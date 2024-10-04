let params = {
  near: 1,
  far: 2600,
};

const WORLD_HALF_SIZE = 1000;
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
  plane = getPlane(WORLD_HALF_SIZE * 2, WORLD_HALF_SIZE * 2);
  plane.position.y = FLOOR_POSITION;
  plane.rotation.x = PI / 2;
  scene.add(plane);

  // targetBox
  targetBox = getBox();
  targetBox.scale.set(10, 10, 10);
  scene.add(targetBox);

  // lights
  const ambiLight = new THREE.AmbientLight(0x333333); // soft light
  scene.add(ambiLight);

  light = getRectAreaLight(100, 200, 10.0);
  light.position.set(100, -80, 0);
  light.lookAt(0, 0, 0);
  scene.add(light);

  // gui
  let folderFog = gui.addFolder("Fog");
  folderFog.add(params, "near", 1, 5000).step(1);
  folderFog.add(params, "far", 1, 5000).step(1);

  let folderAmbiLight = gui.addFolder("AmbientLight");
  folderAmbiLight.add(ambiLight.color, "r", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "g", 0.0, 1.0);
  folderAmbiLight.add(ambiLight.color, "b", 0.0, 1.0);

  let folderRectLight = gui.addFolder("RectAreaLight");
  folderRectLight.open();
  folderRectLight.add(light.position, "x", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderRectLight.add(light.position, "y", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderRectLight.add(light.position, "z", -WORLD_HALF_SIZE, WORLD_HALF_SIZE).step(0.1);
  folderRectLight.add(light, "intensity", 0.1, 50).step(0.1);
  folderRectLight.add(light, "width", 10, 2000).step(1);
  folderRectLight.add(light, "height", 10, 2000).step(1);
  folderRectLight.add(light.color, "r", 0, 1).step(0.01);
  folderRectLight.add(light.color, "g", 0, 1).step(0.01);
  folderRectLight.add(light.color, "b", 0, 1).step(0.01);

  params.lookAt = new THREE.Vector3(0, -100, 0);
  let folderLightDirection = gui.addFolder("RectAreaLight Direction");
  folderLightDirection.open();
  folderLightDirection.add(params.lookAt, "x", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
  folderLightDirection.add(params.lookAt, "y", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
  folderLightDirection.add(params.lookAt, "z", -WORLD_HALF_SIZE / 2, WORLD_HALF_SIZE / 2).step(0.1);
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
  scene.add(mesh); // *** reorganize ***

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