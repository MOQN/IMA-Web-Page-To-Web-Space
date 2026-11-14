const params = { fps: 0, angle: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let hinge;
const axis = new THREE.Vector3(0, 1, 0);

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  hinge = new THREE.Group();
  hinge.position.set(-100, 0, 0);
  const door = getBox();
  door.scale.set(200, 260, 15);
  door.position.x = 100; // move the door center away from the hinge
  hinge.add(door, new THREE.AxesHelper(180).setColors(0xff0000, 0x00ff00, 0x0000ff));
  scene.add(hinge);

  setupGUI();
}

function updateThree() {
  const angle = THREE.MathUtils.degToRad(params.angle);
  hinge.quaternion.setFromAxisAngle(axis, angle);
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
