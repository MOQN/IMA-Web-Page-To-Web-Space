let particles = [];

function setup() {
  createCanvas(800, 500);
  background(0);

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(random(width), random(height)));
    particles[i].vel = createVector(random(-5,5),random(-5,5));
  }
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

function keyPressed() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].vel = createVector(random(-50,50),random(-50,50));
  }
}