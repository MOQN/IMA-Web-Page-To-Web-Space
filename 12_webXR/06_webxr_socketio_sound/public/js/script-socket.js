let socket;

function setupSocket() {
  socket = io.connect();
  console.log(socket);
  socket.on("connection_name", receiveSocket);
}

function receiveSocket(data) {
  playSound(data.num);
}

function sendSocket(data) {
  socket.emit("connection_name", data);
}