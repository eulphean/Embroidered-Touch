// Name: ChildSleeve.js
// Author: Amay Kataria. 
// Date: 09/12/2021
// Description: Child sleeve component where different child sleeves are loaded. 

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Child4Sleeve } from '../Assets/child4line.svg'
import { ReactComponent as Child7Sleeve } from '../Assets/child7line.svg'
import SensorDataStore from '../Stores/SensorDataStore'
import DatabaseParamStore from '../Stores/DatabaseParamStore'

import { color } from './CommonStyles.js'
import ProductStore, { PRODUCT } from '../Stores/ProductStore'

const styles = {
  svgContainer: {
    zIndex: 1,
    top: '45px',
    opacity: 0.7,
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      top: '80px',
      width: '90%',
      height: '90%',
    }
  },

  fixedPos: {
    position: 'fixed',
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

  newSvg: {
    width: '30%',
    height: '30%'
  }
};

const numbersId = 'numbers'; 
const linePrefix = 'line';

class ChildSleeve extends React.Component {
  constructor(props) {
    super(props);
    this.state={};
  }

  render() {
    let svgStyle = this.props.notFixed ? styles.newSvg : styles.svg;
    let sleeve = this.props.isChildA ? <Child4Sleeve style={svgStyle} /> : <Child7Sleeve style={svgStyle} />; 
    let sleeveStyle = this.props.notFixed ? [styles.svgContainer, styles.leftSleeve] : [styles.svgContainer, styles.leftSleeve, styles.fixedPos]
    return (
      <div style={sleeveStyle}>
        {sleeve}
      </div>
    );
  }

  onSensorData() {
    let product = ProductStore.getProductName();
    let config = DatabaseParamStore.getConfigJson(product);

    // Based on the current product, these are the cut off values. 
    let cutoffVals = config[0]; 
    let childSensorData; 
    if (product === PRODUCT.Child4Sleeve) {
      childSensorData = SensorDataStore.getChildSweaterData(true)[0]; // Store the entire array of chilA data. 
    } else {
      childSensorData = SensorDataStore.getChildSweaterData(false)[0];
    }
    for (let i = 0; i < childSensorData.length; i++) {
      let cutoffVal = cutoffVals[i]; 
      let data = childSensorData[i]; 
      if (data < cutoffVal) {
        let sensor = this.getSensorComponent(i);
        sensor.style.stroke = color.sensorActive; 
      } else {
        let sensor = this.getSensorComponent(i);
        sensor.style.stroke = color.sensorDefault; 
      }
    }
  }

  componentDidMount() {
    // Subscribe to the store. 
    // Only if this prop is passed else, we are looking at store when are also calibrating. 
    if (this.props.subscribeToStore) {
      this.sensorDataStoreRemover = SensorDataStore.subscribe(this.onSensorData.bind(this));
    }

    // Need to light up some lines. 
    if (this.props.sensorIdx !== undefined) {
       let sensorLineId = 'line' + this.props.sensorIdx;
       let sensor = document.getElementById(sensorLineId);
       sensor.style.stroke = color.sensorActive;
    }

    if (!this.props.showNumbers) {
      let numbers = document.getElementById(numbersId);
      numbers.style.visibility = 'hidden';
    }
  }

  componentWillUnmount() {
    if (this.props.subscribeToStore) {
      this.sensorDataStoreRemover(); 
    }
  }

  getSensorComponent(idx) {
    let sensorIdx, line, sensor; 
    sensorIdx = idx + 1; 
    line = linePrefix + sensorIdx; 
    sensor = document.getElementById(line); 
    return sensor; 
  }
}

export default Radium(ChildSleeve);