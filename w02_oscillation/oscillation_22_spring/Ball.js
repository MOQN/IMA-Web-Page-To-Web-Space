"use strict";

class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();

    this.mass = 30;
    this.rad = this.mass;

    this.damping = 0.98;
  }
  display() {
    push();
    stroke(255);
    strokeWeight(2);
    fill(200);
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    pop();
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    // damping
    this.vel.mult(this.damping);
  }
  applyForce(force) {
    force.div(this.mass);
    this.acc.add(force);
  }
  drag() {
    let distance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (mouseIsPressed && distance < this.rad) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
  }
}