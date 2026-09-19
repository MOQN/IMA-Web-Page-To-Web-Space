let params = {
  fps: 0,
  // environment
  num_of_cubes: 0,
  scene_children: 0,
  newCubes: 1,
  maxCubes: 3000,
  // generation-related
  initX: 0,
  initY: 0,
  initZ: 0,
  velocity: 5,
  scale: 10,
  // manual control
  color: "#FFFFFF",
  wireframe: false,
  transparent: true,
  opacity: 1.0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let cubes = [];

function setupThree() {
  pane.addBinding(params, "num_of_cubes", {
    step: 1,
  });
  pane.addBinding(params, "scene_children", {
    step: 1,
  });

  const folderNumber = pane.addFolder({ title: "NUMBER", expanded: true });
  folderNumber.addBinding(params, "newCubes", { min: 0, max: 50, step: 1 });
  folderNumber.addBinding(params, "maxCubes", { min: 0, max: 3000, step: 1 });

  const folderGeneration = pane.addFolder({ title: "GENERATION", expanded: true });
  folderGeneration.addBinding(params, "initX", { min: -500, max: 500, step: 0.1 });
  folderGeneration.addBinding(params, "initY", { min: -500, max: 500, step: 0.1 });
  folderGeneration.addBinding(params, "initZ", { min: -500, max: 500, step: 0.1 });
  folderGeneration.addBinding(params, "velocity", { min: 1, max: 15, step: 0.01 });
  folderGeneration.addBinding(params, "scale", { min: 6, max: 30, step: 0.1 });

  const folderControl = pane.addFolder({ title: "CONTROL", expanded: true });
  folderControl.addBinding(params, "color", { picker: "inline" });
  folderControl.addBinding(params, "wireframe");
  folderControl.addBinding(params, "transparent");
  folderControl.addBinding(params, "opacity", { min: 0.0, max: 1.0, step: 0.01 });
}

function updateThree() {
  // generate cubes in real time
  for (let i = 0; i < params.newCubes; i++) {
    let tCube = new Cube()
      .setPosition(params.initX, params.initY, params.initZ)
      .setVelocity(
        random(-1, 1) * params.velocity,
        random(-1, 1) * params.velocity,
        random(-1, 1) * params.velocity
      )
      .setRotationVelocity(random(-0.05, 0.05), random(-0.05, 0.05), random(-0.05, 0.05))
      .setScale(random(params.scale - 5, params.scale + 5));
    cubes.push(tCube);
  }

  // update the cubes
  for (let c of cubes) {
    // access each object's mesh and update the properties
    c.mesh.material.wireframe = params.wireframe;
    c.mesh.material.color.set(params.color);
    c.mesh.material.transparent = params.transparent;
    c.mesh.material.opacity = params.opacity;

    c.updatePosition();
    c.updateRotation();
    c.updateLifespan();
    c.updateScale();
    // or, c.update(); // if you want to update all properties
  }

  // limit the number of cubes
  while (cubes.length > params.maxCubes) {
    let index = 0; // the oldest
    let c = cubes[index];
    scene.remove(c.mesh);
    cubes.splice(index, 1);
  }

  // if some of them are "done", remove the mesh from the scene, then the Cube object
  // this time, I don't use the reversed for loop. Instead, "i--;" is used
  for (let i = 0; i < cubes.length; i++) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh); // don't forget to remove it from the scene
      cubes.splice(i, 1);
      i--;
    }
  }

  // update the GUI
  params.num_of_cubes = cubes.length;
  params.scene_children = scene.children.length;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    // wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    // mesh
    this.mesh = getBox();
    scene.add(this.mesh);
    // position
    this.pos = this.mesh.position; // reference to the mesh position
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    // rotation
    this.rot = this.mesh.rotation; // reference to the mesh rotation
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    // scale
    this.scale = this.mesh.scale; // reference to the mesh scale
    this.baseScale = new THREE.Vector3(10, 10, 10); // initial base scale for the cube
    this.scale.copy(this.baseScale);
    // mass
    this.mass = 1;
    // lifespan
    this.lifespan = 1;
    this.lifeReduction = random(0.001, 0.01);
    this.isDone = false;
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
      this.mass =
        1 +
        this.baseScale.x *
        this.baseScale.y *
        this.baseScale.z *
        0.000001;
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
    this.updateLifespan();
    this.updateScale();
  }
  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0); // or, this.acc.multiplyScalar(0);
  }
  updateRotation() {
    // vector addition for rotation velocity
    this.rotVel.add(this.rotAcc);
    // rotation is by Euler angles, not a vector, so update each component individually
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;
    // reset rotation acceleration
    this.rotAcc.set(0, 0, 0);
  }
  updateScale() {
    this.scale.set(
      this.baseScale.x * this.lifespan,
      this.baseScale.y * this.lifespan,
      this.baseScale.z * this.lifespan
    );
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  reappear() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = WORLD_HALF;
    }
    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = WORLD_HALF;
    }
    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = WORLD_HALF;
    }
  }
  bounce() {
    // x
    if (this.pos.x > WORLD_HALF) {
      this.pos.x = WORLD_HALF;
      this.vel.x *= -1;
    }
    else if (this.pos.x < -WORLD_HALF) {
      this.pos.x = -WORLD_HALF;
      this.vel.x *= -1;
    }
    // y
    if (this.pos.y > WORLD_HALF) {
      this.pos.y = WORLD_HALF;
      this.vel.y *= -1;
    }
    else if (this.pos.y < -WORLD_HALF) {
      this.pos.y = -WORLD_HALF;
      this.vel.y *= -1;
    }
    // z
    if (this.pos.z > WORLD_HALF) {
      this.pos.z = WORLD_HALF;
      this.vel.z *= -1;
    }
    else if (this.pos.z < -WORLD_HALF) {
      this.pos.z = -WORLD_HALF;
      this.vel.z *= -1;
    }
  }
}