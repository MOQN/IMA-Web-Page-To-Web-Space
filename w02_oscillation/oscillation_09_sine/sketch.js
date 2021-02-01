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

  /*   sin(freq or angle) * amp   */
  let sinValue = sin(frameCount * 0.05);
  let x = 0;
  let y = sinValue * 200;

  translate(width / 2, height / 2);
  ellipse(x, y, 50, 50);
  text(round(sinValue), x+40,y);
}