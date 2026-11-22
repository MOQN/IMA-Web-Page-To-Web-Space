let connectionStatus = "Connecting...";

let socket;
let users = {};
let myColor;

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("container-p5");

  const button = createButton("Open Another Window");
  button.parent("container-p5");
  button.mousePressed(function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  myColor = {
    r: random(255),
    g: random(255),
    b: random(255)
  };
  setupSocket();
}

function draw() {
  background(220);
  noStroke();

  for (const id in users) {
    const user = users[id];
    fill(user.color.r, user.color.g, user.color.b);
    circle(user.x, user.y, 48);
    fill(30, 30, 30);
    text(id.slice(0, 5), user.x + 30, user.y + 4);
  }

  fill(30, 30, 30);
  text("Open this same URL in another window and watch both windows update!", 10, 20);
  text(connectionStatus, 10, 40);
}

function mouseMoved() {
  if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) return;

  sendViaSocket();
}

function setupSocket() {
  socket = io();

  socket.on("connect", function () {
    connectionStatus = "Connected.";
    users = {};
    sendViaSocket();
  });

  socket.on("disconnect", function () {
    connectionStatus = "Connecting...";
  });

  socket.on("message_name", receiveViaSocket);
}

function sendViaSocket() {
  if (!socket || !socket.connected) return;

  const data = {
    x: mouseX,
    y: mouseY,
    color: myColor
  };
  users[socket.id] = {
    id: socket.id,
    x: data.x,
    y: data.y,
    color: myColor
  };
  socket.emit("message_name", data);
}

function receiveViaSocket(data) {
  console.log("Received message_name:", data);
  users[data.id] = data;
}
