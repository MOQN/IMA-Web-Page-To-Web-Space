const params = { fps: 0, step: 30 };
let box;
const q = new THREE.Quaternion();

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  box = getBox();
  box.scale.set(160, 80, 50);
  box.add(new THREE.AxesHelper(1).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(box);

  setupGUI();

  showInstruction(
    "Press Add X Rotation, then Add Y Rotation. Reset and try the reverse order.",
    "q.setFromAxisAngle(axis, angle);\nbox.applyQuaternion(q);"
  );
}

function updateThree() {
  // Rotation is applied when a button is pressed.
}

function addRotation(axis) {
  const angle = THREE.MathUtils.degToRad(params.step);
  q.setFromAxisAngle(axis, angle);
  box.applyQuaternion(q);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x0066ff });
  return new THREE.Mesh(geometry, material);
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({ color: 0x404040, wireframe: true, side: THREE.DoubleSide });
  return new THREE.Mesh(geometry, material);
}
