"use strict";

class Spring {
  constructor(x, y, len) {
    this.anchor = createVector(x, y);
    this.len = len;
    
    this.k = 0.2;
  }
  display(b) {
    push();
    stroke(255);
    strokeWeight(2);
    line(this.anchor.x, this.anchor.y, b.pos.x, b.pos.y);
    pop();
  }
  connect(b) {
    // vector
    let vector = p5.Vector.sub(b.pos, this.anchor);
    let distance = vector.mag();
    let direction = vector.copy().normalize();
    
    // force
    let stretch = distance - this.len;
    let force = direction.copy();
    // hooke's law
    force.mult(-1 * this.k * stretch);
    b.applyForce(force);
  }
}






