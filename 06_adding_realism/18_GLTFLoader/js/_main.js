// GLTF TESTER!
// https://gltf-viewer.donmccurdy.com/


let params = {
  // (add)
};

let model;

function setupThree() {
  loadGLTF("assets/sculpture.gltf");
}

function updateThree() {
  if (model !== undefined) {
    // model.rotation.x += 0.01;
    model.rotation.y += 0.01;

    model.scale.x = 3.0;
    model.scale.y = 3.0;
    model.scale.z = 3.0;
  }
}

function loadGLTF(filepath) {
  // load .glft file
  const loader = new GLTFLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function (gltfData) {
      // Add the loaded model to the scene
      model = gltfData.scene.children[0];
      console.log(model);

      model.material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: true
      });

      scene.add(model);
    },

    // onProgress callback
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function (err) {
      console.error('An error happened');
    }
  );
}