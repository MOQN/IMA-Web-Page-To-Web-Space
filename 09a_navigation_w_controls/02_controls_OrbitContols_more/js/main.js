let params = { fps: 0 };

let controls;

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
let plane;

function setupThree() {
  // controls
  controls = new OrbitControls(camera, renderer.domElement);

  controls.minDistance = 50;
  controls.maxDistance = 1500;
  controls.minPolarAngle = 0.10;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.panSpeed = 0.5;
  controls.zoomSpeed = 0.15;

  controls.minAzimuthAngle = -3.14;
  controls.maxAzimuthAngle = 3.14;
  controls.maxTargetRadius = 5000;
  controls.listenToKeyEvents(window);
  setupControlsGUI();

  // plane
  plane = getPlane();
  scene.add(plane);
  plane.position.y = -WORLD_HALF / 4;
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
  }
}

function updateThree() {
  controls.update(delta); // only required if controls.enableDamping = true, or if controls.autoRotate = true
}

function setupControlsGUI() {
  const motion = pane.addFolder({ title: "Motion" });
  motion.addBinding(controls, "enabled");
  motion.addBinding(controls, "enableRotate");
  motion.addBinding(controls, "rotateSpeed", { min: 0.1, max: 3 });
  motion.addBinding(controls, "enablePan");
  motion.addBinding(controls, "panSpeed", { min: 0.1, max: 3 });
  motion.addBinding(controls, "screenSpacePanning");
  motion.addBinding(controls, "enableZoom");
  motion.addBinding(controls, "zoomSpeed", { min: 0.1, max: 3 });
  motion.addBinding(controls, "zoomToCursor");
  motion.addBinding(controls, "enableDamping");
  motion.addBinding(controls, "dampingFactor", { min: 0.01, max: 1 });
  motion.addBinding(controls, "autoRotate");
  motion.addBinding(controls, "autoRotateSpeed", { min: -10, max: 10 });

  const limits = pane.addFolder({ title: "Limits (angles in radians)", expanded: false });
  addLimits(limits, "minDistance", "maxDistance", { min: 1, max: 5000, step: 1 });
  addLimits(limits, "minPolarAngle", "maxPolarAngle", { min: 0, max: Math.PI });
  addLimits(limits, "minAzimuthAngle", "maxAzimuthAngle", { min: -3.14, max: 3.14 });
  addLimits(limits, "minTargetRadius", "maxTargetRadius", { min: 0, max: 5000, step: 1 });

  const focus = pane.addFolder({ title: "Focus", expanded: false });
  focus.addBinding(controls, "target", { expanded: true });
  focus.addBinding(controls, "cursor", { expanded: true });
  focus.addButton({ title: "Save View" }).on("click", () => controls.saveState());
  focus.addButton({ title: "Reset View" }).on("click", () => controls.reset());

  const keyboard = pane.addFolder({ title: "Keyboard", expanded: false });
  const keyMaps = {
    arrows: { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" },
    wasd: { LEFT: "KeyA", UP: "KeyW", RIGHT: "KeyD", BOTTOM: "KeyS" },
  };
  controls.keys = keyMaps.wasd;
  keyboard.addBinding({ layout: "wasd" }, "layout", {
    options: { WASD: "wasd", Arrows: "arrows" },
  }).on("change", ({ value }) => { controls.keys = keyMaps[value]; });
  keyboard.addBinding(controls, "keyPanSpeed", { min: 1, max: 50 });
  keyboard.addBinding(controls, "keyRotateSpeed", { min: 0.1, max: 5 });

  const mouse = pane.addFolder({ title: "Mouse", expanded: false });
  const mouseActions = { Rotate: THREE.MOUSE.ROTATE, Dolly: THREE.MOUSE.DOLLY, Pan: THREE.MOUSE.PAN };
  mouse.addBinding(controls, "cursorStyle", { options: { Auto: "auto", Grab: "grab" } });
  mouse.addBinding(controls.mouseButtons, "LEFT", { options: mouseActions });
  mouse.addBinding(controls.mouseButtons, "MIDDLE", { options: mouseActions });
  mouse.addBinding(controls.mouseButtons, "RIGHT", { options: mouseActions });

  const touch = pane.addFolder({ title: "Touch", expanded: false });
  touch.addBinding(controls.touches, "ONE", {
    options: { Rotate: THREE.TOUCH.ROTATE, Pan: THREE.TOUCH.PAN },
  });
  touch.addBinding(controls.touches, "TWO", {
    options: { "Dolly + Pan": THREE.TOUCH.DOLLY_PAN, "Dolly + Rotate": THREE.TOUCH.DOLLY_ROTATE },
  });
}

function addLimits(folder, minProperty, maxProperty, options) {
  folder.addBinding(controls, minProperty, options).on("change", ({ value }) => {
    controls[maxProperty] = Math.max(controls[maxProperty], value);
  });
  folder.addBinding(controls, maxProperty, options).on("change", ({ value }) => {
    controls[minProperty] = Math.min(controls[minProperty], value);
  });
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_HALF * 2, WORLD_HALF * 2, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  //console.log(geometry.attributes.position.array);
  let positionAttribute = geometry.attributes.position;
  for (let i = 0; i < positionAttribute.array.length; i += 3) {
    let x = positionAttribute.array[i + 0];
    let y = positionAttribute.array[i + 1];
    let z = positionAttribute.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.005;
    let yOffset = (y + WORLD_HALF) * 0.005;
    let amp = 6;
    let noiseValue = (noise(xOffset, yOffset) * amp) ** 3;

    positionAttribute.array[i + 2] = noiseValue; // update the z value.
  }

  return mesh;
}