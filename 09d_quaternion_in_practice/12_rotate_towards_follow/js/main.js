const params = { fps: 0, targetSpeed: 40, speed: 60, paused: false };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let arrow, target;
let targetAngle = 0;
const forward = new THREE.Vector3(0, 0, 1);
const direction = new THREE.Vector3();
const targetRotation = new THREE.Quaternion();

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  arrow = getArrow();
  target = getTarget();
  scene.add(arrow, target);

  setupGUI();
}

function updateThree() {
  if (!params.paused) targetAngle += THREE.MathUtils.degToRad(params.targetSpeed) * delta;
  target.position.set(Math.sin(targetAngle) * 300, 0, Math.cos(targetAngle) * 300);

  direction.subVectors(target.position, arrow.position).normalize();
  targetRotation.setFromUnitVectors(forward, direction);
  const step = THREE.MathUtils.degToRad(params.speed) * delta;
  arrow.quaternion.rotateTowards(targetRotation, step);
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
