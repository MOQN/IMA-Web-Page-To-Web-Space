let params = {
  fps: 0,
  near: 1,
  far: 2600,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_POSITION = -200;
const COLOR_BG = 0x000000;

let plane;
let cubes = [];
let lights = [];

function setupThree() {
  // the floor
  plane = getPlane(WORLD_HALF * 2 + 200, WORLD_HALF * 2 + 200);
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // cubes
  const distance = 100;
  for (let z = -WORLD_HALF; z <= WORLD_HALF; z += distance) {
    for (let x = -WORLD_HALF; x <= WORLD_HALF; x += distance) {
      let tCube = new Cube()
        .setPosition(x, FLOOR_POSITION, z)
        .setScale(50, random(2, 18) ** 2, 50)
        .setTranslation(0, 0.5, 0);
      cubes.push(tCube);
    }
  }

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft light
  scene.add(ambiLight);

  const tLight = new Light();
  tLight.setPosition(0, 300, 0);
  lights.push(tLight);

  let folderFog = pane.addFolder({ title: "Fog", expanded: true });
  folderFog.addBinding(params, "near", { min: 1, max: 5000, step: 1 });
  folderFog.addBinding(params, "far", { min: 1, max: 5000, step: 1 });

  let folderAmbiLight = pane.addFolder({ title: "AmbientLight", expanded: true });
  folderAmbiLight.addBinding(ambiLight.color, "r", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "g", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "b", { min: 0.0, max: 1.0 });

  let folderPointLight = pane.addFolder({ title: "PointLight", expanded: true });
  folderPointLight.addBinding(tLight.pos, "x", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderPointLight.addBinding(tLight.pos, "y", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderPointLight.addBinding(tLight.pos, "z", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderPointLight.addBinding(tLight.light, "intensity", { min: 0.1, max: 10, step: 0.1 });
  folderPointLight.addBinding(tLight.light, "distance", { min: 0, max: 2000, step: 1 });
  folderPointLight.addBinding(tLight.light, "decay", { min: 0, max: 0.5, step: 0.01 });
}

function updateThree() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the objects
  for (let c of cubes) {
    c.update();
  }

  // update the lights
  for (let l of lights) {
    // l.updatePosition();
    l.update();
  }
}

function getPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    //color: 0xFFFFFF,
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 3, 1000, 0.1); // ( color , intensity, distance (0=infinite), decay )

  // try to add helper!
  //const sphereSize = 30;
  //const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
  //scene.add(pointLightHelper);

  return light;
}

class Light {
  constructor() {
    this.mesh = getSphere();
    this.light = getLight();
    this.mesh.scale.set(20, 20, 20);

    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.group.add(this.light);
    scene.add(this.group);

    this.pos = this.group.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    this.rot = this.group.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    this.scale = this.group.scale;
    this.baseScale = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
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
    w = Math.max(w, minScale);
    h = Math.max(h, minScale);
    d = Math.max(d, minScale);
    this.baseScale.set(w, h, d);
    this.scale.set(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass !== undefined) {
      this.mass = mass;
    }
    else {
      this.mass = 1 + this.baseScale.x * this.baseScale.y * this.baseScale.z * 0.000001;
    }
    return this;
  }
  applyForce(f) {
    if (this.mass <= 0) return;
    const force = f.clone();
    force.divideScalar(this.mass);
    this.acc.add(force);
  }
  update() {
    this.updatePosition();
    this.updateRotation();
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
}

class Cube {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);

    this.pos = this.mesh.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    this.rot = this.mesh.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    this.scale = this.mesh.scale;
    this.baseScale = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
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
    w = Math.max(w, minScale);
    h = Math.max(h, minScale);
    d = Math.max(d, minScale);
    this.baseScale.set(w, h, d);
    this.scale.set(w, h, d);
    return this;
  }
  setMass(mass) {
    if (mass !== undefined) {
      this.mass = mass;
    }
    else {
      this.mass = 1 + this.baseScale.x * this.baseScale.y * this.baseScale.z * 0.000001;
    }
    return this;
  }
  applyForce(f) {
    if (this.mass <= 0) return;
    const force = f.clone();
    force.divideScalar(this.mass);
    this.acc.add(force);
  }
  update() {
    this.updatePosition();
    this.updateRotation();
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
}