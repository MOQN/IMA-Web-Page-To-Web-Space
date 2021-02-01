let particles = [];

function setup() {
  createCanvas(500, 600);
  background(0);
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(width / 2, height - 1));
    particles[i].vel = createVector(random(-20, 20), random(-40, -20));
  }

  // let's give a random velocity

}

function draw() {
  background(0);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.checkBoundaries();
    p.applyGravity();
    p.update();
    p.display();
  }

}