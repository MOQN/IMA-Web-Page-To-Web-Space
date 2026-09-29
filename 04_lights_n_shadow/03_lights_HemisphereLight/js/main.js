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

  const hemiLight = new THREE.HemisphereLight(0x000099, 0x330000, 1); //skyColor, groundColor, intensity
  scene.add(hemiLight);

  let folderFog = pane.addFolder({ title: "Fog", expanded: true });
  folderFog.addBinding(params, "near", { min: 1, max: 5000, step: 1 });
  folderFog.addBinding(params, "far", { min: 1, max: 5000, step: 1 });

  let folderAmbiLight = pane.addFolder({ title: "AmbientLight", expanded: true });
  folderAmbiLight.addBinding(ambiLight.color, "r", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "g", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "b", { min: 0.0, max: 1.0 });

  let folderHemiLightSky = pane.addFolder({ title: "HemisphereLight Sky", expanded: true });
  folderHemiLightSky.addBinding(hemiLight.color, "r", { min: 0.0, max: 1.0 });
  folderHemiLightSky.addBinding(hemiLight.color, "g", { min: 0.0, max: 1.0 });
  folderHemiLightSky.addBinding(hemiLight.color, "b", { min: 0.0, max: 1.0 });

  let folderHemiLightGround = pane.addFolder({ title: "HemisphereLight Ground", expanded: true });
  folderHemiLightGround.addBinding(hemiLight.groundColor, "r", { min: 0.0, max: 1.0 });
  folderHemiLightGround.addBinding(hemiLight.groundColor, "g", { min: 0.0, max: 1.0 });
  folderHemiLightGround.addBinding(hemiLight.groundColor, "b", { min: 0.0, max: 1.0 });
}

function updateThree() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the objects
  for (let c of cubes) {
    c.update();
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

class Cube {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add the mesh to the scene

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