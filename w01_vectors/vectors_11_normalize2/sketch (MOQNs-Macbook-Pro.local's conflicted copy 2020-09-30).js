// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 22 2017


var vector;

function setup() {
  createCanvas(500, 500);
  fill(255);

}

function draw() {
  background(0);
  
  vector = createVector(mouseX - width / 2, mouseY - height / 2);

  translate(width / 2, height / 2);
  
  // before normalize()
  stroke(255, 0, 0);
  line(0, 0, vector.x, vector.y); 
  
  vector.normalize(); //change the magnitude 1 (Unit Vector)
  vector.mult(50);
  var magitude = vector.mag();
  
  // after normalize()
  noStroke();
  ellipse(0, 0, 3, 3);
  ellipse(vector.x, vector.y, 10, 10);
  stroke(255);
  line(0, 0, vector.x, vector.y);
  text("1 x " + round(magitude), vector.x + 10, vector.y);
}