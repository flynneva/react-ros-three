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

function PointCloud2(props) {
  const max_points = 100000;
  
  const geometry = useRef();
  const frame = useRef();

  const { isConnected, listeners, createListener } = useROS();
  const [ stat, setStat ] = useState('searching');
  const [ count, setCount ] = useState(0);
  const [ positions, setPositions ] = useState(new Float32Array(max_points * 3));
  const [ pointsColors, setPointColors ] = useState(new Float32Array(max_points * 3));
  const [ fields, setFields ] = useState([]);
  const [ pointSize, setPointSize ] = useState(0);

  let doUpdate = false;
  let buffer = null;
  let point_ratio = 1;
  let n = 0;
  let tempPos = [];
  let tempColor = [];

  const resize_array_right = (array, length, fill_with) => array.concat((new Array(length)).fill(fill_with)).slice(0, length);

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
    }

    return function cleanup() {
      if (isConnected) {
        if (listeners) {
          for (var listeners in listeners) {
            if (listener) {
              listeners[listener].unsubscribe();
              setStat('searching');
            }
          }
        }
      }
    }
  }, [count]);

  const handleMsg = (msg) => {
    if(msg.data) {
      var buf = max_points * msg.point_step;
      if(msg.data.buffer) {
        buffer = msg.data.slice(0, Math.min(msg.data.byteLength, buf));
        n = Math.min(msg.height * msg.width / point_ratio);
      }

      if (tempPos.length < n) {
        resize_array_right(tempPos, n, 0);
        resize_array_right(tempColor, n, 0);
      }

      var dv = new DataView(buffer.buffer);
      var little_endian = !msg.is_bigendian;
      var byte_offset;
      for (var i = 0; i < n; i++) {
        for (var f in msg.fields) {
          byte_offset = i * point_ratio * msg.point_step + Number(msg.fields[f].offset);
          parseField(Number(3*i)+Number(f), dv, msg.fields[f], byte_offset, f, little_endian);
        } 
      }
      updatePoints(tempPos, tempColor);
    }
  }

  const updatePoints = (verticies, colors) => {
    if (verticies.length < positions.length) {
      setPositions(new Float32Array(verticies));
      setPointColors(new Float32Array(colors));
      setPointSize(props.size);
      if (geometry.current) {
        geometry.current.attributes.position.needsUpdate = true;
        geometry.current.attributes.color.needsUpdate = true;
      }
    }
  }

  const parseField = (point, dv, field, offset, field_num, little_endian) => {
    let dt = pointfield_types[field.datatype];
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
        break
      case pointfield_types[6]: // UINT32
        console.log('uint32');
        break
      case pointfield_types[7]: // FLOAT32
        if(field_num < 3) {  // assumes first 3 fields will ALWAYS be x, y and z
          tempPos[point] = dv.getFloat32(offset, little_endian);
        } else {
          // TODO(evanflynn): figure out better way to set min/max color range
          var tempI = dv.getFloat32(offset, little_endian);
          tempColor[point  ] = 1 - tempI;
          tempColor[point+1] = tempI;
          tempColor[point+2] = 1 - tempI * tempI;
        }
        break
      case pointfield_types[8]: // FLOAT64
        if(field_num < 3) {  // assumes first 3 fields will ALWAYS be x, y and z
          tempPos[point] = dv.getFloat64(offset, little_endian);
        } else {
          var tempI = dv.getFloat64(offset, little_endian);
          tempColor[point  ] = 1 - tempI;
          tempColor[point+1] = tempI;
          tempColor[point+2] = 1 - tempI * tempI;
        }
        break
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
            count={pointsColors.length / 3}
            array={pointsColors}
            itemSize={3} />
        </bufferGeometry>
        <pointsMaterial attach="material" vertexColors size={pointSize} sizeAttenuation={true} />
      </points>
    </group>
  );
}

export { PointCloud2 };
