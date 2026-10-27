// this example code is highly inspired by SimonDev's tutorial.
// https://www.youtube.com/watch?v=UuNPHOJ_V5o

let params = {
  color: "#FFF"
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_HEIGHT = -150;
const C_GRAVITY = 1080; // world units / second squared

let plane;
let user;
let thirdPovCam;

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

  const folderOffset = pane.addFolder({ title: "OFFSET", expanded: true });
  folderOffset.addBinding(thirdPovCam.idealOffset, "x", { min: -1000, max: 1000, step: 1 });
  folderOffset.addBinding(thirdPovCam.idealOffset, "y", { min: -1000, max: 1000, step: 1 });
  folderOffset.addBinding(thirdPovCam.idealOffset, "z", { min: -1000, max: 1000, step: 1 });

  const folderLookAt = pane.addFolder({ title: "LOOK AT", expanded: true });
  folderLookAt.addBinding(thirdPovCam.idealLookAt, "x", { min: -1000, max: 1000, step: 1 });
  folderLookAt.addBinding(thirdPovCam.idealLookAt, "y", { min: -1000, max: 1000, step: 1 });
  folderLookAt.addBinding(thirdPovCam.idealLookAt, "z", { min: -1000, max: 1000, step: 1 });
}

let previousUpdateTime = null;
function updateThree() {
  const now = performance.now();
  const dt = previousUpdateTime === null ? 0 : Math.min((now - previousUpdateTime) / 1000, 0.05);
  previousUpdateTime = now;
  user.update(dt);
  thirdPovCam.update(user, dt);
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
    this.followRate = 3.08; // exponential smoothing per second
    this.initialized = false;
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
  update(target, dt) {
    const offset = this.calculateOffset(target);
    const lookAt = this.calculateLookAt(target);

    if (!this.initialized) {
      this.position.copy(offset);
      this.lookAtVector.copy(lookAt);
      this.initialized = true;
    }
    const amount = 1 - Math.exp(-this.followRate * dt);
    this.position.lerp(offset, amount);
    this.lookAtVector.lerp(lookAt, amount);

    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAtVector);
  }
}

class Character {
  constructor() {
    this.position = new THREE.Vector3();
    this.position.y = FLOOR_HEIGHT;
    this.direction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0);
    this.moveVel = 0.0;
    this.rotateVel = 1.2; // radians / second
    this.jumpVel = 0.0;
    //
    this.runAcc = 360; // running speed, world units / second
    this.walkAcc = 150; // walking speed, world units / second
    this.jumpAcc = 600; // initial jump speed, world units / second
    this.isJumped = false;
    //
    this.mesh = getBox();
    scene.add(this.mesh);
    this.mesh.scale.set(100, 200, 20);
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
    const resetInput = () => {
      for (const key of Object.keys(this.keys)) this.keys[key] = false;
    };
    window.addEventListener('blur', resetInput);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) resetInput();
    });
  }
  update(dt) {
    this.rotate(dt);
    this.move(dt);
    this.jump(dt);
    //
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
    //
    this.mesh.setRotationFromQuaternion(this.direction);
  }
  jump(dt) {
    if (this.keys.space) {
      if (!this.isJumped) {
        this.isJumped = true;
        this.jumpVel += this.jumpAcc;

      }
    }
    // fall
    this.position.y += this.jumpVel * dt - 0.5 * C_GRAVITY * dt * dt;
    if (this.position.y > FLOOR_HEIGHT) {
      this.jumpVel -= C_GRAVITY * dt;
    } else {
      this.position.y = FLOOR_HEIGHT;
      this.isJumped = false;
      this.jumpVel = 0.0;
    }
  }
  move(dt) {
    this.moveVel = this.keys.shift ? this.runAcc : this.walkAcc;
    const direction = new THREE.Vector3(
      Number(this.keys.right) - Number(this.keys.left),
      0,
      Number(this.keys.backward) - Number(this.keys.forward)
    );
    // Normalize the combined input so diagonals are no faster than forward.
    if (direction.lengthSq() > 0) {
      direction.normalize().applyQuaternion(this.direction);
      this.position.addScaledVector(direction, this.moveVel * dt);
    }
  }
  rotate(dt) {
    // rotate left or right
    if (this.keys.rotateLeft) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.rotateVel * dt); // positive
      this.direction.multiply(quaternion);
    }
    if (this.keys.rotateRight) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, -this.rotateVel * dt); // negative
      this.direction.multiply(quaternion);
    }
  }
  onKeyDown(event) {
    if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    if (event.code === 'Space' || event.code.startsWith('Arrow')) event.preventDefault();
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
    /*
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 32: // SPACE
        this.keys.space = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
    */
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
    /*
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 32: // SPACE
        this.keys.space = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
    */
  }
};