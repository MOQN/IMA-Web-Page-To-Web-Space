let cube1, cube2;
let group;

function setupThree() {
  cube1 = getBox();
  cube1.position.x = -30;
  cube1.scale.set(100, 100, 100);

  cube2 = getBox();
  cube2.position.x = 30;
  cube2.scale.set(100, 100, 100);

  group = new THREE.Group();
  scene.add(group);
  group.add(cube1);
  group.add(cube2);
}

function updateThree() {
  cube1.rotation.x += 0.02;
  cube1.rotation.y += 0.01;

  cube2.rotation.x += 0.01;
  cube2.rotation.y += 0.02;

  let radDist = 300;
  let angle = frame * 0.01;
  let x = cos(angle) * radDist;
  let y = sin(angle) * radDist;
  let z = 0;
  group.position.set(x, y, z);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial({});
  mesh = new THREE.Mesh(geometry, material);
  return mesh;
}