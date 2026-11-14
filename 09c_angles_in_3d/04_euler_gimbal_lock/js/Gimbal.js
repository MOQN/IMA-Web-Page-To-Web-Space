// Nested groups make the intrinsic XYZ axes visible.
class Gimbal {
  constructor() {
    this.mesh = new THREE.Group();
    this.x = new THREE.Group();
    this.y = new THREE.Group();
    this.z = new THREE.Group();
    this.mesh.add(this.x);
    this.x.add(this.y);
    this.y.add(this.z);
    this.x.add(this.getRing(2.3, 0xff0000, "X"), new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 2.8, 0xff0000));
    this.y.add(this.getRing(2.05, 0x00ff00, "Y"), new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 2.6, 0x00ff00));
    this.z.add(this.getRing(1.8, 0x0000ff, "Z"), new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2.8, 0x0000ff));
    const model = new Model();
    this.z.add(model.mesh);
  }
  getRing(radius, color, axis) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.018, 6, 96), new THREE.MeshBasicMaterial({ color }));
    if (axis === "X") ring.rotation.y = Math.PI / 2;
    if (axis === "Y") ring.rotation.x = Math.PI / 2;
    return ring;
  }
  setAngles(x, y, z) {
    this.x.rotation.x = THREE.MathUtils.degToRad(x);
    this.y.rotation.y = THREE.MathUtils.degToRad(y);
    this.z.rotation.z = THREE.MathUtils.degToRad(z);
  }
}
