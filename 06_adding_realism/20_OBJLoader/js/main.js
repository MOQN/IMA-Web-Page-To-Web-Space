let params = {
  fps: 0,
};

let bear;

function setupThree() {
  loadOBJ("assets/gummy.obj");
}

function updateThree() {
  if (bear !== undefined) {
    bear.rotation.x += 0.01;
    bear.rotation.z += 0.01;

    bear.scale.x = 100.0;
    bear.scale.y = 100.0;
    bear.scale.z = 100.0;
  }
}

function loadOBJ(filepath) {
  // Import OBJLoader from the Three.js addons before using it.
  // See index.html for the import setup!
  const loader = new OBJLoader(); // NOT! THREE.ObjectLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      bear = obj;
      const material = new THREE.MeshBasicMaterial({
        color: 0x00FF00,
        wireframe: true
      });
      bear.traverse(function (child) {
        if (child.isMesh) {
          child.material = material;
        }
      });
      scene.add(bear);
    },

    // onProgress callback
    function (xhr) {
      if (xhr.total > 0) {
        console.log(`${(xhr.loaded / xhr.total * 100).toFixed(0)}% loaded`);
      } else {
        console.log(`${(xhr.loaded / 1024).toFixed(0)} KB downloaded (total unknown)`);
      }
    },

    // onError callback
    function (err) {
      console.error('An error happened');
    }
  );
}