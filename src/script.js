import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var WalkingCube = function() {
  this.scene = new THREE.Scene();
  that = this;
}

WalkingCube.prototype.init = function() {
  this.createCamera();
  this.createRenderer();
  this.createControls();

  this.createCube();
  this.createFloor();

  this.createLights();

  this.render();
}

WalkingCube.prototype.createCamera = function() {
  // Create a camera and translate it
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
  this.camera.position.set(1, 1, 10);
  //this.camera.updateProjectionMatrix();
  this.camera.lookAt(this.scene.position);
}

WalkingCube.prototype.createRenderer = function() {
  this.renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.setClearColor(0x020202);
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  this.renderer.shadowMapSoft = true;
  document.body.appendChild(this.renderer.domElement);
}

WalkingCube.prototype.createControls = function() {
  // Add OrbitControls to allow the user to move in the scene
  this.controls = new OrbitControls(this.camera, this.renderer.domElement);
}

WalkingCube.prototype.createCube = function() {
  this.isUpright = true;
  // Create a cube with basic geometry & material
  const geometry = new THREE.BoxGeometry(5, 5, 1);
  const material = new THREE.MeshStandardMaterial({color: 0x66ccff});

  this.cube = new THREE.Mesh(geometry, material);
  this.cube.castShadow = true;
  this.scene.add(this.cube);

  const pivotPointHelperGeometry = new THREE.BoxGeometry(1,1,1);
  const material2 = new THREE.MeshStandardMaterial({color: 0xff66cc});
  this.pivotPointHelper = new THREE.Mesh(pivotPointHelperGeometry, material2);
  this.scene.add(this.pivotPointHelper);
  this.pivotPointPos = new THREE.Vector3(-2.5, -2.5, .5)
  this.pivotPointHelper.position.set(this.pivotPointPos.x, this.pivotPointPos.y, this.pivotPointPos.z);

  this.targetRotation = THREE.Math.degToRad(90);
}

WalkingCube.prototype.createFloor = function() {
  var geometry2 = new THREE.PlaneGeometry(500, 500); //use PlaneBufferGeometry  ? todo
  var material2 = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
  var floor = new THREE.Mesh(geometry2, material2);
  floor.material.side = THREE.DoubleSide;
  floor.position.y =-2.5;
  floor.rotation.x = 90*Math.PI/180;
  floor.rotation.y = 0;
  floor.rotation.z = 0;
  floor.doubleSided = true;
  floor.receiveShadow = true;
  this.scene.add(floor);
};

WalkingCube.prototype.createLights = function(){
  this.scene.add(new THREE.AmbientLight(0x666666, 1));
  var shadowLight = new THREE.DirectionalLight(0xffffff, 0.5);
  shadowLight.position.set(0, 60, 0);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.far = 100;
  this.scene.add(shadowLight);
};

WalkingCube.prototype.walk = function() {
  if(this.cube.rotation.x < this.targetRotation) {
    rotateAboutPoint(this.cube, this.pivotPointPos, new THREE.Vector3(1, 0, 0), THREE.Math.degToRad(1));
    // this.cube.position.applyAxisAngle(new THREE.Vector3(1,0,0), THREE.Math.degToRad(150.0)); // rotate the POSITION
    // this.cube.rotateOnAxis(new THREE.Vector3(1,0,0), THREE.Math.degToRad(150.0))
    // console.log(this.cube.rotation.x, THREE.Math.radToDeg(this.cube.rotation.x));
  } else {
    this.cube.rotation.x = this.targetRotation;
    this.targetRotation = this.targetRotation + THREE.Math.degToRad(90);

    this.pivotPointPos.setZ(this.pivotPointPos.z + 5);
    this.pivotPointHelper.position.set(this.pivotPointPos.x, this.pivotPointPos.y, this.pivotPointPos.z);
    this.isUpright = !this.isUpright;
  }
}

WalkingCube.prototype.render = function() {
  this.walk();

  //requestAnimationFrame(this.render.bind(this));
  this.renderer.setAnimationLoop(this.render.bind(this));
  this.renderer.render(this.scene, this.camera);
}

var walkingCube = new WalkingCube();
walkingCube.init();

// obj - your object (THREE.Object3D or derived)
// point - the point of rotation (THREE.Vector3)
// axis - the axis of rotation (normalized THREE.Vector3)
// theta - radian value of rotation
function rotateAboutPoint(obj, point, axis, theta){
  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  // obj.rotateOnAxis(axis, theta); // rotate the OBJECT
  // obj.rotateX(theta);
  obj.rotation.x += theta;
}
