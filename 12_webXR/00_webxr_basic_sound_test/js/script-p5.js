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
      // gui
      for (let i = 0; i < audioSources.length; i++) {
        let audioSource = audioSources[i].label;
        let key = "a" + i;
        params[key] = audioSource;
        gui.add(params, key, audioSource);
      }

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
      // mic.setStream(stream);
      mic.start();
    })
    .catch(error => {
      console.error('Error accessing audio device:', error);
    });

  getLocalStream();

  //mic = new p5.AudioIn()
  //mic.start();
}

function getLocalStream() {
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((stream) => {
      console.log(stream);
      window.localStream = stream; // A
      //window.localAudio.srcObject = stream; // B
      //window.localAudio.autoplay = true; // C
    })
    .catch((err) => {
      console.error(`you got an error: ${err}`);
    });
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