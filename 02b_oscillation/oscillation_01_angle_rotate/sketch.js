// IMA NYU Shanghai
// the Nature of Code
// MOQN
// Mar 13 2017


function setup() {
  createCanvas(500, 600);
  background(0);
}


function draw() {
  background(0);
  drawCircle(0,0);  // play with these two numbers!
}


function drawCircle(angle, distance) {
  push();
  translate(width/2, height/2);
  rotate(radians(angle));
  ellipse(distance,0,30, 30);
  pop();
}