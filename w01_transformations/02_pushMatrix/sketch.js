// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 9 2017

function setup() {
  createCanvas(600, 600);
  noStroke();
  rectMode(CENTER);
}

function draw() {
  background(0);

  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.01);
  fill(0, 255, 255);
  rect(0, 0, 180, 120);
  fill(255, 255, 0);
  rect(50, 50, 50, 50);
  pop();

  // this circle won't be affected by translate(width/2, height/2);
  // equivalent to pushMatrix() and popMatrix() in Processing, in this case.
  fill(255, 0, 255);
  rect(50, 50, 30, 30);
}