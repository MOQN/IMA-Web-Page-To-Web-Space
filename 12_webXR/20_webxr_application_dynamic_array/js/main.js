let params = {
  fps: 0,
  cubes: 0,
  scene_children: 0,
};

let room;
let cubes = [];

function setupThree() {
  // WebXR
  setupWebXR();

  // room
  room = getRoom();
  scene.add(room);

  // lights
  const hemiLight = new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3);
  scene.add(hemiLight);

  const direcLight = new THREE.DirectionalLight(0xffffff, 3);
  direcLight.position.set(1, 1, 1).normalize();
  scene.add(direcLight);

  pane.addBinding(params, "cubes", { min: 0, max: 5000, step: 1 });
  pane.addBinding(params, "scene_children", { min: 0, max: 5000, step: 1 });
}

function updateThree() {
  // generate cubes in real time
  let numOfCubes = floor(random(1, 5));
  for (let i = 0; i < numOfCubes; i++) {
    let tCube = new Cube()
      .setPosition(0, 6, 0)
      .setVelocity(random(-0.05, 0.05), random(0.01, 0.05), random(-0.05, 0.05))
      .setRotationVelocity(random(-0.05, 0.05), random(-0.05, 0.05), random(-0.05, 0.05))
      .setScale(random(0.3, 0.6));
    cubes.push(tCube);
  }

  // update the cubes
  for (let c of cubes) {
    let gravity = new THREE.Vector3(0, -0.00005, 0);
    c.applyForce(gravity);
    c.updatePosition();
    c.updateRotation();
    c.updateLifespan();
    c.updateScale();
  }

  // remove the cubes that are done
  for (let i = 0; i < cubes.length; i++) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh);
      cubes.splice(i, 1);
      i--;
    }
  }

  params.cubes = cubes.length;
  params.scene_children = scene.children.length;
}

///// UTILS /////

function getRoom() {
  const geometry = new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0);
  const materials = new THREE.LineBasicMaterial({
    color: 0xbcbcbc,
    transparent: true,
    opacity: 0.5,
  });
  const mesh = new THREE.LineSegments(geometry, materials);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);

    this.pos = this.mesh.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();

    this.scale = this.mesh.scale;
    this.baseScale = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.rot = this.mesh.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.005, 0.010);
    this.isDone = false;
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel.set(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot.set(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel.set(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.baseScale.set(w, h, d);
    this.scale.set(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.baseScale.x * this.baseScale.y * this.baseScale.z) * 0.000001; // arbitrary
    }
    return this;
  }
  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
  }
  updateRotation() {
    this.rotVel.add(this.rotAcc);
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;
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
  disappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  updateScale() {
    this.scale.set(
      this.baseScale.x * this.lifespan,
      this.baseScale.y * this.lifespan,
      this.baseScale.z * this.lifespan
    );
  }
}