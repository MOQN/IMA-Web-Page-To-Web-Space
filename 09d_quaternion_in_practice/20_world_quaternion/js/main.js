const params = { fps: 0, parentAngle: 30, childAngle: 30 };
let parent, child, follower;
const worldRotation = new THREE.Quaternion();

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

function setupThree() {
  controls = new OrbitControls(camera, renderer.domElement);
  const plane = getPlane();
  plane.position.y = -150;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  parent = new THREE.Group();
  parent.position.x = -230;
  scene.add(parent);
  parent.add(new THREE.AxesHelper(200).setColors(0xff0000, 0x00ff00, 0x0000ff));

  child = getBox();
  child.scale.set(160, 80, 50);
  parent.add(child);

  follower = getBox();
  follower.material.color.set(0x00ff00);
  follower.scale.set(160, 80, 50);
  follower.position.x = 230;
  scene.add(follower);

  setupGUI();

  showInstruction(
    "Turn the parent and child on the left. The green box copies their combined world rotation.",
    "child.getWorldQuaternion(worldRotation);\nfollower.quaternion.copy(worldRotation);"
  );
}

function updateThree() {
  parent.rotation.y = THREE.MathUtils.degToRad(params.parentAngle);
  child.rotation.x = THREE.MathUtils.degToRad(params.childAngle);
  child.getWorldQuaternion(worldRotation);
  follower.quaternion.copy(worldRotation);
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
