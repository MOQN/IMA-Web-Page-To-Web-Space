let C_GRAVITY = 5;
let particles = [];


function setup() {
  createCanvas(800, 500);
  background(0);

  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(random(width), random(height), random(1, 7))); // (x,y,mass)
  }

}


function draw() {
  background(0);


  for (let a = 0; a < particles.length; a++) {
    for (let b = 0; b < particles.length; b++) {
      if (a != b) {
        particles[a].applyAttraction(particles[b]);
      }
    }
    particles[a].update();
    particles[a].checkEdges();
    particles[a].display();
  }
}