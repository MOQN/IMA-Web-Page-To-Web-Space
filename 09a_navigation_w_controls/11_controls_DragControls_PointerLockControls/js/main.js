let params = {
  fps: 0,
  walk: false
};

let controls;

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const moveSpeed = 300;

let plane;
let objects = [];

// for controls movements
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = true;
let jumpVelocity = 0;
let jumpAccel = 600; // world units / second
let fallAccel = 1080; // world units / second squared

function setupThree() {
  // controls
  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(camera);

  const controlsDrag = new DragControls(objects, camera, renderer.domElement);
  // add event listener to highlight dragged objects
  controlsDrag.addEventListener('dragstart', function (event) {
    event.object.material.color.set(0xFF0000);
  });
  controlsDrag.addEventListener('dragend', function (event) {
    event.object.material.color.set(0xFFFFFF);
  });

  // F toggles modes. Esc releases the pointer and returns to editing.
  pane.addBinding(params, "walk", { label: "Walk (F)" }).on("change", ({ value }) => {
    if (value) controls.lock();
    else controls.unlock();
  });
  window.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && controls.isLocked) {
      controls.unlock();
      return;
    }
    if (event.code !== "KeyF" || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
    if (controls.isLocked) controls.unlock();
    else controls.lock();
  });
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
  controls.addEventListener("lock", () => {
    params.walk = true;
    controlsDrag.enabled = false;
  });
  controls.addEventListener("unlock", () => {
    params.walk = false;
    controlsDrag.enabled = true;
  });
  document.addEventListener("pointerlockerror", () => {
    params.walk = controls.isLocked;
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

    objects.push(box);
  }
}

function updateThree() {
  const dt = Math.min(delta, 0.05);
  if (!controls.isLocked) return;
  const forward = Number(moveForward) - Number(moveBackward);
  const sideways = Number(moveRight) - Number(moveLeft);
  const length = Math.hypot(forward, sideways);
  if (length > 0) {
    controls.moveForward(forward / length * moveSpeed * dt);
    controls.moveRight(sideways / length * moveSpeed * dt);
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
  let positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.array.length; i += 3) {
    let x = positionAttribute.array[i + 0];
    let y = positionAttribute.array[i + 1];
    let z = positionAttribute.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    positionAttribute.array[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}

// event listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
  if (!controls?.isLocked) return;
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