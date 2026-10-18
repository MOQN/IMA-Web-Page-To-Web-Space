const params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane;

function setupThree() {
  plane = getPlane();
  scene.add(plane);
}

function updateThree() {
  //plane.rotation.x += 0.005;
  //plane.rotation.z += 0.005;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  let material = new THREE.MeshNormalMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  let mesh = new THREE.Mesh(geometry, material);

  let positionAttributes = geometry.attributes.position;
  for (let i = 0; i < positionAttributes.array.length; i += 3) {
    let x = positionAttributes.array[i + 0];
    let y = positionAttributes.array[i + 1];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 9;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    positionAttributes.array[i + 2] = noiseValue; // update the z value.
  }
  positionAttributes.needsUpdate = true;
  return mesh;
}