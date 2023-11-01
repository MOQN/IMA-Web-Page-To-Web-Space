// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 9 2017

function setup() {
  createCanvas(600, 600);
  noStroke();
}

function draw() {
  background(0);
  
  push();
  fill(255,0,0);
  ellipse(mouseX, mouseY, 100,100);
  pop(); 
  // equivalent to pushStyle() and popStyle() in Processing, in this case.
  
  // this circle won't be affected by fill(255,0,0);
  ellipse(mouseY, mouseX, 100,100);
}

