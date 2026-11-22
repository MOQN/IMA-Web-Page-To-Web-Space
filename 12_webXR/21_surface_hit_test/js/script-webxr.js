let updatePlacement;

function setupWebXR() {
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType("local");
  document.body.append(ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] }));
  updatePlacement = setupPlacement();
}

function setupPlacement() {
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.06, 0.08, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x62efb0, side: THREE.DoubleSide }),
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  let hitSource;
  let activeSession;

  renderer.xr.addEventListener("sessionstart", async function() {
    const session = renderer.xr.getSession();
    activeSession = session;
    session.addEventListener("end", function() {
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
