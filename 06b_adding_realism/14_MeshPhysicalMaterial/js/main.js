// Relevant References:
// https://tympanus.net/codrops/2021/10/27/creating-the-effect-of-transparent-glass-and-plastic-in-three-js/
// https://threejs.org/examples/webgl_materials_physical_transmission.html
// https://redstapler.co/three-js-realistic-material-reflection-tutorial/
// https://sbcode.net/threejs/glass-transmission/

// Assets:
// https://polyhaven.com/hdris

const params = {
  // (add)
};

let obj;
let light;
let bgPlane;

function setupThree() {
  obj = getIcosahedron();
  obj.scale.set(300, 300, 300);
  scene.add(obj);

  const ambiLight = new THREE.AmbientLight(0x111111);
  scene.add(ambiLight);

  light = getLight();
  light.position.set(0, 300, 600);
  scene.add(light);

  bgPlane = getPlane();
  scene.add(bgPlane);
  bgPlane.position.set(0, 0, -300);
  bgPlane.scale.set(300, 300);

  gui.add(obj.material, "metalness", 0, 1);
  gui.add(obj.material, "roughness", 0, 1);
  gui.add(obj.material, "transmission", 0, 1);
  gui.add(obj.material, "thickness", 0, 1);
}

function updateThree() {
  obj.rotation.x += 0.01;
  obj.rotation.z += 0.01;
}

function getIcosahedron() {
  const geometry = new THREE.IcosahedronGeometry(1, 0);
  const material = new THREE.MeshPhysicalMaterial({
    metalness: 0, // won't work with transmission
    roughness: 0.0,
    transmission: 1, // Add transparency (a little more than that)
    thickness: 0.5, // Add refraction!
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getPlane() {
  const texture = new THREE.TextureLoader().load("assets/pattern.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  const geometry = new THREE.PlaneGeometry(5, 5);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getLight() {
  const light = new THREE.DirectionalLight(0xfff0dd, 1);
  return light;
}