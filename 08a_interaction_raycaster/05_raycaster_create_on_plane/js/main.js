let params = {
  fps: 0,
};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const mouseDown = new THREE.Vector2();

let plane;
let cubes = [];
let isPressed = false;

function setupThree() {
  camera.position.set(700, 700, 1000);
  controls.target.set(0, 0, 0);
  controls.update();

  plane = getPlane();
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}

function updateThree() {
  for (let c of cubes) {
    c.update();
  }
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(2000, 2000, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x555555,
    wireframe: true,
    side: THREE.DoubleSide
  });
  return new THREE.Mesh(geometry, material);
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  geometry.translate(0, 0.5, 0); // put the origin at the bottom
  const material = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(geometry, material);
}

class Cube {
  constructor() {
    this.pos = new THREE.Vector3();
    this.scl = new THREE.Vector3(1, 1, 1);
    this.mesh = getBox();
    scene.add(this.mesh);
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    this.scl.set(w, h, d);
    return this;
  }
  update() {
    this.mesh.position.copy(this.pos);
    this.mesh.scale.copy(this.scl);
  }
}

// event listeners
window.addEventListener("pointerdown", onPointerDown);
window.addEventListener("pointerup", onPointerUp);
window.addEventListener("pointercancel", () => { isPressed = false; });
window.addEventListener("blur", () => { isPressed = false; });

function onPointerDown(event) {
  if (event.target !== renderer.domElement || event.button !== 0 || !event.isPrimary) return;
  mouseDown.set(event.clientX, event.clientY);
  isPressed = true;
}

function onPointerUp(event) {
  if (!isPressed || !event.isPrimary) return;
  isPressed = false;
  if (event.target !== renderer.domElement || event.button !== 0) return;
  // Ignore a drag used to orbit the camera.
  if (mouseDown.distanceTo(new THREE.Vector2(event.clientX, event.clientY)) > 5) return;

  const canvasBounds = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
  mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

  scene.updateMatrixWorld(true);
  camera.updateWorldMatrix(true, false);
  raycaster.setFromCamera(mouse, camera);
  const intersections = raycaster.intersectObject(plane);
  if (intersections.length === 0) return;

  const position = intersections[0].point; // world position on the plane
  const c = new Cube()
    .setPosition(position.x, position.y, position.z)
    .setScale(50);
  c.update();
  cubes.push(c);
}
