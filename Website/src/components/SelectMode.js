// Name: SelectMode.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that allows one to switch between multiple modes. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Link } from 'react-router-dom';

import DoubleSleeve from './DoubleSleeve';
import CustomButton from './CustomButton';

import AppStatusStore from '../Stores/AppStatusStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';
import AudioManager from './AudioManager';

const RadiumLink = Radium(Link);

const styles = {
  container: {
    position: 'relative',
    color: color.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (min-width: 1200px)': {
      alignSelf: 'stretch'
    }
  },

  content: {
    alignItems: 'center',
    paddingLeft: padding.verySmall,
    paddingRight: padding.verySmall,
    '@media (min-width: 1200px)': {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: '20%',
      paddingRight: '20%',
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      marginTop: '-100px'
    }
  },

  title: {
    fontWeight: 'bold',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  info: {
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

class SelectMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      isSoloActive: false
    };
  }

  componentDidMount() {
    // Subscribe to sensor data store, so when it's receiving new data. 
    // We can trigger the audio engine by correlating the parameters with the 
    // DatabaseParamStore (where the current configuration for calibration is stored.)
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));
  }

  componentWillUnmount() {
    // Unsubscribe from the sensor data store.
    this.removeSubscription();  
  }

  render() {
    return (
      <div style={styles.container}>
        <DoubleSleeve showLife={true} />
        <div style={styles.content}>
          <div style={styles.buttonContainer}>
            <div style={styles.info}>Choose SOLO to send sound<div>to your own device.</div></div>
            <CustomButton isActive={this.state.isSoloActive} onClick={this.onClickSolo.bind(this)}>SOLO</CustomButton>
            <br />
          </div>
          <div style={styles.buttonContainer}>
            <div style={styles.info}>Choose CONNECTION to send and receive<div>sound with a friend.</div></div>
            <CustomButton>
              <RadiumLink to='/connection'>CONNECTION</RadiumLink>
            </CustomButton>
            <br />
          </div>
          <div style={styles.buttonContainer}>
            <div style={styles.info}>Choose SETUP to recalibrate<div>your device.</div></div>
            <CustomButton>
              <RadiumLink to="/testcal">SETUP</RadiumLink>
            </CustomButton>
            <br />
          </div>
        </div>
      </div>
    );
  }

  onSensorData() {
    let config = DatabaseParamStore.getConfigJson(); 
    let chipASensorData = SensorDataStore.getChipData(0)['f']; 
    let chipBSensorData = SensorDataStore.getChipData(1)['f'];

    // Only when we are in solo mode. 
    if (this.state.isSoloActive) {
      // Chip A sensor lines. 
      let chipACutoffVal = config[0]; 
      for (let i = 0; i < chipASensorData.length; i++) {
        let cutoffVal = chipACutoffVal[i]; 
        let data = chipASensorData[i]; 
        if (data < cutoffVal) {
          AudioManager.trigger(i, true); 
        } else {
          AudioManager.release(i, true); 
        }
      }

      // Chip B sensor lines. 
      let chipBCutoffVal = config[1]; 
      for (let i = 0; i < chipBSensorData.length; i++) {
        let cutoffVal = chipBCutoffVal[i]; 
        let data = chipBSensorData[i]; 
        if (data < cutoffVal) {
          AudioManager.trigger(i, false); 
        } else {
          AudioManager.release(i, false); 
        }
      }
    }
  }

  onClickSolo() {
    if (this.state.isSoloActive) {
      AppStatusStore.setMode('SETUP');
      AudioManager.resetPallete(); 
    } else {
      AppStatusStore.setMode('SOLO');
      AudioManager.startPalleteTimer();
    }

    // Activate.
    this.setState({
      isSoloActive: !this.state.isSoloActive
    });
  }
}

export default Radium(SelectMode);