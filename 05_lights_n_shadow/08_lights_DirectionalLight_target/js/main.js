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

let directLight;
let directLightHelper;
let targetBox;

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

  // let's add a box flying based on sin() and cos().
  targetBox = getBox();
  targetBox.material.color.set(0xFF00FF);
  targetBox.scale.set(10, 10, 10);
  scene.add(targetBox);

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft light
  scene.add(ambiLight);

  const directLight = new THREE.DirectionalLight(0xffffff, 2.0); // color, intensity
  scene.add(directLight);
  directLight.castShadow = true;
  directLight.target = targetBox;
  directLight.shadow.mapSize.width = 512; // default
  directLight.shadow.mapSize.height = 512; // default

  directLight.position.y = 1000;
  directLight.target = targetBox; // ***

  // add helper
  directLightHelper = new THREE.DirectionalLightHelper(directLight, 500);
  scene.add(directLightHelper);

  // gui
  let folderFog = gui.addFolder("Fog");
  folderFog.add(params, "near", 1, 5000).step(1);
  folderFog.add(params, "far", 1, 5000).step(1);

  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

  let folderDirectLight = gui.addFolder("DirectionalLight");
  folderDirectLight.open();
  folderDirectLight.add(directLight, "intensity", 0.1, 10).step(0.01);
  folderDirectLight.add(directLight.position, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderDirectLight.add(directLight.position, "y", 0, WORLD_HALF_SIZE).step(0.1);
  folderDirectLight.add(directLight.position, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderDirectLight.add(directLight.color, "r", 0.0, 1).step(0.05);
  folderDirectLight.add(directLight.color, "g", 0.0, 1).step(0.05);
  folderDirectLight.add(directLight.color, "b", 0.0, 1).step(0.05);
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

  // update the target position
  let frequency = frame * 0.01;
  let radialDistance = 600;
  targetBox.position.x = cos(frequency) * radialDistance;
  targetBox.position.y = 50;
  targetBox.position.z = sin(frequency) * radialDistance;

  // update the Helper
  directLightHelper.update();
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