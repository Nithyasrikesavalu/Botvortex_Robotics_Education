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
  const user = { username: 'testuser1', email: 'test501@example.com', password: 'password', fullName: 'Test User', userType: 'instructor' };
  console.log("Registering user...");
  let res = await makeRequest('/api/auth/register', 'POST', user);
  let data = JSON.parse(res.data);
  let token = data.token;
  
  if (!token) {
    console.log("Login instead...");
    res = await makeRequest('/api/auth/login', 'POST', { email: 'test501@example.com', password: 'password' });
    data = JSON.parse(res.data);
    token = data.token;
  }
  console.log("Token received.");
  
  res = await makeRequest('/api/tasks', 'GET', null, token);
  console.log('GET /api/tasks:', res.status, res.data);

  res = await makeRequest('/api/livesessions', 'GET', null, token);
  console.log('GET /api/livesessions:', res.status, res.data);

  res = await makeRequest('/api/attendance', 'GET', null, token);
  console.log('GET /api/attendance:', res.status, res.data);
}

test().catch(console.error);
