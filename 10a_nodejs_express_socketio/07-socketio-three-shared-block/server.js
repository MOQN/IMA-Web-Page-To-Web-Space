import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

const users = {};

const block = {
  x: 0,
  y: 40,
  z: 0,
  color: "#ffcc66",
  owner: null
};

app.use(express.static(import.meta.dirname + "/public"));

function readUser(data, id) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  if (!Number.isFinite(data.x) || !Number.isFinite(data.y) || !Number.isFinite(data.z))
    return null;
  if (typeof data.color !== "string" || !/^#[0-9a-f]{6}$/i.test(data.color)) return null;

  const quaternion = data.quaternion;
  if (!quaternion) return null;

  if (!Number.isFinite(quaternion.x)) return null;
  if (!Number.isFinite(quaternion.y)) return null;
  if (!Number.isFinite(quaternion.z)) return null;
  if (!Number.isFinite(quaternion.w)) return null;

  if (
    quaternion.x === 0 &&
    quaternion.y === 0 &&
    quaternion.z === 0 &&
    quaternion.w === 0
  ) {
    return null;
  }

  return {
    id: id,
    x: data.x,
    y: data.y,
    z: data.z,
    color: data.color,
    quaternion: {
      x: quaternion.x,
      y: quaternion.y,
      z: quaternion.z,
      w: quaternion.w
    }
  };
}

io.on("connection", function (socket) {
  console.log("User connected. ID:", socket.id);
  socket.emit("users_state", users);
  socket.emit("block_state", block);

  socket.on("message_name", function (data) {
    console.log("Received message_name:", data);
    // The server sets the ID, not the browser.
    const user = readUser(data, socket.id);
    if (!user) return;

    users[socket.id] = user;
    socket.broadcast.emit("message_name", user);
  });

  socket.on("block_grab", function (reply) {
    if (typeof reply !== "function") return;
    if (block.owner !== null && block.owner !== socket.id) {
      reply(false);
      return;
    }

    block.owner = socket.id;
    io.emit("block_state", block);
    reply(true);
  });

  socket.on("block_update", function (data) {
    console.log("Received block_update:", data);
    if (block.owner !== socket.id) return;
    if (!data || !Number.isFinite(data.x) || !Number.isFinite(data.z)) return;

    block.x = Math.max(-960, Math.min(960, data.x));
    block.z = Math.max(-960, Math.min(960, data.z));
    io.emit("block_state", block);
  });

  socket.on("block_color", function (color) {
    console.log("Received block_color:", color);
    if (block.owner !== null && block.owner !== socket.id) return;
    if (typeof color !== "string" || !/^#[0-9a-f]{6}$/i.test(color)) return;

    block.color = color;
    io.emit("block_state", block);
  });

  socket.on("block_release", function () {
    if (block.owner !== socket.id) return;

    block.owner = null;
    io.emit("block_state", block);
  });

  socket.on("disconnect", function () {
    delete users[socket.id];
    socket.broadcast.emit("user_left", socket.id);
    if (block.owner === socket.id) {
      block.owner = null;
      io.emit("block_state", block);
    }

    console.log("User left. ID:", socket.id);
  });
});

// With no hostname, other devices can use this computer's network address.
server.listen(port, function () {
  console.log("Open http://localhost:" + port);
});
