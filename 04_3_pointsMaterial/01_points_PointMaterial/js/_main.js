let params = {
  // (add)
};

const WORLD_SIZE = 1000;
let pointCloud;

function setupThree() {
  pointCloud = getPoints();
  scene.add(pointCloud);
}

function updateThree() {
  pointCloud.rotation.x += 0.01;
  pointCloud.rotation.y += 0.01;
}

function getPoints() {
  const vertices = [];

  for (let i = 0; i < 50000; i++) {
    let x = random(-WORLD_SIZE / 2, WORLD_SIZE / 2);
    let y = random(-WORLD_SIZE / 2, WORLD_SIZE / 2);
    let z = random(-WORLD_SIZE / 2, WORLD_SIZE / 2);
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
  const points = new THREE.Points(geometry, material);
  return points;
}