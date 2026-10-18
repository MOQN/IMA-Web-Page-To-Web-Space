// gltf test
// https://gltf-viewer.donmccurdy.com/

let params = {
  fps: 0,
};

let model;
let textureCube;

function setupThree() {
  camera.position.set(0, 400, 1000);
  controls.target.set(0, 400, 0);
  controls.update();

  const loader = new THREE.CubeTextureLoader();
  loader.setPath("assets/DeepSpace/");
  textureCube = loader.load([
    "px.png", "nx.png",
    "py.png", "ny.png",
    "pz.png", "nz.png"
  ]);
  textureCube.mapping = THREE.CubeRefractionMapping;
  scene.background = textureCube;

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

      const mat = new THREE.MeshPhongMaterial({
        color: 0xccddff,
        envMap: textureCube,
        // Mix in the environment colors instead of making the surface darker!
        combine: THREE.MixOperation,
        // A lower ratio makes the refraction easier to see!
        refractionRatio: 0.8,
        reflectivity: 1,
        wireframe: false
      });
      pane.addBinding(mat, "wireframe");
      pane.addBinding(mat, "refractionRatio", { min: 0, max: 1, step: 0.005 });
      pane.addBinding(mat, "reflectivity", { min: 0, max: 1, step: 0.01 });

      // Share one material across all the nested meshes!
      model.traverse(function (child) {
        if (child.isMesh) {
          child.material = mat;
        }
      });

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
