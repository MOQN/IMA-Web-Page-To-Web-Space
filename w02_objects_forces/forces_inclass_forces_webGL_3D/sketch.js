"use strict";

let FLOOR_LEVEL = -200;
let FLOOR_SIZE = 800;

let particles = [];


function setup() {
  createCanvas(1000, 600, WEBGL);

  for (let i = 0; i < 50; i++) {
    particles[i] = new Particle()
      .position(random(-100, 100), random(200, 300), random(-100, 100))
      .velocity(random(-3, 3), random(-3, 3), random(-3, 3));
  }
}


function draw() {
  scale(1, -1, 1); // to flip y axis
  background(0);
  
  // view
  let rotY = map(mouseX, 0, width, -PI / 2, PI / 2);
  rotateY(rotY);
  let rotX = map(mouseY, 0, height, -PI / 6, PI / 6);
  rotateX(rotX);

  // floor
  push();
  translate(0, FLOOR_LEVEL, 0);
  rotateX(PI / 2);
  fill(50);
  plane(FLOOR_SIZE, FLOOR_SIZE);
  pop();
  
  // light?
  ambientLight(0, 0, 30); // r, g, b
  pointLight(255, 0, 0, 0, 300, 0); // r,g,b,x,y,z

  // particles
  for (let a = 0; a < particles.length; a++) {
    let p = particles[a];
    
    // collision
    for (let b = 0; b < particles.length; b++) {
      if (a != b) {
        p.checkCollision(particles[b]);
      }
    }
    
    // gravity
    let gravity = createVector(0, -1, 0);
    gravity.mult(p.mass);
    p.applyForce(gravity);

    // friction
    if (p.pos.y < FLOOR_LEVEL + p.rad + 0.1) {
      let friction = p.vel.copy();
      friction.normalize();
      friction.mult(-1);
      friction.mult(0.5); // CO_FRICTION
      friction.limit(p.vel.mag());
      p.applyForce(friction);
    }
    
    p.update();
    p.checkFloorWall();
    p.display();
  }
}








//