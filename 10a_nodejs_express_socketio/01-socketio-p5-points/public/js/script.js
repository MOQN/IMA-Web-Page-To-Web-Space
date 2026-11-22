let connectionStatus = "Connecting...";

let socket;
let otherPoint = null;

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent("container-p5");
  background(220);

  const button = createButton("Open Another Window");
  button.parent("container-p5");
  button.mousePressed(function () {
    window.open(window.location.href, "_blank", "noopener");
  });

  setupSocket();
}

function draw() {
  // background(220);

  noStroke();
  fill(0);
  circle(mouseX, mouseY, 30);

  if (otherPoint) {
    fill(255, 0, 0);
    circle(otherPoint.x, otherPoint.y, 60);
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
    y: mouseY
  };
  socket.emit("message_name", data);
}

function receiveViaSocket(data) {
  console.log("Received message_name:", data);
  otherPoint = data;
}
