"use strict";

let p;
let DEBUG_MODE = true;

function setup() {
  createCanvas(900, 700);
  background(0);
  if (DEBUG_MODE) {
    frameRate(10);
  }
  p = new Particle(100, height / 2);
}

function draw() {
  background(0, 10);

  //p.acc = createVector(1,0);
  
  let mouseVector = createVector(mouseX, mouseY);
  p.acc = p5.Vector.sub(mouseVector, p.pos);
  p.acc.setMag(5);
  p.vel.mult(0.99);
  //p.acc.mult(0.1);
  //p.vel.mult(0.9);

  p.update();
  p.display();
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(150);
    ellipse(0, 0, 15, 15);
    if (DEBUG_MODE) {
      line(0, 0, this.vel.x, this.vel.y);
      stroke(255, 0, 0);
      line(0, 0, this.acc.x * 5, this.acc.y * 5);
    }
    pop();
  }
}