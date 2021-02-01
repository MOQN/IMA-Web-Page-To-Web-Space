function setup() {
  createCanvas(600, 300);
  noStroke();
}

function draw() {
  background(100);
  
  let startX = 0;
  let endX = width;
  let percentage = 0.5; // 50%
  let outputX = lerp(startX, endX, percentage);

  ellipse(outputX, height/2, 30, 30);
}

