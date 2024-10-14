let params = {
  color: "#FFF"
};

const WORLD_SIZE = 1000;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let cubes = [];

function setupThree() {
  //
}

function updateThree() {
  // generate cubes in real time
  let numOfCubes = floor(random(1, 5));
  for (let i = 0; i < numOfCubes; i++) {
    let tCube = new Cube()
      .setVelocity(random(-5, 5), random(-5, 5), random(-5, 5))
      .setRotationVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setScale(random(5, 20), random(5, 20), random(5, 20));
    cubes.push(tCube);
  }

  // update the ray and calculate intersected objects
  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObjects(scene.children);

  // update the cubes
  for (let c of cubes) {
    c.move();
    c.rotate();
    c.intersect(intersections);
    c.age();
    c.update();
  }

  // if some of them is "done", remove the mesh from the scene, then the Cube object.
  // this time I don't use the flipped for loop. Instead "i--;" is used 
  for (let i = 0; i < cubes.length; i++) {
    let c = cubes[i];
    if (c.isDone) {
      scene.remove(c.mesh);
      cubes.splice(i, 1);
      i--;
    }
  }

  // update the GUI
  params.cubes = cubes.length;
  params.scene_children = scene.children.length;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    //wireframe: true
  });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh); // *** reorganize ***
  return mesh;
}

class Cube {
  constructor() {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();

    this.scl = createVector(1, 1, 1);
    this.mass = 1;
    //this.setMass(); // feel free to use this method; it arbitrarily defines the mass based on the scale.

    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();

    this.lifespan = 1.0;
    this.lifeReduction = random(0.005, 0.010);
    this.isDone = false;
    //
    this.mesh = getBox();
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
  intersect(intersections) {
    let isIntersected = false;
    /*
    // if you only want to select the first (closest) one.
    if (intersections.length > 0) {
      if (this.mesh.uuid === intersections[0].object.uuid) {
        isIntersected = true;
      }
    }
    */
    // if you want to select the whole objects on the ray.
    for (let i of intersections) {
      if (this.mesh.uuid === i.object.uuid) {
        isIntersected = true;
      }
    }
    if (isIntersected) {
      this.mesh.material.color.r = random(1.0);
      this.mesh.material.color.g = random(1.0);
      this.mesh.material.color.b = random(1.0);

      this.vel.mult(0.8);
      this.setScale(random(30, 80), random(30, 80), random(30, 80));

      // this object can be also removed!
      //this.isDone = true; 
    } else {
      //
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);

    let newScale = p5.Vector.mult(this.scl, this.lifespan);
    this.mesh.scale.set(newScale.x, newScale.y, newScale.z);
  }
}

// event listeners
window.addEventListener("resize", onWindowResize);
window.addEventListener('mousemove', onMouseMove);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}