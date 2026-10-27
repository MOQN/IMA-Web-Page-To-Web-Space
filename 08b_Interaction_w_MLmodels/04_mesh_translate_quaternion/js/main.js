// A Bar points its local +X axis from start to end using a quaternion.
let params = { fps: 0 };

let target;
let bar;
const barOrigin = new THREE.Vector3();

function setupThree() {
  target = new TargetBox();
  scene.add(target.mesh);
  target.position.set(500, 0, 0);

  bar = new Bar(30);
  scene.add(bar.mesh);

  pane.addBinding(target.position, "x", { min: -500, max: 500 });
  pane.addBinding(target.position, "y", { min: -500, max: 500 });
  pane.addBinding(target.position, "z", { min: -500, max: 500 });
}

function updateThree() {
  target.update();
  bar.update(barOrigin, target.position);
}

class TargetBox {
  constructor(size = 50) {
    this.mesh = getBox();
    this.mesh.scale.setScalar(size);
    // Keep one position object for both the GUI and the scene.
    this.position = this.mesh.position;
  }
  update() {
    this.mesh.rotation.x += 0.01;
    this.mesh.rotation.y += 0.01;
  }
  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// The same endpoint-based Bar is used in example 05.
class Bar {
  constructor(thickness = 30) {
    this.mesh = getBox();
    // Move the pivot to the left end: position = start, scale.x = length.
    this.mesh.geometry.translate(0.5, 0, 0);
    this.mesh.scale.set(1, thickness, thickness);
    this.mesh.visible = false;
    this.axis = new THREE.Vector3(1, 0, 0);
    this.direction = new THREE.Vector3();
  }
  update(start, end) {
    this.direction.subVectors(end, start);
    const length = this.direction.length();
    // Coincident endpoints have no direction; do not normalize a zero vector.
    this.mesh.visible = Number.isFinite(length) && length > 0.000001;
    if (!this.mesh.visible) return;
    this.mesh.position.copy(start);
    this.mesh.scale.x = length;
    this.mesh.quaternion.setFromUnitVectors(this.axis, this.direction.divideScalar(length));
  }
  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

function getBox() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial()
  );
}
