let pos, vel;
let centerVec, mouseVec;

function setup() {
  createCanvas(600, 700);
  fill(255);
  pos = createVector(width / 2, height / 2);
  centerVec = createVector(width / 2, height / 2);
}

function draw() {
  background(0);

  // update velocity
  mouseVec = createVector(mouseX, mouseY);
  vel = p5.Vector.sub(mouseVec, centerVec);

  vel.limit(50);
  //vel.setMag(50);
  //vel.normalize();
  //vel.mult(30);

  //vel = p5.Vector.fromAngle(radians(frameCount));
  //vel.mult(3);

  // update position
  reappear();
  pos.add(vel);

  // display
  noStroke();
  ellipse(pos.x, pos.y, 30, 30);

  // show the vector
  stroke(255);
  translate(width / 2, height / 2);
  line(0, 0, vel.x, vel.y);
  text(round(vel.mag()), vel.x + 15, vel.y);
}

function reappear() {
  if (pos.x < 0) {
    pos.x = width;
  } else if (pos.x > width) {
    pos.x = 0;
  }
  if (pos.y < 0) {
    pos.y = height;
  } else if (pos.y > height) {
    pos.y = 0;
  }
}
