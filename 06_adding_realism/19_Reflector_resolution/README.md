# Reflector: resolution and performance

This duplicates the original Reflector scene. Open `index.html` through a
local web server and compare it with `../18_Reflector/index.html`.

- `pixelRatioCap`: caps the device pixel ratio used by the reflection targets.
- `resolutionScale`: scales reflection width and height, not the main canvas.
- `reflectionSize`: shows each mirror's actual target dimensions.
- Resizing the window also resizes both targets.

Defaults: pixel ratio cap 1, resolution scale 0.5. On a DPR 2 screen,
each target has 1/16 as many pixels as the original example. This reduces
target storage and pixel work, but does not eliminate the extra scene renders.

Try scales 0.25, 0.5, and 1. Compare reflection sharpness and FPS.
To reproduce the original target size, use scale 1 and a cap at least as
large as your screen's device pixel ratio.
