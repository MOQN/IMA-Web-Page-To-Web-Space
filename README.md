# Web Page to Web Space | Fall 2026
Interactive Media Arts (IMA) at NYU Shanghai

## Class Materials
* [Course Notes](https://docs.google.com/document/d/1_KAc3IYll3QHzGT2VizRUSOwpKSDmDN88llLNoY5vVU/edit?usp=sharing)
* [Example Codes on Web Editor](https://docs.google.com/document/d/1SwlymiC-GtLWn3lierr-RxoAMVOi-Rd8rHhorRjIm38/edit?usp=sharing)

### Model hierarchy examples (06)
Open these examples through a local web server. OBJ and GLTF examples that modify
meshes use `traverse()` to process every level of the model hierarchy. The 30
example folders are numbered consecutively from 01 to 30.

* [OBJ: all meshes](./06_adding_realism/20_OBJLoader/): preserves nested groups, replacing materials only on meshes.
* [OBJ points: all meshes](./06_adding_realism/21_OBJLoader_Points/): collects vertices from nested meshes and applies their parent transforms before building one point cloud.
* [OBJ morph: all meshes](./06_adding_realism/22_OBJLoader_Points_morph/): uses those transformed vertices as morph targets; values above 1 extrapolate beyond the model.
* [GLTF: original materials](./06_adding_realism/24_GLTFLoader/): keeps the complete scene's imported materials and textures, with ambient and directional lighting.
* [GLTF: light and shadow](./06_adding_realism/25_GLTFLoader_LightShadow/): preserves imported materials, casts directional-light shadows from all nested meshes onto a 10000 x 10000 floor, and places the floor just below the model's initial bounds.
* [GLTF: shared material](./06_adding_realism/26_GLTFLoader_Material/): replaces all mesh materials with one shared `MeshNormalMaterial`, with a wireframe control.
* [GLTF OOP](./06_adding_realism/27_GLTFLoader_OOP/): loads once and creates 100 `Model` objects around the world origin with independent movement, rotation, and random-colored materials, plus fog and light controls like the OBJ OOP example. Each model rotates around its initial bounding-box center using a wrapper group. `SkeletonUtils.clone` keeps skeletons independent too; animation clips are not played.
* [GLTF points](./06_adding_realism/28_GLTFLoader_Points/): turns all nested meshes into a single point cloud, with a point-size control.
* [GLTF points morph](./06_adding_realism/29_GLTFLoader_Points_morph/): morphs a sphere-shaped point cloud into the model; `percent` runs from 0 to 3, with the model at 1.
* [GLTF cube refraction](./06_adding_realism/30_GLTFLoader_textureCube_refraction/): shares one `MeshPhongMaterial` across all meshes, using the DeepSpace cube map and refraction controls. `MixOperation`, a refraction ratio of 0.8, and reflectivity of 1 make the environment colors and distortion easier to see.

The OBJ and GLTF point examples use static mesh positions, not animated or skinned
poses. Parent transforms are baked into the collected vertices; the GLTF point
examples use the same 1000x display scale as example 24.
The morph examples refresh their bounding spheres after changing positions.
The 06 examples use frame-based animation, with GLTF models rotating by 0.01
radians per frame. Rotation speed therefore depends on the frame rate; elapsed
time is used only to display FPS. The base 24 example preserves
the imported appearance. The 26 material example replaces
each mesh's imported materials and textures with a single shared `MeshNormalMaterial`,
which does not respond to lighting. After loading, their wireframe controls bind
directly to that material, without an update function or recreating materials.
The refraction and OOP examples also visit nested meshes.

The HDR examples now import `HDRLoader`. In Three.js r185, the deprecated
`RGBELoader` is a compatibility subclass of `HDRLoader` (deprecated since r180).
The `.hdr` assets and texture settings are unchanged.

## Course Information
* Instructor: J.H. Moon
  * Office: Room W839
  * Office Hours: by appointment via [Slack](https://join.slack.com/t/imaallclasses/shared_invite/zt-22cypuwo1-EsljeaLOP_ks6ZZn_Fwzfw) or email.
* Class meeting days and times: Tuesday and Thursday, 6:45 to 8:00 PM
* Classroom: N304
* [Syllabus](https://docs.google.com/document/d/14vZ0bdSUIb3AAjqV1bl6_tYKCzKU81rlszq5GFeNxlY/edit?usp=sharing)
* [Resources](https://docs.google.com/document/d/14vZ0bdSUIb3AAjqV1bl6_tYKCzKU81rlszq5GFeNxlY/edit#bookmark=id.7hn1xbffa92p)
* [Course Schedule Overview](https://docs.google.com/document/d/14vZ0bdSUIb3AAjqV1bl6_tYKCzKU81rlszq5GFeNxlY/edit#bookmark=id.y6mbbsoi6t21)
* [Course Policies](https://docs.google.com/document/d/14vZ0bdSUIb3AAjqV1bl6_tYKCzKU81rlszq5GFeNxlY/edit#bookmark=id.azhyd49tdw8p)

### Description
The Internet and mobile devices have evolved rapidly over the last half century. Computing systems used to take up the whole room or building. Today, even the latest mobile phones hold powerful hardware comparable to laptop computers. The push towards developing Virtual or Augmented Reality (VR/AR) platforms may soon allow us to communicate virtually through mobile devices, without the need for complex hardware or our current tethered approach. Due to recent adjustments and development of technology and social media, people are more inclined to communicate virtually rather than face-to-face. In the near future, VR/AR platforms and the three dimensional (3D) contents may eventually overpower 2D images and textual content. Web pages will become Web Spaces. 

Web Page to Web Space is a course that explores virtual interactive experience in the context of Virtual Embodiment, Virtual Space and Telepresence. Students will investigate new possible ways of using the Web to create new immersive environments in a web platform, by utilizing algorithmic 3D animation and server-side programming. This is an advanced course with technically challenging concepts with three.js and node.js and suitable for students with prior knowledge in visual programming.

 
### Overview and Learning Outcomes
This course will address the fundamentals of programming, such as Object-Oriented Programming (OOP). Advanced visual programming will be gradually applied by creating 3D objects and manipulating their properties and behaviors. By the end of the course, students will be able to create their own virtual space on the Web that connects people in different physical locations and provides interactive experiences. Both practical and creative applications are to be investigated as students are challenged to design their own solutions.
 
#### Student Learning Outcomes
Upon completion of this course, students will be able to:
* practice and produce the fundamentals of programming;
* demonstrate Object-Oriented Programming and integrate why/how to use the concept into practical applications;
* combine fundamentals of web development with visual programming techniques to produce creative web pages;
* expand and apply knowledge and experience in 3D animations;
* utilize comprehensively fundamentals of visual programming in 3D and apply various methods in three.js to algorithmic animations;
* visualize and simulate virtual environment and objects in 3D;
* apply server-side programming in virtual environment to create a dynamic and interactive artifact;
* construct innovative, practical and/or interactive interfaces on the web;
* produce internet artworks and/or practical web applications by utilizing a combination of concepts and techniques discussed and demonstrated throughout the * duration of the course, and;
* develop and discuss meaningful and effective user interactions, and recognize the context of Virtual Space and Telepresence.
