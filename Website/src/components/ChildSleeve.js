// Name: ChildSleeve.js
// Author: Amay Kataria. 
// Date: 09/12/2021
// Description: Child sleeve component where different child sleeves are loaded. 

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Child4Sleeve } from '../Assets/child4line.svg'
import { ReactComponent as Child7Sleeve } from '../Assets/child7line.svg'

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

  svg: {
    width: '100%',
    height: '100%'
  },
};

class ChildSleeve extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    let sleeve = this.props.isChildA ? <Child4Sleeve style={styles.svg} /> : <Child7Sleeve style={styles.svg} />; 
    let sleeveStyle = [styles.svgContainer, styles.leftSleeve]; 
    return (
      <div style={sleeveStyle}>
        {sleeve}
      </div>
    );
  }

  componentDidMount() {
    // Need to light up some lines. 
    // if (this.props.chipsetId !== undefined && this.props.sensorIdx !== undefined) {
    //    let sensorLineId = 'line' + this.props.sensorIdx;
    //    let sensor = document.getElementById(sensorLineId);
    //    sensor.style.stroke = color.sensorActive;
    // }
    if (!this.props.showNumbers) {
      let numbers = document.getElementById('numbers');
      numbers.style.visibility = 'hidden';
    }
  }
}

export default Radium(ChildSleeve);