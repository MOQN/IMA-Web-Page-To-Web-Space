// This example code is created based on:
// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs


let pose = {
  nose: { x: 0, y: 0, z: 0 },
  leftEyeInner: { x: 0, y: 0, z: 0 },
  leftEye: { x: 0, y: 0, z: 0 },
  leftEyeOuter: { x: 0, y: 0, z: 0 },
  rightEyeInner: { x: 0, y: 0, z: 0 },
  rightEye: { x: 0, y: 0, z: 0 },
  rightEyeOuter: { x: 0, y: 0, z: 0 },
  leftEar: { x: 0, y: 0, z: 0 },
  rightEar: { x: 0, y: 0, z: 0 },
  leftMouth: { x: 0, y: 0, z: 0 },
  rightMouth: { x: 0, y: 0, z: 0 },
  leftShoulder: { x: 0, y: 0, z: 0 },
  rightShoulder: { x: 0, y: 0, z: 0 },
  leftElbow: { x: 0, y: 0, z: 0 },
  rightElbow: { x: 0, y: 0, z: 0 },
  leftWrist: { x: 0, y: 0, z: 0 },
  rightWrist: { x: 0, y: 0, z: 0 },
  leftPinky: { x: 0, y: 0, z: 0 },
  rightPinky: { x: 0, y: 0, z: 0 },
  leftIndex: { x: 0, y: 0, z: 0 },
  rightIndex: { x: 0, y: 0, z: 0 },
  leftThumb: { x: 0, y: 0, z: 0 },
  rightThumb: { x: 0, y: 0, z: 0 },
  leftHip: { x: 0, y: 0, z: 0 },
  rightHip: { x: 0, y: 0, z: 0 },
  leftKnee: { x: 0, y: 0, z: 0 },
  rightKnee: { x: 0, y: 0, z: 0 },
  leftAnkle: { x: 0, y: 0, z: 0 },
  rightAnkle: { x: 0, y: 0, z: 0 },
  leftHeel: { x: 0, y: 0, z: 0 },
  rightHeel: { x: 0, y: 0, z: 0 },
  leftFootIndex: { x: 0, y: 0, z: 0 },
  rightFootIndex: { x: 0, y: 0, z: 0 },
};

let cam;
let detector;
let poses = [];

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();
  background(50);

  frameRate(30);

  cam = createCapture(VIDEO, camReady); // camReady callback function will load and initiate the model
  cam.size(640, 480);
  cam.style("transform", "scale(-1,1)");
  cam.hide();

  initTHREE();
}

function draw() {
  background(0);

  drawMirroredCam(0, 0);

  if (poses.length > 0) {
    for (let p of poses[0].keypoints) {
      push();
      translate(p.x, p.y);
      noStroke();
      fill(0, 255, 0);
      circle(0, 0, 5);
      text(p.name, 10, 10);
      text(p.score.toFixed(2), 10, 25);
      pop();
    }
  }
}

function camReady() {
  console.log("Webcam Ready!");
  loadPoseDetectionModel();
}

function drawMirroredCam(x, y) {
  push();
  // to position the cam image
  translate(x, y);
  // to mirror the webcam image
  translate(cam.width, 0);
  scale(-1, 1);
  // draw the image on the origin position
  image(cam, 0, 0);
  pop();
}

async function loadPoseDetectionModel() {
  const model = poseDetection.SupportedModels.BlazePose;
  const detectorConfig = {
    runtime: "tfjs",
    enableSmoothing: true,
    modelType: "full", // (i.e., 'lite', 'full', 'heavy')
  };
  detector = await poseDetection.createDetector(model, detectorConfig);
  console.log("Model Loaded!");

  // initiate the estimation
  getPoses();
}

async function getPoses() {
  const estimationConfig = { flipHorizontal: true };
  const timestamp = performance.now();
  const results = await detector.estimatePoses(
    cam.elt,
    estimationConfig,
    timestamp
  );

  poses = results;

  // let's flip horizontally
  for (const eachPose of poses) {
    for (const p of eachPose.keypoints) {
      p.x = 640 - p.x; // to mirror
      p.z *= -1; // this should be more natural.
    }
    for (const p of eachPose.keypoints3D) {
      p.x *= -1; // to mirror
      p.z *= -1; // this should be more natural.
    }
  }

  // get the first pose's points
  if (poses.length > 0) {
    const points3D = poses[0].keypoints3D;
    let index = 0;
    for (let partName in pose) {
      let bodyPart = pose[partName];
      const point3D = points3D[index];
      bodyPart.x = point3D.x;
      bodyPart.y = point3D.y;
      bodyPart.z = point3D.z;
      index++;
    }
  }

  // repeat the estimation
  getPoses();
}

function drawSkeleton() {
  push();

  noFill();
  strokeWeight(1);
  stroke(0, 255, 0);

  // face
  beginShape();
  vertex(pose.leftEye.x, pose.leftEye.y, pose.leftEye.z);
  vertex(pose.rightEye.x, pose.rightEye.y, pose.rightEye.z);
  vertex(pose.rightMouth.x, pose.rightMouth.y, pose.rightMouth.z);
  vertex(pose.leftMouth.x, pose.leftMouth.y, pose.leftMouth.z);
  endShape(CLOSE);
  beginShape();
  vertex(pose.leftEar.x, pose.leftEar.y, pose.leftEar.z);
  vertex(pose.nose.x, pose.nose.y, pose.nose.z);
  vertex(pose.rightEar.x, pose.rightEar.y, pose.rightEar.z);
  endShape();

  // torso
  beginShape();
  vertex(pose.leftShoulder.x, pose.leftShoulder.y, pose.leftShoulder.z);
  vertex(pose.rightShoulder.x, pose.rightShoulder.y, pose.rightShoulder.z);
  vertex(pose.rightHip.x, pose.rightHip.y, pose.rightHip.z);
  vertex(pose.leftHip.x, pose.leftHip.y, pose.leftHip.z);
  endShape(CLOSE);

  // left leg
  beginShape();
  vertex(pose.leftHip.x, pose.leftHip.y, pose.leftHip.z);
  vertex(pose.leftKnee.x, pose.leftKnee.y, pose.leftKnee.z);
  vertex(pose.leftHeel.x, pose.leftHeel.y, pose.leftHeel.z);
  vertex(pose.leftFootIndex.x, pose.leftFootIndex.y, pose.leftFootIndex.z);
  endShape();

  // right leg
  beginShape();
  vertex(pose.rightHip.x, pose.rightHip.y, pose.rightHip.z);
  vertex(pose.rightKnee.x, pose.rightKnee.y, pose.rightKnee.z);
  vertex(pose.rightHeel.x, pose.rightHeel.y, pose.rightHeel.z);
  vertex(pose.rightFootIndex.x, pose.rightFootIndex.y, pose.rightFootIndex.z);
  endShape();

  // left arm
  beginShape();
  vertex(pose.leftShoulder.x, pose.leftShoulder.y, pose.leftShoulder.z);
  vertex(pose.leftElbow.x, pose.leftElbow.y, pose.leftElbow.z);
  vertex(pose.leftWrist.x, pose.leftWrist.y, pose.leftWrist.z);
  endShape();

  // right arm
  beginShape();
  vertex(pose.rightShoulder.x, pose.rightShoulder.y, pose.rightShoulder.z);
  vertex(pose.rightElbow.x, pose.rightElbow.y, pose.rightElbow.z);
  vertex(pose.rightWrist.x, pose.rightWrist.y, pose.rightWrist.z);
  endShape();

  // left hand
  beginShape(LINES);
  vertex(pose.leftWrist.x, pose.leftWrist.y, pose.leftWrist.z);
  vertex(pose.leftPinky.x, pose.leftPinky.y, pose.leftPinky.z);
  vertex(pose.leftWrist.x, pose.leftWrist.y, pose.leftWrist.z);
  vertex(pose.leftIndex.x, pose.leftIndex.y, pose.leftIndex.z);
  vertex(pose.leftWrist.x, pose.leftWrist.y, pose.leftWrist.z);
  vertex(pose.leftThumb.x, pose.leftThumb.y, pose.leftThumb.z);
  endShape();

  // right hand
  beginShape(LINES);
  vertex(pose.rightWrist.x, pose.rightWrist.y, pose.rightWrist.z);
  vertex(pose.rightPinky.x, pose.rightPinky.y, pose.rightPinky.z);
  vertex(pose.rightWrist.x, pose.rightWrist.y, pose.rightWrist.z);
  vertex(pose.rightIndex.x, pose.rightIndex.y, pose.rightIndex.z);
  vertex(pose.rightWrist.x, pose.rightWrist.y, pose.rightWrist.z);
  vertex(pose.rightThumb.x, pose.rightThumb.y, pose.rightThumb.z);
  endShape();

  pop();
}

function drawAllPoints() {
  push();

  noStroke();
  fill(255, 0, 255);

  for (let bodyPart in pose) {
    let point = pose[bodyPart];
    push();
    translate(point.x, point.y, point.z);

    box(5);
    pop();
  }

  pop();
}

function drawBox() {
  push();

  noFill();
  stroke(255, 100);
  box(POSE_SCALE);

  pop();
}