params = {
  near: 1,
  far: 1600,
  density: 0.001,
  exp2: false,
  color: 0x010101
};

let bears = [];

function setupThree() {
  loadOBJ("assets/gummy.obj");

  const light = getLight();
  light.position.set(100, 400, 800);
  scene.add(light);

  let folderFog = gui.addFolder("FOG");
  folderFog.open();
  folderFog.add(params, "near", 1, 3000).step(1);
  folderFog.add(params, "far", 1, 3000).step(1);
  folderFog.add(params, "exp2");
  folderFog.add(params, "density", 0.00, 0.10).step(0.001);
  folderFog.addColor(params, "color");

  let folderLight = gui.addFolder("LIGHT");
  folderLight.open();
  folderLight
    .add(light.position, "x")
    .min(-2000)
    .max(2000)
    .step(1);
  folderLight
    .add(light.position, "y")
    .min(-2000)
    .max(2000)
    .step(1);
  folderLight
    .add(light.position, "z")
    .min(-2000)
    .max(2000)
    .step(1);
}

function updateThree() {
  if (params.exp2) {
    scene.fog = new THREE.FogExp2(params.color, params.density);
  } else {
    scene.fog = new THREE.Fog(params.color, params.near, params.far);
  }

  // update the objects
  for (let b of bears) {
    b.move();
    b.rotate();
    b.update();
  }
}

function loadOBJ(filepath) {
  // load .obj file
  const loader = new OBJLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      //scene.add(obj); 
      //return obj;
      constructObjects(obj);
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
    }
  );
}

function constructObjects(obj) {
  for (let i = 0; i < 100; i++) {
    let tBear = new Bear(obj)
      .setPosition(random(-500, 500), random(-500, 500), random(-500, 500))
      .setVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setRotationVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setScale(random(10, 30));
    bears.push(tBear);
  }
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 1, 3000, 0.01);
  return light;
}


class Bear {
  constructor(object) {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.group = object.clone();
    for (let child of this.group.children) {
      //child.material = new THREE.MeshBasicMaterial();
      child.material = new THREE.MeshPhongMaterial();
      child.material.color.r = random(1);
      child.material.color.g = random(1);
      child.material.color.b = random(1);
    }

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
  update() {
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.group.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}