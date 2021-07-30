// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color, fontSize} from './CommonStyles';

import { ReactComponent as Ear } from '../Assets/ear.svg';
import AppStatusStore from '../Stores/AppStatusStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';
import Websocket from './Websocket';
import AudioManager from './AudioManager';

const styles = {
  container: {
    color: color.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: '2%',
    paddingRight: '2%',
    '@media (min-width: 1200px)': {
      alignSelf: 'stretch',
      paddingLeft: '5%',
      paddingRight: '5%'
    }
  },

  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '@media (min-width: 1200px)': {
      marginTop: '-25px'
    }
  },

  info: {
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      fontSize: fontSize.veryBig
    }
  },
  
  svgContainer: {
    width: '50%',
    height: '50%',
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      width: '75%',
      height: '75%'
    }
  },

  svg: {
    width: '50%',
    height: '50%'
  }
};

class ConnectionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      roomData: ''
    };
  }

  componentDidMount() {
    AppStatusStore.setMode('CONNECTION');
    Websocket.joinRoom(this.roomDataCallback.bind(this), this.sensorDataCallback.bind(this));
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));
  }

  componentWillUnmount() {
    AppStatusStore.setMode('SETUP');
    Websocket.leaveRoom(); 
    this.removeSubscription();  
  }

  render() {
    let message = this.getMessage(); 
    return (
      <div style={styles.container}>
        <DoubleSleeve />
        <div style={styles.content}>
          {message}
          <br /><br />
          <div style={styles.svgContainer}>
            <Ear style={styles.svg} />
          </div>
        </div>
      </div>
    );
  }

  roomDataCallback(data) {
    this.setState({
      roomData: data
    }); 
  }

  sensorDataCallback(data) {
    if (data !== '') {
      console.log ('Broadcast message: ' + data); 
      let msg = data.split('-');
      let sensorIdx = msg[0]; 
      let adsr = msg[1]; 
      let chipSide = msg[2]; 

      // Parse the message and trigger the signal on this side. 
      if (chipSide === 'L') {
        if (adsr === 'T') {
          AudioManager.trigger(sensorIdx, true); 
        } else {
          AudioManager.release(sensorIdx, true); 
        }
      } else {
        if (adsr === 'T') {
          AudioManager.trigger(sensorIdx, false);
        } else {
          AudioManager.release(sensorIdx, false);
        }
      }
    }
  }

  onSensorData() {
    // If someone has joined the room....
    // Then only try and broadcast sensor data, else don't. 
    if(this.state.roomData === 'roomComplete') {
      let config = DatabaseParamStore.getConfigJson(); 
      let chipASensorData = SensorDataStore.getChipData(0)['f']; 
      let chipBSensorData = SensorDataStore.getChipData(1)['f'];

      // Chip A sensor lines. 
      let chipACutoffVal = config[0]; 
      for (let i = 0; i < chipASensorData.length; i++) {
        let cutoffVal = chipACutoffVal[i]; 
        let data = chipASensorData[i]; 
        if (data < cutoffVal) {
          Websocket.broadcastSensorData(i, 'T', 'L'); 
          // N-T-L (left trigger)
        } else {
          // N-R-L (left release)
          Websocket.broadcastSensorData(i, 'R', 'L'); 
        }
      }

      // Chip B sensor lines. 
      let chipBCutoffVal = config[1]; 
      for (let i = 0; i < chipBSensorData.length; i++) {
        let cutoffVal = chipBCutoffVal[i]; 
        let data = chipBSensorData[i]; 
        if (data < cutoffVal) {
          // N-T-R (right trigger)
          Websocket.broadcastSensorData(i, 'T', 'R'); 
        } else {
          // N-R-R (right release)
          Websocket.broadcastSensorData(i, 'R', 'R'); 
        }
      }
    }
  }

  getMessage() {
    let message = ''; 
    if (this.state.roomData === 'userJoined') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Message Sent.</div> 
          <div style={styles.info}>Waiting for a friend to connect...</div>
        </React.Fragment>
      );
    } else if (this.state.roomData === 'roomComplete') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Your friend is connected. You are now sending Embroidered Touch sound messages to them.</div> 
          <br /><br />
          <div style={styles.info}>You may also receive sound messages in response.</div>
        </React.Fragment>
      ); 
    } else if (this.state.roomData === 'userLeft') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Your friend has logged out.</div> 
        </React.Fragment>
      );
    }
    return message; 
  }
}

export default Radium(ConnectionMode);