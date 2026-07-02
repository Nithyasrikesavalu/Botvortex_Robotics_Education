const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', async () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Login Response:', parsed);
      
      if (!parsed.token) return;

      const getTasksOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/tasks',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${parsed.token}`
        }
      };

      http.request(getTasksOptions, res2 => {
        let tasksData = '';
        res2.on('data', chunk => tasksData += chunk);
        res2.on('end', () => {
          console.log('Tasks GET response:', tasksData.substring(0, 500));
        });
      }).end();

    } catch (e) {
      console.error(e);
    }
  });
});

req.on('error', console.error);
req.write(JSON.stringify({ email: 's@s.com', password: 's' })); // Guessing a student credential, or any credential
req.end();
