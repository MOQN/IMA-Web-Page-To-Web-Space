class User {
  constructor(clientId) {
    this.clientId = clientId;
    this.mesh = this.getMesh();
    scene.add(this.mesh);
    // We use the mesh's position, rotation, scale, and color from the mesh. We take the reference to avoid unnecessary copying.
    this.pos = this.mesh.position;
    this.rot = this.mesh.rotation;
    this.scl = this.mesh.scale;
    this.color = this.mesh.material.color;
  }
  getMesh() {
    // draw a cone
    const geometry = new THREE.ConeGeometry(1, 2, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    // rotate the cone to make the sharp point to the front
    geometry.rotateX(-Math.PI / 2);
    return new THREE.Mesh(geometry, material);
  }
  setPosition(x, y, z) {
    this.pos.set(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
    return this;
  }
  setVelocity(x, y, z) {
    this.vel.set(x, y, z);
    return this;
  }
  setRotation(x, y, z) {
    this.rot.set(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scl.set(w, h, d);
    return this;
  }
  setColor(r, g, b) {
    if (r instanceof THREE.Color) {
      this.color = r;
    }
    else if (r > 255 && g === undefined && b === undefined) {
      // take the hex color
      this.color.setHex(r);
    }
    else if (r > 1 || g > 1 || b > 1) {
      this.color.setRGB(r / 255, g / 255, b / 255);
    }
    else {
      this.color.setRGB(r, g, b);
    }
    this.mesh.material.color = this.color;
    return this;
  }
  update(camera) {
    // get camera's position and rotation
    this.setPosition(camera.position.x, camera.position.y, camera.position.z);
    this.setRotation(camera.rotation.x, camera.rotation.y, camera.rotation.z);
  }
  toData() {
    return {
      clientId: this.clientId,
      position: {
        x: parseFloat(this.mesh.position.x.toFixed(2)),
        y: parseFloat(this.mesh.position.y.toFixed(2)),
        z: parseFloat(this.mesh.position.z.toFixed(2)),
      },
      rotation: {
        x: parseFloat(this.mesh.rotation.x.toFixed(2)),
        y: parseFloat(this.mesh.rotation.y.toFixed(2)),
        z: parseFloat(this.mesh.rotation.z.toFixed(2)),
      },
      scale: {
        x: parseFloat(this.mesh.scale.x.toFixed(2)),
        y: parseFloat(this.mesh.scale.y.toFixed(2)),
        z: parseFloat(this.mesh.scale.z.toFixed(2)),
      },
      color: this.mesh.material.color.getHex(),
    };
  }
}
