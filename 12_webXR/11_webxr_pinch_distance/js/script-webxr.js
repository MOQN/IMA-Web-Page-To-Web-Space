let updateHands;

function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local-floor");

  const button = createHandSessionButton(renderer);
  document.body.append(button);
  updateHands = setupHands();
}

function createHandSessionButton(renderer) {
  const button = document.createElement("button");
  button.className = "hand-session";
  button.textContent = "CHECKING VR SUPPORT";
  button.disabled = true;
  let session;
  let status;

  async function checkSupport() {
    try {
      let supported;
      if (navigator.xr !== null && navigator.xr !== undefined) {
        supported = await navigator.xr.isSessionSupported("immersive-vr");
      }
      button.disabled = !supported;

      if (supported) {
        button.textContent = "ENTER VR WITH HANDS";
      } else {
        button.textContent = "XR NOT SUPPORTED";
      }
    } catch {
      button.textContent = "XR NOT SUPPORTED";
    }
  }

  button.addEventListener("click", async function() {
    button.disabled = true;
    try {
      if (session) {
        await session.end();
      } else {
        if (status) {
          status.remove();
          status = undefined;
        }
        session = await navigator.xr.requestSession("immersive-vr", {
          requiredFeatures: ["local-floor", "hand-tracking"],
        });
        session.addEventListener("end", function() {
          session = undefined;
          button.textContent = "ENTER VR WITH HANDS";
        }, { once: true });
        await renderer.xr.setSession(session);
        button.textContent = "EXIT VR";
      }
    } catch (error) {
      if (session) await session.end().catch(function() {});
      if (!status) {
        status = showInstruction("VR hand tracking could not start. Check headset and browser support.");
        status.style.top = "auto";
        status.style.bottom = "80px";
      }
    } finally {
      button.disabled = false;
    }
  });

  checkSupport();
  return button;
}

function setupHands() {
  const fingertip = getFingertip();
  const thumb = fingertip.clone();
  thumb.material = new THREE.MeshBasicMaterial({ color: 0xff9d55 });
  fingertip.visible = thumb.visible = false;
  scene.add(fingertip, thumb);

  const pinchStart = 0.025;
  const pinchEnd = 0.045;
  let activeInput;
  let pinching = false;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const label = getLabel(texture);
  label.position.set(0, 1.63, -0.55);
  label.scale.set(0.48, 0.12, 1);
  scene.add(label);
  let previousText;

  function show(text) {
    if (text === previousText) return;
    previousText = text;
    context.fillStyle = "#14202d";
    context.fillRect(0, 0, 512, 128);
    context.fillStyle = "#ffffff";
    context.font = "40px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 64, 490);
    texture.needsUpdate = true;
  }

  function reset() {
    fingertip.visible = thumb.visible = false;
    pinching = false;
    box.material.color.set(0x55aaff);
    show("Show one hand");
  }
  reset();
  renderer.xr.addEventListener("sessionend", function() {
    activeInput = undefined;
    reset();
  });

  return function updateHands(frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    if (!referenceSpace) return;
    let input;
    for (const source of frame.session.inputSources) {
      if (source === activeInput) {
        input = source;
        break;
      }
      if (!input && source.hand) {
        input = source;
      }
    }

    if (input !== activeInput) {
      reset();
      activeInput = input;
    }
    if (!input) return;

    const hand = input.hand;
    const indexPose = frame.getJointPose(hand.get("index-finger-tip"), referenceSpace);
    const thumbPose = frame.getJointPose(hand.get("thumb-tip"), referenceSpace);
    if (!indexPose || !thumbPose) {
      reset();
      return;
    }

    fingertip.visible = true;
    fingertip.position.copy(indexPose.transform.position);

    thumb.visible = true;
    thumb.position.copy(thumbPose.transform.position);
    const distance = fingertip.position.distanceTo(thumb.position);
    const wasPinching = pinching;

    if (wasPinching) {
      pinching = distance < pinchEnd;
    } else {
      pinching = distance < pinchStart;
    }

    if (pinching && !wasPinching) {
      console.log("Pinch started.");
    } else if (!pinching && wasPinching) {
      console.log("Pinch ended.");
    }

    if (pinching) {
      box.material.color.set(0xffdc67);
    } else {
      box.material.color.set(0x55aaff);
    }

    if (pinching) {
      show(`${(distance * 100).toFixed(1)} cm · ${"Pinch"}`);
    } else {
      show(`${(distance * 100).toFixed(1)} cm · ${"Open"}`);
    }
  };
}

function getFingertip() {
  const geometry = new THREE.SphereGeometry(0.012, 16, 12);
  const material = new THREE.MeshBasicMaterial({ color: 0x65d4ff });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function getLabel(texture) {
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  return sprite;
}
