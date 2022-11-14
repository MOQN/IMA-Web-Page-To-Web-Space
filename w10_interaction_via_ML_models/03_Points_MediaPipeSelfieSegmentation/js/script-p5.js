// This example code is created based on:
// https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation
// https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/selfie_segmentation_mediapipe
// Demo: https://storage.googleapis.com/tfjs-models/demos/body-pix/index.html

let cam;
let segmenter;
let segmentationData = [];

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();
  background(50);
  
  frameRate(30);

  cam = createCapture(VIDEO, camReady);
  cam.size(640, 480);
  cam.hide();

  initTHREE();
}

function draw() {
  getSegmentation();

  background(0);
  image(cam, 0, 0);

  noStroke();
  fill(255);
  const gridSize = 30;
  cam.loadPixels();
  for (let y = 0; y < cam.height; y += gridSize) {
    for (let x = 0; x < cam.width; x += gridSize) {
      const index = (x + y * cam.width) * 4;
      const segIndex = segmentationData[index];

      text(segIndex, x, y);

      const x3D = random(-0.05, 0.05) + map(x, 0, cam.width, 1.0, -1.0); // mirroring
      const y3D = random(-0.05, 0.05) + map(y, 0, cam.width, 1.0, -1.0); // y axis is flipped in 3D
      const z3D = random(-0.1, 0.1); // y axis is flipped in 3D
      const r = cam.pixels[index + 0] / 255;
      const g = cam.pixels[index + 1] / 255;
      const b = cam.pixels[index + 2] / 255;

      if (segIndex != 0) {
        // generate a particle here!
        const scaleAdj = WORLD_HALF;
        const tParticle = new Particle()
          .setPosition(x3D * scaleAdj, y3D * scaleAdj, z3D * scaleAdj)
          .setColor(r, g, b)
          .setVelocity(0, random(-0.2, -0.1), random(-0.1, 0.1))
        particles.push(tParticle);
      }
    }
  }
}

function camReady() {
  console.log("Webcam Ready!");
  loadBodySegmentationModel();
}

async function loadBodySegmentationModel() {
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation'
  };
  segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
  console.log("Model Loaded!");
}

async function getSegmentation() {
  if (segmenter == undefined) return;

  const segmentationConfig = {
    flipHorizontal: false
  };
  const segmentation = await segmenter.segmentPeople(cam.elt, segmentationConfig);

  if (segmentation.length > 0) {
    let result = await segmentation[0].mask.toImageData();
    segmentationData = result.data;;
  }
}