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

      let freq1 = x * 0.08;
      let sinValue1 = sin(freq1);
      let w1 = map(sinValue1, -1, 1, 0, 255);

      let freq2 = y * 0.1;
      let sinValue2 = sin(freq2);
      let w2 = map(sinValue2, -1, 1, 0, 255);

      let white = (w1 + w2) / 2;
      fill(white);
      rect(x, y, resolution, resolution);
    }
  }
}