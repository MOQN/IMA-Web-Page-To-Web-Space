// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 20 2017

/**
 * This example contains errors as it was created to explain common mistakes.
 * Let's analyze what kind of errors there are and why they are incorrect.
 * */


function setup() {
  createCanvas(500, 500);

  let vector1 = createVector(3, 1);
  let vector2 = createVector(5, 2);

  vector1.mult(vector2); // WRONG!
  console.log(vector1.toString());

  text("Open the Console window and check the values.", 10, 20);
}

function draw() {
  noLoop();
}
