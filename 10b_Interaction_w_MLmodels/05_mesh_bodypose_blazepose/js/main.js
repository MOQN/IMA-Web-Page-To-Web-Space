let params = {
  poseScale: 250,
};

const WORLD_SIZE = 1000;
const WORLD_HALF = WORLD_SIZE / 2;
const VIDEO_WIDTH = 640;

let lines = [];

function setupThree() {
  // floor
  const floor = getPlane();
  scene.add(floor);
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  /* lines */
  // left _eye
  lines.push(new Bar(pose.left_eye_outer, pose.left_eye));
  lines.push(new Bar(pose.left_eye, pose.left_eye_inner));
  // right _eye
  lines.push(new Bar(pose.right_eye_outer, pose.right_eye));
  lines.push(new Bar(pose.right_eye, pose.right_eye_inner));
  // _mouth
  lines.push(new Bar(pose.mouth_left, pose.mouth_right));
  // _ears
  lines.push(new Bar(pose.left_ear, pose.right_ear));

  // torso
  lines.push(new Bar(pose.left_shoulder, pose.right_shoulder));
  lines.push(new Bar(pose.right_shoulder, pose.right_hip));
  lines.push(new Bar(pose.right_hip, pose.left_hip));
  lines.push(new Bar(pose.left_hip, pose.left_shoulder));

  // left leg
  lines.push(new Bar(pose.left_hip, pose.left_knee));
  lines.push(new Bar(pose.left_knee, pose.left_ankle));
  lines.push(new Bar(pose.left_heel, pose.left_foot_index));

  // right leg
  lines.push(new Bar(pose.right_hip, pose.right_knee));
  lines.push(new Bar(pose.right_knee, pose.right_ankle));
  lines.push(new Bar(pose.right_heel, pose.right_foot_index));

  // left arm
  lines.push(new Bar(pose.left_shoulder, pose.left_elbow));
  lines.push(new Bar(pose.left_elbow, pose.left_wrist));
  // left hand
  lines.push(new Bar(pose.left_wrist, pose.left_thumb));
  lines.push(new Bar(pose.left_wrist, pose.left_index));
  lines.push(new Bar(pose.left_wrist, pose.left_pinky));

  // right arm
  lines.push(new Bar(pose.right_shoulder, pose.right_elbow));
  lines.push(new Bar(pose.right_elbow, pose.right_wrist));
  // left hand
  lines.push(new Bar(pose.right_wrist, pose.right_thumb));
  lines.push(new Bar(pose.right_wrist, pose.right_index));
  lines.push(new Bar(pose.right_wrist, pose.right_pinky));


  // GUI
  gui.add(params, "poseScale", 0, 500);
}

function updateThree() {
  // update the bars
  for (const line of lines) {
    line.update();
  }
}

function updateWithBodypose(mesh, keypoint, confidenceThreshold = 0.1) {
  if (keypoint.confidence > confidenceThreshold) {
    mesh.visible = true;
    mesh.position = getScaledVector(keypoint);
  } else {
    mesh.visible = false;
  }
}

class Bar {
  constructor(start, end) {
    this.mesh = getBox();
    scene.add(this.mesh);

    this.mesh.scale.x = 50;
    this.mesh.scale.y = 30;
    this.mesh.scale.z = 30;
    this.mesh.geometry.translate(0.5, 0, 0);

    this.start = start;
    this.end = end;
  }
  update() {
    const confidenceThreshold = 0.1;
    if (this.start.confidence < confidenceThreshold || this.end.confidence < confidenceThreshold) {
      this.mesh.visible = false;
      return;
    } else {
      this.mesh.visible = true;
    }

    let startVector = getScaledVector(this.start);
    let endVector = getScaledVector(this.end);

    let direction = new THREE.Vector3().subVectors(endVector, startVector); // target - origin
    let distance = direction.length();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), direction.normalize());

    this.mesh.position.copy(startVector);
    this.mesh.rotation.setFromQuaternion(quaternion);
    this.mesh.scale.x = distance;
  }
}

function getScaledVector(keypoint) {
  return new THREE.Vector3(
    keypoint.x * params.poseScale,
    keypoint.y * params.poseScale * -1, // flipped!
    keypoint.z * params.poseScale * -0.5 // flipped. 0.5 is an arbitrary value.
  );
}

function getLine() {
  const material = new THREE.LineBasicMaterial({ color: 0x00FF00 });
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const mesh = new THREE.Line(geometry, material);

  return mesh;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}