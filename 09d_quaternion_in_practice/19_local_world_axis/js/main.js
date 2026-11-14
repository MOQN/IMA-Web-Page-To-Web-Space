const params = { fps: 0, step: 30 };
let left, right;
const axis = new THREE.Vector3(0, 1, 0);

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  left = getBox();
  left.scale.set(160, 80, 50);
  left.position.x = -230;
  left.add(new THREE.AxesHelper(1).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(left);
  right = getBox();
  right.material.color.set(0x00ff00);
  right.scale.set(160, 80, 50);
  right.position.x = 230;
  right.add(new THREE.AxesHelper(1).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(right);
  resetRotation();

  setupGUI();

  showInstruction(
    "Both boxes start tilted. Rotate Both turns the left box around its own Y axis and the right box around world Y.",
    "left.rotateOnAxis(axis, angle);\nright.rotateOnWorldAxis(axis, angle);"
  );
}

function updateThree() {
  // Rotate both boxes with the button.
}

function resetRotation() {
  left.rotation.set(Math.PI / 4, 0, 0);
  right.rotation.set(Math.PI / 4, 0, 0);
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
