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
  // generate cubes in real time
  let numOfCubes = floor(random(1, 5));
  for (let i = 0; i < numOfCubes; i++) {
    let tCube = new Cube()
      .setPosition(random(-WORLD_SIZE / 2, WORLD_SIZE / 2), random(-WORLD_SIZE / 2, WORLD_SIZE / 2), random(-WORLD_SIZE / 2, 0))
      .setVelocity(0, 0, random(0.5, 5))
      .setRotationVelocity(random(-0.05, 0.05), random(-0.05, 0.05), random(-0.05, 0.05))
      .setScale(random(0.3, 1.5));
    cubes.push(tCube);
  }

  // update the cubes
  for (let c of cubes) {
    c.move();
    c.rotate();
    //c.reappear();
    c.disappear();
    c.update();
  }

  // if some of them is "done", remove the mesh from the scene, then the Cube object.
  for (let i = cubes.length - 1; i >= 0; i--) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh);
      cubes.splice(i, 1);
    }
  }

  // update the GUI
  params.cubes = cubes.length;
  params.scene_children = scene.children.length;
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
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.isDone = false;
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add to scene
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
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
    if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  disappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}