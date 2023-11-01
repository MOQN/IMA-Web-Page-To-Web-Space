// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Sep 7 2017

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  background(0);

  fill(255, 100, 100);
  star(200, 200, 2.0);

  fill(100, 255, 100);
  star(400, 400, 0.8);
}

// Organize your code with a user-defined function!
function star(x, y, s) {
  push();
  translate(x, y);
  scale(s);
  for (let angle = 0; angle < 360; angle += 72) {
    push();
    rotate(radians(angle));
    rect(0, 30, 10, 30);
    pop();
  }
  pop();
}