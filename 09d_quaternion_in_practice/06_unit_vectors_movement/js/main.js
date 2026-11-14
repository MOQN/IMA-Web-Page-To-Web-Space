const params = { fps: 0, status: "Ready", x: 1, y: 0, z: 1, speed: 100, paused: false };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let arrow;
const forward = new THREE.Vector3(0, 0, 1);
const direction = new THREE.Vector3();

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  arrow = getArrow();
  scene.add(arrow);
}

function updateThree() {
  direction.set(params.x, params.y, params.z);
  if (direction.lengthSq() < 0.000001) {
    params.status = "No direction: keeping last pose";
    return;
  }
  params.status = "Ready";
  direction.normalize();
  arrow.quaternion.setFromUnitVectors(forward, direction);
  if (!params.paused) {
    arrow.position.addScaledVector(direction, params.speed * delta);
    if (arrow.position.length() > 600) arrow.position.set(0, 0, 0);
  }
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
