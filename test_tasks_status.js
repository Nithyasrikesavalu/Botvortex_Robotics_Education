const http = require('http');

function makeRequest(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test() {
  const user = { username: 'student_tasks_test', email: 'testtasks1@example.com', password: 'password', fullName: 'Student', userType: 'student' };
  console.log("Registering student...");
  let res = await makeRequest('/api/auth/register', 'POST', user);
  let data = JSON.parse(res.data);
  let token = data.token;
  
  if (!token) {
    console.log("Login instead...");
    res = await makeRequest('/api/auth/login', 'POST', { email: 'testtasks1@example.com', password: 'password' });
    data = JSON.parse(res.data);
    token = data.token;
  }
  console.log("Token received.");
  
  res = await makeRequest('/api/tasks', 'GET', null, token);
  console.log('GET /api/tasks status:', res.status);
  const tasks = JSON.parse(res.data);
  console.log('Tasks returned:', JSON.stringify(tasks, null, 2));
}

test().catch(console.error);
