let params = {
  color: "#FFF"
};

let cube;

function setupThree() {
  cube = getBox();
  cube.scale.set(50, 200, 50);
  cube.geometry.translate(0, 0.5, 0);
  scene.add(cube);
}

function updateThree() {
  //
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}