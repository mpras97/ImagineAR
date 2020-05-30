import React from 'react';
import './App.css';
import Webcam from "react-webcam";
import axios from 'axios';
import * as THREE from "three";
// import React3 from "react-three-renderer";
// import ObjectModel from 'react-three-renderer-objects';
import batman from './batman.obj'
import batmanmtl from './batman.mtl'
import {OBJModel} from 'react-3d-viewer'
import {Tick,MTLModel} from 'react-3d-viewer'


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const Vis = () => {
  const { useRef, useEffect, useState } = React
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)

  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const geometry = new THREE.BoxGeometry(1, 1, 0.01)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff, map: loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg') })
    const cube = new THREE.Mesh(geometry, material)


    var loader = new THREE.TextureLoader()


    camera.position.z = 4
    scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }

    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    start()

    controls.current = { start, stop }

    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      mount.current.removeChild(renderer.domElement)

      scene.remove(cube)
      geometry.dispose()
      material.dispose()
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])

  return <div className="vis" ref={mount} onClick={() => setAnimating(!isAnimating)} />
}

function Threerender() {

  const tick = React.useRef(null)
  const [rotation, setRotation] = React.useState({x:0,y:0,z:0});
  React.useEffect( () => {

    tick.current = Tick( ()=> {
      const _rotation = {...rotation}
      _rotation.y += 0.005
      setRotation(_rotation)
    })
    },[])

    return(
      <div>
        <MTLModel
          enableZoom = {false}
          position={{x:0,y:-100,z:0}}
          rotation={rotation}
          mtl={batmanmtl}
          src={batman}
        />
      </div>
    )
}


const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [isObject, setIsObject] = React.useState(false);

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc)

      axios({
        method: 'post',
        url: 'http://localhost:8000/camera/image/',
        data: {
          image: imageSrc,
        }
      })
      .then( response => {
          if ( response.data ) {
            console.log(response.data);
            setIsObject(true);
          }
        }
      )
        .catch( error => console.log(error))
    },
    [webcamRef]
  );
  console.log(isObject);

  return (
    <>{
          isObject ?
          <>
            <OBJModel src={batman} texPath="" position={{x:0,y:-1,z:0}}/>
          {/*<Canvas>*/}
          {/*  <ambientLight />*/}
          {/*  <pointLight position={[10, 10, 10]} />*/}
          {/*  <Box position={[-1.2, 0, 0]} />*/}
          {/*  <Box position={[1.2, 0, 0]} />*/}
          {/*</Canvas>*/}
        </>
      :
      <>
        <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        />
        <button onClick={capture}>Capture photo</button>
      </>
    }
    </>
      );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WebcamCapture />
      </header>
    </div>
  );
}

export default App;
