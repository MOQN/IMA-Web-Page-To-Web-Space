// IMA NYU Shanghai
// the Nature of Code
// MOQN
// Mar 16 2017


function setup() {
  createCanvas(500, 600);
  background(0);
  fill(255);
  stroke(255);
}


function draw() {
  background(0);

  let centerVector = createVector(width / 2, height / 2);
  let mouseVector = createVector(mouseX, mouseY);
  
  let vector = p5.Vector.sub(mouseVector,centerVector);
  let angle = round(degrees(vector.heading()));
  
  line(centerVector.x, centerVector.y, mouseVector.x, mouseVector.y);
  text(angle, mouseVector.x, mouseVector.y);
}