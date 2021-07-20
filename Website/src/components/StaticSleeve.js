// Name: StaticSleeve.js
// Author: Amay Kataria. 
// Date: 07/01/2021
// Description: Static Sleeve component that gets triggered with things. 

import React from 'react'
import Radium from 'radium'
import { ReactComponent as LeftSleeve } from '../Assets/left_sleeve.svg'
import { ReactComponent as RightSleeve } from '../Assets/right_sleeve.svg'

import { color } from './CommonStyles.js'

const styles = {
  svgContainer: {
    zIndex: 1,
    position: 'fixed',
    top: '45px',
    opacity: 0.7,
    '@media (min-width: 1200px)': {
      top: '80px',
      width: '90%',
      height: '90%',
    }
  },

  leftSleeve: {
    paddingLeft: '10px',
    '@media (min-width: 1200px)': {
      paddingLeft: '5%'
    }
  },

  rightSleeve: {
    paddingRight: '5px',
    '@media (min-width: 1200px)': {
      paddingRight: '5%'
    }
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
    this.isLeftSleeve = true; 
  }

  render() {
    this.isLeftSleeve = !this.props.sensorIdx ? true : this.props.sensorIdx <= 12 ? true : false; 
    let sleeve = this.isLeftSleeve ? <LeftSleeve style={styles.svg} /> : <RightSleeve style={styles.svg}/>;
    let sleeveStyle = this.isLeftSleeve ? [styles.svgContainer, styles.leftSleeve] : [styles.svgContainer, styles.rightSleeve];
    return (
      <div style={sleeveStyle}>
        {sleeve}
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