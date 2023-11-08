let params = {
  color: "#FFF"
};

let cube;

function setupThree() {
  cube = getBox();
  scene.add(cube);

  cube.position.set(1, 0, 0); //(x, y, z);
  cube.scale.x = 100;
  cube.scale.y = 100;
  cube.scale.z = 100;

  // setup gui
  gui.add(cube.scale, "x").min(1).max(200).step(0.1);
  gui.add(cube.scale, "y").min(1).max(200).step(0.1);
  gui.add(cube.scale, "z").min(1).max(200).step(0.1);
  gui.addColor(params, "color");
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
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}