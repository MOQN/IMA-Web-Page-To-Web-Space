let params = {
  // (add)
};

let room;
let cube;

function setupThree() {
  // WebXR
  setupWebXR();

  // room
  room = getRoom();
  scene.add(room);

  // lights
  const hemiLight = new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3);
  scene.add(hemiLight);

  const direcLight = new THREE.DirectionalLight(0xffffff, 3);
  direcLight.position.set(1, 1, 1).normalize();
  scene.add(direcLight);

  // cube
  cube = getBox();
  cube.position.set(0, 4, 0);
  cube.scale.x = 1.5;
  cube.scale.y = 1.5;
  cube.scale.z = 1.5;
  scene.add(cube);

  //
  // Create an AudioListener and connect it to the XR controller
  const listener = new THREE.AudioListener();
  controller.add(listener);

  const audio = new THREE.Audio(listener);
  const analyser = new THREE.AudioAnalyser(audio, 256);
  cube.userData.analyser = analyser;

  // Request access to the microphone
  // navigator.mediaDevices.getUserMedia({ audio: true })
  //   .then((stream) => {
  //     const audioContext = listener.context;
  //     const mediaStreamSource = audioContext.createMediaStreamSource(stream);
  //     audio.setMediaStreamSource(mediaStreamSource);
  //   })
  //   .catch(console.error);

  //
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
      console.log(stream);
      console.log(listener.context);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // const audioContext = listener.context;
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      audio.setMediaStreamSource(mediaStreamSource);
    })
    .catch(error => {
      console.error('Error accessing audio device:', error);
    });
}

function updateThree() {
  const analyser = cube.userData.analyser;
  if (analyser) {
    const dataArray = analyser.getFrequencyData();
    const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;

    // Use the data for your visualization
    // (replace this with your specific audio visualization logic)
    let size = 1 + average / 128 * 2;
    cube.scale.set(size, size, size);
  }

  cube.rotation.x += 0.01;
  cube.rotation.z += 0.005;

  //let size = map(volume, 0, 1, 0.3, 2);





}


///// UTILS /////

function getRoom() {
  const geometry = new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0);
  const materials = new THREE.LineBasicMaterial({
    color: 0xbcbcbc,
    transparent: true,
    opacity: 0.5,
  });
  const mesh = new THREE.LineSegments(geometry, materials);
  return mesh;
}

function getBox() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({
    color: Math.random() * 0xffffff
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

