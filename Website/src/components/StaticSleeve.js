// Name: StaticSleeve.js
// Author: Amay Kataria. 
// Date: 07/01/2021
// Description: Static Sleeve component that gets triggered with things. 

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Sleeve } from '../Assets/1Sleeve.svg'

import { color } from './CommonStyles.js'

const styles = {
  svgContainer: {
    zIndex: 1,
    position: 'fixed',
    top: '45px',
    left: '0%',
    right: '0%'
  },

  svg: {
    width: '100%',
    height: '100%'
  },
};

class StaticSleeve extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    return (
      <div style={styles.svgContainer}>
        <Sleeve style={styles.svg} />
      </div>
    );
  }

  componentDidMount() {
    // Need to light up some lines. 
    if (this.props.chipsetId !== undefined && this.props.sensorIdx !== undefined) {
       let sensorLineId = 'line' + this.props.sensorIdx;
       let sensor = document.getElementById(sensorLineId);
       sensor.style.stroke = color.sensorActive;
    }
  }
}

export default Radium(StaticSleeve);