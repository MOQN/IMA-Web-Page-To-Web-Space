// Please note that this is similar to what we have explored in the early semester.
// But revised using THREE.Vector3 and JS Object to be more suitable for communication with the server and GUI.

class User {
  constructor(clientId) {
    this.clientId = clientId;
    this.mesh = this.getMesh();
    scene.add(this.mesh);
    // We use the mesh's position, rotation, scale, and color from the mesh. We take the reference to avoid unnecessary copying.
    this.pos = this.mesh.position;
    this.vel = new THREE.Vector3();
    this.acc = new THREE.Vector3();
    //
    this.rot = this.mesh.rotation;
    this.rotVel = new THREE.Vector3();
    this.rotAcc = new THREE.Vector3();
    //
    this.scl = this.mesh.scale;
    this.mass = 1; // arbitrary
    //
    this.color = this.mesh.material.color;
  }
  getMesh() {
    // feel free to replace this with your own
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
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
  setRotationVelocity(x, y, z) {
    this.rotVel.set(x, y, z);
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
  setMass(mass) {
    if (mass) {
      this.mass = mass;
    } else {
      this.mass = 1 + (this.scl.x * this.scl.y * this.scl.z) * 0.000001; // arbitrary
    }
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
  move() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0, 0);
  }
  rotate() {
    this.rotVel.add(this.rotAcc);
    // mesh's rotation is Euler, not Vector3. 
    // so we update x, y, and z separately.
    this.rot.x += this.rotVel.x;
    this.rot.y += this.rotVel.y;
    this.rot.z += this.rotVel.z;
    this.rotAcc.set(0, 0, 0);
  }
  applyForce(f) {
    let force = f.clone();
    if (this.mass > 0) {
      force.divideScalar(this.mass);
    }
    this.acc.add(force);
  }
  update() {
    // we don't need to update the mesh's position, rotation, scale, and color because they are already referenced.
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
