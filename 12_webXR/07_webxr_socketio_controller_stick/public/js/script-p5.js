let beat, song;
let mic;
let volume;
let audioSources = [];

function preload() {
  beat = loadSound("assets/beat.mp3");
  song = loadSound("assets/song.mp3");
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("container-p5");
  canvas.hide();

  initThree(); // ***

  //mic = new p5.AudioIn()
  //mic.start();
}

function draw() {
  volume = mic ? mic.getLevel() : 0;
}

function keyPressed() {
  if (key == " ") {
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
  const keyNumber = parseInt(key);
  /*
  if (keyNumber >= 0 && keyNumber < audioSources.length) {
    const selectedDevice = audioSources[keyNumber];
    navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: { exact: selectedDevice.deviceId }
      }
    })
      .then(stream => {
        mic.setStream(stream);
      })
      .catch(error => {
        console.error('Error accessing audio device:', error);
      });
  }
  */
  if (keyNumber >= 0 && keyNumber < 9) {
    sendSocket({ num: keyNumber });
  }
}

function playSound(num) {
  beat.rate(map(num, 0, 9, 0.1, 2));
  beat.play();
}