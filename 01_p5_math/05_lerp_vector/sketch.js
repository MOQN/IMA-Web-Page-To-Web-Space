let pos;

function setup() {
  createCanvas(500, 500);
  noStroke();

  pos = createVector();
}

function draw() {
  background(100);
  
  let percentage = 0.05; // 5%
  let targetVector = createVector(mouseX, mouseY);
  pos = p5.Vector.lerp(pos, targetVector, percentage);

  ellipse(pos.x, pos.y, 30, 30);
}

