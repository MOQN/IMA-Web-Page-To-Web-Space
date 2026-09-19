let params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

let cube;

function setupThree() {
  cube = getBox();
  cube.position.x = 0;
  cube.position.y = 0;
  cube.position.z = 0;
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;
  scene.add(cube);
}

function updateThree() {
  cube.rotation.x += 0.02;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}