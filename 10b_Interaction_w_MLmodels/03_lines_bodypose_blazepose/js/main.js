let params = {
  poseScale: 250,
};

const WORLD_SIZE = 1000;
const WORLD_HALF = WORLD_SIZE / 2;
const VIDEO_WIDTH = 640;

let lines = [];
let cube;

function setupThree() {
  // floor
  const floor = getPlane();
  scene.add(floor);
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  /* lines */
  // left _eye
  lines.push(new Line3D(pose.left_eye_outer, pose.left_eye));
  lines.push(new Line3D(pose.left_eye, pose.left_eye_inner));
  // right _eye
  lines.push(new Line3D(pose.right_eye_outer, pose.right_eye));
  lines.push(new Line3D(pose.right_eye, pose.right_eye_inner));
  // _mouth
  lines.push(new Line3D(pose.mouth_left, pose.mouth_right));
  // _ears
  lines.push(new Line3D(pose.left_ear, pose.right_ear));

  // torso
  lines.push(new Line3D(pose.left_shoulder, pose.right_shoulder));
  lines.push(new Line3D(pose.right_shoulder, pose.right_hip));
  lines.push(new Line3D(pose.right_hip, pose.left_hip));
  lines.push(new Line3D(pose.left_hip, pose.left_shoulder));

  // left leg
  lines.push(new Line3D(pose.left_hip, pose.left_knee));
  lines.push(new Line3D(pose.left_knee, pose.left_ankle));
  lines.push(new Line3D(pose.left_heel, pose.left_foot_index));

  // right leg
  lines.push(new Line3D(pose.right_hip, pose.right_knee));
  lines.push(new Line3D(pose.right_knee, pose.right_ankle));
  lines.push(new Line3D(pose.right_heel, pose.right_foot_index));

  // left arm
  lines.push(new Line3D(pose.left_shoulder, pose.left_elbow));
  lines.push(new Line3D(pose.left_elbow, pose.left_wrist));
  // left hand
  lines.push(new Line3D(pose.left_wrist, pose.left_thumb));
  lines.push(new Line3D(pose.left_wrist, pose.left_index));
  lines.push(new Line3D(pose.left_wrist, pose.left_pinky));

  // right arm
  lines.push(new Line3D(pose.right_shoulder, pose.right_elbow));
  lines.push(new Line3D(pose.right_elbow, pose.right_wrist));
  // left hand
  lines.push(new Line3D(pose.right_wrist, pose.right_thumb));
  lines.push(new Line3D(pose.right_wrist, pose.right_index));
  lines.push(new Line3D(pose.right_wrist, pose.right_pinky));

  // cube
  cube = getBox();
  scene.add(cube);
  cube.scale.set(30, 30, 30);

  // GUI
  gui.add(params, "poseScale", 0, 500);
}

function updateThree() {
  // update lines
  for (const line of lines) {
    line.update();
  }

  // update cube based on right wrist position and confidence
  updateWithBodypose(cube, pose.right_wrist, 0.1);
}

function updateWithBodypose(mesh, keypoint, confidenceThreshold = 0.1) {
  if (keypoint.confidence > confidenceThreshold) {
    mesh.visible = true;
    mesh.position.x = keypoint.x * params.poseScale; // x
    mesh.position.y = keypoint.y * params.poseScale * -1; // y: should be flipped! 
    mesh.position.z = keypoint.z * params.poseScale * -0.5; // z: is also flipped.
  } else {
    mesh.visible = false;
  }
}

class Line3D {
  constructor(start, end) {
    this.mesh = getLine();
    scene.add(this.mesh);
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

    const position = this.mesh.geometry.attributes.position;
    // start
    position.array[0] = this.start.x * params.poseScale; // x
    position.array[1] = this.start.y * params.poseScale * -1; // y: should be flipped!
    position.array[2] = this.start.z * params.poseScale * -0.5; // z: is also flipped.
    // end
    position.array[3] = this.end.x * params.poseScale; // x
    position.array[4] = this.end.y * params.poseScale * -1; // y: should be flipped!
    position.array[5] = this.end.z * params.poseScale * -0.5; // z: is also flipped.
    // update
    position.needsUpdate = true;
  }
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
  const material = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}