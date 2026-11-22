const params = {
  fps: 0,
};

const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_HEIGHT = -WORLD_HALF / 4;
const GRAVITY = 1080;
const PLAYER_RADIUS = 45;

let plane;
let character;
let thirdPersonCamera;
let walls = [];

function setupThree() {
  plane = createTerrain();
  scene.add(plane);

  createWalls();
  character = new Character();
  thirdPersonCamera = new ThirdPersonCamera(camera);

  const cameraFolder = pane.addFolder({ title: "CAMERA", expanded: true });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "x", { min: -500, max: 500 });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "y", { min: 0, max: 500 });
  cameraFolder.addBinding(thirdPersonCamera.idealOffset, "z", { min: 50, max: 800 });

  showInstruction("WASD / arrows move · Q / E turn · Shift run · Space jump. Walls and world bounds block movement.");
}

function createWalls() {
  walls = [
    getWall(0, -700, 1400, 30),
    getWall(0, 700, 1400, 30),
    getWall(-700, 0, 30, 1400),
    getWall(700, 0, 30, 1400),
  ];

  for (const wall of walls) {
    scene.add(wall);
    wall.updateMatrixWorld(true);
  }
}

function getWall(x, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, 200, depth);
  const material = new THREE.MeshBasicMaterial({ color: 0x303744 });
  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(x, FLOOR_HEIGHT + 100, z);
  return wall;
}

function collidesWithWall(position) {
  // Look down at the XZ plane, so jumping does not change the collision test.
  const point = new THREE.Vector2(position.x, position.z);
  const limit = WORLD_HALF - PLAYER_RADIUS;
  if (Math.abs(point.x) > limit || Math.abs(point.y) > limit) {
    return true;
  }

  for (const wall of walls) {
    const bounds = new THREE.Box3().setFromObject(wall);
    const min = new THREE.Vector2(bounds.min.x, bounds.min.z);
    const max = new THREE.Vector2(bounds.max.x, bounds.max.z);
    const closest = point.clone().clamp(min, max);
    if (point.distanceTo(closest) < PLAYER_RADIUS) {
      return true;
    }
  }
  return false;
}

function updateThree() {
  const dt = Math.min(delta, 0.05); // Limit the time step to avoid sudden large movements during slow frames.
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

  if (intersections.length > 0) {
    return intersections[0].point.y;
  } else {
    return FLOOR_HEIGHT;
  }
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
    this.onKeyDown = function(event) {
      return this.setKey(event, true);
    }.bind(this);
    this.onKeyUp = function(event) {
      return this.setKey(event, false);
    }.bind(this);
    this.resetKeys = function() {
      this.pressedKeys.clear();
      this.jumpWasPressed = false;
      for (const key of Object.keys(this.keys)) this.keys[key] = false;
    }.bind(this);

    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.resetKeys);
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) this.resetKeys();
    }.bind(this));
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
    let speed;

    if (this.keys.run) {
      speed = 360;
    } else {
      speed = 150;
    }

    const distance = speed * dt;
    const nextPosition = this.mesh.position.clone();

    nextPosition.x += movement.x * distance;
    if (!collidesWithWall(nextPosition)) this.mesh.position.x = nextPosition.x;

    nextPosition.copy(this.mesh.position);
    nextPosition.z += movement.z * distance;
    if (!collidesWithWall(nextPosition)) this.mesh.position.z = nextPosition.z;
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
    if (isDown && event.target !== null && event.target !== undefined
        && event.target.closest !== null && event.target.closest !== undefined) {
      if (event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    }
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
    let anyPressed = false;
    for (const code of this.pressedKeys) {
      if (bindings[code] === key) {
        anyPressed = true;
        break;
      }
    }
    this.keys[key] = anyPressed;
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
