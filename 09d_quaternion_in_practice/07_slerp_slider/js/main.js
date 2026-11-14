const params = { fps: 0, t: 0 };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let box;
const start = new THREE.Quaternion();
const end = new THREE.Quaternion();

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
  const axis = new THREE.Vector3(0, 1, 0);
  end.setFromAxisAngle(axis, Math.PI / 2);
}

function updateThree() {
  // Start from the same pose every frame, then interpolate to the end.
  box.quaternion.copy(start).slerp(end, params.t);
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
