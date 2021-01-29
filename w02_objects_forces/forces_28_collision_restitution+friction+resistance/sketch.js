let particles = [];

let coResistance = 0.01;

function setup() {
  createCanvas(800, 500);
  background(0);

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(random(width), random(height), random(1, 15))); // (x,y,mass)
    particles[i].vel = createVector(random(-5, 5), random(-5, 5));
  }
}


function draw() {
  background(0);

  for (let a = 0; a < particles.length; a++) {
    
    // collision
    for (let b = 0; b < particles.length; b++) {
      if (a != b) {
        particles[a].checkCollision(particles[b]);
      }
    }
    
    // resistance
    let resistance = p5.Vector.mult(particles[a].vel, -1);
    resistance.normalize();
    let speed = particles[a].vel.mag();
    let magnitude = speed * speed * coResistance;
    resistance.mult(magnitude);
    particles[a].applyForce(resistance);
    
    particles[a].update();
    particles[a].checkEdges();
    particles[a].display();
  }
}