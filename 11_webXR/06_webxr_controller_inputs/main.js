import { showInstruction } from "./script-three.js";
import * as THREE from "three";
import { XRButton } from "three/addons/webxr/XRButton.js";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js";

const params = { fps: 0 };
let timer, time = 0, delta = 0, frame = 0;

let status;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10131b);
scene.add(new THREE.HemisphereLight(0xffffff, 0x526080, 2));

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(2, 5, 3);
scene.add(keyLight);

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 50);
camera.position.set(0, 1.6, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(XRButton.createButton(renderer));

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({ color: 0x222938, roughness: 0.9 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
scene.add(floor);

const targets = [];
for (let index = 0; index < 8; index += 1) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.35, 0.35),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(index / 8, 0.65, 0.52),
      emissive: 0x000000,
      roughness: 0.45,
    }),
  );
  mesh.position.set((index % 4 - 1.5) * 0.75, 1.25, -1.5 - Math.floor(index / 4) * 0.7);
  scene.add(mesh);
  targets.push(mesh);
}

const controllerModelFactory = new XRControllerModelFactory();
const controllers = [];
for (let index = 0; index < 2; index += 1) {
  const controller = renderer.xr.getController(index);
  controller.userData.lastAction = "Waiting";
  controller.addEventListener("connected", ({ data }) => {
    controller.userData.inputSource = data;
  });
  controller.addEventListener("disconnected", () => {
    controller.userData.inputSource = null;
  });
  controller.addEventListener("selectstart", () => {
    controller.userData.lastAction = "select pressed";
  });
  controller.addEventListener("select", () => {
    controller.userData.lastAction = "select done";
    const target = getTarget(controller);
    if (target) {
      target.material.color.setHSL(Math.random(), 0.7, 0.55);
      selectCount += 1;
    }
  });
  controller.addEventListener("selectend", () => {
    controller.userData.lastAction = "select released";
  });
  controller.addEventListener("squeezestart", () => {
    controller.userData.lastAction = "squeeze started";
  });
  controller.addEventListener("squeeze", () => {
    controller.userData.lastAction = "squeeze done";
  });
  controller.addEventListener("squeezeend", () => {
    controller.userData.lastAction = "squeeze released";
  });

  const ray = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -1),
    ]),
    new THREE.LineBasicMaterial({ color: 0xb7d8ff }),
  );
  ray.scale.z = 4;
  controller.add(ray);
  scene.add(controller);

  const grip = renderer.xr.getControllerGrip(index);
  grip.add(controllerModelFactory.createControllerModel(grip));
  scene.add(grip);
  controllers.push(controller);
}

const raycaster = new THREE.Raycaster();
const rotation = new THREE.Matrix4();
let selectCount = 0;

function getTarget(controller) {
  controller.updateMatrixWorld(true);
  rotation.identity().extractRotation(controller.matrixWorld);
  raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
  raycaster.ray.direction.set(0, 0, -1).applyMatrix4(rotation);
  return raycaster.intersectObjects(targets, false)[0]?.object ?? null;
}

function updateStatus() {
  const session = renderer.xr.getSession();
  if (!session) {
    status.textContent = "Waiting for XR. Connect the controllers on your headset.";
    return;
  }

  const sources = [...session.inputSources];
  if (sources.length === 0) {
    status.textContent = "No input. Connect a controller or try the hand tracking demo.";
    return;
  }

  status.textContent = sources.map((source, index) => {
    const gamepad = source.gamepad;
    const buttons = gamepad
      ? gamepad.buttons.map((button) => button.value.toFixed(1)).join(",")
      : "none";
    const axes = gamepad
      ? gamepad.axes.map((axis) => axis.toFixed(1)).join(",")
      : "none";
    const controller = controllers.find((item) => item.userData.inputSource === source);
    return [
      `${index + 1}. ${source.handedness} / ${source.targetRayMode}`,
      `profile: ${source.profiles.join(", ") || "none"}`,
      `gamepad buttons: ${buttons} | axes: ${axes}`,
      `action: ${controller?.userData.lastAction ?? "Connecting"}`,
    ].join("\n");
  }).join("\n\n") + `\n\nselect count: ${selectCount}`;
}

setupThree(); // ***

if (navigator.xr) {
  status.textContent = "Checking immersive-vr support...";
  navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
    status.textContent = supported
      ? "immersive-vr is ready. Press the XR start button."
      : "This browser or device cannot use immersive-vr.";
  }).catch((error) => {
    status.textContent = `Could not check XR support: ${error.message}`;
  });
} else {
  status.textContent = "WebXR is not ready. Use HTTPS or localhost and a device that supports XR.";
}

timer = new THREE.Timer();
timer.connect(document);
timer.reset();

renderer.setAnimationLoop(() => {
  frame++;
  timer.update();
  time = timer.getElapsed() * 1000; // milliseconds
  delta = timer.getDelta();
  params.fps = delta > 0 ? 1 / delta : 0;

  for (const target of targets) target.material.emissive.setHex(0x000000);

  if (renderer.xr.isPresenting) {
    for (const controller of controllers) {
      const target = getTarget(controller);
      if (target) target.material.emissive.setHex(0x303030);
    }
    updateStatus();
  }

  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});


function setupThree() {
  status = document.createElement("pre");
  status.style.whiteSpace = "pre-wrap";
  status.style.overflowWrap = "anywhere";
  status.textContent = "Checking WebXR support...";
  showInstruction("Point at an object and press the trigger to change its color. Try the grip and stick too!").appendChild(status);
}
