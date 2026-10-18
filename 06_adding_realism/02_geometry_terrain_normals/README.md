# Terrain: position and normals

Open `index.html` through a local web server.

- Left: displaced vertices with the original plane normals.
- Right: identical vertices with `computeVertexNormals()`.
- Toggle `recomputeNormals` to compare shading without changing the shape.
- Toggle `wireframe` to see the same mesh structure on both sides.

`positionAttributes.needsUpdate` uploads changed positions; it does not
recalculate normals. The geometry is static, so normals are calculated only
at setup or when the comparison control changes.
