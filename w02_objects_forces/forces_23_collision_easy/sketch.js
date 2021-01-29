let particles = [];


function setup() {
  createCanvas(800, 500);
  background(0);

  particles.push(new Particle(100, height / 2, random(1, 15))); // (x,y,mass)
  particles.push(new Particle(700, height / 2, random(1, 15))); // (x,y,mass)
  particles[0].vel.x = random(1,5);
  particles[1].vel.x = -random(1,5);
}


function draw() {
  background(0);

  for (let a = 0; a < particles.length; a++) {
    for (let b = 0; b < particles.length; b++) {
      if (a != b) {
        particles[a].checkCollision(particles[b]);
      }
    }
    particles[a].update();
    particles[a].checkEdges();
    particles[a].display();
  }
}