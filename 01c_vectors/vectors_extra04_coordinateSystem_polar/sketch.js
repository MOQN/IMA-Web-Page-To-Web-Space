// IMA NYU Shanghai
// The Nature of Code
// MOQN
// Feb 21 2017

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);

  translate(width / 2, height / 2);
  drawCoordSystem(color(255, 0, 0, 150));

  drawCircle(200, PI/4); // drawCircle(radialDistance, angle);

  /*
  let polar = true; // change this value and compare between two
  if (polar) {
    // polar: angle, distance
    for (let i = 0; i < 500; i++) {
      drawCircle(random(200), random(PI*2));
    }
  } else {
    // cartesian: x, y
    for (let i = 0; i < 500; i++) {
      let x = random(-200, 200);
      let y = random(-200, 200);
      ellipse(x, y, 10, 10);
    }
  }
  */
}

function drawCircle(rDist, angle) {
  let x = cos(angle) * rDist;
  let y = sin(angle) * rDist;

  push();
  noStroke();
  fill(255);
  ellipse(x, y, 10, 10);
  stroke(255, 100);
  noFill();
  line(0, 0, x, y);
  ellipse(0, 0, rDist * 2, rDist * 2);
  pop();
}

function drawCoordSystem(c) {
  push();
  stroke(c);
  noFill();
  rectMode(CENTER);
  rect(0, 0, width, height);
  strokeWeight(3);
  line(-width * 2, 0, width * 2, 0);
  line(0, -height * 2, 0, height * 2);
  noStroke();
  fill(c)
  text("(0,0)", 10, 20);
  pop();
}
