// Name: StaticSleeve.js
// Author: Amay Kataria. 
// Date: 07/01/2021
// Description: Double Sleeve component, which gets activated based on user interaction.

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Sleeve } from '../Assets/2sleeve.svg'
import { color } from './CommonStyles';

const styles = {
  svg: {
    stroke: 'red',
    width: '100%',
    height: '100%'
  },
};

class DoubleSleeve extends React.Component {
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

//   componentDidMount() {
//     // Need to light up some lines. 
//     if (this.props.chipsetId !== undefined && this.props.sensorIdx !== undefined) {
//        let sensorLineId = 'line' + this.props.sensorIdx;
//        let sensor = document.getElementById(sensorLineId);
//        sensor.style.stroke = color.sensorActive;
//     }
//   }
}

export default Radium(DoubleSleeve);