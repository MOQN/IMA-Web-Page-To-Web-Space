let params = {
  fps: 0,
  wireframe: true,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
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

  pane.addBinding(params, "wireframe", { label: "Wireframe" }).on("change", function () {
    plane.material.wireframe = params.wireframe;
  });
}

function updateThree() {

  let positionAttributes = plane.geometry.attributes.position;
  for (let i = 0; i < positionAttributes.array.length; i += 3) {
    let x = positionAttributes.array[i + 0];
    let y = positionAttributes.array[i + 1];

    let xOffset = (x + WORLD_HALF) * 0.005 + frame * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.005 + frame * 0.02;
    let amp = 15;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 2;

    positionAttributes.array[i + 2] = noiseValue; // update the z value.
  }
  positionAttributes.needsUpdate = true;
}

function getPlane() {
  let geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  geometry.attributes.position.setUsage(THREE.DynamicDrawUsage);
  let material = new THREE.MeshBasicMaterial({
    wireframe: params.wireframe,
    side: THREE.DoubleSide,
    map: texture
  });
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
