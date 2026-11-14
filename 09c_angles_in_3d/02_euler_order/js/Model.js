// A small asymmetric aircraft: orange nose = local +Z, white mast = local +Y.
class Model {
  constructor(color = 0x0066ff) {
    this.mesh = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.35, 1.65), new THREE.MeshBasicMaterial({ color }));
    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.55), new THREE.MeshBasicMaterial({ color }));
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.6, 4), new THREE.MeshBasicMaterial({ color: 0xff8800 }));
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 1.1;
    const mast = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.65, 0.12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    mast.position.y = 0.4;
    this.mesh.add(body, wing, nose, mast, new THREE.AxesHelper(3).setColors(0xff0000, 0x00ff00, 0x0000ff));
  }
}
