const axios = require('axios');

const LOG_API = 'http://20.207.122.201/evaluation-service/logs';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXZ5YTEzNDIuYmUyM0BjaGl0a2FyYXVuaXZlcnNpdHkuZWR1LmluIiwiZXhwIjoxNzc3OTU4NjU5LCJpYXQiOjE3Nzc5NTc3NTksImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIyMWY3MTZhMi1kNWFjLTQ4M2UtYWY5NS1lNzZmOTlhMTA2OTYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJuYXZ5YSIsInN1YiI6ImU2MDg1YzcxLTU3MTMtNDY2Mi05N2Y0LTk0OGI4YzRkODM4MyJ9LCJlbWFpbCI6Im5hdnlhMTM0Mi5iZTIzQGNoaXRrYXJhdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoibmF2eWEiLCJyb2xsTm8iOiIyMzExOTgxMzQyIiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiZTYwODVjNzEtNTcxMy00NjYyLTk3ZjQtOTQ4YjhjNGQ4MzgzIiwiY2xpZW50U2VjcmV0IjoiSFB3V0FEd1RjQ0JEY2JieSJ9.0iZ9JYOWHGEEHYWaiasj-i-PCKupC58nnbVXdDe4JjQ';

async function Log(stack, level, package, message) {
  try {
    const response = await axios.post(LOG_API, {
      stack: stack,
      level: level,
      package: package,
      message: message
    }, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Log created:', response.data.logID);
    return response.data;
  } catch (error) {
    console.error('Logging failed:', error.message);
  }
}

module.exports = { Log };