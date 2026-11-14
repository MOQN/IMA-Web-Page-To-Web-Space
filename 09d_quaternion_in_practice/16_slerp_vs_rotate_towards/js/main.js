const params = { fps: 0, angle: 150, follow: 0.05, speed: 60, smoothLeft: 0, steadyLeft: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let smoothArrow, steadyArrow;
const goal = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 1, 0);

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
  smoothArrow = getArrow();
  smoothArrow.position.x = -220;
  smoothArrow.children[0].material.color.set(0x0066ff);
  steadyArrow = getArrow();
  steadyArrow.position.x = 220;
  steadyArrow.children[0].material.color.set(0xff3300);
  scene.add(smoothArrow, steadyArrow);

  setupGUI();
}

function updateThree() {
  goal.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));

  // Re-use the current pose: ease toward the goal, slowing down near it.
  smoothArrow.quaternion.slerp(goal, params.follow);

  // Maximum angular distance this frame: keep a constant speed until arrival.
  const step = THREE.MathUtils.degToRad(params.speed) * delta;
  steadyArrow.quaternion.rotateTowards(goal, step);
}

function resetRotation() {
  smoothArrow.quaternion.identity();
  steadyArrow.quaternion.identity();
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

