const http = require('http');

function makeRequest(path, method, headers = {}, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: { ...headers }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (body) {
      if (typeof body === 'string' || Buffer.isBuffer(body)) {
         req.write(body);
      } else {
         req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
}

async function test() {
  const user = { username: 'submit_tester', email: 'submit_tester@example.com', password: 'password', fullName: 'Student', userType: 'student' };
  console.log("Registering student...");
  let res = await makeRequest('/api/auth/register', 'POST', {'Content-Type': 'application/json'}, user);
  let data = JSON.parse(res.data);
  let token = data.token;
  
  if (!token) {
    console.log("Login instead...");
    res = await makeRequest('/api/auth/login', 'POST', {'Content-Type': 'application/json'}, { email: 'submit_tester@example.com', password: 'password' });
    data = JSON.parse(res.data);
    token = data.token;
  }
  console.log("Token received.");
  
  res = await makeRequest('/api/tasks', 'GET', {}, null, token);
  let tasks = JSON.parse(res.data);
  if (!tasks || tasks.length === 0) {
    console.log("No tasks found. Please assign a task first as an instructor.");
    return;
  }

  let task = tasks[0];
  console.log('Task found:', task._id);

  // Submit task using multipart/form-data
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const postData = `--${boundary}\r\nContent-Disposition: form-data; name="notes"\r\n\r\nThis is a test note\r\n--${boundary}--`;

  res = await makeRequest(`/api/tasks/${task._id}/submit`, 'POST', {
    'Content-Type': `multipart/form-data; boundary=${boundary}`
  }, postData, token);

  console.log('POST /submit status:', res.status, res.data);

  // Fetch tasks again to see if status updated
  res = await makeRequest('/api/tasks', 'GET', {}, null, token);
  tasks = JSON.parse(res.data);
  let updatedTask = tasks.find(t => t._id === task._id);
  console.log('Task status after submit:', updatedTask.status);
}

test().catch(console.error);
