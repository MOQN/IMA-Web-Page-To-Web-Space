let params = {
  fps: 0,
  near: 1,
  far: 1500,
  fogColor: 0x333333,
  exp2: false,
  density: 0.001,
};


let cubes = [];

function setupThree() {
  pane.addBinding(params, "fogColor", { view: "color" });
  pane.addBinding(params, "exp2");

  let folderCommon = pane.addFolder({ title: "NORMAL", expanded: true });
  folderCommon.addBinding(params, "near", { min: 1, max: 5000, step: 1 }).on("change", function () {
    params.exp2 = false;
  });
  folderCommon.addBinding(params, "far", { min: 1, max: 5000, step: 1 }).on("change", function () {
    params.exp2 = false;
  });

  let folderExp2 = pane.addFolder({ title: "EXP2", expanded: true });
  folderExp2.addBinding(params, "density", { min: 0.0, max: 0.003, step: 0.0001 }).on("change", function () {
    params.exp2 = true;
  });

  for (let i = 0; i < 100; i++) {
    let tCube = new Cube()
      .setPosition(random(-500, 500), random(-500, 500), random(-500, 500))
      .setVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setRotationVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setScale(random(50, 100), random(50, 100), random(50, 100));
    cubes.push(tCube);
  }
}

function updateThree() {
  // we usually call this in initTHREE().
  if (params.exp2) {
    scene.fog = new THREE.FogExp2(params.fogColor, params.density);
  } else {
    scene.fog = new THREE.Fog(params.fogColor, params.near, params.far);
  }

  // update the objects
  for (let c of cubes) {
    c.update();
  }
}


function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    //color: 0xFFFFFF,
    //wireframe: true
  });
  material.color = new THREE.Color(random(1), random(1), random(1));
  let mesh = new THREE.Mesh(geometry, material);
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