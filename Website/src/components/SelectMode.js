// Name: SelectMode.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that allows one to switch between multiple modes. 

import React from 'react'
import Radium from 'radium'
import { color, padding } from './CommonStyles';
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
    color: color.white
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: padding.big,
    alignItems: 'center'
  },

  title: {
    fontWeight: 'bold'
  },

  info: {
    textAlign: 'center'
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
        <DoubleSleeve />
        <div style={styles.content}>
          <div style={styles.title}>Mode</div>
          <br />
          <div style={styles.info}>Choose SOLO to send sound to your own device.</div>
          <CustomButton isActive={this.state.isSoloActive} onClick={this.onClickSolo.bind(this)}>SOLO</CustomButton>
          <br />
          <div style={styles.info}>Choose CONNECTION to send and receive sound with a friend.</div>
          <CustomButton>
            <RadiumLink to='/connection'>CONNECTION</RadiumLink>
          </CustomButton>
          <br />
          <div style={styles.info}>Choose SETUP to recalibrate your device.</div>
          <CustomButton>
            <RadiumLink to="/testcal">SETUP</RadiumLink>
          </CustomButton>
        </div>
      </div>
    );
  }

  onSensorData() {
    let config = DatabaseParamStore.getConfig(); 
    let chipASensorData = SensorDataStore.getChipData(0)['f']; 
    let chipBSensorData = SensorDataStore.getChipData(1)['f'];

    // TODO: 
    // Compare the cutoff values in the database param store with the chipset sensor data. 
    // If cutoff value is hit, then call the AudioManager to play a sound for that 
    // specific sample. 

    console.log(chipASensorData);
  }

  onClickSolo() {
    if (this.state.isSoloActive) {
      AppStatusStore.setMode('SETUP')
    } else {
      AppStatusStore.setMode('SOLO');
    }

    // Activate.
    this.setState({
      isSoloActive: !this.state.isSoloActive
    });
  }
}

export default Radium(SelectMode);