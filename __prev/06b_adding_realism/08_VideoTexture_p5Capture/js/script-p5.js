let cam;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  cam = createCapture(VIDEO);
  cam.parent("container-p5");
  cam.hide();

  initThree(); // ***
}

function draw() {
  background(100);
  noLoop();
}