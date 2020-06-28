import React, { useEffect, useState, useContext } from 'react';
import { useROS }  from 'react-ros';

function Pointcloud2(props) {
  const { isConnected, listeners, createListener } = useROS();

  const [ stat, setStat ] = useState('searching');
  const [ count, setCount ] = useState(0);
  
  useEffect(() => {
    if (stat === 'searching') {
      if (isConnected) {
        console.log(listeners);
        if (listeners == false) {
          createListener( props.topic,
                          'sensor_msgs/Pointcloud2',
                          Number(10),
                          'cbor-raw' );
        }
      } else {
        console.log('Not connected to ROS websocket');
      }

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

  return (
    <points>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={1}
          array={[0,0,0]}
          itemSize={3} />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={1}
          array={[255, 255, 255]}
          itemSize={3} />
      </bufferGeometry>
      <pointsMaterial attach="material" vertexColors size={10} sizeAttenuation={false} />
    </points>
  )
}

export { Pointcloud2 };
