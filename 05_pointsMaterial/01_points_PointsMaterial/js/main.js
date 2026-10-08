let params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;

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
    let x = random(-WORLD_HALF, WORLD_HALF);
    let y = random(-WORLD_HALF, WORLD_HALF);
    let z = random(-WORLD_HALF, WORLD_HALF);
    vertices.push(x, y, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({ color: 0xFFFFFF });
  const points = new THREE.Points(geometry, material);
  return points;
}