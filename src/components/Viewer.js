import React, { useContext, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import Controls from './Controls';

import { ROSProvider, ROSContext }  from 'react-ros';

function Viewer(props) {
  const [ ros, setROS ] = useContext(ROSContext);
  const [ position, setPosition ] = useState([-5, 5, 5]);
  const [ fov, setFOV ] = useState(50);
  const [ lookAt, setLookAt ] = useState([0, 0, 0]);

  const viewStyle = {
    height: props.height ? props.height : '500px',
  }
  
  return (
    <Canvas shadowMap
            gl={{ alpha: false }}
            camera={{ position: position, fov: fov }}
            onCreated={({ gl, camera, scene }) => {
              camera.lookAt(lookAt[0], lookAt[1], lookAt[2])
              scene.background = props.background
			       ? new THREE.Color(props.background)
			       : new THREE.Color('black') }}
	   style={viewStyle}>
          <ROSContext.Provider value={[ros, setROS]}>
            <Controls />
            {props.children}
          </ROSContext.Provider>
    </Canvas>
  )
}

export { Viewer };
