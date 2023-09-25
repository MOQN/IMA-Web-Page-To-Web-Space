"use strict";

class Particle {
  constructor(x, y, z) {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.mass = random(1, 10);
    this.rad = this.mass * 3;

    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.a = 100;
  }
  position(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  velocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  colour(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    //fill(this.r, this.g, this.b, this.a);
    sphere(this.rad);
    pop();
  }
  checkFloor() {
    if (this.pos.x > -FLOOR_SIZE / 2 && this.pos.x < FLOOR_SIZE / 2 &&
      this.pos.z > -FLOOR_SIZE / 2 && this.pos.z < FLOOR_SIZE / 2) {
      // if in the floor area
      // they bounce!
      if (this.pos.y - this.rad < FLOOR_LEVEL) {
        this.pos.y = FLOOR_LEVEL + this.rad;
        this.vel.y *= -1;
        // restitution
        let co_restitution = map(this.mass, 1, 10, 0.99, 0.80);
        this.vel.y *= co_restitution;
      }
    }
  }
  checkFloorWall() {
    // x
    if (this.pos.x < -FLOOR_SIZE/2 || this.pos.x > FLOOR_SIZE/2) {
      this.vel.x *= -1;
    }
    // z
    if (this.pos.z < -FLOOR_SIZE/2 || this.pos.z > FLOOR_SIZE/2) {
      this.vel.z *= -1;
    }
    this.pos.x = constrain(this.pos.x, -FLOOR_SIZE/2, FLOOR_SIZE/2);
    this.pos.z = constrain(this.pos.z, -FLOOR_SIZE/2, FLOOR_SIZE/2);
    // y
    if (this.pos.y - this.rad < FLOOR_LEVEL) {
      this.pos.y = FLOOR_LEVEL + this.rad;
      this.vel.y *= -1;
      // restitution
      let co_restitution = map(this.mass, 1, 10, 0.99, 0.80);
      this.vel.y *= co_restitution;
    }
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass); // *** mass!! ***
    this.acc.add(force);
  }
  checkCollision(other) {
    let distance = this.pos.dist(other.pos);
    if (distance < this.rad + other.rad) {
      // collided!

      // this particle
      let force = p5.Vector.sub(other.pos, this.pos);
      force.normalize();
      force.mult(this.vel.mag() * 0.8);
      other.applyForce(force);

      // other particle
      force.mult(-1);
      force.normalize();
      force.mult(other.vel.mag() * 0.8);
      this.applyForce(force);
    }
  }
}







//
