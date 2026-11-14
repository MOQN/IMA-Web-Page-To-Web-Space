// This example code is created based on:
// https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation
// https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/selfie_segmentation_mediapipe
// Demo: https://storage.googleapis.com/tfjs-models/demos/body-pix/index.html

let cam;
let segmenter;
let segmentationData = [];
let segmentationWidth = 0;
let segmentationHeight = 0;
let segmentationPending = false;

async function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();
  background(50);

  frameRate(30);

  await loadBodySegmentationModel();

  cam = createCapture(VIDEO);
  cam.size(640, 480);
  cam.hide();

  initThree();
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
      const maskX = min(segmentationWidth - 1, floor(x / cam.width * segmentationWidth));
      const maskY = min(segmentationHeight - 1, floor(y / cam.height * segmentationHeight));
      // The alpha channel stores the probability that this pixel is a person.
      const confidence = segmentationData[(maskX + maskY * segmentationWidth) * 4 + 3] / 255;

      const x3D = random(-0.05, 0.05) + map(x, 0, cam.width, 1.0, -1.0); // mirroring
      const y3D = random(-0.05, 0.05) + map(y, 0, cam.height, 1.0, -1.0); // y axis is flipped in 3D
      const z3D = random(-0.1, 0.1); // y axis is flipped in 3D
      const r = cam.pixels[index + 0] / 255;
      const g = cam.pixels[index + 1] / 255;
      const b = cam.pixels[index + 2] / 255;

      if (confidence >= 0.5) {
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

async function loadBodySegmentationModel() {
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig = {
    runtime: 'mediapipe',
    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation'
  };
  segmenter = await bodySegmentation.createSegmenter(model, segmenterConfig);
}

async function getSegmentation() {
  if (segmentationPending || cam.elt.readyState < 2) return;

  segmentationPending = true;
  const segmentation = await segmenter.segmentPeople(cam.elt, { flipHorizontal: false });
  if (segmentation.length > 0) {
    const result = await segmentation[0].mask.toImageData();
    segmentationData = result.data;
    segmentationWidth = result.width;
    segmentationHeight = result.height;
  } else {
    segmentationData = [];
  }
  segmentationPending = false;
}
