const params = { fps: 0, angle: 90, speed: 30, paused: false };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let box;
const target = new THREE.Quaternion();
const axis = new THREE.Vector3(0, 1, 0);

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  box = getBox();
  box.scale.set(160, 80, 50);
  box.add(new THREE.AxesHelper(160).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(box);

  setupGUI();

  showInstruction(
    "Change Target and Speed to set the rotation and how fast the box turns.",
    "target.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));\nbox.quaternion.rotateTowards(target, step);"
  );
}

function updateThree() {
  target.setFromAxisAngle(axis, THREE.MathUtils.degToRad(params.angle));
  if (params.paused) return;
  const step = THREE.MathUtils.degToRad(params.speed) * delta;
  box.quaternion.rotateTowards(target, step);
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
