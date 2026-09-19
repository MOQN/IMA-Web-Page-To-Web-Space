let params = {
  // (add)
};

const WORLD_SIZE = 2000;
let cubes = [];

function setupThree() {
  for (let i = 0; i < 1000; i++) {
    let tCube = new Cube()
      .setPosition(random(-WORLD_SIZE / 2, WORLD_SIZE / 2), random(-WORLD_SIZE / 2, WORLD_SIZE / 2), random(-WORLD_SIZE / 2, 0))
      .setVelocity(0, 0, random(0.5, 5))
      .setRotationVelocity(random(-0.05, 0.05), random(-0.05, 0.05), random(-0.05, 0.05))
      .setScale(random(3, 15));
    cubes.push(tCube);
  }
}

function updateThree() {
  for (let c of cubes) {
    c.move();
    c.rotate();
    c.reappear();
    c.update();
  }
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    //wireframe: true
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    this.scl = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = new THREE.Vector3();
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add to scene
  }
  setPosition(x, y, z) {
    this.pos = new THREE.Vector3(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = new THREE.Vector3(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = new THREE.Vector3(w, h, d);
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
    this.acc.set(0, 0, 0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.set(0, 0, 0);
  }
  applyForce(f) {
    let force = f.clone();
    if (this.mass > 0) {
      force.divideScalar(this.mass);
    }
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}