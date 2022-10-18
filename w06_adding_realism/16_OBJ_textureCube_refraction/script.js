let bear;
let light;
let sphere;
let textureCube;

function setupTHREE() {
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
  loadObject("assets/gummy.obj", cubeMaterial);

  // ENV - either way between #1 and #2
  // #1
  //scene.background = textureCube;
  // #2
  sphere = getSphere();
  sphere.material.envMap = textureCube;
  sphere.material.side = THREE.DoubleSide;
  sphere.scale.set(300.0, 300.0, 300.0);

  // light
  light = getLight();
}

function updateTHREE() {
  if (bear !== undefined) {
    bear.rotation.x += 0.01;
    bear.rotation.z += 0.01;

    bear.scale.x = 10.0;
    bear.scale.y = 10.0;
    bear.scale.z = 10.0;
  }

  light.position.x = cos(frame * 0.01) * 50;
  light.position.y = sin(frame * 0.005) * 50;
  light.position.z = sin(frame * 0.01) * 50;
}

function getSphere() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function getLight() {
  const light = new THREE.PointLight(0xFFFFFF, 1, 100);
  let sphere = getSphere();
  return light;
}

function loadObject(filepath, material) {
  // load .obj file
  const loader = new THREE.OBJLoader(); // NOT! THREE.ObjectLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback - Here the loaded data is assumed to be an object
    function(obj) {
      // Add the loaded object to the scene
      bear = obj;
      for (let child of bear.children) {
        child.material = material;
        //child.material = new THREE.MeshBasicMaterial({ color: 0x00FF00, wireframe: true });
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

///// p5.js /////

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();
  background(50);

  initTHREE();
}

function draw() {
  noLoop();
}

///// three.js /////

let container, stats, gui, params;
let scene, camera, renderer;
let time = 0;
let frame = 0;

function cameraUpdate() {
  camera.updateProjectionMatrix();
}


function initTHREE() {
  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
  );
  camera.position.z = 100;

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // gui
  // https://davidwalsh.name/dat-gui
  gui = new dat.gui.GUI();
  params = {
    value1: 0,
    value2: 0,
    value3: 0
  };
  gui
    .add(camera, "fov")
    .min(1)
    .max(179)
    .step(1)
    .onChange(cameraUpdate);
  // .listen()


  // stats
  stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  container.appendChild(stats.dom);

  setupTHREE();

  // let's draw!
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  stats.update();
  time = performance.now();
  frame++;

  updateTHREE();

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}