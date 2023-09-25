let p;

function setup() {
  createCanvas(500, 600);
  background(0);
  p = new Particle(width / 2, height / 2);
  
  // let's give a random velocity
  p.vel = createVector(random(-15,15),random(-15,15));
}

function draw() {
  background(0);
  
  p.checkBoundaries();
  p.update();
  p.display();

}
