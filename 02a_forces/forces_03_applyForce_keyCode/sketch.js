let p;

function setup() {
  createCanvas(500, 600);
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
  }

  p.checkBoundaries();
  p.update();
  p.display();

  p.displayVelocity();
}