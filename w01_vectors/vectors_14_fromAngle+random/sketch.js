// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 22 2017


function setup() {
  createCanvas(500, 500);
  background(0);
  fill(255);
  noStroke();
}


function draw() {
  background(0);

  translate(width / 2, height / 2);
  for (let i = 0; i < 100; i++) {
    let angle = random(TWO_PI);
    let distance = random(100);
    drawCircle(angle, distance);
  }
}


function drawCircle(angle, distance) {
  let vector = p5.Vector.fromAngle(angle);
  vector.mult(distance);
  ellipse(vector.x, vector.y, 10, 10);
}