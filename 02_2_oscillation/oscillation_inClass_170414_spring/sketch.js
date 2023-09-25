let mBall;
let mSpring;

function setup() {
  createCanvas(500, 600);

  mBall = new Ball(width / 2 + 150, height / 2 + 150);
  mSpring = new Spring(width / 2, height / 2, 100);
}

function draw() {
  background(0);

  let gravity = createVector(0, 2);
  mBall.applyForce(gravity);

  mSpring.connect(mBall);
  mBall.update();
  mBall.drag();
  
  mSpring.display(mBall);
  mBall.display();
}





