const params = { fps: 0, duration: 1.5 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let arrow;
let progress = 1;
const start = new THREE.Quaternion();
const end = new THREE.Quaternion();

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  arrow = getArrow();
  scene.add(arrow);

  setupGUI();

  showInstruction(
    "Choose Front, Left, Right or Up to turn to that pose.",
    "arrow.quaternion.copy(start).slerp(end, progress);"
  );
}

function updateThree() {
  progress = Math.min(1, progress + delta / params.duration);
  arrow.quaternion.copy(start).slerp(end, progress);
}

function turnTo(x, y) {
  start.copy(arrow.quaternion);
  const angles = new THREE.Euler(THREE.MathUtils.degToRad(x), THREE.MathUtils.degToRad(y), 0);
  end.setFromEuler(angles);
  progress = 0;
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

// The arrow is built to point along local +Z before rotation.
function getArrow() {
  const group = new THREE.Group();
  const shaft = getBox();
  shaft.scale.set(12, 12, 100);
  shaft.position.z = 50;
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(25, 50, 8),
    new THREE.MeshBasicMaterial({ color: 0xff8800 })
  );
  head.rotation.x = Math.PI / 2;
  head.position.z = 125;
  group.add(shaft, head);
  return group;
}
