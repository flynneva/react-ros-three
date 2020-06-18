import React, { useEffect } from 'react';
import * as THREE from 'three';

function Grid(props) {
 
  var gridSize = Number(0);
  useEffect(() => {
    gridSize = props.cellSize * props.planeCellCount;
  })

  return (
    <gridHelper args={[ gridSize, props.planeCellCount, props.centerLineColor, props.color ]} />
  )
}

export { Grid };
