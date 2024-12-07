// this example code is highly inspired by SimonDev's tutorial.
// https://www.youtube.com/watch?v=UuNPHOJ_V5o

let params = {
  color: "#FFF"
};

const WORLD_HALF = 1000;
const FLOOR_HEIGHT = -150;
const C_GRAVITY = 0.3;

let plane;
let user;
let thirdPovCam;

let rayToBottom;

function setupThree() {
  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  // Character
  user = new Character();

  // 3rd person camera
  thirdPovCam = new ThirdPersonCamera(camera);

  // raycaster
  rayToBottom = new Ray();

  // gui
  let folderOffset = gui.addFolder("OFFSET");
  folderOffset.open();
  folderOffset.add(thirdPovCam.idealOffset, "x", -1000, 1000).step(1);
  folderOffset.add(thirdPovCam.idealOffset, "y", -1000, 1000).step(1);
  folderOffset.add(thirdPovCam.idealOffset, "z", -1000, 1000).step(1);

  let folderLookAt = gui.addFolder("LOOK AT");
  folderLookAt.open();
  folderLookAt.add(thirdPovCam.idealLookAt, "x", -1000, 1000).step(1);
  folderLookAt.add(thirdPovCam.idealLookAt, "y", -1000, 1000).step(1);
  folderLookAt.add(thirdPovCam.idealLookAt, "z", -1000, 1000).step(1);
}

function updateThree() {
  rayToBottom.updateOrigin(user.position);
  let floorHeight = rayToBottom.getIntersection([plane]); // we send an array of objects to check for intersection.

  user.update();
  thirdPovCam.update(user);
}

class Ray {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    let origin = new THREE.Vector3(0, 0, 0); // this will be updated later by the user's position.
    let direction = new THREE.Vector3(0, -1, 0); // to bottom
    this.raycaster.set(origin, direction);

    // optional
    this.intersectionMarker = this.getMarkerMesh();
    this.intersectionMarker.scale.set(10, 10, 10);
    scene.add(this.intersectionMarker);
  }
  updateOrigin(position) {
    this.raycaster.ray.origin.copy(position);
  }
  updateDirection(direction) {
    this.raycaster.ray.direction.copy(direction);
  }
  getMarkerMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }
  getIntersection(objects) {
    const intersects = this.raycaster.intersectObjects(objects);

    if (intersects.length > 0) {
      const intersection = intersects[0]; // the first intersection (closest object)

      // get the position of the intersection
      const intersectionPosition = intersection.point;
      console.log('Intersection Position:', intersectionPosition);

      // optional
      this.intersectionMarker.position.copy(intersectionPosition);

      return intersectionPosition;
    } else {
      console.log('Nothing below.');
      return null;
    }
  }
}

// alternatively this function can be used
const raycaster = new THREE.Raycaster();

function getHeightAt(position, targetObject) {
  const origin = new THREE.Vector3(position.x, 100000, position.z); // 100000 is just an arbitrary large number.
  const direction = new THREE.Vector3(0, -1, 0); // to bottom
  raycaster.set(origin, direction);

  const intersects = raycaster.intersectObject(targetObject);
  if (intersects.length > 0) {
    return intersects[0].point.y;
  }
  return null;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array; // REORGANIZE
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.02;
    let amp = 4;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}

class ThirdPersonCamera {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3();
    this.lookAtVector = new THREE.Vector3();
    this.idealOffset = new THREE.Vector3(100, 150, 350);
    this.idealLookAt = new THREE.Vector3(0, 0, -300);
    this.lerpAmount = 0.05;
  }
  calculateOffset(target) {
    const offset = new THREE.Vector3().copy(this.idealOffset);
    offset.applyQuaternion(target.direction);
    offset.add(target.position);
    return offset;
  }
  calculateLookAt(target) {
    const lookAt = new THREE.Vector3().copy(this.idealLookAt);
    lookAt.applyQuaternion(target.direction);
    lookAt.add(target.position);
    return lookAt;
  }
  update(target) {
    const offset = this.calculateOffset(target);
    const lookAt = this.calculateLookAt(target);

    this.position.lerp(offset, this.lerpAmount);
    this.lookAtVector.lerp(lookAt, this.lerpAmount);

    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAtVector);
  }
}

class Character {
  constructor() {
    this.mesh = getBox();
    scene.add(this.mesh);
    this.mesh.geometry.translate(0, 0.5, 0); // translate the origin to the bottom of the box
    this.mesh.scale.set(100, 200, 20);
    //
    this.position = this.mesh.position;
    this.position.y = FLOOR_HEIGHT;
    this.direction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0);
    this.moveVel = 0.0;
    this.rotateVel = 0.02;
    this.jumpVel = 0.0;
    //
    this.runAcc = 6.0;
    this.walkAcc = 2.5;
    this.jumpAcc = 10;
    this.isJumped = false;
    //
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      rotateLeft: false,
      rotateRight: false,
      space: false,
      shift: false,
    }
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
  }
  update() {
    this.rotate();
    this.move();
    this.jump();
    //
    this.mesh.setRotationFromQuaternion(this.direction);
  }
  jump() {
    let floorHeight = getHeightAt(this.position, plane); // using global function with global plane.
    if (floorHeight === null) {
      floorHeight = FLOOR_HEIGHT;
    }
    if (this.keys.space) {
      if (!this.isJumped) {
        this.isJumped = true;
        this.jumpVel += this.jumpAcc;
      }
    }
    // fall
    this.position.y += this.jumpVel;
    if (this.position.y > floorHeight) {
      this.jumpVel -= C_GRAVITY;
    } else {
      this.position.y = floorHeight;
      this.isJumped = false;
      this.jumpVel = 0.0;
    }
  }
  move() {
    // walk or run
    if (this.keys.shift) {
      this.moveVel = this.runAcc;
    } else {
      this.moveVel = this.walkAcc;
    }
    // forward or backward
    if (this.keys.forward) {
      const vector = new THREE.Vector3(0, 0, 1); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(-this.moveVel); // negative
      this.position.add(vector);
    }
    if (this.keys.backward) {
      const vector = new THREE.Vector3(0, 0, 1); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(this.moveVel); // positive
      this.position.add(vector);
    }
    // left or right
    if (this.keys.left) {
      const vector = new THREE.Vector3(1, 0, 0); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(-this.moveVel); // negative
      this.position.add(vector);
    }
    if (this.keys.right) {
      const vector = new THREE.Vector3(1, 0, 0); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(+this.moveVel); // positive
      this.position.add(vector);
    }
  }
  rotate() {
    // rotate left or right
    if (this.keys.rotateLeft) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.rotateVel); // positive
      this.direction.multiply(quaternion);
    }
    if (this.keys.rotateRight) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, -this.rotateVel); // negative
      this.direction.multiply(quaternion);
    }
  }
  onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = true;
        break;
      case 'KeyE':
        this.keys.rotateRight = true;
        break;
      case 'Space':
        this.keys.space = true;
        break;
      case 'ShiftLeft':
        this.keys.shift = true;
        break;
    }
  };

  onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = false;
        break;
      case 'KeyE':
        this.keys.rotateRight = false;
        break;
      case 'Space':
        this.keys.space = false;
        break;
      case 'ShiftLeft':
        this.keys.shift = false;
        break;
    }
  }
};