// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color, fontSize} from './CommonStyles';
import { Link } from 'react-router-dom'

import { ReactComponent as Ear } from '../Assets/ear.svg';
import AppStatusStore from '../Stores/AppStatusStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';
import Websocket from './Websocket';
import AudioManager from './AudioManager';
import BLE from './BLE';
import CustomButton from './CustomButton';

const RadiumLink = Radium(Link);

const animation = {
  pulse: Radium.keyframes({
    '0%': {
      transform: 'scale(0.5)'
    },
    '50%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(0.5)',
    }
  }),

  attackPulse: Radium.keyframes({
    '0%': {
      transform: 'scale(1.0)'
    },
    '50%': {
      transform: 'scale(0.5)',
    },
    '100%': {
      transform: 'scale(1.0)'
    }
  })
}

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

  svgSimplePulse: {
    animation: 'x 10s linear infinite',
    animationName: animation.pulse
  },

  svgAttackPulse: {
    animation: 'x 2s cubic-bezier(0.0,0.1,0.25,1) infinite',
    animationName: animation.attackPulse
  },
  
  svgContainer: {
    position: 'relative',
    width: '150px',
    height: '150px',
    textAlign: 'center',
    '@media (min-width: 1200px)': {
      width: '250px',
      height: '250px'
    }
  },

  svg: {
    width: '100%',
    height: '100%'
  }
};

class ConnectionMode extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      roomData: '',
      isAnimating: false
    };
    
    this.leftTriggerMap = []; 
    this.rightTriggerMap = []; 
    this.leftCallbackMap = []; 
    this.rightCallbackMap = []; 
  }

  componentDidMount() {
    AppStatusStore.setMode('CONNECTION');
    Websocket.joinRoom(this.roomDataCallback.bind(this), this.sensorDataCallback.bind(this));
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));
    AudioManager.resetPallete(); 
  }

  componentWillUnmount() {
    AppStatusStore.setMode('SETUP');
    Websocket.leaveRoom(); 
    this.removeSubscription();  
    AudioManager.resetPallete(); 
  }

  render() {
    let message = this.getMessage(); 
    let svgStyle = this.state.roomData === 'userJoined' ? [styles.svgContainer, styles.svgSimplePulse] : 
                    (this.state.roomData === 'roomComplete' && this.state.isAnimating) ? [styles.svgContainer, styles.svgAttackPulse]: [styles.svgContainer];
    return (
      <div style={styles.container}>
        <DoubleSleeve showLife={true} />
        <div style={styles.content}>
          {message}
          <br /><br />
          <div style={svgStyle} onAnimationEnd={this.earAnimationEnd.bind(this)}>
            <Ear style={styles.svg} />
          </div>
          <br />
          <CustomButton>
            <RadiumLink to="/selectmode">BACK</RadiumLink>
          </CustomButton>
          <br />
        </div>
      </div>
    );
  }

  earAnimationEnd() {
    console.log('Animation Ending');
  }

  roomDataCallback(data) {
    this.setState({
      roomData: data
    }); 

    // Reset audio if the user left and didn't release the signals
    // on the other side. 
    if (data === 'userLeft') {
      AudioManager.resetPallete();
    }
  }

  // Here the message from the other client is decoded. 
  sensorDataCallback(data) {
    if (data !== '' && this.state.roomData === 'roomComplete') {
      let msg = data.split('-');
      let sensorIdx = parseInt(msg[0]); 
      let adsr = msg[1]; 
      let chipSide = msg[2]; 
      let lifeSignal = parseInt(msg[3]);

      // Parse the message and trigger the signal on this side. 
      if (chipSide === 'L') {
        if (adsr === 'T') {
          AudioManager.trigger(sensorIdx, true); 
          if (!this.leftCallbackMap.includes(sensorIdx)) {
            this.leftCallbackMap.push(sensorIdx);
            if (!this.state.isAnimating) {
              this.setState({
                isAnimating: true
              });
            }
           }
        } else {
          if (this.leftCallbackMap.includes(sensorIdx)) {
            let idx = this.leftCallbackMap.indexOf(sensorIdx); 
            this.leftCallbackMap.splice(idx, 1); 
            AudioManager.release(sensorIdx, true); 
          }
        }

        // Activate life if it's not already active. 
        if (lifeSignal === 1) {
          if (BLE.getLife(0) === 0) {
            BLE.activateLife(0);
          } 
          // Else ignore. 
        }
        
        // Deactivate life if it's already active. 
        if (lifeSignal === 0) {
          if (BLE.getLife(0) === 1) {
            BLE.deactivateLife(0);
          }
        }
      } else {
        if (adsr === 'T') {
          if (!this.rightCallbackMap.includes(sensorIdx)) {
            this.rightCallbackMap.push(sensorIdx);
            AudioManager.trigger(sensorIdx, false);
            if (!this.state.isAnimating) {
              // Trigger the animation. 
              this.setState({
                isAnimating: true
              });
            }
          }         
        } else {
          if (this.rightCallbackMap.includes(sensorIdx)) {
            let idx = this.rightCallbackMap.indexOf(sensorIdx);
            this.rightCallbackMap.splice(idx, 1);
            AudioManager.release(sensorIdx, false);
          }
        }

        // Activate life if it's not already active. 
        if (lifeSignal === 1) {
          if (BLE.getLife(1) === 0) {
            BLE.activateLife(1);
          } 
          // Else ignore. 
        }
        
        // Deactivate life if it's already active. 
        if (lifeSignal === 0) {
          if (BLE.getLife(1) === 1) {
            BLE.deactivateLife(1);
          }
        }
      }

      // Animation end. 
      if (this.leftCallbackMap.length === 0 && this.rightCallbackMap.length === 0) {
        // All sensors are off now, so stop animating the ear. 
        this.setState({
          isAnimating: false
        }); 
      }
    }
  }

  // Here the message from the current client is encoded. 
  onSensorData() {
    // If someone has joined the room....
    // Then only try and broadcast sensor data, else don't. 
    if(this.state.roomData === 'roomComplete') {
      let config = DatabaseParamStore.getConfigJson(); 
      let chipASensorData = SensorDataStore.getChipData(0)['f']; 
      let chipBSensorData = SensorDataStore.getChipData(1)['f'];
      let lifeSignal = 0; 

      // Chip A sensor lines. 
      let chipACutoffVal = config[0]; 
      for (let i = 0; i < chipASensorData.length; i++) {
        let cutoffVal = chipACutoffVal[i]; 
        let data = chipASensorData[i]; 
        if (data < cutoffVal) {
          // Left trigger map. 
          if (!this.leftTriggerMap.includes(i)) {
            this.leftTriggerMap.push(i); 
            // Turn on life. 
            lifeSignal = 1; 
            Websocket.broadcastSensorData(i, 'T', 'L', lifeSignal); 
          }
        } else {
          // N-R-L (left release)
          if (this.leftTriggerMap.includes(i)) {
            Websocket.broadcastSensorData(i, 'R', 'L', lifeSignal); 
            // Remove that value from the map. 
            let idx = this.leftTriggerMap.indexOf(i); 
            this.leftTriggerMap.splice(idx, 1); 
          }

          if (this.leftTriggerMap.length === 0) {
            // Turn off life.
            lifeSignal = 0; 
          }
        }
      }

      // Chip B sensor lines. 
      let chipBCutoffVal = config[1]; 
      for (let i = 0; i < chipBSensorData.length; i++) {
        let cutoffVal = chipBCutoffVal[i]; 
        let data = chipBSensorData[i]; 
        if (data < cutoffVal) {
          // N-T-R (right trigger)
          if (!this.rightTriggerMap.includes(i)) {
            this.rightTriggerMap.push(i); 
            // Turn on life. 
            lifeSignal = 1; 
            Websocket.broadcastSensorData(i, 'T', 'R', lifeSignal); 
          }
        } else {
          // N-R-R (right release)
          // Remove that value from the map.
          if (this.rightTriggerMap.includes(i)) {
            Websocket.broadcastSensorData(i, 'R', 'R', lifeSignal); 
            let idx = this.rightTriggerMap.indexOf(i); 
            this.rightTriggerMap.splice(idx, 1); 
          } 

          if (this.rightTriggerMap.length === 0) {
            // Turn off life. 
            lifeSignal = 0; 
          }
        }
      }
    }
  }

  getMessage() {
    let message = ''; 
    if (this.state.roomData === 'userJoined') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Waiting for a friend to connect...</div>
        </React.Fragment>
      );
    } else if (this.state.roomData === 'roomComplete') {
      message = (
        <React.Fragment>
          <div style={styles.info}>Your friend is connected. You are now sending Embroidered Touch sound messages to them.</div> 
          <br />
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