import * as THREE from "three";
import { XRButton } from "three/addons/webxr/XRButton.js";

const params = { fps: 0 };
let timer, time = 0, delta = 0, frame = 0;

const status = document.querySelector("#status");
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
document.body.appendChild(XRButton.createButton(renderer, {
  optionalFeatures: ["hand-tracking"],
}));

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({ color: 0x222938, roughness: 0.9 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.02;
scene.add(floor);

const jointGeometry = new THREE.SphereGeometry(1, 10, 8);
const orbGeometry = new THREE.SphereGeometry(0.055, 20, 16);
const orbMeshes = [];
const hands = new Map();
const pinchEnterDistance = 0.025;
const pinchExitDistance = 0.045;
let handCount = 0;
let pinchCount = 0;

function makeHandVisual(inputSource) {
  const group = new THREE.Group();
  const jointMaterial = new THREE.MeshStandardMaterial({
    color: inputSource.handedness === "left" ? 0x62d7ff : 0xffa05f,
    roughness: 0.4,
  });
  const joints = new Map();

  for (const [name] of inputSource.hand) {
    const marker = new THREE.Mesh(jointGeometry, jointMaterial);
    marker.name = String(name);
    marker.visible = false;
    group.add(marker);
    joints.set(name, marker);
  }

  scene.add(group);
  return { group, joints, jointMaterial, isPinching: false };
}

function removeHandVisual(visual) {
  scene.remove(visual.group);
  visual.jointMaterial.dispose();
}

function makePinchOrb(position, handedness) {
  const material = new THREE.MeshStandardMaterial({
    color: handedness === "left" ? 0x62d7ff : 0xffa05f,
    roughness: 0.35,
    metalness: 0.1,
  });
  const orb = new THREE.Mesh(orbGeometry, material);
  orb.position.copy(position);
  scene.add(orb);
  orbMeshes.push(orb);

  if (orbMeshes.length > 50) {
    const oldest = orbMeshes.shift();
    scene.remove(oldest);
    oldest.material.dispose();
  }

  pinchCount += 1;
}

function updateHands(frame) {
  const referenceSpace = renderer.xr.getReferenceSpace();
  if (!referenceSpace) return;

  for (const visual of hands.values()) {
    for (const marker of visual.joints.values()) marker.visible = false;
  }

  const activeHands = new Set();
  handCount = 0;

  for (const inputSource of frame.session.inputSources) {
    if (!inputSource.hand) continue;

    activeHands.add(inputSource);
    handCount += 1;
    let visual = hands.get(inputSource);
    if (!visual) {
      visual = makeHandVisual(inputSource);
      hands.set(inputSource, visual);
    }

    const jointPoses = new Map();
    for (const [jointName, jointSpace] of inputSource.hand) {
      const pose = frame.getJointPose(jointSpace, referenceSpace);
      const marker = visual.joints.get(jointName);
      if (!pose || !marker) continue;

      marker.position.set(
        pose.transform.position.x,
        pose.transform.position.y,
        pose.transform.position.z,
      );
      marker.scale.setScalar(Math.max(pose.radius ?? 0.008, 0.004));
      marker.visible = true;
      jointPoses.set(jointName, pose);
    }

    const thumb = jointPoses.get("thumb-tip");
    const index = jointPoses.get("index-finger-tip");
    if (!thumb || !index) {
      visual.isPinching = false;
      continue;
    }

    const thumbPosition = new THREE.Vector3(
      thumb.transform.position.x,
      thumb.transform.position.y,
      thumb.transform.position.z,
    );
    const indexPosition = new THREE.Vector3(
      index.transform.position.x,
      index.transform.position.y,
      index.transform.position.z,
    );
    const distance = thumbPosition.distanceTo(indexPosition);
    const isPinching = visual.isPinching
      ? distance < pinchExitDistance
      : distance < pinchEnterDistance;

    if (isPinching && !visual.isPinching) {
      makePinchOrb(thumbPosition.add(indexPosition).multiplyScalar(0.5), inputSource.handedness);
    }
    visual.isPinching = isPinching;
  }

  for (const [inputSource, visual] of hands) {
    if (activeHands.has(inputSource)) continue;
    removeHandVisual(visual);
    hands.delete(inputSource);
  }
}

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

renderer.xr.addEventListener("sessionend", () => {
  for (const visual of hands.values()) removeHandVisual(visual);
  hands.clear();
});

timer = new THREE.Timer();
timer.connect(document);
timer.reset();

renderer.setAnimationLoop((_time, xrFrame) => {
  frame++;
  timer.update();
  time = timer.getElapsed() * 1000; // milliseconds
  delta = timer.getDelta();
  params.fps = delta > 0 ? 1 / delta : 0;

  if (xrFrame) {
    updateHands(xrFrame);
    status.textContent = handCount
      ? `Tracked hands: ${handCount}\nBalls made by pinching: ${pinchCount}\nPinch start/end distance: ${pinchEnterDistance * 100} / ${pinchExitDistance * 100} cm`
      : "No hand input. Allow hand-tracking and use a device that supports it.";
  }

  renderer.render(scene, camera);
});

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
