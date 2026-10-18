// Assets for HDR (High Dynamic Range) images:
// https://polyhaven.com/hdris

const params = {
  fps: 0,
};

let hdrTexture;
let sphere;

function setupThree() {
  // Suggestion: HDR, 2k resolution!
  loadHDR("assets/test_2k.hdr");
  scene.background = hdrTexture;

  sphere = getSphere();
  scene.add(sphere);
  sphere.scale.set(300, 300, 300);
}

function updateThree() {
  //
}

function loadHDR(filepath) {
  // Import HDRLoader from the Three.js addons before using it.
  // See index.html for the import setup!
  hdrTexture = new HDRLoader().load(filepath, function () {
    hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
  });
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: hdrTexture,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}