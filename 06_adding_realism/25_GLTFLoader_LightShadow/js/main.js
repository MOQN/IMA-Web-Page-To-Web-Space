// gltf test
// https://gltf-viewer.donmccurdy.com/

let params = {
  fps: 0,
};

let model;
let ground;

function setupThree() {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  camera.position.set(0, 700, 1500);
  controls.target.set(0, 400, 0);
  controls.update();

  // lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const directionalLight = getDirectionalLight();
  scene.add(directionalLight);

  ground = getPlane();
  scene.add(ground);

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

      // Let every nested mesh cast shadows without replacing its material!
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Put the floor just below the model's feet!
      const bounds = new THREE.Box3().setFromObject(model);
      ground.position.y = bounds.min.y - 1;

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

function getDirectionalLight() {
  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(800, 1500, 1000);
  light.target.position.set(0, 400, 0);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  // Keep the shadow camera around the model, not the entire huge floor!
  light.shadow.camera.left = -1200;
  light.shadow.camera.right = 1200;
  light.shadow.camera.top = 1200;
  light.shadow.camera.bottom = -1200;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 4000;
  light.shadow.normalBias = 1;
  return light;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(10000, 10000);
  const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 1
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  return mesh;
}
