let params = {
  // (add)
};

let room;
let objectGroup; // don't change this variable name. It is also used in script-webxr.js

function setupThree() {
  // renderer additional setup
  renderer.shadowMap.enabled = true;

  // WebXR
  setupWebXR();

  // socket.io
  setupSocket();

  // room
  room = getRoom();
  //scene.add(room);

  // floor
  const floorGeometry = new THREE.PlaneGeometry(6, 6);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25, blending: THREE.CustomBlending, transparent: false });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // lights
  const hemiLight = new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3);
  scene.add(hemiLight);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.camera.top = 3;
  light.shadow.camera.bottom = - 3;
  light.shadow.camera.right = 3;
  light.shadow.camera.left = - 3;
  light.shadow.mapSize.set(4096, 4096);
  scene.add(light);

  // cubes
  objectGroup = new THREE.Group();
  scene.add(objectGroup);

  for (let angle = 0; angle < 360; angle += 30) {
    const object = getBox();

    object.userData.id = angle / 30;

    object.position.x = cos(radians(angle)) * 5;
    object.position.y = 2;
    object.position.z = sin(radians(angle)) * 5;

    object.rotation.x = random(TWO_PI);
    object.rotation.y = random(TWO_PI);
    object.rotation.z = random(TWO_PI);

    object.scale.setScalar(random(0.3, 1.1));

    object.castShadow = true;
    object.receiveShadow = true;

    objectGroup.add(object);
  }
}

function updateThree() {
  if (volume) {
    for (let i = 0; i < objectGroup.children.length; i++) {
      let object = objectGroup.children[i];
      let size = map(volume, 0, 1, 0.3, 2);
      object.scale.set(size, size, size);
    }
  }

  // room.rotation.y += 0.001;

  cleanIntersected();
  intersectObjects(controller1);
  intersectObjects(controller2);
  dollyMove();
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
  const material = new THREE.MeshStandardMaterial({
    color: Math.random() * 0xffffff,
    roughness: 0.7,
    metalness: 0.0
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

