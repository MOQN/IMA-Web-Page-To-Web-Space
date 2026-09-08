let params = {
  // (add)
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
  // load .obj file
  const loader = new OBJLoader(); // NOT! THREE.ObjectLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function(obj) {
      // Add the loaded object to the scene
      bear = obj;
      for (let child of bear.children) {
        //child.material = new THREE.MeshBasicMaterial();
        child.material = new THREE.MeshBasicMaterial({
          color: 0x00FF00,
          wireframe: true
        });
      }
      scene.add(bear);
    },

    // onProgress callback
    function(xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    // onError callback
    function(err) {
      console.error('An error happened');
    }
  );
}