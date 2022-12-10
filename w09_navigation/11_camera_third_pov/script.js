// this example code is highly inspired by SimonDev's tutorial.
// https://www.youtube.com/watch?v=UuNPHOJ_V5o

const WORLD_HALF = 200;
const FLOOR_HEIGHT = -15;
const C_GRAVITY = 0.1;

let plane;
let user;
let thirdPovCam;

function setupTHREE() {
  // plane
  plane = getPlane();
  plane.position.y = -WORLD_HALF / 2;
  plane.rotation.x = -PI / 2;

  // Character
  user = new Character();

  // 3rd person camera
  thirdPovCam = new ThirdPersonCamera(camera);

  // gui
  gui.add(thirdPovCam.idealOffset, "x", -100, 100).step(1);
  gui.add(thirdPovCam.idealOffset, "y", -100, 100).step(1);
  gui.add(thirdPovCam.idealOffset, "z", -100, 100).step(1);
  gui.add(thirdPovCam.idealLookAt, "x", -100, 100).step(1);
  gui.add(thirdPovCam.idealLookAt, "y", -100, 100).step(1);
  gui.add(thirdPovCam.idealLookAt, "z", -100, 100).step(1);
}

function updateTHREE() {
  user.update();
  thirdPovCam.update(user);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 10, WORLD_HALF * 10, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array;
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

  scene.add(mesh);
  return mesh;
}

class ThirdPersonCamera {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3();
    this.lookAtVector = new THREE.Vector3();
    this.idealOffset = new THREE.Vector3(30, 20, 60);
    this.idealLookAt = new THREE.Vector3(0, 0, -100);
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
    this.position = new THREE.Vector3();
    this.position.y = FLOOR_HEIGHT;
    this.direction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0);
    this.moveVel = 1.0;
    this.rotateVel = 0.02;
    this.jumpVel = 0.0;
    //
    this.runAcc = 2.5;
    this.walkAcc = 1.0;
    this.jumpAcc = 2.3;
    this.isJumped = false;
    //
    this.mesh = getBox();
    this.mesh.scale.set(10, 20, 2);
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
    this.mesh.position.x = this.position.x;
    this.mesh.position.y = this.position.y;
    this.mesh.position.z = this.position.z;
    //
    this.mesh.setRotationFromQuaternion(this.direction);
  }
  jump() {
    if (this.keys.space) {
      if (!this.isJumped) {
        this.isJumped = true;
        this.jumpVel += this.jumpAcc;

      }
    }
    // fall
    this.position.y += this.jumpVel;
    if (this.position.y > FLOOR_HEIGHT) {
      this.jumpVel -= C_GRAVITY;
    } else {
      this.position.y = FLOOR_HEIGHT;
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




///// p5.js /////

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();
  background(50);

  initTHREE();
}

function draw() {
  noLoop();
}

///// three.js /////

let container, stats, gui, params;
let scene, camera, renderer;
let time = 0;
let frame = 0;

function initTHREE() {
  console.log(THREE.REVISION);
  
  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
  );
  camera.position.z = 100;

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  //let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  gui = new dat.gui.GUI();

  // stats
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild(stats.dom);

  setupTHREE();

  // let's draw!
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  stats.update();
  time = performance.now();
  frame++;

  updateTHREE();

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}