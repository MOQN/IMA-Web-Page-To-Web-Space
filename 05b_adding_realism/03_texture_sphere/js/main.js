let params = {
  // (add)
};

let sphere;
let texture;

function setupThree() {
  gui
    .add(camera, "fov")
    .min(1)
    .max(179)
    .step(1)
    .onChange(updateCamera);

  // texture = new THREE.TextureLoader().load('assets/earth.jpg');
  // texture = new THREE.TextureLoader().load('assets/moon.jpg');
  // texture = new THREE.TextureLoader().load('assets/city.jpg');
  texture = new THREE.TextureLoader().load('assets/theta.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  sphere = getSphere();
  scene.add(sphere);
  sphere.scale.set(300.0, 300.0, 300.0);
}

function updateThree() {
  //sphere.rotation.x += 0.01;
  //sphere.rotation.z += 0.01;
}

function updateCamera() {
  camera.updateProjectionMatrix();
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    //wireframe: true,
    map: texture,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}