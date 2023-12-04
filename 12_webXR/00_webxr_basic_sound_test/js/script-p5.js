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



  // Get a list of available audio input devices
  navigator.mediaDevices.enumerateDevices()
    .then(devices => {
      audioSources = devices.filter(device => device.kind === 'audioinput');
      console.log(audioSources);

      // Assuming the first device in the list is the desired one
      const selectedDevice = audioSources[0];

      // Request access to the selected audio input device
      return navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: { exact: selectedDevice.deviceId }
        }
      });
    })
    .then(stream => {
      // Create a p5.AudioIn object using the selected device's stream
      mic = new p5.AudioIn();
      mic.setStream(stream);
      mic.start();
    })
    .catch(error => {
      console.error('Error accessing audio device:', error);
    });

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
}