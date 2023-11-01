function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(0);
  
  orbitControl();
  // manual 
  // let rotX = map(mouseY, 0, height, -PI/4, PI/4);
  // let rotY = map(mouseX, 0, width, -PI/2, PI/2);
  // rotateX(rotX);
  // rotateY(rotY);
  
  rotateY(frameCount * 0.01);
  
  let resolution = 15;
  for (let z = -width/2; z < width/2; z += resolution) {
    for (let x = -width/2; x < width/2; x += resolution) {
      let freq1 = (frameCount + x) * 0.005;
      let freq2 = (frameCount + z) * 0.005;
      let amp = -120;
      let noiseVal = noise(freq1, freq2) * amp;
      let y = 200 + noiseVal;
      
      drawBox(x,y,z,5);
    }
  }
}


function drawBox(x,y,z,s) {
  push();
  translate(x,y,z);
  box(s);
  pop();
}


