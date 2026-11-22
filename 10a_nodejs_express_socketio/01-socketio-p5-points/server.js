import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(import.meta.dirname + "/public"));

io.on("connection", function (socket) {
  console.log("User connected. ID:", socket.id);

  socket.on("message_name", function (data) {
    console.log("Received message_name:", data);
    if (!data || !Number.isFinite(data.x) || !Number.isFinite(data.y)) return;

    socket.broadcast.emit("message_name", {
      x: data.x,
      y: data.y
    });
  });

  socket.on("disconnect", function () {
    console.log("User left. ID:", socket.id);
  });
});

// With no hostname, other devices can use this computer's network address.
server.listen(port, function () {
  console.log("Open http://localhost:" + port);
});
