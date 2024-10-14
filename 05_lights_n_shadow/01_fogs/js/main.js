let params = {
  near: 1,
  far: 1500,
  fogColor: 0x333333,
  exp2: false,
  density: 0.001,
};


let cubes = [];

function setupThree() {
  gui.addColor(params, "fogColor");
  gui.add(params, "exp2").listen();

  let folderCommon = gui.addFolder("NORMAL");
  folderCommon.open();
  folderCommon.add(params, "near", 1, 5000).step(1).onChange(function () {
    params.exp2 = false;
  });
  folderCommon.add(params, "far", 1, 5000).step(1).onChange(function () {
    params.exp2 = false;
  });

  let folderExp2 = gui.addFolder("EXP2");
  folderExp2.open();
  folderExp2.add(params, "density", 0.0, 0.003).step(0.0001).onChange(function () {
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
    c.move();
    c.rotate();
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