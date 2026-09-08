// Please note that this is similar to what we have explored in the early semester.
// But revised using THREE.Vector3 and JS Object to be more suitable for communication with the server and GUI.

class User {
  constructor(clientId) {
    this.clientId = clientId;

    this.mesh = this.getMesh();
    scene.add(this.mesh);

    // We use the mesh's position, rotation, scale, and color from the mesh. We take the reference to avoid unnecessary copying.
    this.position = this.mesh.position;
    this.rotation = this.mesh.rotation;
    this.scale = this.mesh.scale;
    this.color = this.mesh.material.color;
    //
    this.direction = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0);
    //
    this.moveVel = 0.0;
    this.rotateVel = 0.02;
    this.jumpVel = 0.0;
    //
    this.runAcc = 6.0;
    this.walkAcc = 2.5;
    this.jumpAcc = 10;
    this.isJumped = false;
    //
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      rotateLeft: false,
      rotateRight: false,
      space: false,
      shift: false,
    }
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
  }
  getMesh() {
    const geometry = new THREE.BoxGeometry(100, 200, 20);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    return new THREE.Mesh(geometry, material);
  }
  setPosition(x, y, z) {
    this.position.set(x, y, z);
    return this;
  }
  setTranslation(x, y, z) {
    this.mesh.geometry.translate(x, y, z);
    return this;
  }
  setRotation(x, y, z) {
    this.rotation.set(x, y, z);
    return this;
  }
  setScale(w, h = w, d = w) {
    const minScale = 0.01;
    if (w < minScale) w = minScale;
    if (h < minScale) h = minScale;
    if (d < minScale) d = minScale;
    this.scale.set(w, h, d);
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
  update() {
    this.rotate();
    this.move();
    this.jump();
    //
    this.mesh.setRotationFromQuaternion(this.direction);
  }
  jump() {
    if (this.keys.space) {
      if (!this.isJumped) {
        this.isJumped = true;
        this.jumpVel += this.jumpAcc;
      }
    }
    // fall
    this.position.y += this.jumpVel;
    if (this.position.y > FLOOR_HEIGHT) {
      this.jumpVel -= C_GRAVITY;
    } else {
      this.position.y = FLOOR_HEIGHT;
      this.isJumped = false;
      this.jumpVel = 0.0;
    }
  }
  move() {
    // walk or run
    if (this.keys.shift) {
      this.moveVel = this.runAcc;
    } else {
      this.moveVel = this.walkAcc;
    }
    // forward or backward
    if (this.keys.forward) {
      const vector = new THREE.Vector3(0, 0, 1); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(-this.moveVel); // negative
      this.position.add(vector);
    }
    if (this.keys.backward) {
      const vector = new THREE.Vector3(0, 0, 1); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(this.moveVel); // positive
      this.position.add(vector);
    }
    // left or right
    if (this.keys.left) {
      const vector = new THREE.Vector3(1, 0, 0); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(-this.moveVel); // negative
      this.position.add(vector);
    }
    if (this.keys.right) {
      const vector = new THREE.Vector3(1, 0, 0); // ***
      vector.applyQuaternion(this.direction);
      vector.normalize();
      vector.multiplyScalar(+this.moveVel); // positive
      this.position.add(vector);
    }
  }
  rotate() {
    // rotate left or right
    if (this.keys.rotateLeft) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, this.rotateVel); // positive
      this.direction.multiply(quaternion);
    }
    if (this.keys.rotateRight) {
      let axis = new THREE.Vector3(0, 1, 0);
      let quaternion = new THREE.Quaternion().setFromAxisAngle(axis, -this.rotateVel); // negative
      this.direction.multiply(quaternion);
    }
  }
  onKeyDown(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = true;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = true;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = true;
        break;
      case 'KeyE':
        this.keys.rotateRight = true;
        break;
      case 'Space':
        this.keys.space = true;
        break;
      case 'ShiftLeft':
        this.keys.shift = true;
        break;
    }
  };
  onKeyUp(event) {
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        this.keys.forward = false;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'ArrowDown':
      case 'KeyS':
        this.keys.backward = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.keys.right = false;
        break;
      case 'KeyQ':
        this.keys.rotateLeft = false;
        break;
      case 'KeyE':
        this.keys.rotateRight = false;
        break;
      case 'Space':
        this.keys.space = false;
        break;
      case 'ShiftLeft':
        this.keys.shift = false;
        break;
    }
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