let cube1, cube2;

function setupThree() {
  cube1 = getBox();
  cube1.position.x = -30;
  cube1.scale.set(100, 100, 100);

  cube2 = getBox();
  cube2.position.x = 30;
  cube2.scale.set(100, 100, 100);
}

function updateThree() {
  cube1.rotation.x += 0.02;
  cube1.rotation.y += 0.01;

  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.02;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0099ff,
    transparent: true,
    opacity: 0.5,
    //wireframe: true
  });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}