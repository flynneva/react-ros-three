import React, { useEffect, useContext } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { Physics } from 'use-cannon';
import Controls from './Controls';

import { ROSProvider, ROSContext }  from 'react-ros';

function Viewer(props) {
  const [ ros, setROS ] = useContext(ROSContext);

  useEffect(() => {
    console.log(ROSProvider);
  });

  const viewStyle = {
    height: props.height ? props.height : '500px',
  }
  
  return (
    <Canvas shadowMap
            gl={{ alpha: false }}
            camera={{ position: [-5, 5, 5], fov: 50 }}
            onCreated={({ gl, camera, scene }) => {
              camera.lookAt(0, 0, 0)
              scene.background = props.background
			       ? new THREE.Color(props.background)
			       : new THREE.Color('white') }}
	   style={viewStyle}>
          <ROSContext.Provider value={[ros, setROS]}>
            <Controls />
            {props.children}
          </ROSContext.Provider>
    </Canvas>
  )
}

export { Viewer };
