const ui = {
  //
}

const WORLD_SIZE = 500;
const WORLD_HALF = WORLD_SIZE / 2;
const POSE_SCALE = WORLD_HALF/2;
const CAM_WIDTH = 640;

let lines = [];

function setupThree() {
  // floor
  const floor = getPlane();
  floor.position.y = -WORLD_HALF / 2;
  floor.rotation.x = -PI / 2;

  /* lines */
  // face
  lines.push( new Line3D(pose.leftEar, pose.leftEye) );
  lines.push( new Line3D(pose.leftEye, pose.nose) );
  lines.push( new Line3D(pose.nose, pose.rightEye) );
  lines.push( new Line3D(pose.rightEye, pose.rightEar) );

  // torso
  lines.push( new Line3D(pose.leftShoulder, pose.rightShoulder) );
  lines.push( new Line3D(pose.rightShoulder, pose.rightHip) );
  lines.push( new Line3D(pose.rightHip, pose.leftHip) );
  lines.push( new Line3D(pose.leftHip, pose.leftShoulder) );

  // left arm
  lines.push( new Line3D(pose.leftShoulder, pose.leftElbow) );
  lines.push( new Line3D(pose.leftElbow, pose.leftWrist) );

  // right arm
  lines.push( new Line3D(pose.rightShoulder, pose.rightElbow) );
  lines.push( new Line3D(pose.rightElbow, pose.rightWrist) );

  // left leg
  lines.push( new Line3D(pose.leftHip, pose.leftKnee) );
  lines.push( new Line3D(pose.leftKnee, pose.leftAnkle) );

  // right leg
  lines.push( new Line3D(pose.rightHip, pose.rightKnee) );
  lines.push( new Line3D(pose.rightKnee, pose.rightAnkle) );
}

function updateThree() {
  for (const line of lines) {
    line.update();
  }
}

class Line3D {
  constructor(start, end) {
    this.mesh = getLine();
    this.start = start;
    this.end = end;
  }
  update() {
    const position = this.mesh.geometry.attributes.position;
    // start
    position.array[0] = map(this.start.x, 0, CAM_WIDTH, -1.0, 1.0) * POSE_SCALE;
    position.array[1] = map(this.start.y, 0, CAM_WIDTH, 1.0, -1.0) * POSE_SCALE; // y should be flipped!
    position.array[2] = 0;
    // end
    position.array[3] = map(this.end.x, 0, CAM_WIDTH, -1.0, 1.0) * POSE_SCALE;
    position.array[4] = map(this.end.y, 0, CAM_WIDTH, 1.0, -1.0) * POSE_SCALE;
    position.array[5] = 0;
    // update
    position.needsUpdate = true;
  }
}

function getLine() {
  const material = new THREE.LineBasicMaterial({ color: 0x0000FF });
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(10, 0, 0));
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);

  scene.add(line);
  return line;
}

function getPlane() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0x999999,
    wireframe: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(geometry, material);

  let pos = geometry.attributes.position;
  for (let i = 0; i < pos.array.length; i += 3) {
    let x = pos.array[i + 0];
    let y = pos.array[i + 1];
    let z = pos.array[i + 2];

    let xOffset = (x + WORLD_HALF) * 0.02;
    let yOffset = (y + WORLD_HALF) * 0.02;
    let amp = 30;
    let noiseValue = noise(xOffset, yOffset) * amp;

    pos.array[i + 2] = noiseValue; // update the z value.
  }

  scene.add(mesh);
  return mesh;
}

// event listeners
window.addEventListener("resize", onWindowResize);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}