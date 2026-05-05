const axios = require('axios');
const { Log } = require('./logging_middleware/logger');

const API_URL = 'http://20.207.122.201/evaluation-service/notifications';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYXZ5YTEzNDIuYmUyM0BjaGl0a2FyYXVuaXZlcnNpdHkuZWR1LmluIiwiZXhwIjoxNzc3OTYwOTE2LCJpYXQiOjE3Nzc5NjAwMTYsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIwMTEyNDNhMC1lMDk2LTQxY2ItYWVlNy04YzVhNmVkODhjNTYiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJuYXZ5YSIsInN1YiI6ImU2MDg1YzcxLTU3MTMtNDY2Mi05N2Y0LTk0OGI4YzRkODM4MyJ9LCJlbWFpbCI6Im5hdnlhMTM0Mi5iZTIzQGNoaXRrYXJhdW5pdmVyc2l0eS5lZHUuaW4iLCJuYW1lIjoibmF2eWEiLCJyb2xsTm8iOiIyMzExOTgxMzQyIiwiYWNjZXNzQ29kZSI6IkVYZnZEcCIsImNsaWVudElEIjoiZTYwODVjNzEtNTcxMy00NjYyLTk3ZjQtOTQ4YjhjNGQ4MzgzIiwiY2xpZW50U2VjcmV0IjoiSFB3V0FEd1RjQ0JEY2JieSJ9.-4URNjrWfiH05BORjf6qokWu66lkWwgo0Nymu7CGTYo';
const TOP_N = 10;

const TYPE_WEIGHTS = {
  "Placement": 3,
  "Result": 2,
  "Event": 1
};

class PriorityInbox {
  constructor(size = TOP_N) {
    this.size = size;
    this.heap = [];
  }

  calculateScore(notification) {
    const weight = TYPE_WEIGHTS[notification.Type] || 0;
    const timestamp = new Date(notification.Timestamp).getTime();
    return (weight * 10000000000000) + timestamp;
  }

  addNotification(notification) {
    const score = this.calculateScore(notification);
    const entry = { score, notification };

    if (this.heap.length < this.size) {
      this.heap.push(entry);
      this.heap.sort((a, b) => a.score - b.score);
    } else if (score > this.heap[0].score) {
      this.heap[0] = entry;
      this.heap.sort((a, b) => a.score - b.score);
    }
  }

  getTopN() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  display() {
    const top = this.getTopN();
    console.log("\n========== TOP 10 PRIORITY NOTIFICATIONS ==========\n");
    top.forEach((entry, index) => {
      const n = entry.notification;
      console.log("#" + (index + 1) + " | Type: " + n.Type + " | Message: " + n.Message + " | Time: " + n.Timestamp + " | Score: " + entry.score);
    });
    console.log("\n====================================================\n");
  }
}

async function fetchNotifications() {
  await Log("backend", "info", "handler", "fetching notifications from API");
  
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': 'Bearer ' + AUTH_TOKEN
      }
    });

    await Log("backend", "info", "handler", "fetched " + response.data.notifications.length + " notifications");
    
    return response.data.notifications;
  } catch (error) {
    await Log("backend", "error", "handler", "API fetch failed: " + error.message);
    console.error('Error fetching notifications:', error.message);
    return [];
  }
}

async function main() {
  await Log("backend", "info", "handler", "priority inbox started");
  
  const notifications = await fetchNotifications();
  
  if (notifications.length === 0) {
    console.log("No notifications found.");
    return;
  }

  const inbox = new PriorityInbox(TOP_N);

  notifications.forEach((notification) => {
    inbox.addNotification(notification);
  });

  inbox.display();
  
  await Log("backend", "info", "handler", "priority inbox completed");
}

main();