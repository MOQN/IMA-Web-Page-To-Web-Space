const params = { fps: 0, forward: "+Y", x: 250, y: 100, z: 150 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let arrow, target;
const forward = new THREE.Vector3();
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
}

function updateThree() {
  // The unrotated arrow is built along +Y, not +Z.
  if (params.forward === "+Y") forward.set(0, 1, 0);
  else forward.set(0, 0, 1);
  target.position.set(params.x, params.y, params.z);
  direction.subVectors(target.position, arrow.position);
  if (direction.lengthSq() < 0.000001) return;
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

// This example model points along local +Y before rotation.
function getArrow() {
  const group = new THREE.Group();
  const shaft = getBox();
  shaft.scale.set(12, 100, 12);
  shaft.position.y = 50;
  const head = new THREE.Mesh(
    new THREE.ConeGeometry(25, 50, 8),
    new THREE.MeshBasicMaterial({ color: 0xff8800 })
  );
  head.position.y = 125;
  group.add(shaft, head);
  return group;
}

function getTarget() {
  const geometry = new THREE.SphereGeometry(20, 16, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
  return new THREE.Mesh(geometry, material);
}
