let params = {
  color: "#FFF"
};

let cubes = [];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let arrowHelper;

window.addEventListener('mousemove', function (event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -event.clientY / window.innerHeight * 2 + 1;
  // console.log(mouse.x, mouse.y);
});


/*
window.addEventListener('click', function (event) {
  mouse.x = event.clientX / window.innerWidth * 2 - 1;
  mouse.y = -event.clientY / window.innerHeight * 2 + 1;
  // console.log(mouse.x, mouse.y);
});
*/

function setupThree() {
  for (let i = 0; i < 100; i++) {
    let tCube = new Cube()
      .setPosition(random(-500, 500), random(-500, 500), random(-500, 500))
      .setVelocity(random(-0.1, 0.1), random(-0.1, 0.1), random(-0.1, 0.1))
      .setRotationVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setScale(random(10, 30), random(10, 30), random(10, 30));
    cubes.push(tCube);
  }


  arrowHelper = new THREE.ArrowHelper(
    raycaster.ray.direction,
    raycaster.ray.origin,
    100,
    0x00ff00
  );
  scene.add(arrowHelper);
}

function updateThree() {

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  /*
  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }
  */

  for (let c of cubes) {
    c.intersect(intersects);
    c.move();
    c.rotate();
    c.update();
  }


  // update the arrow helper
  arrowHelper.position.copy(raycaster.ray.origin);
  arrowHelper.setDirection(raycaster.ray.direction);

  // release the mouse
  //mouse.x = -1000000;
  //mouse.y = -1000000;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    wireframe: true
  });
  let mesh = new THREE.Mesh(geometry, material);
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
    this.isSelected = false;
    this.mesh = getBox();
    scene.add(this.mesh);
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
  intersects(intersections) {

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
  intersect(intersections) {
    let isIntersected = false;

    for (let i of intersections) {
      if (i.object === this.mesh) {
        isIntersected = true;
        //break;
      }
    }

    /*
    if (intersections.length > 0) {
      if (intersections[0].object === this.mesh) {
        isIntersected = true;
      }
    }
      */

    if (isIntersected) {
      // change
      this.mesh.material.color.set(0xff0000);
      this.mesh.material.wireframe = false;
    } else {
      // back to the original
      this.mesh.material.color.set(0xFFFFFF);
      this.mesh.material.wireframe = true;
    }
  }
  update() {
    this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.mesh.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.mesh.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
}