// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 21 2017


function setup() {
  createCanvas(600,600);
}

function draw() {
  background(0);
  
  push();
  translate(width/2,height/2);
  rotate(frameCount*0.05);
  fill(255);
  ellipse(200,0,30,30);
  drawCoordSystem(color(255,255,0,150));
  pop();
  
  drawCoordSystem(color(0,0,255,200));
}

function drawCoordSystem(c) {
  push();
  stroke(c);
  noFill();
  rectMode(CENTER);
  rect(0,0, width, height);
  strokeWeight(3);
  line(-width*2, 0, width*2, 0);
  line(0, -height*2, 0, height*2);
  noStroke();
  fill(c)
  text("(0,0)", 10, 20);
  pop();
}