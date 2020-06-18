import React, { useState, useEffect } from 'react'
import { Viewer } from '../Viewer'

function ViewDemo(props) {

  return (
    <div>
      <Viewer height={props.height} />
    </div>
  );
}

export default ViewDemo;
