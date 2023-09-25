// IMA NYU Shanghai
// the Nature of Code
// MOQN
// Mar 15 2017


function setup() {
  createCanvas(500, 600);
  background(0);
  noStroke();
}


function draw() {
  background(0);

  for (let x = 0; x < width; x++) {
    let freq = x * 0.05; // here!
    let amp = 1;
    let sinValue = sin(freq) * amp;  // sin(freq) * amp
    let white = map(sinValue, -1, 1, 0, 255);
    fill(white);
    rect(x, height/2, 1, 1);
  }

}