let x = 0;
let y = 0;

function setup() {
  createCanvas(500, 500);
  noStroke();
}

function draw() {
  background(100);
  
  let targetX = width;
  let percentage = 0.05; // 5%
  x = lerp(x, mouseX, percentage);
  y = lerp(y, mouseY, percentage);

  ellipse(x, y, 30, 30);
}

