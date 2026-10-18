// gltf test
// https://gltf-viewer.donmccurdy.com/

let params = {
  fps: 0,
};

let model;

function setupThree() {
  camera.position.set(0, 400, 1000);
  controls.target.set(0, 400, 0);
  controls.update();

  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 100, 0);
  scene.add(directionalLight);

  loadGLTF("assets/test-model.glb");
}

function updateThree() {
  if (model) {
    model.rotation.y += 0.01;
  }
}

function loadGLTF(filepath) {
  // Import GLTFLoader from the Three.js addons before using it.
  // See index.html for the import setup!
  const loader = new GLTFLoader();

  loader.load(
    filepath,
    function (gltfData) {
      // add the whole scene
      model = gltfData.scene;
      model.scale.setScalar(1000);

      // Keep the original materials and textures!
      scene.add(model);
    },
    function (xhr) {
      // show loading progress
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      } else {
        console.log(`${(xhr.loaded / 1024).toFixed(0)} KB downloaded (total unknown)`);
      }
    },
    function (err) {
      // report loading errors
      console.error("couldn't load the model file", err);
    }
  );
}
