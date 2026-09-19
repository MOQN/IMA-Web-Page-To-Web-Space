let params = {
  fps: 0,
  // environment
  num_of_cubes: 0,
  scene_children: 0,
  newCubes: 1,
  maxCubes: 3000,
  // genration-related
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
let cubes = [];

function setupThree() {
  pane.addBinding(params, "num_of_cubes", { readonly: true });
  pane.addBinding(params, "scene_children", { readonly: true });

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
      .setVelocity(random(-1, 1) * params.velocity, random(-1, 1) * params.velocity, random(-1, 1) * params.velocity)
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

    c.move();
    c.rotate();
    c.age();
    c.update();
  }

  // limit the number of cubes
  while (cubes.length > params.maxCubes) {
    let index = 0;  // the oldest
    let c = cubes[index];
    scene.remove(c.mesh);
    cubes.splice(index, 1);
  }

  // if some of them is "done", remove the mesh from the scene, then the Cube object.
  // this time I don't use the flipped for loop. Instead "i--;" is used 
  for (let i = 0; i < cubes.length; i++) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh); // don't forget to remove from scene
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
    //wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

class Cube {
  constructor() {
    this.pos = new THREE.Vector3();
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();

    this.scl = new THREE.Vector3(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.rot = new THREE.Vector3();
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.005, 0.010);
    this.isDone = false;
    //
    this.mesh = getBox();
    scene.add(this.mesh); // don't forget to add to scene
  }
  setPosition(x, y, z) {
    this.pos = new THREE.Vector3(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = new THREE.Vector3(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = new THREE.Vector3(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = new THREE.Vector3(w, h, d);
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
    this.acc.set(0, 0, 0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.set(0, 0, 0);
  }
  applyForce(f) {
    let force = f.clone();
    if (this.mass > 0) {
      force.divideScalar(this.mass);
    }
    this.acc.add(force);
  }
  reappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.pos.z = -WORLD_SIZE / 2;
    }
  }
  disappear() {
    if (this.pos.z > WORLD_SIZE / 2) {
      this.isDone = true;
    }
  }
  age() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan <= 0) {
      this.lifespan = 0;
      this.isDone = true;
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);

    let newScale = this.scl.clone().multiplyScalar(this.lifespan);
    this.mesh.scale.set(newScale.x, newScale.y, newScale.z);
  }
}