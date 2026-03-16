const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const cors = require("cors"); // Import cors module

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected clients and their data
const clients = new Map();

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON body for HTTP POST requests
app.use(express.json());

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/read.html");
// });
app.get("/", (req, res) => {
  res.send("TwitterPak WebSocket server is running");
});

// Function to send a message to a specific client by incomingid
function sendMessageToUser(incomingid, message) {
  // Find the client that matches the incomingid
  const recipientClient = Array.from(clients.entries()).find(
    ([ws, user]) => user.id == incomingid
  );
  if (recipientClient) {
    const [ws] = recipientClient;
    // Check if the WebSocket connection is open
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log(`Message sent to user ${incomingid}: ${message}`);
    } else {
      console.log(`WebSocket connection to user ${incomingid} is not open.`);
    }
  }
}

// Handle incoming WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);

      if (parsedData.id) {
        // Store the user's data
        clients.set(ws, parsedData);
        console.log(`Client data stored: ${JSON.stringify(parsedData)}`);

        if (parsedData.status === "online") {
          // Broadcast user data to all clients when a user comes online
          broadcastUserData();
        }
      } else if (parsedData.incomingid && parsedData.type) {
        // Send the message to the specific user with incomingid
        sendMessageToUser(parsedData.incomingid, JSON.stringify(parsedData));
      } else if (parsedData.type === "live") {
        // Handle live stream broadcast to all users
        broadcastLiveStream(parsedData);
      } else {
        console.log("Broadcasting general message", parsedData);
      }
    } catch (error) {
      console.error("Invalid data received from the client:", error);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
    broadcastUserData();
  });
});

// Handle HTTP POST requests to send data to specific WebSocket clients
app.post("/post", (req, res) => {
  const { incomingid, user, type, data } = req.body;

  console.log("Received POST data:", req.body);

  if (!incomingid || !user || !type || !data) {
    return res.status(400).send("Invalid data format.");
  }

  // Construct the message object
  const messageObject = {
    incomingid,
    user,
    type,
    data,
  };

  // Convert the message object to a JSON string
  const messageJSON = JSON.stringify(messageObject);

  // Send the message to the specific user
  sendMessageToUser(incomingid, messageJSON);

  res.send("Message sent via WebSocket.");
});

// Function to broadcast user data to all clients
function broadcastUserData() {
  const onlineUsers = Array.from(clients.values()).filter(
    (user) => user.status === "online"
  );
  const onlineUsersJSON = JSON.stringify(onlineUsers);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(onlineUsersJSON);
    }
  });
}

// Function to broadcast live stream to all online users
function broadcastLiveStream(liveData) {
  const liveStreamMessage = JSON.stringify(liveData);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      // Send live stream data to all connected clients
      client.send(liveStreamMessage);
      console.log("Broadcasting live stream to all online users");
    }
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WebSocket server is listening on port ${PORT}`);
});
