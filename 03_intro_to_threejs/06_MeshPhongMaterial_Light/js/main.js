// https://threejs.org/docs/index.html?q=light#api/en/lights/PointLight
// https://threejs.org/docs/index.html?q=phong#api/en/materials/MeshPhongMaterial

let ball;
let light, lightMesh;

function setupThree() {
  ball = getPhongSphere();
  ball.scale.set(200, 200, 200);

  light = getPointLight();
  lightMesh = getBasicSphere();
  lightMesh.scale.set(10, 10, 10);
}

function updateThree() {
  let angle = frame * 0.02;
  let radDist = 300;
  let x = cos(angle) * radDist;
  let y = sin(frame * 0.01) * 100;
  let z = sin(angle) * radDist;
  light.position.set(x, y, z);
  lightMesh.position.set(x, y, z);
}

function getPhongSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 100
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}

function getBasicSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return mesh;
}

function getPointLight() {
  const light = new THREE.PointLight(0xffffff, 2, 0, 0.1); // ( color , intensity, distance (0=infinite), decay )
  scene.add(light);

  return light;
}