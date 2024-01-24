import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as THREE from 'three'
function App() {
  const [count, setCount] = useState(0)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
 const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
 })

 renderer.setPixelRatio( window.devicePixelRatio)
 renderer.setSize( window.innerWidth, window.innerHeight)
 camera.position.setZ(30)
 renderer.render(scene, camera)

 const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
 const material = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true});
const torus = new THREE.Mesh( geometry, material);

scene.add(torus)
function animate() {
  requestAnimationFrame( animate)
  torus.rotation.x += 0.01
  
  renderer.render(scene, camera)
}
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
