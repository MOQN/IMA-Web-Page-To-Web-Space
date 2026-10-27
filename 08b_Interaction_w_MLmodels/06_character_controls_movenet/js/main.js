// Input sources produce the same intent; Character only knows how to move.
let params = { fps: 0 };
const WORLD_SIZE = 2000;
const WORLD_HALF = WORLD_SIZE / 2;
const FLOOR_HEIGHT = -150;

let user;
let keyboard;
let poseInput;
let previousUpdateTime = null;

function setupThree() {
  const floor = getPlane();
  floor.position.y = -WORLD_HALF / 4;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  user = new Character({ floorHeight: FLOOR_HEIGHT });
  scene.add(user.mesh);
  keyboard = new KeyboardInput(document, window);
  poseInput = new PoseInput();

  pane.addBinding(poseInput, "status", { readonly: true });
  pane.addBinding(poseInput, "angle", { label: "Shoulder tilt (degrees)", readonly: true });
  pane.addBinding(poseInput, "distance", { label: "Shoulder width", readonly: true });
  pane.addBinding(poseInput, "neutralWidth", { readonly: true });
  pane.addButton({ title: "Calibrate neutral pose" }).on("click", () => poseInput.calibrate());
}

function updateThree() {
  const now = performance.now();
  const dt = previousUpdateTime === null ? 0 : Math.min((now - previousUpdateTime) / 1000, 0.05);
  previousUpdateTime = now;

  const keyboardIntent = keyboard.read();
  let intent;
  if (keyboardIntent.active) {
    poseInput.status = "Keyboard control";
    intent = keyboardIntent;
  } else {
    intent = poseInput.read(pose, lastPoseTime, now, document.hidden);
  }
  user.update(intent, dt);

  camera.position.copy(user.position);
  camera.quaternion.copy(user.direction);
}

// All input sources return local movement axes, a turn amount, and action flags.
function getNeutralIntent() {
  return { x: 0, z: 0, turn: 0, jump: false, run: false, active: false };
}

class Character {
  constructor({ floorHeight = -150, walkSpeed = 150, runSpeed = 360,
    turnSpeed = 1.2, jumpSpeed = 600, gravity = 1080 } = {}) {
    this.floorHeight = floorHeight;
    this.walkSpeed = walkSpeed;
    this.runSpeed = runSpeed;
    this.turnSpeed = turnSpeed;
    this.jumpSpeed = jumpSpeed;
    this.gravity = gravity;
    this.verticalSpeed = 0;
    this.grounded = true;
    this.mesh = getBox();
    this.mesh.scale.set(100, 200, 20);
    this.position = this.mesh.position;
    this.position.y = floorHeight;
    this.direction = this.mesh.quaternion;
    this.movement = new THREE.Vector3();
    this.upAxis = new THREE.Vector3(0, 1, 0);
    this.rotation = new THREE.Quaternion();
  }
  update(intent, dt) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(dt, 0.05);
    this.rotate(intent.turn, dt);
    this.move(intent, dt);
    this.jump(intent.jump, dt);
  }
  rotate(turn, dt) {
    this.rotation.setFromAxisAngle(this.upAxis, turn * this.turnSpeed * dt);
    this.direction.multiply(this.rotation);
  }
  move(intent, dt) {
    this.movement.set(intent.x, 0, intent.z);
    // Preserve analog pose input, but cap diagonal keyboard movement at length 1.
    if (this.movement.lengthSq() > 1) this.movement.normalize();
    this.movement.applyQuaternion(this.direction);
    const speed = intent.run ? this.runSpeed : this.walkSpeed;
    this.position.addScaledVector(this.movement, speed * dt);
  }
  jump(requested, dt) {
    if (requested && this.grounded) {
      this.verticalSpeed = this.jumpSpeed;
      this.grounded = false;
    }
    this.position.y += this.verticalSpeed * dt - 0.5 * this.gravity * dt * dt;
    this.verticalSpeed -= this.gravity * dt;
    if (this.position.y <= this.floorHeight) {
      this.position.y = this.floorHeight;
      this.verticalSpeed = 0;
      this.grounded = true;
    }
  }
  dispose() {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}

// This object interprets the body; it never changes a mesh or a camera.
class PoseInput {
  constructor() {
    this.confidenceThreshold = 0.1;
    this.timeoutMs = 500;
    this.neutralWidth = 0;
    this.angle = 0;
    this.distance = 0;
    this.status = "Waiting for pose";
  }
  calibrate() {
    this.neutralWidth = 0;
    this.status = "Stand naturally to calibrate";
  }
  hasPoint(point) {
    return point && point.confidence > this.confidenceThreshold
      && Number.isFinite(point.x) && Number.isFinite(point.y);
  }
  read(keypoints, lastDetectionTime, now, hidden = false) {
    const intent = getNeutralIntent();
    const left = keypoints?.left_shoulder;
    const right = keypoints?.right_shoulder;
    const age = now - lastDetectionTime;
    if (hidden || !Number.isFinite(age) || age < 0 || age > this.timeoutMs
        || !this.hasPoint(left) || !this.hasPoint(right)) {
      this.status = "Pose lost — movement paused";
      return intent;
    }
    const dx = right.x - left.x;
    const dy = right.y - left.y;
    this.distance = Math.hypot(dx, dy);
    if (this.distance < 1) {
      this.status = "Shoulders too close — movement paused";
      return intent;
    }
    this.angle = Math.atan2(dy, Math.abs(dx)) * 180 / Math.PI;
    if (!this.neutralWidth) this.neutralWidth = this.distance;
    this.status = "Tracking";
    const ratio = this.distance / this.neutralWidth;
    const clamp = value => Math.max(0, Math.min(1, value));
    // A neutral zone prevents small tracking jitters from starting movement.
    intent.z = ratio > 1.1 ? -clamp((ratio - 1.1) / 0.3)
      : ratio < 0.9 ? clamp((0.9 - ratio) / 0.3) : 0;
    intent.turn = -Math.sign(this.angle) * clamp((Math.abs(this.angle) - 12) / 18);
    intent.active = true;
    return intent;
  }
}

const KEY_ACTIONS = {
  KeyW: "forward", ArrowUp: "forward", KeyS: "backward", ArrowDown: "backward",
  KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right",
  KeyQ: "rotateLeft", KeyE: "rotateRight", Space: "jump",
  ShiftLeft: "run", ShiftRight: "run",
};

// Key state and listener cleanup belong to the input object, not Character.
class KeyboardInput {
  constructor(keyTarget, windowTarget) {
    this.keyTarget = keyTarget;
    this.windowTarget = windowTarget;
    this.pressed = new Set();
    this.jumpRequested = false;
    this.onKeyDown = event => {
      if (!KEY_ACTIONS[event.code]) return;
      if (event.target?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (event.code === "Space" || event.code.startsWith("Arrow")) event.preventDefault();
      if (event.code === "Space" && !this.pressed.has(event.code)) this.jumpRequested = true;
      this.pressed.add(event.code);
    };
    this.onKeyUp = event => this.pressed.delete(event.code);
    this.onBlur = () => this.reset();
    this.onVisibility = () => { if (this.keyTarget.hidden) this.reset(); };
    keyTarget.addEventListener("keydown", this.onKeyDown);
    keyTarget.addEventListener("keyup", this.onKeyUp);
    keyTarget.addEventListener("visibilitychange", this.onVisibility);
    windowTarget.addEventListener("blur", this.onBlur);
  }
  reset() {
    this.pressed.clear();
    this.jumpRequested = false;
  }
  read() {
    const actions = new Set([...this.pressed].map(code => KEY_ACTIONS[code]));
    const intent = getNeutralIntent();
    intent.x = Number(actions.has("right")) - Number(actions.has("left"));
    intent.z = Number(actions.has("backward")) - Number(actions.has("forward"));
    intent.turn = Number(actions.has("rotateLeft")) - Number(actions.has("rotateRight"));
    intent.jump = this.jumpRequested;
    intent.run = actions.has("run");
    intent.active = this.pressed.size > 0 || intent.jump;
    this.jumpRequested = false;
    return intent;
  }
  dispose() {
    this.reset();
    this.keyTarget.removeEventListener("keydown", this.onKeyDown);
    this.keyTarget.removeEventListener("keyup", this.onKeyUp);
    this.keyTarget.removeEventListener("visibilitychange", this.onVisibility);
    this.windowTarget.removeEventListener("blur", this.onBlur);
  }
}

function getBox() {
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 100, 100);
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const xOffset = (positions[i] + WORLD_HALF) * 0.02;
    const yOffset = (positions[i + 1] + WORLD_HALF) * 0.02;
    positions[i + 2] = (noise(xOffset, yOffset) * 4) ** 3;
  }
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ wireframe: true, side: THREE.DoubleSide }));
}
