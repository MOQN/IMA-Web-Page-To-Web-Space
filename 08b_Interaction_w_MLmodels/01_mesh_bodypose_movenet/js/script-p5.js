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

async function setup() {
  bodypose = await ml5.bodyPose();

  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodypose.detectStart(video, gotPoses);

  initThree(); // ***
}

function draw() {
  if (time - lastPoseTime > POSE_TIMEOUT_MS) clearPoseConfidence();
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
  lastPoseTime = time;

  // Mirror a copy for the preview; do not mutate the model's input data.
  poses = [];
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    let copiedResult = {};
    for (let key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        copiedResult[key] = result[key];
      }
    }

    copiedResult.keypoints = [];
    for (let j = 0; j < result.keypoints.length; j++) {
      let point = result.keypoints[j];
      let copiedPoint = {};
      for (let property in point) {
        if (Object.prototype.hasOwnProperty.call(point, property)) {
          copiedPoint[property] = point[property];
        }
      }
      copiedPoint.x = video.width - point.x;
      copiedResult.keypoints.push(copiedPoint);
    }
    poses.push(copiedResult);
  }
  const points = results[0].keypoints || [];
  const amount = 0.25;
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    let name = point.name;
    if (!name) {
      const originalPoint = results[0].keypoints[index];
      name = undefined;
      if (originalPoint !== null && originalPoint !== undefined) {
        name = originalPoint.name;
      }
    }
    const target = pose[name];
    if (!target) continue;
    let confidence = point.confidence;
    if (confidence === null || confidence === undefined) {
      const originalPoint = results[0].keypoints[index];
      confidence = undefined;
      if (originalPoint !== null && originalPoint !== undefined) {
        confidence = originalPoint.confidence;
      }
      if (confidence === null || confidence === undefined) {
        confidence = 0;
      }
    }
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