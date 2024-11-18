let handPose;
let video;

let hands = [];

let handData = {
  x: 0,
  y: 0,
  isPinching: false
}

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  initThree(); // ***
}

function draw() {
  background(100);

  //image(video, 0, 0);

  if (hands.length > 0) {
    let indexFinger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);
    if (distance < 80) {
      handData.isPinching = true;
    } else {
      handData.isPinching = false;
    }

    handData.x = map(indexFinger.x, 0, width, -1, 1);
    handData.y = map(indexFinger.y, 0, height, 1, -1);

    /*
    noStroke();
    fill(0, 255, 0);
    circle(indexFinger.x, indexFinger.y, 10);
    circle(thumb.x, thumb.y, 10);

    if (handData.isPinching) {
      fill(255, 0, 0);
      circle(indexFinger.x, indexFinger.y, 50);
    }
      */
  }

}

function gotHands(results) {
  //console.log(results);
  hands = results;
}