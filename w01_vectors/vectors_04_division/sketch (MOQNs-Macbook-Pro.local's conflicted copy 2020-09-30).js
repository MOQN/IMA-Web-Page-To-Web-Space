// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 20 2017

/**
 * Please have a look at the book page 54.
 * Static vs. Non-Static Functions
 * */


function setup() {
  createCanvas(500, 500);

  var vector = createVector(3, 1);
  var newVector = p5.Vector.div(vector, 3); // static
  vector.div(3); // non-static. the values of vector1 will change.

  print(newVector.toString());
  print(vector.toString());
}


function draw() {
  noLoop();
}