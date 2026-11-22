import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.use(express.static(import.meta.dirname + "/public"));

function readUser(data, id) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) return null;
  const color = data.color;
  if (!color) return null;
  if (!Number.isFinite(color.r) || !Number.isFinite(color.g) || !Number.isFinite(color.b))
    return null;
  if (
    color.r < 0 ||
    color.r > 255 ||
    color.g < 0 ||
    color.g > 255 ||
    color.b < 0 ||
    color.b > 255
  )
    return null;

  const user = {
    id: id,
    x: data.x,
    y: data.y,
    color: {
      r: color.r,
      g: color.g,
      b: color.b
    }
  };

  return user;
}

io.on("connection", function (socket) {
  console.log("User connected. ID:", socket.id);

  socket.on("message_name", function (data) {
    console.log("Received message_name:", data);
    // The server sets the ID, not the browser.
    const user = readUser(data, socket.id);
    if (!user) return;

    socket.broadcast.emit("message_name", user);
  });

  socket.on("disconnect", function () {
    console.log("User left. ID:", socket.id);
  });
});

// With no hostname, other devices can use this computer's network address.
server.listen(port, function () {
  console.log("Open http://localhost:" + port);
});
