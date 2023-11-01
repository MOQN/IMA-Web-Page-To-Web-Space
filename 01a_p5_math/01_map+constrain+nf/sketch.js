function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  let red = map(mouseX, 0, width, 0, 255); // from position to color range.
  let green = map(mouseY, 0, height, 255, 0);  // the range can be flipped!
  let blue = map(mouseX, 0, width, 255, 0);
  blue = constrain(blue, 0, 255);

  background(red, green, blue);
  fill(255);
  text(`R: ${red}`, width/2, height/2);
  text(`G: ${nf(green, 3, 3)}`, width/2, height/2 + 30);
  text(`B: ${blue}`, width/2, height/2 + 60);
}

