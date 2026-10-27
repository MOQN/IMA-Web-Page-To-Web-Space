// Bodypose: MoveNet on p5.js web editor
// https://editor.p5js.org/ml5/sketches/c8sl_hGmN

let pose = {
  nose: { x: 0, y: 0, confidence: 0 },
  left_eye: { x: 0, y: 0, confidence: 0 },
  right_eye: { x: 0, y: 0, confidence: 0 },
  left_ear: { x: 0, y: 0, confidence: 0 },
  right_ear: { x: 0, y: 0, confidence: 0 },
  left_shoulder: { x: 0, y: 0, confidence: 0 },
  right_shoulder: { x: 0, y: 0, confidence: 0 },
  left_elbow: { x: 0, y: 0, confidence: 0 },
  right_elbow: { x: 0, y: 0, confidence: 0 },
  left_wrist: { x: 0, y: 0, confidence: 0 },
  right_wrist: { x: 0, y: 0, confidence: 0 },
  left_hip: { x: 0, y: 0, confidence: 0 },
  right_hip: { x: 0, y: 0, confidence: 0 },
  left_knee: { x: 0, y: 0, confidence: 0 },
  right_knee: { x: 0, y: 0, confidence: 0 },
  left_ankle: { x: 0, y: 0, confidence: 0 },
  right_ankle: { x: 0, y: 0, confidence: 0 },
};

let video;
let bodypose;
let poses = [];
let lastPoseTime = -Infinity;
const POSE_TIMEOUT_MS = 500;

function clearPoseConfidence() {
  for (const point of Object.values(pose)) point.confidence = 0;
}


function preload() {
  bodypose = ml5.bodyPose();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodypose.detectStart(video, gotPoses);

  initThree(); // ***
}

function draw() {
  if (performance.now() - lastPoseTime > POSE_TIMEOUT_MS) clearPoseConfidence();
  background(50);

  drawMirroredCam();

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is greater than 0.1
      if (keypoint.confidence > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function gotPoses(results) {
  poses = results;
  clearPoseConfidence();
  if (!results.length) return;
  lastPoseTime = performance.now();

  // Mirror a copy for the preview; do not mutate the model's input data.
  poses = results.map(result => ({
    ...result,
    keypoints: result.keypoints.map(point => ({ ...point, x: video.width - point.x }))
  }));
  const points = results[0].keypoints || [];
  const amount = 0.25;
  for (const [index, point] of points.entries()) {
    const name = point.name || results[0].keypoints[index]?.name;
    const target = pose[name];
    if (!target) continue;
    const confidence = point.confidence ?? results[0].keypoints[index]?.confidence ?? 0;
    if (confidence <= 0.1 || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
    target.x = lerp(target.x, video.width - point.x, amount);
    target.y = lerp(target.y, point.y, amount);

    target.confidence = confidence;
  }
}

function drawMirroredCam(x = 0, y = 0, w) {
  if (w == undefined) w = video.width;

  push();
  // to position the video image
  translate(x, y);
  // to mirror the webvideo image
  translate(w, 0);
  scale(-1, 1);
  // draw the image on the origin position
  image(video, 0, 0);
  pop();
}