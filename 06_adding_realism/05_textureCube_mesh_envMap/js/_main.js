let sphere;
let textureCube;

function setupThree() {
  gui
    .add(camera, "fov")
    .min(1)
    .max(179)
    .step(1)
    .onChange(updateCamera);

  const loader = new THREE.CubeTextureLoader();
  loader.setPath('assets/DeepSpace/');
  textureCube = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
  ]);

  sphere = getSphere();
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
    color: 0xffffff,
    envMap: textureCube,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}