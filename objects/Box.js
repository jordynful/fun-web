import * as THREE from 'three'
import {
  Mesh
} from "./Mesh"
import {
  MathUtils,
  Spherical,
  Vector3
} from "three";

class Box extends Mesh {

  constructor({
    width,
    height,
    depth,
    color = '#00ff00',
    velocity = {
      x: 0,
      y: 0,
      z: 0
    },
    position = {
      x: 0,
      y: 0,
      z: 0
    },
    zAccel = false,
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color
      }))

    //from first persopn
    //var _onMouseMove = bind(this, this.onMouseMove);
    this.lat = 0.0;
    this.lon = 0.0;

    // var lookDirection = new Vector3();
    // var spherical = new Spherical();
    // var target = new Vector3();

    // this.mouseX = 0;
    // this.mouseY = 0;

    this.viewHalfX = 0;
    this.viewHalfY = 0;
    //above is from first person


    this.movementSpeed = 0.01;
    this.lookSpeed = 0.005;
    this.position.set(position.x, position.y, position.z)

    this.height = height
    this.width = width
    this.depth = depth
    this.color = color

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2

    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.velocity = velocity
    this.gravity = -0.002

    // this.zAccel = zAccel

  }

  updateSides() {
    this.right = this.position.x + this.width / 2
    this.left = this.position.x - this.width / 2

    this.bottom = this.position.y - this.height / 2
    this.top = this.position.y + this.height / 2

    this.front = this.position.z + this.depth / 2
    this.back = this.position.z - this.depth / 2
  }

  update(ground) {

    this.updateSides()
    // if (zAccel) this.velocity.z += 0.0002
   this.position.x += this.velocity.x
    this.position.z += this.velocity.z

    // const forwardDirection = new Vector3(0, 0, -1);
    // forwardDirection.applyQuaternion(this.quaternion); // Apply the object's rotation
    // this.position.add(forwardDirection.multiplyScalar(distance));
    // this.object.translateZ(1)
    this.applyGravity(ground)
  }

  direction(delta, mouseX, mouseY, moveLeft, moveRight, ground, controls) {
   // console.log("Dierection Parameters:", { "Delta": delta, "Mouse X": mouseX, "Mouse Y": mouseY, "Move Left": moveLeft, "Move Right": moveRight });

    this.updateSides()
    

    var targetPosition = new Vector3();
  
    this.autoSpeedFactor = 0.0;
    
    var actualMoveSpeed = delta * this.movementSpeed;
const cameraRotation = controls.getObject().rotation;
this.rotation.y = cameraRotation.y;
    //MOVE LOGIC 
a

    this.position.x += this.velocity.x
    this.position.z += this.velocity.z
    
 
  this.applyGravity(ground);

  }


  applyGravity(ground) {

    this.velocity.y += this.gravity

    if (boxCollision({
        box1: this,
        box2: ground
      })) {
      this.velocity.y *= 0.8
      this.velocity.y = -this.velocity.y

    } else this.position.y += this.velocity.y
  }

  // onMouseMove = function (event) {


  // 		this.mouseX = event.pageX - this.viewHalfX;
  // 		this.mouseY = event.pageY - this.viewHalfY;



  // };




  setTarget(target) {
    this.target = target;
    this.object.target = target;
  }


}




function boxCollision({
  box1,
  box2
}) {
  const xCol = box1.right >= box2.left && box1.left <= box2.right
  const yCol = box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom
  const zCol = box1.front >= box2.back && box1.back <= box2.front

  return xCol && yCol && zCol
}

function bind(scope, fn) {

  return function () {

    fn.apply(scope, arguments);

  };

}


export {
  Box,
  boxCollision
};