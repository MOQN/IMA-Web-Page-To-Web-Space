// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 22 2017


let vector;

function setup() {
  createCanvas(500, 500);
  fill(255);
  stroke(255);
}

function draw() {
  background(0);
  vector = createVector(mouseX, mouseY);

  ellipse(0, 0, 10, 10);
  ellipse(vector.x, vector.y, 10, 10);

  let magnitude = vector.mag();
  // check the function magSq() as well.
  // https://p5js.org/reference/#/p5.Vector/magSq

  // let's visualize the vector!
  line(0, 0, vector.x, vector.y);
  text(round(magnitude), vector.x+10, vector.y);
}
