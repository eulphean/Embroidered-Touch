// Name: StaticSleeve.js
// Author: Amay Kataria. 
// Date: 07/01/2021
// Description: Double Sleeve component, which gets activated based on user interaction.

import React from 'react'
import Radium from 'radium'
import { ReactComponent as Sleeve } from '../Assets/2sleeve_life.svg'

import { color } from './CommonStyles.js'

import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';

const lifeId = 'life'; 
const numbersId = 'numbers'; 
const linePrefix = 'line';

const styles = {
  svgContainer: {
    '@media (min-width: 1200px)': {
      width: '100%',
      height: '100%'
    }
  },

  svg: {
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

  componentDidMount() {
    // Subscribe to the sensor data store. 
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));

    // Handle showLife. 
    if (this.props.showLife) {
       let numbers = document.getElementById(numbersId);
       numbers.style.visibility = 'hidden'; 
    } else {
      let life = document.getElementById(lifeId);
      life.style.visibility = 'hidden'; 
    }
  }

  componentWillUnmount() {
    this.removeSubscription(); 
  }

  onSensorData() {
    // Cutoff values. 
    let config = DatabaseParamStore.getConfigJson(); 

    // Sensor data. 
    let chipASensorData = SensorDataStore.getChipData(0)['f']; 
    let chipBSensorData = SensorDataStore.getChipData(1)['f'];

    // Chip A sensor lines. 
    let chipACutoffVal = config[0]; 
    for (let i = 0; i < chipASensorData.length; i++) {
      let cutoffVal = chipACutoffVal[i]; 
      let data = chipASensorData[i]; 
      if (data < cutoffVal) {
        let sensor = this.getSensorComponent(true, i); 
        sensor.style.stroke = color.sensorActive;
      } else {
        let sensor = this.getSensorComponent(true, i); 
        sensor.style.stroke = color.sensorDefault; 
      }
    }

    // Chip B sensor lines. 
    let chipBCutoffVal = config[1]; 
    for (let i = 0; i < chipBSensorData.length; i++) {
      let cutoffVal = chipBCutoffVal[i]; 
      let data = chipBSensorData[i]; 
      if (data < cutoffVal) {
        let sensor = this.getSensorComponent(false, i);
        sensor.style.stroke = color.sensorActive;
      } else {
        let sensor = this.getSensorComponent(false, i);
        sensor.style.stroke = color.sensorDefault;
      }
    }
  }

  getSensorComponent(isChipA, idx) {
    let sensorIdx, line, sensor; 
    if (isChipA) {
      sensorIdx = idx + 1; 
      line = linePrefix + sensorIdx; 
      sensor = document.getElementById(line); 
    } else {
      sensorIdx = idx + 12 + 1; 
      line = linePrefix + sensorIdx; 
      sensor = document.getElementById(line); 
    }
    return sensor; 
  }
}

export default Radium(DoubleSleeve);