let params = {
  fps: 0,
  near: 1,
  far: 2600,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_POSITION = -200;
const COLOR_BG = 0x000000;

let plane;
let light;
let targetBox;

function setupThree() {
  // enable shadow
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  // the floor
  plane = getPlane(WORLD_HALF * 2, WORLD_HALF * 2);
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // targetBox
  targetBox = getBox();
  scene.add(targetBox);
  targetBox.scale.set(10, 10, 10);

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft light
  scene.add(ambiLight);

  light = getRectAreaLight(100, 200, 10.0);
  light.position.set(100, -80, 0);
  light.lookAt(0, 0, 0);
  scene.add(light);

  let folderFog = pane.addFolder({ title: "Fog", expanded: true });
  folderFog.addBinding(params, "near", { min: 1, max: 5000, step: 1 });
  folderFog.addBinding(params, "far", { min: 1, max: 5000, step: 1 });

  let folderAmbiLight = pane.addFolder({ title: "AmbientLight", expanded: true });
  folderAmbiLight.addBinding(ambiLight.color, "r", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "g", { min: 0.0, max: 1.0 });
  folderAmbiLight.addBinding(ambiLight.color, "b", { min: 0.0, max: 1.0 });

  let folderRectLight = pane.addFolder({ title: "RectAreaLight", expanded: true });
  folderRectLight.addBinding(light.position, "x", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderRectLight.addBinding(light.position, "y", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderRectLight.addBinding(light.position, "z", { min: -WORLD_HALF, max: WORLD_HALF, step: 0.1 });
  folderRectLight.addBinding(light, "intensity", { min: 0.1, max: 50, step: 0.1 });
  folderRectLight.addBinding(light, "width", { min: 10, max: 2000, step: 1 });
  folderRectLight.addBinding(light, "height", { min: 10, max: 2000, step: 1 });
  folderRectLight.addBinding(light.color, "r", { min: 0, max: 1, step: 0.01 });
  folderRectLight.addBinding(light.color, "g", { min: 0, max: 1, step: 0.01 });
  folderRectLight.addBinding(light.color, "b", { min: 0, max: 1, step: 0.01 });

  params.lookAt = new THREE.Vector3(0, -100, 0);
  let folderLightDirection = pane.addFolder({ title: "RectAreaLight Direction", expanded: true });
  folderLightDirection.addBinding(params.lookAt, "x", { min: -WORLD_HALF / 2, max: WORLD_HALF / 2, step: 0.1 });
  folderLightDirection.addBinding(params.lookAt, "y", { min: -WORLD_HALF / 2, max: WORLD_HALF / 2, step: 0.1 });
  folderLightDirection.addBinding(params.lookAt, "z", { min: -WORLD_HALF / 2, max: WORLD_HALF / 2, step: 0.1 });
}


function updateThree() {
  // update fog
  scene.fog = new THREE.Fog(COLOR_BG, params.near, params.far);

  // update the light
  // (consider using a callback function onChange() rather than the code below.)
  targetBox.position.set(params.lookAt.x, params.lookAt.y, params.lookAt.z);
  light.lookAt(targetBox.position);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane(w, h) {
  const geometry = new THREE.PlaneGeometry(w, h, 32);
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true; //default is false
  return mesh;
}

function getRectAreaLight(w, h, intensity) {
  // There is no shadow support.
  // Only MeshStandardMaterial and MeshPhysicalMaterial are supported.
  const light = new THREE.RectAreaLight(0xffffff, intensity, w, h);
  // "RectAreaLightHelper" should be imported. View index.html
  const rectAreaLightHelper = new RectAreaLightHelper(light);
  light.add(rectAreaLightHelper);
  return light;
}