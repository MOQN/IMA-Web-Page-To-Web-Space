let circlePoints = [];
let starPoints = [];

function setup() {
  createCanvas(800, 300);

  generateCirclePoints(200, height/2, 100);
  generateStarPoints(width - 200, height/2, 100);
}

function draw() {
  background(100);
  stroke(0, 255, 0);

  // draw the circle shape
  fill(255, 0, 0);
  for (let pt of circlePoints) {
    ellipse(pt.x, pt.y, 5, 5);
  }

  // draw the star shape
  fill(0, 0, 255);
  for (let pt of starPoints) {
    ellipse(pt.x, pt.y, 5, 5);
  }

  // draw the morph shape
  let percentage = map(mouseX, 0, width, 0.0, 1.0);
  fill(0, 255, 0, 100);
  beginShape();
  for (let i=0; i<starPoints.length; i++) {
    let circlePt = circlePoints[i];
    let starPt = starPoints[i];

    let x = lerp(circlePt.x, starPt.x, percentage);
    let y = lerp(circlePt.y, starPt.y, percentage);
    vertex(x, y);

    //let output = new p5.Vector.lerp(circlePt, starPt, percentage);
    //vertex(output.x, output.y);
  }
  endShape(CLOSE);
}

function generateCirclePoints(x, y, rad) {
  for (let angle = 0; angle < 360; angle += 36) {
    let vector = new p5.Vector.fromAngle(radians(angle));
    vector.mult(rad);
    vector.add( createVector(x, y) );
    circlePoints.push( vector );
  }
}

function generateStarPoints(x, y, rad) {
  for (let angle = 0; angle < 360; angle += 36) {
    let vector = new p5.Vector.fromAngle(radians(angle));
    vector.mult(rad);
    if (angle % 72 == 0) {
      vector.mult(0.4);
    }
    vector.add( createVector(x, y) );
    starPoints.push( vector );
  }
}
