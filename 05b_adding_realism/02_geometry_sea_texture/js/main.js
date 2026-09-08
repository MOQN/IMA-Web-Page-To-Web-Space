let params = {
  // (add)
};

const WORLD_HALF = 1000;
let plane;
let texture;

function setupThree() {
  texture = new THREE.TextureLoader().load('assets/sea_dark.jpg');
  //texture.colorSpace = THREE.LinearSRGBColorSpace; // default
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.offset.set(0, 0);
  texture.repeat.set(2, 2);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  //texture.mapping = THREE.UVMapping

  plane = getPlane();
  scene.add(plane);
}

function updateThree() {

  let posArray = plane.geometry.attributes.position.array;
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005 + frame * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.005 + frame * 0.02;
    let amp = 15;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 2;

    posArray[i + 2] = noiseValue; // update the z value.
  }
  plane.geometry.attributes.position.needsUpdate = true;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  let material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide,
    map: texture
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
