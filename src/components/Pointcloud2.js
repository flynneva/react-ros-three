import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from 'react-three-fiber';
import { Physics } from 'use-cannon';
import Controls from './Controls';

import { useROS }  from 'react-ros';

function PointCloud2(props) {
  const { listeners, ros } = useROS();
  const [ stat, setStat ] = useState('searching');
  const [ count, setCount ] = useState(0);

  useEffect(() => {
    if (stat === 'searching') {
      for (var listener in listeners) {
        if(listener) {
          if(listeners[listener].compression === 'cbor-raw') {
            listeners[listener].subscribe(handleCBORMsg);
          } else {
            listeners[listener].subscribe(handleMsg);
          }
          setStat('listening');
        }
      }

      const timeout = setTimeout(() => {
        console.log(stat);
        setCount(count + 1);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [count]);

  var vertices = [];
  const handleCBORMsg = (msg) => {
    console.log(msg);
  }

  const handleMsg = (msg) => {
    console.log(msg);
  }

  const viewStyle = {
    height: props.height ? props.height : '500px',
  }

  return (
   <div style={viewStyle}>
     <Canvas shadowMap
             gl={{ alpha: false }}
             camera={ props.camera ? props.camera : { position: [-1, 1, 2.5], fov: 50 }}
             onCreated={({ gl, camera, scene }) => {
               camera.lookAt(0, 0, 0)
               scene.background = new THREE.Color('white')
               gl.toneMapping = THREE.ACESFilmicToneMapping
               gl.outputEncoding = THREE.sRGBEncoding }}>
       <Controls />
       <gridHelper />
     </Canvas>
   </div>
  )
}

export { Viewer };
