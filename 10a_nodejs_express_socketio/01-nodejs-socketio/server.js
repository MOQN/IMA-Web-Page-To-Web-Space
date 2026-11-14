const express = require("express");
const http = require("node:http");
const path = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const users = new Map();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "views/index.html"));
});

function validVector(value) {
  return value && ["x", "y", "z"].every((key) => Number.isFinite(value[key]));
}

io.on("connection", (socket) => {
  // Send known users before adding the new user.
  for (const [id, state] of users) {
    socket.emit("initialize_cube", id);
    if (state) socket.emit("update_cube", state);
  }
  users.set(socket.id, null);
  io.emit("initialize_cube", socket.id);

  socket.on("update_cube", (data) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return;
    if (![data.position, data.rotation, data.scale].every(validVector)) return;
    if (!["x", "y", "z"].every((key) => data.scale[key] > 0)) return;
    const color = data.color;
    const validColor = Number.isInteger(color) && color >= 0 && color <= 0xffffff;
    const validRGB = color && ["r", "g", "b"].every((key) =>
      Number.isFinite(color[key]) && color[key] >= 0 && color[key] <= 1);
    if (!validColor && !validRGB) return;
    // Use the sender ID so a client cannot move another user.
    const vector = (value) => ({ x: value.x, y: value.y, z: value.z });
    const state = {
      clientId: socket.id,
      position: vector(data.position),
      rotation: vector(data.rotation),
      scale: vector(data.scale),
      color: validColor ? color : { r: color.r, g: color.g, b: color.b },
    };
    users.set(socket.id, state);
    socket.broadcast.emit("update_cube", state);
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    socket.broadcast.emit("remove_cube", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running: Port: ${port}`);
});
