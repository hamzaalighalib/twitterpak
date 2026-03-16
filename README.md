Here is a clean, professional `README.md` file you can copy and paste directly into your GitHub repository. It explains what the project does and how the API works.

---

```markdown
# TwitterPak WebSocket Server

The real-time communication engine for the TwitterPak platform. This server handles live messaging, user status updates, and live stream broadcasting using WebSockets and Express.

## 🚀 Features
- **Real-time Messaging:** Direct message delivery via `incomingid`.
- **Presence System:** Tracks online users and broadcasts the list to all clients.
- **Live Stream Support:** Logic for broadcasting "live" type events to all connected peers.
- **HTTP Bridge:** Includes a POST endpoint to trigger WebSocket messages from external sources (like a PHP backend).

## 🛠️ Tech Stack
- **Node.js** (Runtime)
- **Express** (HTTP Server)
- **ws** (WebSocket Library)
- **CORS** (Cross-Origin Resource Sharing enabled)

## 📡 API Endpoints

### 1. Root Status
- **URL:** `/`
- **Method:** `GET`
- **Response:** Simple text confirmation that the server is running.

### 2. HTTP to WebSocket Bridge
- **URL:** `/post`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "incomingid": "user_id_here",
  "user": "sender_name",
  "type": "message_type",
  "data": "content"
}

```

## 🔌 WebSocket Events

### Connecting

Clients should connect to `ws://your-app-url`. Once connected, send an identification JSON:

```json
{
  "id": "your_user_id",
  "status": "online"
}

```

### Messaging

To send a message via WebSocket, send a JSON object containing an `incomingid`:

```json
{
  "incomingid": "target_id",
  "type": "chat",
  "message": "Hello!"
}

```

## 🏗️ Deployment

This project is configured for deployment on **Koyeb**.

* **Port:** 3000 (or dynamic `process.env.PORT`)
* **Build Command:** `npm install`
* **Run Command:** `npm start`

```

---

### How to add this:
1. Go to your GitHub repository.
2. Click **Add file** > **Create new file**.
3. Name it `README.md`.
4. Paste the content above and click **Commit changes**.

Since this is the core of **Ghalib Corporation's** real-time features, would you like me to show you how to add a simple JavaScript snippet for your website to connect to this new server?

```
