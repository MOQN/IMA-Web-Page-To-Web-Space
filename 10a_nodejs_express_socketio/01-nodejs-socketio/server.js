// express app
const express = require("express");
const app = express();

app.use(express.static("public"));
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// HTTP Server
const http = require("http");
//const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;
const server = http.createServer(app);
//server.listen(port, hostname, function() {}); 
server.listen(port, function () {
  console.log("Server is running: Port: " + port);
});


// socket.io
const socket = require("socket.io");
const io = socket(server);

io.on("connection", function (socket) {
  console.log("New Connection - ID: " + socket.id);

  // Notify all clients to add a new cube for the connected client
  socket.emit("initialize_cube", socket.id);
  socket.broadcast.emit("initialize_cube", socket.id);

  socket.on("update_cube", function (data) {
    console.log(data);
    socket.broadcast.emit("update_cube", data);
  });
});