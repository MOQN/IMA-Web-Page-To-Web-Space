// Bodypose: Blazepose on p5.js web editor
// https://editor.p5js.org/ml5/sketches/OukJYAJAb

let pose = {
  nose: { x: 0, y: 0, z: 0, score: 0 },
  left_eye_inner: { x: 0, y: 0, z: 0, score: 0 },
  left_eye: { x: 0, y: 0, z: 0, score: 0 },
  left_eye_outer: { x: 0, y: 0, z: 0, score: 0 },
  right_eye_inner: { x: 0, y: 0, z: 0, score: 0 },
  right_eye: { x: 0, y: 0, z: 0, score: 0 },
  right_eye_outer: { x: 0, y: 0, z: 0, score: 0 },
  left_ear: { x: 0, y: 0, z: 0, score: 0 },
  right_ear: { x: 0, y: 0, z: 0, score: 0 },
  mouth_left: { x: 0, y: 0, z: 0, score: 0 },
  mouth_right: { x: 0, y: 0, z: 0, score: 0 },
  left_shoulder: { x: 0, y: 0, z: 0, score: 0 },
  right_shoulder: { x: 0, y: 0, z: 0, score: 0 },
  left_elbow: { x: 0, y: 0, z: 0, score: 0 },
  right_elbow: { x: 0, y: 0, z: 0, score: 0 },
  left_wrist: { x: 0, y: 0, z: 0, score: 0 },
  right_wrist: { x: 0, y: 0, z: 0, score: 0 },
  left_pinky: { x: 0, y: 0, z: 0, score: 0 },
  right_pinky: { x: 0, y: 0, z: 0, score: 0 },
  left_index: { x: 0, y: 0, z: 0, score: 0 },
  right_index: { x: 0, y: 0, z: 0, score: 0 },
  left_thumb: { x: 0, y: 0, z: 0, score: 0 },
  right_thumb: { x: 0, y: 0, z: 0, score: 0 },
  left_hip: { x: 0, y: 0, z: 0, score: 0 },
  right_hip: { x: 0, y: 0, z: 0, score: 0 },
  left_knee: { x: 0, y: 0, z: 0, score: 0 },
  right_knee: { x: 0, y: 0, z: 0, score: 0 },
  left_ankle: { x: 0, y: 0, z: 0, score: 0 },
  right_ankle: { x: 0, y: 0, z: 0, score: 0 },
  left_heel: { x: 0, y: 0, z: 0, score: 0 },
  right_heel: { x: 0, y: 0, z: 0, score: 0 },
  left_foot_index: { x: 0, y: 0, z: 0, score: 0 },
  right_foot_index: { x: 0, y: 0, z: 0, score: 0 },
};

let video;
let bodypose;
let poses = [];

function preload() {
  bodypose = ml5.bodypose("BlazePose"); // ***
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
      pose[point].z = lerp(pose[point].z, newPose[index].z, amount);
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