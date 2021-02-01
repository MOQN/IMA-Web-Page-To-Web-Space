"use strict";

class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.rad = this.mass * 5;
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass); // *** mass!! ***
    this.acc.add(force);
  }
  applyAttraction(other) {
    let distance = this.pos.dist(other.pos);
    let magnitude = (C_GRAVITY * this.mass * other.mass) / (distance * distance);
    let force = p5.Vector.sub(other.pos, this.pos);
    force.normalize();
    force.mult(magnitude);
    this.applyForce(force);
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = width;
    } else if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    } else if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
  update() {
    this.vel.add(this.acc); // vel = vel + acc;
    this.pos.add(this.vel); // pos = pos + vel;
    this.acc.mult(0); // acceleration has to be reset after being applied! ***
    //
    this.vel.limit(5); // let's not make them too fast..
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    stroke(255);
    fill(255, 100);
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();
  }
}
