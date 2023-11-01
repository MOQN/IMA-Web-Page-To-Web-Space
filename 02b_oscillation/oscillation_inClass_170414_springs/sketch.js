let numOfBalls = 5;
let balls = [];
let springs = [];

function setup() {
  createCanvas(500, 600);

  for (let i = 0; i < numOfBalls; i++) {
    balls.push(new Ball(random(width), random(height)));
  }
  for (let i = 0; i < balls.length; i++) {
    if (i < balls.length - 1) {
      springs.push(new Spring(balls[i], balls[i + 1], 150));
    } else {
      springs.push(new Spring(balls[i], balls[0], 150));
    }
  }
}

function draw() {
  background(0);
  for (let i = 0; i < springs.length; i++) {
    springs[i].update();
    springs[i].display();
  }
  for (let i = 0; i < balls.length; i++) {
    balls[i].update();
    balls[i].drag();
    balls[i].display();
  }
}