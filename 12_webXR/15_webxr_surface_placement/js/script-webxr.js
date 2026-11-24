let updatePlacement;

function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");

  document.body.append(ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }));
  updatePlacement = setupPlacement();
}

function setupPlacement() {
  const reticle = getReticle();
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  const scale = new THREE.Vector3();
  let hitSource;
  let activeSession;

  function place() {
    if (!reticle.visible) return;
    reticle.matrix.decompose(box.position, box.quaternion, scale);
    box.translateY(0.12);
    box.visible = true;
  }

  renderer.xr.addEventListener("sessionstart", async function() {
    const session = renderer.xr.getSession();
    activeSession = session;
    session.addEventListener("select", place);
    session.addEventListener("end", function() {
      session.removeEventListener("select", place);
      activeSession = undefined;
      hitSource = undefined;
      reticle.visible = box.visible = false;
    }, { once: true });

    try {
      const viewerSpace = await session.requestReferenceSpace("viewer");
      if (activeSession !== session) return;
      const source = await session.requestHitTestSource({ space: viewerSpace });
      if (activeSession === session) hitSource = source;
    } catch (error) {
      if (activeSession === session) showInstruction("Could not start surface tracking.");
    }
  });

  return function updatePlacement(frame) {
    const referenceSpace = renderer.xr.getReferenceSpace();
    if (!hitSource || !referenceSpace) return;
    const hits = frame.getHitTestResults(hitSource);
    const hit = hits[0];
    let pose;
    if (hit !== null && hit !== undefined) {
      pose = hit.getPose(referenceSpace);
    }
    reticle.visible = Boolean(pose);
    if (pose) {
      reticle.matrix.fromArray(pose.transform.matrix);
      reticle.matrixWorldNeedsUpdate = true;
    }
  };
}

function getReticle() {
  const geometry = new THREE.RingGeometry(0.06, 0.08, 32).rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({ color: 0x62efb0, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
