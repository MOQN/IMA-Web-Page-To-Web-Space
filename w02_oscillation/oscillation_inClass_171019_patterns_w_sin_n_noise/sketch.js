function setup() {
  createCanvas(600, 600);
  background(0);
  noStroke();
}

function draw() {


  for (let angle = 0; angle < 360; angle += 72) {
    push();
    translate(width / 2, height / 2);
    rotate( radians(angle) + frameCount * 0.01); // angle
    
    let freq, amp;
    
    freq = frameCount * 0.02;
    amp = 300;
    let noiseVal = noise(freq) * amp;

    freq = frameCount * 0.035;
    amp = noiseVal;
    let distance = sin(freq) * amp;
    
    stroke(255, 10);
    line(0, 0, distance, 0);
    ellipse(distance, 0, 1, 1);
    
    pop();
  }
}