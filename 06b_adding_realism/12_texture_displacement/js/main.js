let params = {
  // (add)
};

let sphere;
let texture;

function setupThree() {
  // texture = new THREE.TextureLoader().load('assets/cubeGrid.png');
  // texture = new THREE.TextureLoader().load('assets/asteroid.png');
  // texture = new THREE.TextureLoader().load('assets/earth.png');
  texture = new THREE.TextureLoader().load('assets/moon.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  sphere = getSphere();
  sphere.scale.set(300.0, 300.0, 300.0);

  const light = getLight();
  light.position.set(100, 400, 800);

  gui
    .add(light.position, "x")
    .min(-2000)
    .max(2000)
    .step(1);
  gui
    .add(light.position, "y")
    .min(-2000)
    .max(2000)
    .step(1);
  gui
    .add(light.position, "z")
    .min(-2000)
    .max(2000)
    .step(1);
}

function updateThree() {
  //sphere.rotation.x += 0.01;
  //sphere.rotation.z += 0.01;
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 1, 2000, 0.01);
  scene.add(light);
  return light;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 360, 360);
  // *** Use MeshStandardMaterial!
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: texture,
    displacementMap: texture,
    displacementScale: 0.05
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh); // *** reorganize ***
  return mesh;
}