const params = { fps: 0, angle: 0 };
let left, right;
const axis = new THREE.Vector3(0, 1, 0);
const q = new THREE.Quaternion();

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

  setupGUI();

  showInstruction(
    "Change Angle. Left uses quaternion.copy(), right uses setRotationFromQuaternion(). Both receive the same rotation.",
    "left.quaternion.copy(q);\nright.setRotationFromQuaternion(q);"
  );
}

function updateThree() {
  q.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));
  left.quaternion.copy(q);
  right.setRotationFromQuaternion(q);
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
