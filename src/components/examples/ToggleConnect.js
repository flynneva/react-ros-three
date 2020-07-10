import React from 'react'
import { useROS } from 'react-ros'

function ToggleConnect() {
  const { isConnected, url, changeUrl, toggleConnection } = useROS();

  return (
    <div>
      <p>
        <b>Simple connect:  </b><button onClick={ toggleConnection }>Toggle Connect</button>  <br />
        <b>ROS url input:  </b><input name="urlInput" defaultValue={ url } onChange={event => changeUrl(event.target.value)} />  <br />
        <b>ROS url to connect to:  </b> {url}  <br />
        <b>Status of ROS:</b> { isConnected ? "connected" : "not connected" }   <br />
      </p>
    </div>
  );
}

export default ToggleConnect;
