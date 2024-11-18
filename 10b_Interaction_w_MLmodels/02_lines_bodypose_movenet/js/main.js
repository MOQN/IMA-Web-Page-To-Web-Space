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
  // face
  lines.push(new Line3D(pose.left_ear, pose.left_eye));
  lines.push(new Line3D(pose.left_eye, pose.nose));
  lines.push(new Line3D(pose.nose, pose.right_eye));
  lines.push(new Line3D(pose.right_eye, pose.right_ear));
  // torso
  lines.push(new Line3D(pose.left_shoulder, pose.right_shoulder));
  lines.push(new Line3D(pose.right_shoulder, pose.right_hip));
  lines.push(new Line3D(pose.right_hip, pose.left_hip));
  lines.push(new Line3D(pose.left_hip, pose.left_shoulder));
  // left arm
  lines.push(new Line3D(pose.left_shoulder, pose.left_elbow));
  lines.push(new Line3D(pose.left_elbow, pose.left_wrist));
  // right arm
  lines.push(new Line3D(pose.right_shoulder, pose.right_elbow));
  lines.push(new Line3D(pose.right_elbow, pose.right_wrist));
  // left leg
  lines.push(new Line3D(pose.left_hip, pose.left_knee));
  lines.push(new Line3D(pose.left_knee, pose.left_ankle));
  // right leg
  lines.push(new Line3D(pose.right_hip, pose.right_knee));
  lines.push(new Line3D(pose.right_knee, pose.right_ankle));

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

  // update cube based on nose position and confidence
  updateWithBodypose(cube, pose.nose, 0.1);
}

function updateWithBodypose(mesh, keypoint, confidenceThreshold = 0.1) {
  if (keypoint.confidence > confidenceThreshold) {
    mesh.visible = true;
    mesh.position.x = map(keypoint.x, 0, VIDEO_WIDTH, -1.0, 1.0) * params.poseScale; // x
    mesh.position.y = map(keypoint.y, 0, VIDEO_WIDTH, 1.0, -1.0) * params.poseScale; // y: should be flipped! 
    mesh.position.z = 0
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
    position.array[0] = map(this.start.x, 0, VIDEO_WIDTH, -1.0, 1.0) * params.poseScale; // x
    position.array[1] = map(this.start.y, 0, VIDEO_WIDTH, 1.0, -1.0) * params.poseScale; // y: should be flipped!
    position.array[2] = 0; // z
    // end
    position.array[3] = map(this.end.x, 0, VIDEO_WIDTH, -1.0, 1.0) * params.poseScale; // x
    position.array[4] = map(this.end.y, 0, VIDEO_WIDTH, 1.0, -1.0) * params.poseScale; // y: should be flipped!
    position.array[5] = 0; // z
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