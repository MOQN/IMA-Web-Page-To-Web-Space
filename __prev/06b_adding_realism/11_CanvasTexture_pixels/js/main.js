let params = {
  // (add)
};

let cube;
let texture;

function setupThree() {
  texture = new THREE.CanvasTexture(img.canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  cube = getBox();
  scene.add(cube);
}

function updateThree() {
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;

  cube.scale.x = 500.0;
  cube.scale.y = 500.0;
  cube.scale.z = 500.0;
}

function getBox() {
  let geometry = new THREE.BoxGeometry(1, 1, 1);
  let material = new THREE.MeshBasicMaterial({
    //wireframe: true
    map: texture
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}