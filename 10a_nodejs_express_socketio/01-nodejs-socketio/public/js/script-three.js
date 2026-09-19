console.log("three.js Version: " + THREE.REVISION);

let container, pane, gui;
let scene, camera, renderer;
let controls;
let time, frame = 0;
const fps = { value: 0, last: 0 };


function createGuiCompat(paneInstance) {
  const makeControl = (target, key, opts = {}) => {
    const control = paneInstance.addBinding(target, key, opts);
    return {
      min(v) { if (v !== undefined) opts.min = v; return this; },
      max(v) { if (v !== undefined) opts.max = v; return this; },
      step(v) { if (v !== undefined) opts.step = v; return this; },
      listen() { return this; },
      onChange(fn) { if (typeof fn === "function") control.on("change", (ev) => fn(ev.value)); return this; },
      onFinishChange(fn) { if (typeof fn === "function") control.on("change", (ev) => fn(ev.value)); return this; },
    };
  };

  const api = {
    add(target, key, min, max, step) {
      const opts = {};
      if (typeof min === "number") opts.min = min;
      if (typeof max === "number") opts.max = max;
      if (typeof step === "number") opts.step = step;
      return makeControl(target, key, opts);
    },
    addColor(target, key) {
      const control = paneInstance.addBinding(target, key, { view: "color" });
      return {
        onChange(fn) { if (typeof fn === "function") control.on("change", (ev) => fn(ev.value)); return this; },
        onFinishChange(fn) { if (typeof fn === "function") control.on("change", (ev) => fn(ev.value)); return this; },
      };
    },
    addFolder(titleOrOptions) {
      const title = typeof titleOrOptions === "string"
        ? titleOrOptions
        : (titleOrOptions && titleOrOptions.title) || "Folder";
      const folderPane = paneInstance.addFolder({ title, expanded: true });
      return createGuiCompat(folderPane);
    },
    open() {
      if ("expanded" in paneInstance) {
        paneInstance.expanded = true;
      }
      return api;
    },
    close() {
      if ("expanded" in paneInstance) {
        paneInstance.expanded = false;
      }
      return api;
    },
  };

  return api;
}


function initThree() {
  scene = new THREE.Scene();

  const fov = 75;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
  camera.position.z = 1000;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container = document.getElementById("container-three");
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  if (typeof params === "undefined") { window.params = {}; }
  if (typeof params.fps === "undefined") { params.fps = 0; }



  pane = new Pane();
  gui = createGuiCompat(pane);
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
  pane.addBlade({ view: "separator" });


  setupThree(); // *** 
  renderer.setAnimationLoop(animate);
}

function animate() {
time = performance.now();
  frame++;
  fps.value = 1000 / (time - (fps.last || time));
  fps.last = time;
  params.fps = fps.value.toFixed(2);


  updateThree(); // ***

  pane.refresh();

  renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});