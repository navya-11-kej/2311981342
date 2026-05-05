import axios from 'axios';
import { Log } from './logger';

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXZ5YTEzNDIuYmUyM0BjaGl0a2FyYXVuaXZlcnNpdHkuZWR1LmluIiwiZXhwIjoxNzc3OTYwOTE2LCJpYXQiOjE3Nzc5NjAwMTYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMTEyNDNhMC1lMDk2LTQxY2ItYWVlNy04YzVhNmVkODhjNTYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJuYXZ5YSIsInN1YiI6ImU2MDg1YzcxLTU3MTMtNDY2Mi05N2Y0LTk0OGI4YzRkODM4MyJ9LCJlbWFpbCI6Im5hdnlhMTM0Mi5iZTIzQGNoaXRrYXJhdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoibmF2eWEiLCJyb2xsTm8iOiIyMzExOTgxMzQyIiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiZTYwODVjNzEtNTcxMy00NjYyLTk3ZjQtOTQ4YjhjNGQ4MzgzIiwiY2xpZW50U2VjcmV0IjoiSFB3V0FEd1RjQ0JEY2JieSJ9.-4URNjrWfiH05BORjf6qokWu66lkWwgo0Nymu7CGTYo';

const TYPE_WEIGHTS = { "Placement": 3, "Result": 2, "Event": 1 };

export async function fetchNotifications(limit = 50, page = 1, type = '') {
  await Log("frontend", "info", "api", "fetching notifications limit=" + limit + " page=" + page + " type=" + type);
  try {
    const params = { limit, page };
    if (type) params.notification_type = type;
    
    const response = await axios.get(API_URL, {
      params,
      headers: { 'Authorization': 'Bearer ' + AUTH_TOKEN }
    });
    await Log("frontend", "info", "api", "fetched " + response.data.notifications.length + " notifications");
    return response.data.notifications;
  } catch (error) {
    await Log("frontend", "error", "api", "fetch failed: " + error.message);
    return [];
  }
}

export function getTopN(notifications, n = 10) {
  const scored = notifications.map(n => ({
    ...n,
    score: (TYPE_WEIGHTS[n.Type] || 0) * 10000000000000 + new Date(n.Timestamp).getTime()
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, n);
}