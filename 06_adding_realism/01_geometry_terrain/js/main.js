const params = {
  // (add)
};

const WORLD_HALF = 1000;
let plane;

function setupThree() {
  plane = getPlane();
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

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 9;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }

  scene.add(mesh); // *** reorganize ***
  return mesh;
}