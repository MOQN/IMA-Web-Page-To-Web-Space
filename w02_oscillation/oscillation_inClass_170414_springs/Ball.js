"use strict";

class Ball {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();

    this.mass = random(10, 30);
    this.rad = this.mass;
    
    this.cDamping = 0.9;
  }
  display() {
    push();
    stroke(255);
    fill(200);
    ellipse(this.pos.x, this.pos.y, this.rad * 2, this.rad * 2);
    pop();
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    this.vel.mult(this.cDamping);
  }
  applyForce( f ) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  drag() {
    let distance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    if (mouseIsPressed && distance < this.rad + 10) {
      this.pos.x = mouseX;
      this.pos.y = mouseY;
    }
  }
}















