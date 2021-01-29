let p;
let dots = [];

function setup() {
  createCanvas(500, 600);
  background(0);
  p = new Particle(width / 2, height / 2);

}


function draw() {
  background(0);

  let gravity = createVector(0, 1);
  p.applyForce(gravity);

  p.checkBoundaries();
  p.update();
  p.display();


  // dots
  let dotX = width;
  let dotY = p.pos.y / 2;
  dots.push(new Dot(dotX, dotY));

  for (let i = dots.length - 1; i >= 0; i--) {
    let d = dots[i];
    d.update();
    d.display();
    if (d.pos.x < 0) {
      dots.splice(i, 1);
    }
  }
  
  // vector
  p.displayVelocity();
}



function keyPressed() {
  let force = createVector();
  switch (keyCode) {
    case UP_ARROW:
      force = createVector(0, -1);
      break;
    case DOWN_ARROW:
      force = createVector(0, 1);
      break;
    case LEFT_ARROW:
      force = createVector(-1, 0);
      break;
    case RIGHT_ARROW:
      force = createVector(1, 0);
      break;
  }
  p.applyForce(force);
}