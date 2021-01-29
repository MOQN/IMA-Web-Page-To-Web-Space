let p;

function setup() {
  createCanvas(500, 600);
  background(0);
  p = new Particle(width / 2, height / 2);
}

function draw() {
  background(0);

  // let's create a random force and add it to acceleration when pressing any key.
  if (keyIsPressed) {
    let force = createVector(random(-2, 2), random(-2, 2));
    p.applyForce(force);
  }

  p.checkBoundaries();
  p.update();
  p.display();
  
  p.displayVelocity();
}