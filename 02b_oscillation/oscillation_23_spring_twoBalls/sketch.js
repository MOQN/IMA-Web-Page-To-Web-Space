let ballA, ballB;
let spring;

function setup() {
  createCanvas(500, 600);
  background(0);

  ballA = new Ball(200, 200);
  ballB = new Ball(400, 400);
  spring = new Spring(ballA, ballB, 200);
}

function draw() {
  background(0);

  spring.update();
  spring.display();

  ballA.update();
  ballA.drag();
  ballA.display();

  ballB.update();
  ballB.drag();
  ballB.display();
}