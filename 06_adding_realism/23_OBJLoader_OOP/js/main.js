let params = {
  fps: 0,
  near: 1,
  far: 1600,
  density: 0.001,
  exp2: false,
  color: 0x010101
};

let bears = [];
let linearFog, exponentialFog;

function setupThree() {
  loadOBJ("assets/gummy.obj");
  linearFog = new THREE.Fog(params.color, params.near, params.far);
  exponentialFog = new THREE.FogExp2(params.color, params.density);
  updateFog();

  const light = getLight();
  light.position.set(100, 400, 800);
  scene.add(light);

  const folderFog = pane.addFolder({ title: "FOG", expanded: true });
  folderFog.addBinding(params, "near", { min: 1, max: 3000, step: 1 });
  folderFog.addBinding(params, "far", { min: 1, max: 3000, step: 1 });
  folderFog.addBinding(params, "exp2");
  folderFog.addBinding(params, "density", { min: 0.00, max: 0.10, step: 0.001 });
  folderFog.addBinding(params, "color", { view: "color" });
  folderFog.on("change", updateFog);

  const folderLight = pane.addFolder({ title: "LIGHT", expanded: true });
  folderLight.addBinding(light.position, "x", { min: -2000, max: 2000, step: 1 });
  folderLight.addBinding(light.position, "y", { min: -2000, max: 2000, step: 1 });
  folderLight.addBinding(light.position, "z", { min: -2000, max: 2000, step: 1 });
}

function updateFog() {
  linearFog.color.set(params.color);
  linearFog.near = params.near;
  linearFog.far = params.far;
  exponentialFog.color.set(params.color);
  exponentialFog.density = params.density;
  scene.fog = params.exp2 ? exponentialFog : linearFog;
}

function updateThree() {
  // update the objects
  for (let b of bears) {
    b.update();
  }
}

function loadOBJ(filepath) {
  // Import OBJLoader from the Three.js addons before using it.
  // See index.html for the import setup!
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
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      } else {
        console.log(`${(xhr.loaded / 1024).toFixed(0)} KB downloaded (total unknown)`);
      }
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
    this.group = object.clone();
    this.pos = this.group.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    this.scale = this.group.scale;
    this.baseScale = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.
    this.rot = this.group.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    this.group.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshPhongMaterial();
        child.material.color.r = random(1);
        child.material.color.g = random(1);
        child.material.color.b = random(1);
      }
    });

    scene.add(this.group);
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
    if (this.mass <= 0) return;
    const force = f.clone();
    force.divideScalar(this.mass);
    this.acc.add(force);
  }
  update() {
    this.updatePosition();
    this.updateRotation();
  }
}