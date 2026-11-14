const params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_HEIGHT = -WORLD_HALF / 4;
const GRAVITY = 1080;

let plane;
let character;
let thirdPersonCamera;

function setupThree() {
  plane = createTerrain();
  scene.add(plane);

  character = new Character();
  thirdPersonCamera = new ThirdPersonCamera(camera);

  const cameraFolder = pane.addFolder({ title: "CAMERA", expanded: true });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "x", { min: -500, max: 500 });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "y", { min: 0, max: 500 });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "z", { min: 50, max: 800 });

  showInstruction("WASD / arrows move · Q / E turn · Shift run · Space jump");
}

function updateThree() {
  const dt = Math.min(delta, 0.05);
  character.update(dt);
  thirdPersonCamera.update(character, dt);
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 100, 100);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const height = (noise((x + WORLD_HALF) * 0.02, (y + WORLD_HALF) * 0.02) * 4) ** 3;
    positions.setZ(i, height);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshBasicMaterial({
    wireframe: true,
    side: THREE.DoubleSide,
  });
  const terrain = new THREE.Mesh(geometry, material);
  terrain.position.y = FLOOR_HEIGHT;
  terrain.rotation.x = -Math.PI / 2;
  terrain.updateMatrixWorld(true);
  return terrain;
}

function getHeightAt(position) {
  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(position.x, WORLD_SIZE, position.z),
    new THREE.Vector3(0, -1, 0)
  );
  const intersections = raycaster.intersectObject(plane);
  return intersections.length > 0 ? intersections[0].point.y : FLOOR_HEIGHT;
}

class Character {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    geometry.translate(0, 0.5, 0);
    const material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.scale.set(100, 200, 20);
    this.mesh.position.y = FLOOR_HEIGHT;
    scene.add(this.mesh);

    this.direction = new THREE.Quaternion();
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      turnLeft: false,
      turnRight: false,
      jump: false,
      run: false,
    };
    this.jumpSpeed = 0;
    this.jumpWasPressed = false;
    this.pressedKeys = new Set();
    this.onKeyDown = (event) => this.setKey(event, true);
    this.onKeyUp = (event) => this.setKey(event, false);
    this.resetKeys = () => {
      this.pressedKeys.clear();
      this.jumpWasPressed = false;
      for (const key of Object.keys(this.keys)) this.keys[key] = false;
    };

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.resetKeys);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.resetKeys();
    });
  }

  update(dt) {
    this.rotate(dt);
    this.move(dt);
    this.jump(dt);
  }

  rotate(dt) {
    const direction = Number(this.keys.turnLeft) - Number(this.keys.turnRight);
    this.mesh.rotation.y += direction * 1.2 * dt;
    this.direction.setFromEuler(this.mesh.rotation);
  }

  move(dt) {
    const movement = new THREE.Vector3(
      Number(this.keys.right) - Number(this.keys.left),
      0,
      Number(this.keys.backward) - Number(this.keys.forward)
    );
    if (movement.lengthSq() === 0) return;

    movement.normalize().applyQuaternion(this.direction);
    const speed = this.keys.run ? 360 : 150;
    this.mesh.position.addScaledVector(movement, speed * dt);
  }

  jump(dt) {
    const floorHeight = getHeightAt(this.mesh.position);
    const onGround = this.mesh.position.y <= floorHeight + 0.01;

    if (this.keys.jump && !this.jumpWasPressed && onGround) this.jumpSpeed = 600;
    this.jumpWasPressed = this.keys.jump;
    this.mesh.position.y += this.jumpSpeed * dt - 0.5 * GRAVITY * dt * dt;
    this.jumpSpeed -= GRAVITY * dt;

    if (this.mesh.position.y <= floorHeight) {
      this.mesh.position.y = floorHeight;
      this.jumpSpeed = 0;
    }
  }

  setKey(event, isDown) {
    if (isDown && event.target?.closest?.("input, textarea, select, [contenteditable='true']")) return;
    const bindings = {
      ArrowUp: "forward",
      KeyW: "forward",
      ArrowDown: "backward",
      KeyS: "backward",
      ArrowLeft: "left",
      KeyA: "left",
      ArrowRight: "right",
      KeyD: "right",
      KeyQ: "turnLeft",
      KeyE: "turnRight",
      Space: "jump",
      ShiftLeft: "run",
      ShiftRight: "run",
    };
    const key = bindings[event.code];

    if (!key) return;
    if (isDown && (event.code === "Space" || event.code.startsWith("Arrow"))) {
      event.preventDefault();
    }
    if (isDown) this.pressedKeys.add(event.code);
    else this.pressedKeys.delete(event.code);
    this.keys[key] = [...this.pressedKeys].some((code) => bindings[code] === key);
  }
}

class ThirdPersonCamera {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3();
    this.lookAt = new THREE.Vector3();
    this.idealOffset = new THREE.Vector3(100, 150, 350);
    this.idealLookAt = new THREE.Vector3(0, 100, 0);
    this.followRate = 4;
    this.initialized = false;
  }

  update(target, dt) {
    const desiredPosition = this.idealOffset.clone()
      .applyQuaternion(target.direction)
      .add(target.mesh.position);
    const desiredLookAt = this.idealLookAt.clone()
      .applyQuaternion(target.direction)
      .add(target.mesh.position);

    if (!this.initialized) {
      this.position.copy(desiredPosition);
      this.lookAt.copy(desiredLookAt);
      this.initialized = true;
    }

    const amount = 1 - Math.exp(-this.followRate * dt);
    this.position.lerp(desiredPosition, amount);
    this.lookAt.lerp(desiredLookAt, amount);
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAt);
  }
}
