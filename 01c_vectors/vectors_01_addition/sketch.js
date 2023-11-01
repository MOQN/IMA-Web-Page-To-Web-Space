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

  let vector1 = createVector(3, 2);
  let vector2 = createVector(4, 1);

  let newVector = p5.Vector.add(vector1, vector2); // static
  vector1.add(vector2); // non-static. the values of vector1 will change.

  console.log(newVector.toString());
  console.log(vector1.toString());

  text("Open the Console window and check the values.", 10, 20);
}


function draw() {
  noLoop();
}
