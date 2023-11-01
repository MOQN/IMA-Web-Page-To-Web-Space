let params = {
  // add
};

let cube;

function setupThree() {
  cube = getBox();
  cube.position.set(1, 0, 0); //(x, y, z);
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;
}

function updateThree() {
  cube.material.color.set(params.color);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}