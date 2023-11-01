"use strict";

class Spring {
  constructor(ballA, ballB, len) {
    this.ballA = ballA;
    this.ballB = ballB;
    this.len = len;
    this.k = 0.2;
  }
  display() {
    push();
    stroke(255);
    line(this.ballA.pos.x, this.ballA.pos.y, this.ballB.pos.x, this.ballB.pos.y);
    pop();
  }
  update() {
    let vector = p5.Vector.sub(this.ballA.pos, this.ballB.pos);
    let distance = vector.mag();
    let direction = vector.copy().normalize();
    let stretch = distance - this.len;

    // hooke's law
    let force = direction.copy();
    force.mult(-1 * this.k * stretch);
    this.ballA.applyForce(force);
    force.mult(-1);
    this.ballB.applyForce(force);
  }
}