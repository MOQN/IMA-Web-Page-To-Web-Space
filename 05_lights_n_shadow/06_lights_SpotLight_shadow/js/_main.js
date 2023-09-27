let params = {
  near: 1,
  far: 2600,
};

const WORLD_HALF_SIZE = 1000;
const FLOOR_POSITION = -200;
const COLOR_BG = 0x000000;

let plane;
let cubes = [];
let lights = [];

let spotLightHelper;

function setupThree() {
  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // the floor
  plane = getPlane(WORLD_HALF_SIZE * 2 + 200, WORLD_HALF_SIZE * 2 + 200);
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // cubes
  const distance = 100;
  for (let z = -WORLD_HALF_SIZE; z <= WORLD_HALF_SIZE; z += distance) {
    for (let x = -WORLD_HALF_SIZE; x <= WORLD_HALF_SIZE; x += distance) {
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

  // add helper for the light frustum and shadow
  spotLightHelper = new THREE.SpotLightHelper(tLight.light);
  scene.add(spotLightHelper);

  // gui
  let folderFog = gui.addFolder("Fog");
  folderFog.add(params, "near", 1, 5000).step(1);
  folderFog.add(params, "far", 1, 5000).step(1);

  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

  let folderSpotLight = gui.addFolder("SpotLight");
  folderSpotLight.open();
  folderSpotLight.add(tLight.pos, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderSpotLight.add(tLight.pos, "y", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderSpotLight.add(tLight.pos, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderSpotLight.add(tLight.light, "intensity", 0.1, 10).step(0.1);
  folderSpotLight.add(tLight.light, "distance", 0, 2000).step(1);
  folderSpotLight.add(tLight.light, "angle", 0, PI / 2).step(0.01);
  folderSpotLight.add(tLight.light, "penumbra", 0, 1).step(0.01);
  folderSpotLight.add(tLight.light, "decay", 0, 0.5).step(0.01);
}

function updateThree() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the objects
  for (let c of cubes) {
    c.move();
    c.rotate();
    c.update();
  }

  // update the lights
  for (let l of lights) {
    //l.move();
    l.update();
  }

  spotLightHelper.update();
}

function getPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h, 32);
  const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true; //default is false

  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    //color: 0xFFFFFF,
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true; //default is false
  mesh.receiveShadow = true; //default is false
  scene.add(mesh);

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
  const light = new THREE.SpotLight(0xFFFFFF, 5, 1000, PI / 4, 0.5, 0.1); // (color, intensity, distance (0=infinite), angle, penumbra, decay)

  light.castShadow = true; // default false
  // can't manipulate the mapSize in realtime.
  light.shadow.mapSize.width = 1024; // default
  light.shadow.mapSize.height = 1024; // default

  return light;
}

class Light {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.mesh = getSphere();
    this.light = getLight();
    this.mesh.scale.set(20, 20, 20);

    this.group = new THREE.Group();
    this.group.add(this.mesh);
    this.group.add(this.light);

    scene.add(this.group);
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
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    let freq = frame * 0.01; // also angle
    let radialDistance = 30;
    this.pos.x = cos(freq) * radialDistance;
    this.pos.z = sin(freq) * radialDistance;
  }
  update() {
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.group.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}

class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.mesh = getBox();
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
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
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
    force.div(this.mass);
    this.acc.add(force);
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}