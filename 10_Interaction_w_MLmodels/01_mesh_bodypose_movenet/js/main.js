let params = {
  poseScale: 250,
};

const WORLD_SIZE = 1000;
const WORLD_HALF = WORLD_SIZE / 2;
const VIDEO_WIDTH = 640;

let cube;

function setupThree() {
  // floor
  const floor = getPlane();
  scene.add(floor);
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  // cube
  cube = getBox();
  scene.add(cube);
  cube.scale.set(30, 30, 30);

  // GUI
  gui.add(params, "poseScale", 0, 500);
}

function updateThree() {
  // update cube based on nose position and confidence
  if (pose.nose.score > 0.1) {
    cube.visible = true;
    cube.position.x = map(pose.nose.x, 0, VIDEO_WIDTH, -1.0, 1.0) * params.poseScale; // x
    cube.position.y = map(pose.nose.y, 0, VIDEO_WIDTH, 1.0, -1.0) * params.poseScale; // y: should be flipped! 
  } else {
    cube.visible = false;
  }
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}