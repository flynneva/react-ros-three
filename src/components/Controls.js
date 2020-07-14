import React, { useRef } from 'react';
import { extend, useThree, useFrame } from 'react-three-fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

extend({ OrbitControls });

function Controls() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableKeys
      enableRotate
      enablePan
      screenSpacePanning={true}
      maxDistance={200}
      minDistance={0.01}
      minPolarAngle={-Math.PI}
      maxPolarAngle={Math.PI}
    />
  );
}

export default Controls;
