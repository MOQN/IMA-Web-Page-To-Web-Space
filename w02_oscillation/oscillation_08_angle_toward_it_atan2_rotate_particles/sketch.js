let particles = [];

function setup() {
  createCanvas(800, 500);
  background(0);

  particles.push(new Particle(random(width), random(height)));
}


function draw() {
  background(0);

  let mouseVector = createVector(mouseX, mouseY);
  for (let i = 0; i < particles.length; i++) {
    particles[i].applyAttraction(mouseVector);
    particles[i].update();
    particles[i].vel.mult(0.98);
    //particles[i].display();
    particles[i].displayTriangle();
  }
}