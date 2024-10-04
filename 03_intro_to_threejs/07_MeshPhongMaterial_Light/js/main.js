// https://threejs.org/docs/index.html?q=light#api/en/lights/PointLight
// https://threejs.org/docs/index.html?q=phong#api/en/materials/MeshPhongMaterial

let ball;
let light, lightMesh;

function setupThree() {
  // It is not recommended to explore materials and lights this week!
  // This is just to show you how to add a light and a material to a sphere.

  // add ambient light
  ambiLight = new THREE.AmbientLight(0x111111);
  scene.add(ambiLight);

  // add point light
  light = getPointLight();
  scene.add(light);

  // add a small sphere for the light
  lightMesh = getBasicSphere();
  light.add(lightMesh); // add the lightMesh to the light object so that it moves with the light
  lightMesh.scale.set(10, 10, 10);

  // add a sphere
  ball = getPhongSphere();
  scene.add(ball);
  ball.scale.set(200, 200, 200);
}

function updateThree() {
  let angle = frame * 0.02;
  let radDist = 300;
  let x = cos(angle) * radDist;
  let y = sin(frame * 0.01) * 100;
  let z = sin(angle) * radDist;
  light.position.set(x, y, z);
}

function getPhongSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  // let's use MeshPhongMaterial instead of MeshBasicMaterial.
  // Please focus on exploring diverse geometries rather than materials and lights this week.
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 100
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBasicSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPointLight() {
  const light = new THREE.PointLight(0xffffff, 2, 0, 0.1); // ( color , intensity, distance (0=infinite), decay )
  return light;
}