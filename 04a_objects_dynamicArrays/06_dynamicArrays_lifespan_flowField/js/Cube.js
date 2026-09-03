class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.001, 0.010);
    this.isDone = false;

    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add to scene
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    // or
    //h = (h === undefined) ? w : h;
    //d = (d === undefined) ? w : d;
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.scl.x * this.scl.y * this.scl.z) * 0.000001; // arbitrary
    }
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    if (this.mass > 0) {
      force.div(this.mass);
    }
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.x < -WORLD_SIZE / 2) {
      this.pos.x = WORLD_SIZE / 2;
    } else if (this.pos.x > WORLD_SIZE / 2) {
      this.pos.x = -WORLD_SIZE / 2;
    }
    if (this.pos.y < -WORLD_SIZE / 2) {
      this.pos.y = WORLD_SIZE / 2;
    } else if (this.pos.y > WORLD_SIZE / 2) {
      this.pos.y = -WORLD_SIZE / 2;
    }
    if (this.pos.z < -WORLD_SIZE / 2) {
      this.pos.z = WORLD_SIZE / 2;
    } else if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  disappear() {
    if (this.pos.x < -WORLD_SIZE / 2 ||
      this.pos.x > WORLD_SIZE / 2 ||
      this.pos.z < -WORLD_SIZE / 2 ||
      this.pos.z > WORLD_SIZE / 2 ||
      this.pos.y < -WORLD_SIZE / 2 ||
      this.pos.y > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);

    let newScale = p5.Vector.mult(this.scl, this.lifespan);
    this.mesh.scale.set(newScale.x, newScale.y, newScale.z);
  }
}