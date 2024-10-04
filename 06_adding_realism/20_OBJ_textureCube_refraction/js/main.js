let params = {
  color: "#FFF"
};

let bear;
let light;
let sphere;
let textureCube;

function setupThree() {
  gui
    .add(camera, "fov")
    .min(1)
    .max(179)
    .step(1)
    .onChange(updateCamera);
  // .listen()

  // SPHERE
  const loader = new THREE.CubeTextureLoader();
  loader.setPath('assets/DeepSpace/');
  textureCube = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
  ]);

  // OBJ + Refraction
  textureCube.mapping = THREE.CubeRefractionMapping;
  const cubeMaterial = new THREE.MeshPhongMaterial({
    color: 0xccddFF,
    envMap: textureCube,
    refractionRatio: 0.98,
    reflectivity: 0.95
  });
  loadOBJ("assets/gummy.obj", cubeMaterial);

  // ENV - either way between #1 and #2
  // #1
  scene.background = textureCube;
  // #2
  sphere = getSphere();
  sphere.material.envMap = textureCube;
  sphere.material.side = THREE.DoubleSide;
  sphere.scale.set(3000.0, 3000.0, 3000.0);

  // light
  light = getLight();
}

function updateThree() {
  if (bear !== undefined) {
    bear.rotation.x += 0.01;
    bear.rotation.z += 0.01;

    bear.scale.x = 100.0;
    bear.scale.y = 100.0;
    bear.scale.z = 100.0;
  }

  light.position.x = cos(frame * 0.01) * 500;
  light.position.y = sin(frame * 0.005) * 500;
  light.position.z = sin(frame * 0.01) * 500;
}

function updateCamera() {
  camera.updateProjectionMatrix();
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh); // *** reorganize ***
  return mesh;
}

function getLight() {
  const light = new THREE.PointLight(0xFFFFFF, 1, 2000, 0.005);
  scene.add(light);
  return light;
}

function loadOBJ(filepath, material) {
  // load .obj file
  const loader = new OBJLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback - Here the loaded data is assumed to be an object
    function (obj) {
      // Add the loaded object to the scene
      bear = obj;
      for (let child of bear.children) {
        child.material = material;
        //child.material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
      }
      scene.add(bear);
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
