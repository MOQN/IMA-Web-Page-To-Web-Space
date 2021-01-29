let p;

function setup() {
  createCanvas(1000, 600);
  background(0);
  p = new Particle(width / 2, height / 2);
}

function draw() {
  background(0);
  // let's create a force and add it to acceleration when pressing any key.
  if (keyIsPressed) {
    let force = createVector();
    switch (keyCode) {
      case UP_ARROW:
        force = createVector(0, -1);
        break;
      case DOWN_ARROW:
        force = createVector(0, 1);
        break;
      case LEFT_ARROW:
        force = createVector(-1, 0);
        break;
      case RIGHT_ARROW:
        force = createVector(1, 0);
        break;
    }
    force.limit(10);
    p.applyForce(force);
    background(100, 0, 0);
  }
  displayAccVel(3);
  
  p.checkBoundaries();
  p.update();
  p.display();
}

function displayAccVel(scale) {
  push();
  translate(width/2, height/2);
  
  fill(255);
  stroke(255);
  line(0, -10, p.acc.x * scale*50, -10 + p.acc.y * scale*50);
  ellipse(0, -10, 3, 3);
  
  fill(255, 0, 0);
  stroke(255, 0, 0);
  line(0, 0, p.vel.x * scale, p.vel.y * scale);
  ellipse(0, 0, 3, 3);
  
  fill(255);
  noStroke();
  text(p.vel.x, 5, -40);
  text(p.vel.y, 5, -20);
  pop();
}