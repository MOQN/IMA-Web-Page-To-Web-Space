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
      let xOff = x * 0.015 + frameCount * 0.010;
      let yOff = y * 0.015 + frameCount * 0.010;
      let brightness = noise(xOff, yOff) * 255;
      img.pixels[index + 0] = brightness; // red
      img.pixels[index + 1] = brightness; // green
      img.pixels[index + 2] = brightness; // blue
      img.pixels[index + 3] = 255; // alpha
    }
  }
  img.updatePixels();
  image(img, 0, 0); // uncomment this line and see the img in the canvas

  texture.needsUpdate = true; // ***
}