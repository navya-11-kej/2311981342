import axios from 'axios';

const LOG_API = 'http://20.207.122.201/evaluation-service/logs';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXZ5YTEzNDIuYmUyM0BjaGl0a2FyYXVuaXZlcnNpdHkuZWR1LmluIiwiZXhwIjoxNzc3OTYwOTE2LCJpYXQiOjE3Nzc5NjAwMTYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMTEyNDNhMC1lMDk2LTQxY2ItYWVlNy04YzVhNmVkODhjNTYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJuYXZ5YSIsInN1YiI6ImU2MDg1YzcxLTU3MTMtNDY2Mi05N2Y0LTk0OGI4YzRkODM4MyJ9LCJlbWFpbCI6Im5hdnlhMTM0Mi5iZTIzQGNoaXRrYXJhdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoibmF2eWEiLCJyb2xsTm8iOiIyMzExOTgxMzQyIiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiZTYwODVjNzEtNTcxMy00NjYyLTk3ZjQtOTQ4YjhjNGQ4MzgzIiwiY2xpZW50U2VjcmV0IjoiSFB3V0FEd1RjQ0JEY2JieSJ9.-4URNjrWfiH05BORjf6qokWu66lkWwgo0Nymu7CGTYo';

export async function Log(stack, level, pkg, message) {
  try {
    await axios.post(LOG_API, {
      stack: stack,
      level: level,
      package: pkg,
      message: message
    }, {
      headers: {
        'Authorization': 'Bearer ' + AUTH_TOKEN,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Log failed:', error.message);
  }
}