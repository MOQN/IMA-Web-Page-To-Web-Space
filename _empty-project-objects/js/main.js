let params = {
  fps: 0,
  numOfParticles: 0
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let cubes = [];

function setupThree() {
  // GUI
  pane.addBinding(params, "numOfParticles", { step: 1 });

  // add your code here
}

function updateThree() {
  // generate
  let box = new Box();
  // random position
  // box.pos.x = random(-WORLD_HALF, WORLD_HALF);
  // box.pos.y = random(-WORLD_HALF, WORLD_HALF);
  // box.pos.z = random(-WORLD_HALF, WORLD_HALF);
  cubes.push(box);

  // update
  for (let i = 0; i < cubes.length; i++) {
    let cube = cubes[i];
    cube.reappear();
    cube.update();
  }

  // remove cubes that are done
  for (let i = cubes.length - 1; i >= 0; i--) {
    let cube = cubes[i];
    if (cube.isDone) {
      scene.remove(cube.mesh);
      cubes.splice(i, 1);
    }
  }

  // update the value(s) in the GUI
  params.numOfParticles = cubes.length;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

///// CLASS /////

class Box {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);

    // position
    this.pos = this.mesh.position; // get the reference to the mesh's position
    this.vel = new THREE.Vector3(random(-1, 1), random(-1, 1), random(-1, 1));
    this.acc = new THREE.Vector3(0, 0, 0);

    // rotation
    this.rot = this.mesh.rotation; // get the reference to the mesh's rotation
    this.rotSpeed = new THREE.Vector3(
      random(-0.05, 0.05),
      random(-0.05, 0.05),
      random(-0.05, 0.05)
    );

    // scale
    this.size = random(5, 20);
    this.mass = 1;
    this.scale = this.mesh.scale; // get the reference to the mesh's scale
    this.scale.set(this.size, this.size, this.size);

    // color
    this.color = this.mesh.material.color; // get the reference to the mesh's color
    this.mesh.material.transparent = true; // enable transparency for the material

    // lifespan
    this.lifespan = 1; // 100%
    this.lifeReduction = random(0.001, 0.01);
    this.isDone = false;
  }
  update() {
    this.updatePosition();
    this.updateRotation();
    this.updateScale();
    this.updateLifespan();
  }
  applyForces(f) {
    if (this.mass <= 0) return;
    const force = f.clone(); // clone the input force to avoid modifying the original vector
    force.divideScalar(this.mass); // Accel = Force / Mass
    this.acc.add(force);
  }
  updatePosition() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.multiplyScalar(0); // reset acceleration     //this.acc.mult(0); // p5's way
  }
  updateRotation() {
    // note that the rotation object is not a vector, but an Euler object
    this.rot.x += this.rotSpeed.x; // update rotation around x-axis in radians
    this.rot.y += this.rotSpeed.y;
    this.rot.z += this.rotSpeed.z;
  }
  updateScale() {
    this.scale.set(
      this.size * this.lifespan,
      this.size * this.lifespan,
      this.size * this.lifespan
    );
  }
  updateColor() {
    this.mesh.material.opacity = this.lifespan; // update opacity based on lifespan
  }
  updateLifespan() {
    this.lifespan -= this.lifeReduction;
    if (this.lifespan < 0) {
      this.isDone = true;
      this.lifespan = 0;
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