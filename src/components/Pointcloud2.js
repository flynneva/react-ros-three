import React, { useEffect, useState, useRef } from 'react';
import { useROS }  from 'react-ros';
import { useFrame } from 'react-three-fiber'
import * as THREE from 'three'

// copying the same pointfield enum from
// http://docs.ros.org/noetic/api/sensor_msgs/html/msg/PointField.html
const pointfield_types = {
  1: 'INT8',
  2: 'UINT8',
  3: 'INT16',
  4: 'UINT16',
  5: 'INT32',
  6: 'UINT32',
  7: 'FLOAT32',
  8: 'FLOAT64'
}

function Pointcloud2(props) {
  const max_points = 100000;
  
  const geometry = useRef();
  const frame = useRef();

  const { isConnected, listeners, createListener } = useROS();
  const [ stat, setStat ] = useState('searching');
  const [ count, setCount ] = useState(0);
  const [ positions, setPositions ] = useState(new Float32Array(max_points * 3));
  const [ points_colors, setColors ] = useState(new Float32Array(max_points * 3));

  let doUpdate = false;
  let buffer = null;
  let point_ratio = 1;
  let n = 0;
  let tempPos = [1, 1, 1];

  useEffect(() => {
    if (stat === 'searching') {
      if (isConnected) {
        if (listeners == false) {
          // subscribe to given pointcloud topic & set compression method
          createListener( props.topic,
                          'sensor_msgs/PointCloud2',
                          Number(100),
                          props.compression ? props.compression : 'none');
        }
      } else {
        console.log('Not connected to ROS websocket');
      }

      // if there is a listener available, set the callback and subscribe
      for (var listener in listeners) {
        if(listener) {
          listeners[listener].subscribe(handleMsg);
          setStat('listening');
        }
      }
     
      const timeout = setTimeout(() => {
        setCount(count + 1);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [count]);

  const handleMsg = (msg) => {
    if(msg.data) {
      initPoints(msg.header['frame_id'], msg.point_step, msg.fields);
      var buf = max_points * msg.point_step;
      if(msg.data.buffer) {
        buffer = msg.data.slice(0, Math.min(msg.data.byteLength, buf));
        n = Math.min(msg.height * msg.width / point_ratio);
      }

      var dv = new DataView(buffer.buffer);
      var littleEndian = !msg.is_bigendian;
      var x = msg.fields[0].offset;  // assume x is field 0?
      var y = msg.fields[1].offset;
      var z = msg.fields[2].offset;
      var intensity = msg.fields[3].offset;
      var offset;
      var tempI = 0;
      var tempPos = [n * 3];
      var tempColor = [n * 3];
      for (var i = 0; i < n; i++) {
        offset = i * point_ratio * msg.point_step;
        tempPos[3*i  ] = dv.getFloat32(offset+x, littleEndian);
        tempPos[3*i+1] = dv.getFloat32(offset+y, littleEndian);
        tempPos[3*i+2] = dv.getFloat32(offset+z, littleEndian);
        tempI = dv.getFloat32(offset+intensity, littleEndian);
        tempColor[3*i  ] = 1 - tempI;
        tempColor[3*i+1] = tempI;
        tempColor[3*i+2] = 1 - tempI * tempI;
      }
      
      updatePoints(tempPos, tempColor);
    }
  }

  const updatePoints = (verticies, colors) => {
    if (verticies.length < positions.length) {
      setPositions(new Float32Array(verticies));
      setColors(new Float32Array(colors));
      geometry.current.attributes.position.needsUpdate = true;
      geometry.current.attributes.color.needsUpdate = true;
    }
  }

  const initPoints = (frame_id, point_step, fields) => {
    parseFields(fields);
  }

  const parseFields = (fields) => {
    for (var field in fields) {
      let dt = pointfield_types[fields[field].datatype];
      switch(dt) {
        case pointfield_types[1]: // INT8
          console.log('int8');
        case pointfield_types[2]: // UINT8
          console.log('uint8');
        case pointfield_types[3]: // INT16
          console.log('int16');
        case pointfield_types[4]: // UINT16
          console.log('uint16');
        case pointfield_types[5]: // INT32
          console.log('int32');
        case pointfield_types[6]: // UINT32
          console.log('uint32');
        case pointfield_types[7]: // FLOAT32
          //console.log('float32');
          return
        case pointfield_types[8]: // FLOAT64
          //console.log('float64');
      }
    }
  }

  return (
    <group ref={frame} rotation={[1.57, 0, 0]}>
      <points>
        <bufferGeometry attach="geometry" ref={geometry}>
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={positions.length / 3}
            array={positions}
            itemSize={3} />
          <bufferAttribute
            attachObject={['attributes', 'color']}
            count={points_colors.length / 3}
            array={points_colors}
            itemSize={3} />
        </bufferGeometry>
        <pointsMaterial attach="material" vertexColors size={0.075} sizeAttenuation={true} />
      </points>
    </group>
  );
}

export { Pointcloud2 };
