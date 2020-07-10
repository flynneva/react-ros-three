import React, { useEffect, useState} from 'react';
import * as THREE from 'three';

function Grid(props) {
  const [ size, setSize ] = useState(Number(0));
  const [ count, setCount ] = useState(Number(0));

  useEffect(() => {
    var temp_size = props.cellSize * props.planeCellCount;
    if (temp_size != size) {
      setSize(temp_size);
    }
    if (count != props.planeCellCount) {
      setCount(props.planeCellCount);
    }
  })

  return (
    <gridHelper args={[ size, count, props.centerLineColor, props.color ]} />
  )
}

export { Grid };
