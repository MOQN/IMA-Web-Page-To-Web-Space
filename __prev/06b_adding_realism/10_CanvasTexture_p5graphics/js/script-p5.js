let graphics;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();

  graphics = createGraphics(300, 300); // ***

  initThree(); // ***
}

function draw() {
  background(100);

  let x = map(sin(frameCount * 0.01), -1, 1, 0, graphics.width);
  graphics.background(255, 255, 0);
  graphics.ellipse(x, graphics.height / 2, 200, 200);
  image(graphics, 0, 0); // uncomment this line and see the graphics in the canvas

  texture.needsUpdate = true; // ***
}