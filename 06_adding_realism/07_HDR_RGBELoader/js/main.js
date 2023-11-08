// Assets for HDR (High Dynamic Range) images:
// https://polyhaven.com/hdris

const params = {
  // (add)
};

let hdrTexture;
let sphere;

function setupThree() {
  loadHDR("assets/test_2k.hdr");
  scene.background = hdrTexture;

  sphere = getSphere();
  sphere.scale.set(300, 300, 300);
  scene.add(sphere);
}

function updateThree() {
  //
}

function loadHDR(filepath) {
  hdrTexture = new RGBELoader().load(filepath, function () {
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