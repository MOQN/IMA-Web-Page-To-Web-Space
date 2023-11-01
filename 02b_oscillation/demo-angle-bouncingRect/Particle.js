"use strict";

class Particle {
  constructor(x,y) {
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.size = random(20,40);
    this.color = color(random(255),random(255),random(255));
    this.angle = 0;
    this.angleAcc = random(-0.5, 0.5);
  }
  update() {
    this.angle += this.angleAcc;
    this.vel.add(this.acc);  // vel = vel + acc;
    this.pos.add(this.vel);  // pos = pos + vel;
    this.acc.mult(0);        // acceleration has to be reset after being applied! ***
  }
  applyGravity() {
    let force = createVector(0,1.5);
    this.acc.add(force);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    rotate(this.angle);
    noStroke();
    fill(this.color);
    rect(0,0, this.size, this.size);
    pop();
  }
  checkBoundaries() {
    // x
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x = -this.vel.x;
    } else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x = -this.vel.x;
    }
    // y
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = -this.vel.y;
    } else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y = -this.vel.y;
    }
  }
}