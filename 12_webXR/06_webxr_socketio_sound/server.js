// https://www.golinuxcloud.com/create-https-server-with-node-js/


// express app
const express = require('express');
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true, limit: '3mb' }))
app.get('/', (req, res) => {
  response.sendFile(__dirname + "/public/index.html");
});
app.post("/registration", (req, res) => {
  console.log(req.body)
  res.redirect("/")
})


// HTTPS Server
const fs = require("fs");
const IP = require('ip');
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}
const https = require("https");
const server = https.createServer(options, app);

// HTTP Server
// const http = require("http");
// const server = http.createServer(app);

const hostname = IP.address();
// const hostname = "127.0.0.1";
const port = 3000;

server.listen(port, hostname, () => {
  console.log(`Server is running: ${hostname}:${port}`);
});

// socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-header"],
    credentials: false
  }
});

io.on("connection", newConnection);
function newConnection(sck) {
  console.log("New Connection - ID: " + sck.id);
  sck.on("connection_name", receive);
  function receive(data) {
    console.log(data);
    //https://socket.io/docs/v3/emit-cheatsheet/index.html
    sck.broadcast.emit("connection_name", data);
  }
}