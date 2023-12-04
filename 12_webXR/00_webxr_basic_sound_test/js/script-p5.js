let beat, song;
let mic;
let volume;

function preload() {
  beat = loadSound("assets/beat.mp3");
  song = loadSound("assets/song.mp3");
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  initThree(); // ***

  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  volume = mic.getLevel();
}

function keyPressed() {
  if (key == " ") {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
}