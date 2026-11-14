const params = { fps: 0, speed: 90, paused: false };

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let fan;
let angle = 0;
const axis = new THREE.Vector3(0, 0, 1);

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  fan = new THREE.Group();
  const blade1 = getBox();
  blade1.scale.set(300, 30, 12);
  const blade2 = getBox();
  blade2.scale.set(30, 300, 12);
  fan.add(blade1, blade2);
  scene.add(fan);
}

function updateThree() {
  if (params.paused) return;
  angle += THREE.MathUtils.degToRad(params.speed) * delta;
  fan.quaternion.setFromAxisAngle(axis, angle);
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
