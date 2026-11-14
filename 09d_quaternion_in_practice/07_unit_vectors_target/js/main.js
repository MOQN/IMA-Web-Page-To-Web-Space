const params = { fps: 0, status: "Ready", x: 250, y: 100, z: 150 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let arrow, target;
const forward = new THREE.Vector3(0, 0, 1);
const direction = new THREE.Vector3();

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  arrow = getArrow();
  arrow.position.x = -180;
  target = getTarget();
  scene.add(arrow, target);

  setupGUI();

  showInstruction(
    "Move the target with the sliders. The arrow points at it.",
    "arrow.quaternion.setFromUnitVectors(forward, direction);"
  );
}

function updateThree() {
  target.position.set(params.x, params.y, params.z);
  direction.subVectors(target.position, arrow.position);
  if (direction.lengthSq() < 0.000001) {
    params.status = "No direction: keeping last pose";
    return;
  }
  params.status = "Ready";
  direction.normalize();
  arrow.quaternion.setFromUnitVectors(forward, direction);
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

function getTarget() {
  const geometry = new THREE.SphereGeometry(20, 16, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  return new THREE.Mesh(geometry, material);
}
