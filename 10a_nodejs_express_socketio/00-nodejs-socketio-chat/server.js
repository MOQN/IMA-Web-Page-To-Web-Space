const express = require("express");
const http = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("chat:send", (message) => {
    if (!message || typeof message !== "object" || Array.isArray(message)) {
      socket.emit("chat:error", "Use a valid message.");
      return;
    }

    const username =
      typeof message.username === "string" ? message.username.trim() : "";
    const text = typeof message.text === "string" ? message.text.trim() : "";

    if (!username || username.length > 24) {
      socket.emit("chat:error", "Use a name with 1 to 24 characters.");
      return;
    }

    if (!text || text.length > 500) {
      socket.emit("chat:error", "Use a message with 1 to 500 characters.");
      return;
    }

    io.emit("chat:message", {
      username,
      text,
      sentAt: new Date().toISOString(),
    });
  });
});

server.listen(port, () => {
  console.log(`Chat server is running: http://localhost:${port}`);
});
