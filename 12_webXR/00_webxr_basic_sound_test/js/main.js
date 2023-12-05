let params = {
  // (add)
};

let room;
let cube;

function setupThree() {
  // WebXR
  setupWebXR();

  // room
  room = getRoom();
  scene.add(room);

  // lights
  const hemiLight = new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3);
  scene.add(hemiLight);

  const direcLight = new THREE.DirectionalLight(0xffffff, 3);
  direcLight.position.set(1, 1, 1).normalize();
  scene.add(direcLight);

  // cube
  cube = getBox();
  cube.position.set(0, 4, 0);
  cube.scale.x = 1.5;
  cube.scale.y = 1.5;
  cube.scale.z = 1.5;
  scene.add(cube);
}

function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;

  if (volume) {
    let size = map(volume, 0, 1, 0.3, 2);
    cube.scale.set(size, size, size);
  }

}

///// UTILS /////

function getRoom() {
  const geometry = new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0);
  const materials = new THREE.LineBasicMaterial({
    color: 0xbcbcbc,
    transparent: true,
    opacity: 0.5,
  });
  const mesh = new THREE.LineSegments(geometry, materials);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

