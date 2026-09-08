let cam;
let canvas;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();

  cam = createCapture(VIDEO);
  cam.parent("container-p5");
  cam.hide();

  initThree(); // ***
}

function draw() {
  noStroke();
  for (let i = 0; i < 5; i++) {
    let x = floor(random(width));
    let y = floor(random(height));
    let dia = random(30, 50);
    let c = cam.get(x, y);
    fill(c);
    circle(x, y, dia);
  }

  texture.needsUpdate = true; // ***
}