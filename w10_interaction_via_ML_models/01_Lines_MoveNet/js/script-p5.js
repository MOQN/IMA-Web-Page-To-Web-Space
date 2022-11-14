// This example code is created based on:
// https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet

const LIGHTNING_CONFIG = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, //default
  scoreThreshold: 0.3
};

const THUNDER_CONFIG = {
  modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  scoreThreshold: 0.3,
};

const MULTIPOSE_CONFIG = {
  modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  scoreThreshold: 0.3,
  enableTracking: true
};

let pose = {
  nose: { x: 0, y: 0 },
  leftEye: { x: 0, y: 0 },
  rightEye: { x: 0, y: 0 },
  leftEar: { x: 0, y: 0 },
  rightEar: { x: 0, y: 0 },
  leftShoulder: { x: 0, y: 0 },
  rightShoulder: { x: 0, y: 0 },
  leftElbow: { x: 0, y: 0 },
  rightElbow: { x: 0, y: 0 },
  leftWrist: { x: 0, y: 0 },
  rightWrist: { x: 0, y: 0 },
  leftHip: { x: 0, y: 0 },
  rightHip: { x: 0, y: 0 },
  leftKnee: { x: 0, y: 0 },
  rightKnee: { x: 0, y: 0 },
  leftAnkle: { x: 0, y: 0 },
  rightAnkle: { x: 0, y: 0 },
};

let cam;
let detector;
let newPose;
let poses = [];

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();
  background(50);

  frameRate(30);

  cam = createCapture(VIDEO, camReady);
  cam.size(640, 480);
  cam.style('transform', 'scale(-1,1)');
  cam.hide();

  initTHREE();
}

function draw() {
  background(0);

  // update the estimation
  getPoses();

  drawMirroredCam(0, 0);

  if (newPose != undefined) {
    for (let p of newPose) {
      push();
      translate(p.x, p.y);
      noStroke();
      fill(0, 255, 0);
      circle(0, 0, 5);
      text(p.name, 10, 10);
      text(p.score.toFixed(2), 10, 25);
      pop();
    }

    let amount = 0.25;
    let index = 0;
    for (let point in pose) {
      pose[point].x = lerp(pose[point].x, newPose[index].x, amount);
      pose[point].y = lerp(pose[point].y, newPose[index].y, amount);
      index++;
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
  const model = poseDetection.SupportedModels.MoveNet;
  const detectorConfig = LIGHTNING_CONFIG;
  detector = await poseDetection.createDetector(model, detectorConfig);
  console.log("Model Loaded!");
}

async function getPoses() {
  if (detector == undefined) return;

  const estimationConfig = {};
  const results = await detector.estimatePoses(
    cam.elt,
    estimationConfig
  );

  // let's flip horizontally
  for (const pose of results) {
    for (const p of pose.keypoints) {
      p.x = cam.width - p.x;
    }
  }

  // get the first pose and poses array
  poses = results;
  newPose = results[0].keypoints;
}