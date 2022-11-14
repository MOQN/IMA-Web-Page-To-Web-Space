//https://medium.com/threejs/using-es6-modules-in-three-js-7621f98d72d5
//https://www.npmjs.com/package/p5
//https://www.npmjs.com/package/node-p5
import * as p5 from 'p5';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

// this is not included..?
// import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

/*
function sketch(p) {
    p.setup = () => {
        p.createCanvas(200, 200);
    }
    p.draw = () => {
        p.background(50);
        p.text('hello world!', 50, 100);
    }
}

let p5Instance = new p5.createSketch(sketch);
*/

/*
new p5(function(p5)
{
  p5.setup = fucntion()
  {
    p5.createCanvas(400,400);
  }

  p5.draw = function(){
    p5.background(55);
  }
});
*/

console.log(p5); // ????? This is an empty module...

const scene = new THREE.Scene();
console.log(scene);
console.log(OrbitControls);
console.log(Stats);


