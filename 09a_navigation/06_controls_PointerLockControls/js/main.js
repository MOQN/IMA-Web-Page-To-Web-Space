let params = {
  color: "#FFF"
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let plane;

// for controls movements
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;
let moveVelocity = 300; // world units / second
let jumpVelocity = 0;
let jumpAccel = 600; // world units / second
let fallAccel = 1080; // world units / second squared

function setupThree() {
  // controls
  controls = new PointerLockControls(camera, renderer.domElement);
  //controls.lock();
  scene.add(camera);

  // Click Walk to capture the pointer. Esc releases it and returns to editing.
  pane.addButton({ title: "Walk (Esc to exit)" }).on('click', () => controls.lock());
  const resetMovement = () => {
    moveForward = moveBackward = moveLeft = moveRight = false;
  };
  controls.addEventListener('unlock', resetMovement);
  window.addEventListener('blur', resetMovement);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      resetMovement();
      controls.unlock();
    }
  });

  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
  plane.rotation.x = -PI / 2;

  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);

    box.position.x = random(-WORLD_HALF, WORLD_HALF);
    box.position.y = random(-WORLD_HALF / 2, WORLD_HALF);
    box.position.z = random(-WORLD_HALF, WORLD_HALF);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 20);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);
  }
}

let previousUpdateTime = null;
function updateThree() {
  const now = performance.now();
  const dt = previousUpdateTime === null ? 0 : Math.min((now - previousUpdateTime) / 1000, 0.05);
  previousUpdateTime = now;
  if (!controls.isLocked) return;
  const forward = Number(moveForward) - Number(moveBackward);
  const sideways = Number(moveRight) - Number(moveLeft);
  const length = Math.hypot(forward, sideways);
  if (length > 0) {
    controls.moveForward(forward / length * moveVelocity * dt);
    controls.moveRight(sideways / length * moveVelocity * dt);
  }
  camera.position.y += jumpVelocity * dt - 0.5 * fallAccel * dt * dt;
  jumpVelocity -= fallAccel * dt;
  if (camera.position.y <= 0) {
    camera.position.y = 0;
    jumpVelocity = 0;
    canJump = true;
  }
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
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

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}


// event listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  if (!controls.isLocked) return;
  if (event.code === "Space" || event.code.startsWith("Arrow")) event.preventDefault();
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;
    case 'Space':
      if (canJump === true) jumpVelocity += jumpAccel;
      canJump = false;
      break;
  }
};

function onKeyUp(event) {
  switch (event.code) {
    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;
  }
};