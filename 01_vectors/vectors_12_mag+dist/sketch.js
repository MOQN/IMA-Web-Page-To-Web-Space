// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 20 2017


let vector1, vector2;

function setup() {
  createCanvas(500, 500);
  fill(255);
  stroke(255);
}

function draw() {
  background(0);
  vector1 = createVector(width / 2, height / 2);
  vector2 = createVector(mouseX, mouseY);

  ellipse(vector1.x, vector1.y, 3, 3);
  ellipse(vector2.x, vector2.y, 10, 10);

  let vector3 = p5.Vector.sub(vector2, vector1);
  let magitude = vector3.mag();
  // check the function magSq() as well.
  // https://p5js.org/reference/#/p5.Vector/magSq
  
  // let's visualize vector3!
  push();
  translate(vector1.x, vector1.y);
  line(0, 0, vector3.x, vector3.y);
  text("mag() = " + round(magitude), vector3.x+10, vector3.y);
  pop();
  
  // we also have dist() function
  let distance = dist(vector1.x, vector1.y, vector2.x, vector2.y);
  text("dist() = " + round(distance), 20, 20);
  
  // vector has dist() function as well. I know this is confusing :|
  console.log(vector1.dist(vector2)); // this won't change the vector1 values.
  console.log(vector1.toString());
}