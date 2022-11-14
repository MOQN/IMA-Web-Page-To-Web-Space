import * as THREE from 'three';

const scene = new THREE.Scene();
//console.log(scene);

// define __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// express app
import express from 'express';
const app = express();

app.use(express.static("public"));
app.use("/p5/", express.static("node_modules/p5/lib"));
app.use("/three/", express.static("node_modules/three/build"));
app.use('/jsm/', express.static("node_modules/three/examples/jsm"));

app.get("/", function(request, response){
  response.sendFile(__dirname + "/views/index.html");
});

// HTTP Server
import http from "http";
// const hostname = "127.0.0.1" // localhost
const port = 3000;
const server = http.createServer(app);
server.listen(port, function() {
  console.log("Server is running! Port: " + port);
});