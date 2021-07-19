// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
import { Link } from 'react-router-dom';

import CustomButton from './CustomButton';

import DatabaseParamStore from '../Stores/DatabaseParamStore'
import SensorDataStore from '../Stores/SensorDataStore';

const RadiumLink = Radium(Link);
const CALIBRATIONSTATE = {
  NOTSTARTED: 'NOTSTARTED',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED'
}; 
const calibrationTime = 5; // seconds.

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: color.white,
    padding: padding.veryBig,
    zIndex: 2
  },

  info: {
    textAlign: 'center',
    zIndex: 'inherit'
  },

  title: {
    zIndex: 'inherit',
    fontWeight: 'bold'
  },

  button: {
    zIndex: 'inherit'
  }
};

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    let v = SensorDataStore.getSensorData(this.props.chipsetId, this.props.sensorIdx); 
    this.state={
      sensorVal: v,
      time: calibrationTime,
      calibration: CALIBRATIONSTATE.NOTSTARTED
    };

    // Calibration parameters. 
    this.curSensorValue = v; 
    this.initialThreshold = 10; 
    this.interval = ''; 
  }

  componentDidMount() {
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this)); 
  }

  componentWillUnmount() {
    this.removeSubscription();
  }

  render() {
    let nextPath = this.getNextPath(); 
    let calibrationMessage = this.getCalibrationMsg(); 
    return (
      <div style={styles.container}>
        <div style={styles.title}>Calibration</div>
        <br />
        <div style={styles.info}>First, the Left Sleeve.</div>
        <br />
        <div style={styles.info}>Starting with the vertical grid lines that run down the length of the sleeve, from shoulder to wrist.</div>
        <br />
        <div style={styles.info}>Touch the vertical grid line closest to the front of the body.</div>
        <br />
        {calibrationMessage}
        <br />
        <div style={styles.info}>Then click NEXT below.</div>
        <div style={styles.info}>Debug Sensor Val: {this.state.sensorVal}</div>
        <CustomButton><RadiumLink to={nextPath}>NEXT</RadiumLink></CustomButton>    
      </div>
    );
  }

  getCalibrationMsg() {
    if (this.state.calibration === CALIBRATIONSTATE.NOTSTARTED) {
      return (<div style={styles.info}>Hold for about 5 seconds, then release.</div>);
    } else if (this.state.calibration === CALIBRATIONSTATE.STARTED) {
      return (<div style={styles.info}>Calibration in process...{this.state.time}</div>);
    } else if (this.state.calibration === CALIBRATIONSTATE.COMPLETED) {
      return (<div style={styles.info}>Calibration completed.</div>); 
    }
  }

  // Logic to create the next path for the next button.
  getNextPath() {
    let path = ''; 
    let sensorIdx = this.props.sensorIdx;
    if (this.props.chipsetId === 0 && this.props.sensorIdx <= 12) {
      sensorIdx = sensorIdx + 1; 
      if (this.props.sensorIdx === 12) {
        path = '/r-' + sensorIdx;
      } else {
        path = '/l-' + sensorIdx; 
      }
    }

    // Handle all the sensors from Right-0 onwards. 
    if (this.props.chipsetId === 1 && this.props.sensorIdx <= 24) {
      sensorIdx = sensorIdx + 1; 
      path = '/r-' + sensorIdx;
    }

    // Last Right-24 path.
    if (this.props.chipsetId === 1 && this.props.sensorIdx === 24) {
      path = '/testcal'
    }
    return path; 
  }

  onSensorData() {
    let v = SensorDataStore.getSensorData(this.props.chipsetId, this.props.sensorIdx); 
    this.setState({
      sensorVal: v
    });

    // Check if this incoming value is less than the set value and we are not calibrating.
    if ((v < this.curSensorValue - this.initialThreshold) && (this.state.calibration === CALIBRATIONSTATE.NOTSTARTED)) {
      // Start the timer. 
      this.interval = setInterval(this.updateTime.bind(this), 1000); 
      this.setState({
        calibration: CALIBRATIONSTATE.STARTED
      }); 
    }

    // If we lifted our finger off by mistake before the calibration was completed, reset calibration state.
    if ((v > this.curSensorValue - this.initialThreshold) && (this.state.calibration === CALIBRATIONSTATE.STARTED)) {
      clearInterval(this.interval); 
      this.setState({
        calibration: CALIBRATIONSTATE.NOTSTARTED,
        time: calibrationTime
      }); 
    }
  }

  updateTime() {
    let curTime = this.state.time; 
    curTime = curTime - 1;

    // Calibration completed. 
    if (curTime < 0) {
      curTime = 0; 
      clearInterval(this.interval);
      let curSensorValue = SensorDataStore.getSensorData(this.props.chipsetId, this.props.sensorIdx); 
      let cutoffVal = curSensorValue + this.initialThreshold; 
      DatabaseParamStore.setCutOffVal(this.props.chipsetId, this.props.sensorIdx, cutoffVal);
      // Register the cutoff value to the database param store. 
      // Cut off value is 10 points more than this. 
      // Commit this cutoff value to the db.
      this.setState({
        calibration: CALIBRATIONSTATE.COMPLETED
      }); 

      return;
    }

    this.setState({
      time: curTime
    }); 
  }
}

export default Radium(Sensor);