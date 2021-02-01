let p;

function setup() {
  createCanvas(500, 600);
  background(0);

  p = new Pendulum(width / 2, height / 2 - 100, 200);
}

function draw() {
  background(0);
  p.update();
  p.display();
}