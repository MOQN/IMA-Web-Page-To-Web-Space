let bears = [];

function setupTHREE() {
  loadObject("assets/gummy.obj");

  const light = getLight();
  light.position.set(10, 40, 80);

  let folder = gui.addFolder("LIGHT");
  folder
    .add(light.position, "x")
    .min(-100)
    .max(100)
    .step(0.5);
  folder
    .add(light.position, "y")
    .min(-100)
    .max(100)
    .step(0.5);
  folder
    .add(light.position, "z")
    .min(-100)
    .max(100)
    .step(0.5);
}

function updateTHREE() {
  // we usually call this in initTHREE().
  if (params.exp2) {
    scene.fog = new THREE.FogExp2(params.color, params.density);
  } else {
    scene.fog = new THREE.Fog(params.color, params.near, params.far);
  }

  // update the objects
  for (let b of bears) {
    b.move();
    b.rotate();
    b.update();
  }
}

function loadObject(filepath) {
  // load .obj file
  const loader = new THREE.OBJLoader(); // NOT! THREE.ObjectLoader();

  loader.load(
    // resource URL
    filepath,
    // onLoad callback

    // Here the loaded data is assumed to be an object
    function(obj) {
      // Add the loaded object to the scene
      //scene.add(obj); 
      //return obj;
      constructObjects(obj);
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

function constructObjects(obj) {
  for (let i = 0; i < 100; i++) {
    let tBear = new Bear(obj)
      .setPosition(random(-50, 50), random(-50, 50), random(-50, 50))
      .setVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setRotationVelocity(random(-0.01, 0.01), random(-0.01, 0.01), random(-0.01, 0.01))
      .setScale(random(1, 3));
    bears.push(tBear);
  }
}

function getLight() {
  const light = new THREE.PointLight(0xffffff, 1, 300);
  scene.add(light);
  return light;
}


class Bear {
  constructor(object) {
    this.pos = createVector();
    this.vel = createVector();
    this.acc = createVector();
    this.scl = createVector(1, 1, 1);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    this.rot = createVector();
    this.rotVel = createVector();
    this.rotAcc = createVector();
    this.group = object.clone();
    for (let child of this.group.children) {
      //child.material = new THREE.MeshBasicMaterial();
      child.material = new THREE.MeshPhongMaterial();
      child.material.color.r = random(1);
      child.material.color.g = random(1);
      child.material.color.b = random(1);
    }

    scene.add(this.group);
  }
  setPosition(x, y, z) {
    this.pos = createVector(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel = createVector(x, y, z);
    return this;
  }
  setRotationAngle(x, y, z) {
    this.rot = createVector(x, y, z);
    return this;
  }
  setRotationVelocity(x, y, z) {
    this.rotVel = createVector(x, y, z);
    return this;
  }
   setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl = createVector(w, h, d);
    this.mass = this.scl.x * this.scl.y * this.scl.z;
    return this;
  }
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    this.rot.add(this.rotVel);
    this.rotAcc.mult(0);
  }
  applyForce(f) {
    let force = f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }
  update() {
    this.group.position.set(this.pos.x, this.pos.y, this.pos.z);
    this.group.rotation.set(this.rot.x, this.rot.y, this.rot.z);
    this.group.scale.set(this.scl.x, this.scl.y, this.scl.z);
  }
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
    near: 1,
    far: 150,
    density: 0.001,
    exp2: false,
    color: 0x333333
  };
  let guiFolder = gui.addFolder("FOG");
  guiFolder.add(params, "near", 1, 500).step(1);
  guiFolder.add(params, "far", 1, 500).step(1);
  guiFolder.add(params, "exp2");
  guiFolder.add(params, "density", 0.00, 0.10).step(0.001);
  guiFolder.addColor(params, "color");

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