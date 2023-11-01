// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 20 2017

let RESOLUTION = 40;
let currVector;

function setup() {
  createCanvas(600, 600);
  currVector = createVector(0, 0);

  // display vectors
  background(0);
  drawGrid();

  addVector(4, 4);
  subVector(1, 3);
  //addVector(3, 2);
  //subVector(1,1);
  //multVector(2);
  
  drawSumVector();
}


function draw() {
  noLoop();
}








// Don't worry about the functions below

function addVector(x, y) {
  // calculation
  let newVector = createVector(x, y);
  let prevVector = currVector.copy();
  currVector.add(newVector);
  // display the result
  let c = color(random(255), random(255), random(255));
  stroke(c);
  strokeWeight(2);
  line(prevVector.x * RESOLUTION, prevVector.y * RESOLUTION,
    currVector.x * RESOLUTION, currVector.y * RESOLUTION);
  fill(c);
  ellipse(currVector.x * RESOLUTION, currVector.y * RESOLUTION, 10, 10);
}

function subVector(x, y) {
  // calculation
  let newVector = createVector(x, y);
  let prevVector = currVector.copy();
  currVector.sub(newVector);
  // display the result
  let c = color(random(255), random(255), random(255));
  stroke(c);
  strokeWeight(2);
  line(prevVector.x * RESOLUTION, prevVector.y * RESOLUTION,
    currVector.x * RESOLUTION, currVector.y * RESOLUTION);
  fill(c);
  ellipse(currVector.x * RESOLUTION, currVector.y * RESOLUTION, 10, 10);
}

function multVector(val) {
  // calculation
  let prevVector = currVector.copy();
  currVector.mult(val);
  // display the result
  let c = color(random(255), random(255), random(255));
  stroke(c);
  strokeWeight(2);
  line(prevVector.x * RESOLUTION, prevVector.y * RESOLUTION,
    currVector.x * RESOLUTION, currVector.y * RESOLUTION);
  fill(c);
  ellipse(currVector.x * RESOLUTION, currVector.y * RESOLUTION, 10, 10);
}

function divVector(val) {
  if (val === 0) {
    console.log("!!! Cannot divide by 0 !!!");
    return;
  }
  // calculation
  let prevVector = currVector.copy();
  currVector.div(val);
  // display the result
  let c = color(random(255), random(255), random(255));
  stroke(c);
  strokeWeight(2);
  line(prevVector.x * RESOLUTION, prevVector.y * RESOLUTION,
    currVector.x * RESOLUTION, currVector.y * RESOLUTION);
  fill(c);
  ellipse(currVector.x * RESOLUTION, currVector.y * RESOLUTION, 10, 10);
}

function drawSumVector() {
  let c = color(255, 0, 0);
  stroke(c);
  strokeWeight(5);
  line(0, 0, currVector.x * RESOLUTION, currVector.y * RESOLUTION);
  fill(c);
  ellipse(currVector.x * RESOLUTION, currVector.y * RESOLUTION, 10, 10);
  printVector(currVector);
}

function drawGrid() {
  translate(width / 2, height / 2);
  // lines on x
  for (let x = -width; x < width; x += RESOLUTION) {
    stroke(100);
    strokeWeight(1);
    line(x, -height, x, height);
    fill(150);
    noStroke();
    text(x / RESOLUTION, x + 5, 15);
  }
  // lines on y
  for (let y = -height; y < height; y += RESOLUTION) {
    stroke(100);
    strokeWeight(1);
    line(-width, y, width, y);
    fill(150);
    noStroke();
    text(y / RESOLUTION, 5, y + 15);
  }
  // draw the origin 
  stroke(150);
  strokeWeight(2);
  line(0, -height, 0, height);
  line(-width, 0, width, 0);
}

function printVector(v) {
  console.log("(" + v.x + ", " + v.y + ")");
}