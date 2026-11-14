const params = { fps: 0, duration: 2, paused: false, progress: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let hinge;
let progress = 0;
let playing = false;
const closed = new THREE.Quaternion();
const opened = new THREE.Quaternion();

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  hinge = new THREE.Group();
  hinge.position.x = -100;
  const door = getBox();
  door.scale.set(200, 260, 15);
  door.position.x = 100;
  hinge.add(door, new THREE.AxesHelper(180).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(hinge);
  opened.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);

  setupGUI();

  showInstruction(
    "Press Open / Replay. Duration sets how long the door takes to open.",
    "hinge.quaternion.copy(closed).slerp(opened, progress);"
  );
}

function updateThree() {
  if (playing && !params.paused) {
    progress = Math.min(1, progress + delta / params.duration);
  }
  hinge.quaternion.copy(closed).slerp(opened, progress);
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
