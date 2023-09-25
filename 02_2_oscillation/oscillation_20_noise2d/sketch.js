// IMA NYU Shanghai
// the Nature of Code
// MOQN
// Mar 15 2017


function setup() {
  createCanvas(400, 400);
  background(0);
  noStroke();
}


function draw() {
  background(0);

  let resolution = 5;
  for (let y = 0; y < height; y += resolution) {
    for (let x = 0; x < width; x += resolution) {

      let freq1 = (x + frameCount*2) * 0.01;
      let freq2 = (y + frameCount) * 0.01;
      let noiseValue = noise(freq1, freq2);
      let white = map(noiseValue, 0, 1, 0, 255);
      
      fill(white);
      rect(x, y, resolution, resolution);
    }
  }
}