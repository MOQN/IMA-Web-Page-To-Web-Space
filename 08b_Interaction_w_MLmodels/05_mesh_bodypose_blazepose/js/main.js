// BodyPose turns tracked landmarks into endpoint-based Bars from example 04.
let params = { fps: 0 };
const WORLD_SIZE = 2000;
let body;

function setupThree() {
  const floor = getPlane();
  floor.position.y = -WORLD_SIZE / 4;
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  body = new BodyPose();
  scene.add(body.group);
  pane.addBinding(body, "poseScale", { min: 0, max: 500 });
  pane.addBinding(body, "confidenceThreshold", { min: 0, max: 1 });
}

function updateThree() {
  body.update(pose);
}

// Each pair is one bone. Add or remove pairs without changing drawing logic.
const BODY_CONNECTIONS = [
  ["left_eye_outer", "left_eye"], ["left_eye", "left_eye_inner"],
  ["right_eye_outer", "right_eye"], ["right_eye", "right_eye_inner"],
  ["mouth_left", "mouth_right"], ["left_ear", "right_ear"],
  ["left_shoulder", "right_shoulder"], ["right_shoulder", "right_hip"],
  ["right_hip", "left_hip"], ["left_hip", "left_shoulder"],
  ["left_hip", "left_knee"], ["left_knee", "left_ankle"],
  ["left_heel", "left_foot_index"],
  ["right_hip", "right_knee"], ["right_knee", "right_ankle"],
  ["right_heel", "right_foot_index"],
  ["left_shoulder", "left_elbow"], ["left_elbow", "left_wrist"],
  ["left_wrist", "left_thumb"], ["left_wrist", "left_index"],
  ["left_wrist", "left_pinky"],
  ["right_shoulder", "right_elbow"], ["right_elbow", "right_wrist"],
  ["right_wrist", "right_thumb"], ["right_wrist", "right_index"],
  ["right_wrist", "right_pinky"],
];

class BodyPose {
  constructor(connections = BODY_CONNECTIONS) {
    this.group = new THREE.Group();
    this.poseScale = 250;
    this.confidenceThreshold = 0.1;
    this.bones = connections.map(([startName, endName]) => {
      const bar = new Bar(30);
      this.group.add(bar.mesh);
      return { startName, endName, bar };
    });
    // Reuse these vectors instead of allocating for every bone on every frame.
    this.start = new THREE.Vector3();
    this.end = new THREE.Vector3();
  }
  hasPoint(point) {
    return point && point.confidence > this.confidenceThreshold
      && Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.z);
  }
  toWorld(point, output) {
    // Pose Y points down; the arbitrary 0.5 depth scale keeps the body readable.
    return output.set(
      point.x * this.poseScale,
      -point.y * this.poseScale,
      -point.z * this.poseScale * 0.5
    );
  }
  update(keypoints) {
    for (const bone of this.bones) {
      const start = keypoints?.[bone.startName];
      const end = keypoints?.[bone.endName];
      if (!this.hasPoint(start) || !this.hasPoint(end)) {
        bone.bar.mesh.visible = false;
        continue;
      }
      bone.bar.update(this.toWorld(start, this.start), this.toWorld(end, this.end));
    }
  }
  dispose() {
    for (const bone of this.bones) bone.bar.dispose();
    this.group.removeFromParent();
  }
}

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
  return new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshNormalMaterial());
}

function getPlane() {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: true, side: THREE.DoubleSide })
  );
}
