const WORLD_HALF = 200;

let plane;
let objects = [];

function setupThree() {
  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 2;
  plane.rotation.x = -PI / 2;

  // boxes
  for (let i = 0; i < 100; i++) {
    let box = getBox();
    scene.add(box);

    box.position.x = random(-WORLD_HALF, WORLD_HALF);
    box.position.y = random(-WORLD_HALF / 2, WORLD_HALF);
    box.position.z = random(-WORLD_HALF, WORLD_HALF);

    box.rotation.x = random(TWO_PI);
    box.rotation.y = random(TWO_PI);
    box.rotation.z = random(TWO_PI);

    const size = random(1, 20);
    box.scale.x = size;
    box.scale.y = size;
    box.scale.z = size;

    box.material.transparent = true;
    box.material.opacity = random(0.4, 0.7);

    objects.push(box);
    scene.add(box);
  }
}

function updateThree() {
  //
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 10, WORLD_HALF * 10, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let posArray = geometry.attributes.position.array; // REORGANIZE
  for (let i = 0; i < posArray.length; i += 3) {
    let x = posArray[i + 0];
    let y = posArray[i + 1];
    let z = posArray[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.02;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    posArray[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
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

let container, pane, params;
let scene, camera, renderer;
let time = 0;
let frame = 0;
const fps = { value: 0, last: 0 };

function initTHREE() {
  console.log(THREE.REVISION);

  // scene
  scene = new THREE.Scene();

  // camera (fov, ratio, near, far)
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.5,
    5000
  );
  camera.position.z = 300;

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor("#333333");
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // container
  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  // controls
  const controlsOrbit = new THREE.OrbitControls(camera, renderer.domElement);
  const controlsDrag = new THREE.DragControls(objects, camera, renderer.domElement);
  // add event listener to highlight dragged objects
  controlsDrag.addEventListener('dragstart', function (event) {
    event.object.material.color.set(0xFF0000);
    controlsOrbit.enabled = false; // ***
  });

  controlsDrag.addEventListener('dragend', function (event) {
    event.object.material.color.set(0xFFFFFF);
    controlsOrbit.enabled = true; // ***
  });

  params = {
    fps: 0,
    frame: 0,
  };

  pane = new Pane();
  pane.addBinding(params, "fps", {
    label: "FPS",
    readonly: true,
  });
  pane.addBinding(params, "fps", {
    label: "FPS Graph",
    readonly: true,
    view: "graph",
    min: 0,
    max: 120,
  });
  pane.addBinding(params, "frame", {
    readonly: true,
    step: 1,
  });
  pane.addBlade({ view: "separator" });

  setupThree();

  // let's draw!
  renderer.setAnimationLoop(animate);
}

function animate() {
  time = performance.now();
  frame++;
  fps.value = 1000 / (time - fps.last);
  fps.last = time;
  params.fps = fps.value.toFixed(2);
  params.frame = frame;

  updateThree();

  pane.refresh();

  renderer.render(scene, camera);
}

// event listeners
window.addEventListener("resize", onWindowResize);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}