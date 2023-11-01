"use strict";

class Spring {
  constructor(x, y, len) {
    this.anchor = createVector(x, y);
    this.len = len;
    this.lenMin = len * 0.5;
    this.lenMax = len * 1.5;
    this.k = 0.2;
  }
  display(b) {
    this.drawAnchor();
    this.drawLine(b);
  }
  drawAnchor() {
    push();
    rectMode(CENTER);
    rect(this.anchor.x, this.anchor.y, 10, 10);
    pop();
  }
  drawLine(b) {
    push();
    stroke(255);
    line(this.anchor.x, this.anchor.y, b.pos.x, b.pos.y);
    pop();
  }
  connect(b) {
    let vector = p5.Vector.sub(b.pos, this.anchor);
    let distance = vector.mag();
    let direction = vector.copy().normalize();

    let stretch = distance - this.len;
    // hooke's law
    let force = direction.copy();
    force.mult(-1 * this.k * stretch);
    b.applyForce(force);

    // let's constrain the length
    if (distance < this.lenMin) {
      direction.mult(this.lenMin);
      b.pos = p5.Vector.add(this.anchor, direction);
      b.vel.mult(0);
    } else if (distance > this.lenMax) {
      direction.mult(this.lenMax);
      b.pos = p5.Vector.add(this.anchor, direction);
      b.vel.mult(0);
    }
  }
}