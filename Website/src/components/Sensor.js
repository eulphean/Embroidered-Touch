// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Sensor component that references all the attributes like sensor values, calibration parameters,
// audio outputs, etcs. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Link, Redirect } from 'react-router-dom';

import CustomButton from './CustomButton';

import AppStatusStore from '../Stores/AppStatusStore';
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
    zIndex: 2,
    '@media (min-width: 1200px)': {
      marginTop: padding.extraEnormous
    }
  },

  info: {
    textAlign: 'center',
    zIndex: 'inherit',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  title: {
    zIndex: 'inherit',
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  }
};

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    let v = SensorDataStore.getSensorData(this.props.chipsetId, this.props.sensorIdx); 
    this.state={
      sensorVal: v,
      time: calibrationTime,
      calibration: CALIBRATIONSTATE.NOTSTARTED,
      redirectToPair: false
    };

    // Calibration parameters. 
    this.curSensorValue = v; 
    this.initialThreshold = 10; 
    this.interval = '';   
  }

  componentDidMount() {
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this)); 
    this.appStoreRemover = AppStatusStore.subscribe(this.onAppStatusUpdated.bind(this));
  }

  componentWillUnmount() {
    this.removeSubscription();
    this.appStoreRemover();
  }

  render() {
    let nextPath = this.getNextPath(); 
    let calibrationMessage = this.getCalibrationMsg(); 

    // Some conditions used to render the messages. 
    let isLeftSleeve = this.props.sensorIdx <=12;
    let isContinuing = (this.props.sensorIdx >= 2 && this.props.sensorIdx <=12) || (this.props.sensorIdx >= 14 && this.props.sensorIdx <=24); 

    // Pending messages. 
    let firstMessage = this.getFirstMessage(isLeftSleeve, isContinuing); 
    let secondMessage = this.getSecondMessage(isLeftSleeve, isContinuing); 
    //let thirdMessage = this.getThirdMessage(isLeftSleeve, isContinuing); 
    return this.state.redirectToPair ?  (<Redirect to="/setup" />) : (
      <div style={styles.container}>
        <div style={styles.title}>Calibration</div>
        <br />
        {firstMessage}
        {secondMessage}
        <br />
        {calibrationMessage}
        <br />
        <div style={styles.info}>Then click NEXT below.</div>
        <div style={styles.info}>Sensor Value: {this.state.sensorVal}</div>
        <br />
        <CustomButton><RadiumLink to={nextPath}>NEXT</RadiumLink></CustomButton>    
      </div>
    );
  }

  onAppStatusUpdated() {
    let data = AppStatusStore.getData();
    if (data['bleStatus'] === false) {
      // Component gets unmounted and cleans up its state.
      this.setState({
        redirectToPair: true
      });
    }
  }

  getFirstMessage(isLeftSleeve, isContinuing) {
    let message; 
    if (isLeftSleeve) {
      message = (<span><div style={styles.info}>First, the Left Sleeve.</div><br /></span>);
    }
    
    if (isLeftSleeve && isContinuing) {
      message = (<span><div style={styles.info}>Continuing with the Left Sleeve.</div><br /></span>);
    }
    
    if (!isLeftSleeve) {
      message = (<span><div style={styles.info}>Now, the Right Sleeve.</div><br /></span>);
    }

    if (!isLeftSleeve && isContinuing) {
      message = (<span><div style={styles.info}>Continuing with the Right Sleeve.</div><br /></span>);
    }

    return message; 
  }

  getSecondMessage(isLeftSleeve, isContinuing) {
    let message;
    // if (isLeftSleeve || !isLeftSleeve) {
    //   message = (<span><div style={styles.info}>Starting with the vertical grid lines that run down the length of the sleeve, from shoulder to wrist.</div><br /></span>);
    // }

    if (isLeftSleeve || !isLeftSleeve) {
      if (this.props.sensorIdx === 1 || this.props.sensorIdx === 13) {
        message = (<span><div style={styles.info}>Place your hand near the front side of your upper arm so it is touching the vertical lines closest to the center of your body.</div></span>);
      }
      
      if (this.props.sensorIdx === 2 || this.props.sensorIdx === 14) {
        message = (<span><div style={styles.info}>Again, place your hand near the front side of your upper arm so it is touching the vertical lines closest to the center of your body.</div></span>);
      }

      if (this.props.sensorIdx === 3 || this.props.sensorIdx === 15) {
        message = (<span><div style={styles.info}>One more time, place your hand near the front side of your upper arm so it is touching the vertical lines closest to the center of your body.</div></span>);
      }

      if (this.props.sensorIdx === 4 || this.props.sensorIdx === 16) {
        message = (<span><div style={styles.info}>Rotate your hand towards the back of your arm, so it is touching the vertical lines closest to the back of your body.</div></span>);
      }

      if (this.props.sensorIdx === 5 || this.props.sensorIdx === 17) {
        message = (<span><div style={styles.info}>Again, place your hand towards the back of your arm, so it is touching the vertical lines closest to the back of your body.</div></span>);
      }

      if (this.props.sensorIdx === 6 || this.props.sensorIdx === 18) {
        message = (<span><div style={styles.info}>One more time, place your hand towards the back of your arm, so it is touching the vertical lines closest to the back of your body.</div></span>);
      }
      
      if (this.props.sensorIdx === 7 || this.props.sensorIdx === 19) {
        message = (<span><div style={styles.info}>Now place your hand on the back of your shoulder so it is touching the horizontal line closest to the top of your arm.</div></span>);
      }

      if (this.props.sensorIdx === 8 || this.props.sensorIdx === 20) {
        message = (<span><div style={styles.info}>Now move your hand down the length of your arm, so it is touching the second horizontal line from the top.</div></span>);
      }

      if (this.props.sensorIdx === 9 || this.props.sensorIdx === 21) {
        message = (<span><div style={styles.info}>Now move your hand down the length of your arm a bit more, so it is touching the third horizontal line from the top.</div></span>);
      }

      if (this.props.sensorIdx === 10 || this.props.sensorIdx === 22) {
        message = (<span><div style={styles.info}>Now move your hand down the length of your arm below the elbow, so it is touching the fourth horizontal line from the top.</div></span>);
      }

      if (this.props.sensorIdx === 11 || this.props.sensorIdx === 23) {
        message = (<span><div style={styles.info}>Now move your hand a bit further down the length of your arm below the elbow, so it is touching the fifth horizontal line from the top.</div></span>);
      }

      if (this.props.sensorIdx === 12 || this.props.sensorIdx === 24) {
        message = (<span><div style={styles.info}>Now move your hand a bit further down the length of your arm below the elbow, so it is touching the horizontal line closest to your elbow.</div></span>);
      }
    } 

    return message; 
  }

  getThirdMessage(isLeftSleeve, isContinuing) {
    let message; 
    if (isLeftSleeve || !isLeftSleeve) {
      message = <span><div style={styles.info}>Touch the vertical grid line closest to the front of the body.</div><br /></span>;
    }

    if ((isLeftSleeve && isContinuing) || (!isLeftSleeve && isContinuing)) {
      message = <span><div style={styles.info}>Touch the next vertical grid line moving away from the center of the body.</div><br /></span>;
    }

    return message; 
  }

  getCalibrationMsg() {
    if (this.state.calibration === CALIBRATIONSTATE.NOTSTARTED) {
      return (<div style={styles.info}>Hold for 5 seconds as the counter counts down, then release.</div>);
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