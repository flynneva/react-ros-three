import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { Physics } from 'use-cannon';
import Controls from './Controls';

import { useROS }  from 'react-ros';

function Viewer(props) {

  const viewStyle = {
    height: props.height ? props.height : '500px',
  }

  return (
    <Canvas shadowMap
            gl={{ alpha: false }}
            camera={{ position: [-5, 5, 5], fov: 50 }}
            onCreated={({ gl, camera, scene }) => {
              camera.lookAt(0, 0, 0)
              scene.background = props.background ? new THREE.Color(props.background) : new THREE.Color('white') }} style={viewStyle}>
      <Controls />
      {props.children}
    </Canvas>
  )
}

export { Viewer };
