// https://threejs.org/docs/index.html?q=light#api/en/lights/PointLight
// https://threejs.org/docs/index.html?q=phong#api/en/materials/MeshPhongMaterial

let light, lightMesh;
let sculpture;

function setupThree() {
  // It is not recommended to explore materials and lights this week!

  // change the background color
  renderer.setClearColor("#CCCCCC");

  // add ambient light
  ambiLight = new THREE.AmbientLight("#999999");
  scene.add(ambiLight);

  // add point light
  light = getPointLight("#FFFFFF");
  scene.add(light);

  // add a small sphere for the light
  lightMesh = getBasicSphere();
  lightMesh.scale.set(10, 10, 10);
  light.add(lightMesh);

  // add meshes
  const cube1 = getPhongBox();
  cube1.position.set(0, -100, 0);
  cube1.scale.set(200, 100, 200);

  const cube2 = getPhongBox();
  cube2.position.set(0, 100, 0);
  cube2.scale.set(50, 300, 50);

  const ball = getPhongSphere();
  ball.scale.set(100, 100, 100);
  // change color
  ball.material.color.set("#FF00FF");
  // change transparency
  ball.material.transparent = true;
  ball.material.opacity = 0.75;

  sculpture = new THREE.Group();
  scene.add(sculpture);
  sculpture.add(cube1);
  sculpture.add(cube2);
  sculpture.add(ball);
}

function updateThree() {
  let angle = frame * 0.01;
  let radDist = 500;
  let x = cos(angle) * radDist;
  let y = 300;
  let z = sin(angle) * radDist;
  light.position.set(x, y, z);
}

function getPhongBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: "#999999",
    shininess: 100
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPhongSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: "#999999",
    shininess: 100
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBasicSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: "#ffffff"
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPointLight(color) {
  const light = new THREE.PointLight(color, 2, 0, 0.1); // ( color , intensity, distance (0=infinite), decay )
  return light;
}