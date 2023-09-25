"use strict";

let coRestitution = 0.98;
let coFriction = 10;

class Particle {
  constructor(x, y, m) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.rad = 3 * this.mass;
    this.color = color(255);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass); // *** mass!! ***
    this.acc.add(force);
  }
  checkCollision(other) {
    let distance = this.pos.dist(other.pos);
    if (distance < this.rad + other.rad) {

      let force = createVector();
      let friction = createVector();

      // this
      force = p5.Vector.sub(other.pos, this.pos);
      force.normalize();
      force.mult(-1);
      force.mult(other.vel.mag());
      this.applyForce(force);
      this.vel.mult(coRestitution);

      friction = p5.Vector.mult(this.vel, -1);
      friction.normalize();
      friction.mult(coFriction);
      friction.limit(this.vel.mag());
      other.applyForce(friction);

      // other
      force = p5.Vector.sub(this.pos, other.pos);
      force.normalize();
      force.mult(-1);
      force.mult(this.vel.mag());
      other.applyForce(force);
      other.vel.mult(coRestitution);

      friction = p5.Vector.mult(other.vel, -1);
      friction.normalize();
      friction.mult(coFriction);
      friction.limit(other.vel.mag());
      other.applyForce(friction);
    }
  }
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x = -this.vel.x;
    } else if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x = -this.vel.x;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y = -this.vel.y;
    } else if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y = -this.vel.y;
    }
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.rad * 2, this.rad * 2);
    pop();
  }
}
