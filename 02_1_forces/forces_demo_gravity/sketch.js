let GRAVITY_MAG = 20;
let GROUND = 450; //420
let p;

function setup() {
  createCanvas(1200, 700);
  background(0);
  frameRate(3);

  // draw the ground
  fill(50);
  rect(0, GROUND, width, height - GROUND);

  // create a particle and change its velocity
  p = new Particle(0, 30);
  p.vel = createVector(20, 0.1);
}

function draw() {
  p.checkBoundaries();
  
  p.displayDebugMode();
  
  let gravity = createVector(0, GRAVITY_MAG);
  p.applyForce(gravity);
  p.update();
  p.display();

  if (p.pos.x > width) {
    noLoop();
  }
}