class ThirdPersonCamera {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3();
    this.lookAtVector = new THREE.Vector3();
    this.idealOffset = new THREE.Vector3(100, 150, 350);
    this.idealLookAt = new THREE.Vector3(0, 0, -300);
    this.lerpAmount = 0.05;
  }
  calculateOffset(target) {
    const offset = new THREE.Vector3().copy(this.idealOffset);
    offset.applyQuaternion(target.direction);
    offset.add(target.position);
    return offset;
  }
  calculateLookAt(target) {
    const lookAt = new THREE.Vector3().copy(this.idealLookAt);
    lookAt.applyQuaternion(target.direction);
    lookAt.add(target.position);
    return lookAt;
  }
  update(target) {
    const offset = this.calculateOffset(target);
    const lookAt = this.calculateLookAt(target);

    this.position.lerp(offset, this.lerpAmount);
    this.lookAtVector.lerp(lookAt, this.lerpAmount);

    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAtVector);
  }
}