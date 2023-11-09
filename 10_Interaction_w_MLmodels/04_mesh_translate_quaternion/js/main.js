// https://threejs.org/docs/#api/en/math/Quaternion

let params = {
  // (add)
};

let cube;
let bar;

function setupThree() {
  // cube
  cube = getBox();
  scene.add(cube);
  cube.position.set(500, 0, 0);
  cube.scale.x = 50;
  cube.scale.y = 50;
  cube.scale.z = 50;

  // bar
  bar = getBox();
  scene.add(bar);
  bar.position.set(0, 0, 0);
  bar.scale.x = 300;
  bar.scale.y = 30;
  bar.scale.z = 30;
  bar.geometry.translate(0.5, 0, 0);

  // setup gui
  gui.add(cube.position, "x").min(-500).max(500);
  gui.add(cube.position, "y").min(-500).max(500);
  gui.add(cube.position, "z").min(-500).max(500);
}

function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // rotate the bar to the cube's position (get the direction from the bar to the cube)
  let direction = new THREE.Vector3().subVectors(cube.position, bar.position);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.normalize());
  bar.rotation.setFromQuaternion(quaternion);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}