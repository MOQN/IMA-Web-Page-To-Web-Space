"use strict";

class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = 1;
    this.rad = 10 * this.mass;
  }
  applyForce(f) {
    f.div(this.mass);
    this.acc.add(f);
  }
  applyAttraction(otherPos) {
    let force = p5.Vector.sub(otherPos, this.pos);
    force.mult(0.005);
    this.acc.add(force);
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(255, 100);
    ellipse(0, 0, this.rad * 2 * this.mass, this.rad * 2 * this.mass);
    pop();
  }
  displayTriangle() {
    let angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
    
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);
    stroke(255);
    fill(255, 100);
    triangle(0, 0, -30, -10, -30, 10);
    pop();
  }
}