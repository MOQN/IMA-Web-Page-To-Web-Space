// gltf test
// https://gltf-viewer.donmccurdy.com/

let params = {
  fps: 0,
};

let model;

function setupThree() {
  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(0, 100, 0);
  scene.add(directionalLight);

  loadGLTF("assets/test-model1.glb");
}

function updateThree(deltaTime) {
  if (model) {
    model.rotation.y += 0.6 * deltaTime;
  }
}

function loadGLTF(filepath) {
  // load the gltf file
  const loader = new GLTFLoader();

  loader.load(
    filepath,
    function (gltfData) {
      // add the whole scene
      model = gltfData.scene;
      model.scale.setScalar(1000);

      // keep the wireframe look
      // const material = new THREE.MeshNormalMaterial({
      //   wireframe: true,
      // });
      // model.traverse(function (object) {
      //   if (object.isMesh) {
      //     object.material = material;
      //   }
      // });

      scene.add(model);
    },
    function (xhr) {
      // show loading progress
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      }
    },
    function (err) {
      // report loading errors
      console.error("couldn't load the model file", err);
    }
  );
}