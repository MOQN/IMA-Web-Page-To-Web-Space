let x = 0;

function setup() {
  createCanvas(600, 300);
  noStroke();
}

function draw() {
  background(100);
  
  let targetX = width;
  let percentage = 0.02; // 2%
  x = lerp(x, targetX, percentage); // update the current position with the lerp's output value.

  ellipse(x, height/2, 30, 30);
}

