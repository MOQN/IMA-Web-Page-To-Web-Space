let ball;
let spring;

function setup() {
  createCanvas(500, 600);
  background(0);

  ball = new Ball(width / 2 + 100, height / 2 + 200);
  spring = new Spring(width / 2, height / 2, 100);
}

function draw() {
  background(0);

  spring.connect(ball);

  let gravity = createVector(0, 5);
  ball.applyForce(gravity);
  ball.update();
  ball.drag();
  
  spring.display(ball);
  ball.display();
}