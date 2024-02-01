import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useEffect } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from '../controls/OrbitControls'
import { FirstPersonControls } from '../controls/FirstPersonControls';
import { FlyControls } from 'three/addons/controls/FlyControls.js';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera'
import { Object3D } from '../core/Object3D'
import { Mesh } from '../objects/Mesh'
import { Box, boxCollision } from '../objects/bOX.JS'

function App() {


  const clock = new THREE.Clock()
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222222)
  const gridHelper = new THREE.GridHelper(10, 10); // Specify the size of the grid and the number of divisions
  scene.add(gridHelper);

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 3, 3);
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  // console.log("Camera position:", camera.position);

  //renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.shadowMap.enabled = true

  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  //controls
  //const controls = new FlyControls(camera, renderer.domElement)  
  //const controls = new OrbitControls(camera, renderer.domElement)

  //controls.target.set(0, 1, 0)
  //camera.add(controls)
  //scene.add(controls)
  //console.log("Controls object position:", controls.object.position);

  //cube
  // const geometry = new THREE.BoxGeometry(1, 1, 1)
  // const material = new THREE.MeshStandardMaterial({ color: 0x0000ff })


  const cube = new Box({
    width: 1, height: 1, depth: 1, velocity: {
      x: 0,
      y: -0.01,
      z: 0
    }
  })
  cube.castShadow = true // need to add this for each object
  scene.add(cube)

  //CONTROLS
  const controls = new FirstPersonControls(camera, renderer.domElement, cube);
  controls.movementSpeed = 5.0;
  controls.lookSpeed = 0.1
  controls.noFly = true
  controls.lookVertical = false;


  const ground = new Box({
    width: 5,
    height: 0.5,
    depth: 10,
    color: '#000067',
    position: {
      x: 0,
      y: -2,
      z: 0
    }
  })
  // const ground = new THREE.Mesh(
  //   new THREE.BoxGeometry(5, 0.5, 10),  
  //   new THREE.MeshStandardMaterial({ color: 0x00ff00 }))

  ground.receiveShadow = true //need to add this for other things
  scene.add(ground)


  //light
  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.y = 3
  light.position.z = 2
  light.castShadow = true //need to add this for other lights
  scene.add(light)
  const light2 = new THREE.AmbientLight(0xffffff, 1000)
  light2.position.y = 20
  light2.position.z = 0
  light2.position.x = 0
  scene.add(light2)


  const keys = {
    a: {
      pressed: false
    },
    d: {
      pressed: false,
    },
    w: {
      pressed: false
    },
    s: {
      pressed: false
    }

  }

  //movement
  window.addEventListener('keydown', (event) => {
    // console.log(event)
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = true
        break
      case 'KeyD':
        keys.d.pressed = true
        break
      case 'ArrowRight':
        keys.d.pressed = true
        break
      case 'ArrowLeft':
        keys.a.pressed = true
        break

      case 'KeyW':
        keys.w.pressed = true
        break
      case 'KeyS':
        keys.s.pressed = true
        break
      case 'ArrowUp':
        keys.w.pressed = true
        break
      case 'ArrowDown':
        keys.s.pressed = true
        break
    }

  })

  window.addEventListener('keyup', (event) => {
    // console.log(event)
    switch (event.code) {
      case 'KeyA':
        keys.a.pressed = false
        break
      case 'KeyD':
        keys.d.pressed = false
        break
      case 'ArrowRight':
        keys.d.pressed = false
        break
      case 'ArrowLeft':
        keys.a.pressed = false
        break
      case 'KeyW':
        keys.w.pressed = false
        break
      case 'KeyS':
        keys.s.pressed = false
        break
      case 'ArrowUp':
        keys.w.pressed = false
        break
      case 'ArrowDown':
        keys.s.pressed = false
        break
    }

  })

  //   controls.addEventListener("change", event => {  
  //     console.log( controls.object.position ); 
  // }) 
  const enemy = new Box({
    width: 1, height: 1, depth: 1,
    position: {
      x: 0,
      y: 0,
      z: -4
    },
    velocity: {
      x: 0,
      y: -0.01,
      z: 0.005
    },
    color: 'red',
    zAccel: true
  })
  enemy.castShadow = true
  scene.add(enemy)
  const enemies = [enemy]


  function animate() {
    //var lookDirection =  FirstPersonControls.getLookDirection()
    //console.log( controls.object.position );
    const animationId = requestAnimationFrame(animate)
    

    //movement code
    cube.velocity.x = 0
    cube.velocity.z = 0
    if (keys.a.pressed) {
      cube.velocity.x = -0.01
    }
    else if (keys.d.pressed) {
      cube.velocity.x = 0.01
      // camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    if (keys.w.pressed) {
      cube.velocity.z = -0.01
    }
    else if (keys.s.pressed) {
      cube.velocity.z = 0.01
    }

    let delta = clock.getDelta()
   // cube.update(ground)
    controls.update(delta);
    const target = controls.getTarget();
    const spherical = controls.getSpherical();
    const lookDirection = controls.getLookDirection();
    const mouseX = controls.getMouseX();
    const mouseY = controls.getMouseY();
    const moveLeft = controls.getMoveLeft();
    const moveRight = controls.getMoveRight();

    cube.direction(delta, mouseX, mouseY, moveLeft, moveRight, ground, controls);
    //console.log("after update");
    // console.log(spherical);
    // console.log(lookDirection)
   


    enemies.forEach(enemy => {
      enemy.update(ground)
      if (boxCollision({
        box1: cube,
        box2: enemy
      })) {
        //cancelAnimationFrame(animationId)
      }
    })

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    renderer.render(scene, camera)
  }//animate

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

  animate()


  return (
    <>




      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
