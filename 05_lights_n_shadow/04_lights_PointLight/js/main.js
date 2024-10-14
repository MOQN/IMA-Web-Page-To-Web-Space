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

function setupThree() {
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

  // gui
  let folderFog = gui.addFolder("Fog");
  folderFog.add(params, "near", 1, 5000).step(1);
  folderFog.add(params, "far", 1, 5000).step(1);

  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

  let folderPointLight = gui.addFolder("PointLight");
  folderPointLight.open();
  folderPointLight.add(tLight.pos, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderPointLight.add(tLight.pos, "y", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderPointLight.add(tLight.pos, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderPointLight.add(tLight.light, "intensity", 0.1, 10).step(0.1);
  folderPointLight.add(tLight.light, "distance", 0, 2000).step(1);
  folderPointLight.add(tLight.light, "decay", 0, 0.5).step(0.01);
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
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.setMass();
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
    this.mass = this.setMass();
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add the mesh to the scene
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
    force.div(this.mass);
    this.acc.add(force);
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}