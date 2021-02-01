// IMA NYU Shanghai
// the Nature of Code
// MOQN
// Mar 15 2017


function setup() {
  createCanvas(500, 600);
  background(0);
  fill(255);
  noStroke();
}


function draw() {
  background(0);

  for (let x = 0; x < width; x++) {
    let freq = x * 0.01;
    let amp = 100;
    let sinValue = sin(freq) * amp;  // sin(freq) * amp
    
    let y = height/2 + sinValue;
    ellipse(x, y, 2, 2);
  }

}