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

  let vector = createVector(3, 1);
  let newVector = p5.Vector.div(vector, 3); // static
  vector.div(3); // non-static. the values of vector1 will change.

  console.log(newVector.toString());
  console.log(vector.toString());

  text("Open the Console window and check the values.", 10, 20);
}


function draw() {
  noLoop();
}
