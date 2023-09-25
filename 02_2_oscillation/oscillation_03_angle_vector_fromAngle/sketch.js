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
  drawCircle(frameCount,100);  // play with these two numbers!
}


function drawCircle(angle, distance) {
  let vector = p5.Vector.fromAngle(radians(angle));
  vector.mult(distance);
  
  push();
  translate(width/2, height/2);
  ellipse(vector.x,vector.y,30, 30);
  pop();
}