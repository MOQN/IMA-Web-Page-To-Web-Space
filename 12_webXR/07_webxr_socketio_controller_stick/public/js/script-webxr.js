let controller1, controller2;
let controllerGrip1, controllerGrip2;

function setupWebXR() {
  renderer.xr.enabled = true;

  // controller 
  controller1 = renderer.xr.getController(0);
  controller1.addEventListener('selectstart', onSelectStart); // when the trigger is pressed
  controller1.addEventListener('selectend', onSelectEnd); // when the trigger is released
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener('selectstart', onSelectStart);
  controller2.addEventListener('selectend', onSelectEnd);
  scene.add(controller2);

  // controller grip
  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
  scene.add(controllerGrip2);

  // display the XR Button
  document.body.appendChild(XRButton.createButton(renderer));

  // raycaster
  raycaster = new THREE.Raycaster();

  // visualize rays with lines
  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

  const line = new THREE.Line(geometry);
  line.name = 'line';
  line.scale.z = 5;

  controller1.add(line.clone());
  controller2.add(line.clone());
}

function onSelectStart(event) {
  const controller = event.target;
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const object = intersection.object;
    object.material.emissive.b = 1;
    controller.attach(object);
    controller.userData.selected = object;

    sendSocket({ num: object.userData.id }); // ***
  }
  controller.userData.targetRayMode = event.data.targetRayMode;
}

function onSelectEnd(event) {
  const controller = event.target;
  if (controller.userData.selected !== undefined) {
    const object = controller.userData.selected;
    object.material.emissive.b = 0;
    objectGroup.attach(object);
    controller.userData.selected = undefined;
  }
}


const intersected = [];
const tempMatrix = new THREE.Matrix4();

function getIntersections(controller) {
  controller.updateMatrixWorld();
  tempMatrix.identity().extractRotation(controller.matrixWorld);

  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

  return raycaster.intersectObjects(objectGroup.children, false);
}

function intersectObjects(controller) {
  // Do not highlight in mobile-ar
  if (controller.userData.targetRayMode === 'screen') return;
  // Do not highlight when already selected
  if (controller.userData.selected !== undefined) return;

  const line = controller.getObjectByName('line');
  const intersections = getIntersections(controller);

  if (intersections.length > 0) {
    const intersection = intersections[0];
    const object = intersection.object;
    object.material.emissive.r = 1;
    intersected.push(object);
    line.scale.z = intersection.distance;
  } else {
    line.scale.z = 5;
  }
}

function cleanIntersected() {
  while (intersected.length) {
    const object = intersected.pop();
    object.material.emissive.r = 0;
  }
}




///// new attempt /////
/*
// Initialize XR
const xrButton = document.getElementById('xr-button');
let xrSession = null;



function onXRButtonClick() {
  if (!xrSession) {
    navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['thumbstick-controls'] })
      .then(onSessionStarted);
  } else {
    xrSession.end();
  }
}

function onSessionEnded() {
  xrSession = null;
  xrButton.innerHTML = 'Enter VR';
}

// Function to check for controllers
function checkForControllers(time, frame) {
  const controllers = frame.session.inputSources;

  if (controllers && controllers.length > 0) {
    // Assuming there is at least one controller
    const controller = controllers[0];

    // Check if the controller has thumbstick input
    if (controller.gamepad.buttons[0].pressed) {
      // The thumbstick is pressed
      const thumbstickValue = controller.gamepad.axes;

      // thumbstickValue[0] is the X-axis
      // thumbstickValue[1] is the Y-axis

      // Use thumbstick values for your application
      console.log('Thumbstick value:', thumbstickValue);
    }
  }

  // Continue checking for controllers in the next frame
  xrSession.requestAnimationFrame(checkForControllers);
}

// Function to handle XR frame
function onXRFrame(time, frame) {
  const session = frame.session;

  // Update the XRReferenceSpace
  const pose = frame.getViewerPose(xrReferenceSpace);

  if (pose) {
    // Update the camera and controllers based on the pose
    updateCameraAndControllers(pose);

    // Render the scene
    renderer.render(scene, camera);
  }

  // Continue the animation loop
  session.requestAnimationFrame(onXRFrame);
}

// Function to update camera and controllers based on the XR pose
function updateCameraAndControllers(pose) {
  // Update camera position and orientation
  const viewerPose = pose.views[0];
  const cameraMatrix = new THREE.Matrix4().fromArray(viewerPose.transform.matrix);
  camera.matrix.identity();
  camera.applyMatrix4(cameraMatrix);

  // Update controllers if present
  const controllers = xrSession.inputSources;

  if (controllers) {
    for (let i = 0; i < controllers.length; i++) {
      const controller = controllers[i];
      const inputPose = pose.getInputPose(controller.targetRaySpace, xrReferenceSpace);

      if (inputPose) {
        // Update controller position and orientation
        const controllerMatrix = new THREE.Matrix4().fromArray(inputPose.transform.matrix);
        const controllerObject = yourControllerObject; // Get the corresponding Three.js controller object
        controllerObject.matrix.identity();
        controllerObject.applyMatrix4(controllerMatrix);
      }
    }
  }
}
*/

/*
function dollyMove() {
  var handedness = "unknown";

  //determine if we are in an xr session
  const session = renderer.xr.getSession();
  let i = 0;

  if (session) {
    //let xrCamera = renderer.xr.getCamera(camera);
    //xrCamera.getWorldDirection(cameraVector);

    //a check to prevent console errors if only one input source
    //if (isIterable(session.inputSources)) {
    for (const source of session.inputSources) {
      if (source && source.handedness) {
        handedness = source.handedness; //left or right controllers
        sendSocket({ handedness: handedness }); // ***
      }
      if (!source.gamepad) continue;
      const controller = renderer.xr.getController(i++);
      const old = prevGamePads.get(source);
      const data = {
        handedness: handedness,
        buttons: source.gamepad.buttons.map((b) => b.value),
        axes: source.gamepad.axes.slice(0)
      };
      if (old) {
        data.buttons.forEach((value, i) => {
          //handlers for buttons
          if (value !== old.buttons[i] || Math.abs(value) > 0.8) {
            //check if it is 'all the way pushed'
            if (value === 1) {
              //console.log("Button" + i + "Down");
              if (data.handedness == "left") {
                //console.log("Left Paddle Down");
                sendSocket({ new: test });
                if (i == 1) {
                  dolly.rotateY(-THREE.Math.degToRad(1));
                }
                if (i == 3) {
                  //reset teleport to home position
                  dolly.position.x = 0;
                  dolly.position.y = 5;
                  dolly.position.z = 0;
                }
              } else {
                //console.log("Right Paddle Down");
                if (i == 1) {
                  dolly.rotateY(THREE.Math.degToRad(1));
                }
              }
            } else {
              // console.log("Button" + i + "Up");

              if (i == 1) {
                //use the paddle buttons to rotate
                if (data.handedness == "left") {
                  //console.log("Left Paddle Down");
                  dolly.rotateY(-THREE.Math.degToRad(Math.abs(value)));
                } else {
                  //console.log("Right Paddle Down");
                  dolly.rotateY(THREE.Math.degToRad(Math.abs(value)));
                }
              }
            }
          }
        });
        data.axes.forEach((value, i) => {
          //handlers for thumbsticks
          //if thumbstick axis has moved beyond the minimum threshold from center, windows mixed reality seems to wander up to about .17 with no input
          if (Math.abs(value) > 0.2) {
            //set the speedFactor per axis, with acceleration when holding above threshold, up to a max speed
            speedFactor[i] > 1 ? (speedFactor[i] = 1) : (speedFactor[i] *= 1.001);
            console.log(value, speedFactor[i], i);
            if (i == 2) {
              //left and right axis on thumbsticks
              if (data.handedness == "left") {
                // (data.axes[2] > 0) ? console.log('left on left thumbstick') : console.log('right on left thumbstick')

                //move our dolly
                //we reverse the vectors 90degrees so we can do straffing side to side movement
                dolly.position.x -= cameraVector.z * speedFactor[i] * data.axes[2];
                dolly.position.z += cameraVector.x * speedFactor[i] * data.axes[2];

                //provide haptic feedback if available in browser
                if (
                  source.gamepad.hapticActuators &&
                  source.gamepad.hapticActuators[0]
                ) {
                  var pulseStrength = Math.abs(data.axes[2]) + Math.abs(data.axes[3]);
                  if (pulseStrength > 0.75) {
                    pulseStrength = 0.75;
                  }

                  var didPulse = source.gamepad.hapticActuators[0].pulse(
                    pulseStrength,
                    100
                  );
                }
              } else {
                // (data.axes[2] > 0) ? console.log('left on right thumbstick') : console.log('right on right thumbstick')
                dolly.rotateY(-THREE.Math.degToRad(data.axes[2]));
              }
              controls.update();
            }

            if (i == 3) {
              //up and down axis on thumbsticks
              if (data.handedness == "left") {
                // (data.axes[3] > 0) ? console.log('up on left thumbstick') : console.log('down on left thumbstick')
                dolly.position.y -= speedFactor[i] * data.axes[3];
                //provide haptic feedback if available in browser
                if (
                  source.gamepad.hapticActuators &&
                  source.gamepad.hapticActuators[0]
                ) {
                  var pulseStrength = Math.abs(data.axes[3]);
                  if (pulseStrength > 0.75) {
                    pulseStrength = 0.75;
                  }
                  var didPulse = source.gamepad.hapticActuators[0].pulse(
                    pulseStrength,
                    100
                  );
                }
              } else {
                // (data.axes[3] > 0) ? console.log('up on right thumbstick') : console.log('down on right thumbstick')
                dolly.position.x -= cameraVector.x * speedFactor[i] * data.axes[3];
                dolly.position.z -= cameraVector.z * speedFactor[i] * data.axes[3];

                //provide haptic feedback if available in browser
                if (
                  source.gamepad.hapticActuators &&
                  source.gamepad.hapticActuators[0]
                ) {
                  var pulseStrength = Math.abs(data.axes[2]) + Math.abs(data.axes[3]);
                  if (pulseStrength > 0.75) {
                    pulseStrength = 0.75;
                  }
                  var didPulse = source.gamepad.hapticActuators[0].pulse(
                    pulseStrength,
                    100
                  );
                }
              }
              controls.update();
            }
          } else {
            //axis below threshold - reset the speedFactor if it is greater than zero  or 0.025 but below our threshold
            if (Math.abs(value) > 0.025) {
              speedFactor[i] = 0.025;
            }
          }
        });
      }
      ///store this frames data to compate with in the next frame
      prevGamePads.set(source, data);
    }
  }
  //}
}

function isIterable(obj) {  //function to check if object is iterable
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}
*/