"use strict";

let particles = [];
let DEBUG_MODE = false;

function setup() {
  createCanvas(900, 700);
  background(0);
  if (DEBUG_MODE) {
    frameRate(10);
  }
  for (let i = 0; i < 50; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0);

  let mouseVector = createVector(mouseX, mouseY);

  for (let i = 0; i < particles.length; i++) {
    particles[i].acc = p5.Vector.sub(mouseVector, particles[i].pos);
    particles[i].update();
    particles[i].display();
  }
}


function mousePressed() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].vel = createVector(random(-20,20), random(-20,20));
  }
}


class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.dia = random(5,15);
    this.accAdj = random(0.001, 0.05);
  }
  update() {
    this.acc.mult(this.accAdj); // ***
    this.vel.mult(0.95); // ***

    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(255);
    ellipse(0, 0, this.dia, this.dia);
    if (DEBUG_MODE) {
      line(0, 0, this.vel.x, this.vel.y);
      stroke(255, 0, 0);
      line(0, 0, this.acc.x * 5, this.acc.y * 5);
    }
    pop();
  }
}
