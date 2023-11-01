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
  drawCircle(frameCount,100);  // play with these two number!
}


function drawCircle(angle, distance) {
  let x = cos(radians(angle)) * distance;
  let y = sin(radians(angle)) * distance;
  
  push();
  translate(width/2, height/2);
  ellipse(x,y,30, 30);
  pop();
}