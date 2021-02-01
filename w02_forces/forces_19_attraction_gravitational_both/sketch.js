let C_GRAVITY = 20;
let p1, p2;


function setup() {
  createCanvas(800, 500);
  background(0);

  p1 = new Particle(100, height/2, 5); // (x,y,mass)
  p2 = new Particle(width-100, height/2, 15); // (x,y,mass)

}


function draw() {
  background(0);

  p1.applyAttraction(p2);
  p1.update();
  p1.display();

  p2.applyAttraction(p1);
  p2.update();
  p2.display();
}