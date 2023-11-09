// Bodypose: MoveNet on p5.js web editor
// https://editor.p5js.org/ml5/sketches/c8sl_hGmN

let pose = {
  nose: { x: 0, y: 0, score: 0 },
  left_eye: { x: 0, y: 0, score: 0 },
  right_eye: { x: 0, y: 0, score: 0 },
  left_ear: { x: 0, y: 0, score: 0 },
  right_ear: { x: 0, y: 0, score: 0 },
  left_shoulder: { x: 0, y: 0, score: 0 },
  right_shoulder: { x: 0, y: 0, score: 0 },
  left_elbow: { x: 0, y: 0, score: 0 },
  right_elbow: { x: 0, y: 0, score: 0 },
  left_wrist: { x: 0, y: 0, score: 0 },
  right_wrist: { x: 0, y: 0, score: 0 },
  left_hip: { x: 0, y: 0, score: 0 },
  right_hip: { x: 0, y: 0, score: 0 },
  left_knee: { x: 0, y: 0, score: 0 },
  right_knee: { x: 0, y: 0, score: 0 },
  left_ankle: { x: 0, y: 0, score: 0 },
  right_ankle: { x: 0, y: 0, score: 0 },
};

let video;
let bodypose;
let poses = [];

function preload() {
  bodypose = ml5.bodypose();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");

  video = createCapture(VIDEO);
  video.size(width, height);

  bodypose.detectStart(video, gotPoses);

  initThree(); // ***
}

function draw() {
  background(50);

  drawMirroredCam();

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      // Only draw a circle if the keypoint's confidence is greater than 0.1
      if (keypoint.score > 0.1) {
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  }
}

function gotPoses(results) {
  // let's flip horizontally
  for (const pose of results) {
    for (const p of pose.keypoints) {
      p.x = video.width - p.x;
    }
  }
  poses = results;

  // update newPose with lerp()
  if (results.length > 0) {
    newPose = results[0].keypoints;
    const amount = 0.25;
    let index = 0;
    for (let point in pose) {
      pose[point].x = lerp(pose[point].x, newPose[index].x, amount);
      pose[point].y = lerp(pose[point].y, newPose[index].y, amount);
      pose[point].score = newPose[index].score;
      index++;
    }
  }
}

function drawMirroredCam(x, y, w) {
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