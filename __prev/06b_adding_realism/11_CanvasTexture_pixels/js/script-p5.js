let img;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  //canvas.hide();

  img = createImage(300, 300);

  initThree();
}

function draw() {
  background(100);

  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      img.pixels[index + 0] = random(255); // red
      img.pixels[index + 1] = random(255); // green
      img.pixels[index + 2] = random(255); // blue
      img.pixels[index + 3] = 255; // alpha
    }
  }
  img.updatePixels();
  image(img, 0, 0);

  texture.needsUpdate = true; // ***
}