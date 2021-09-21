// Name: ConnectionMode.js
// Author: Amay Kataria. 
// Date: 07/2/2021
// Description: Component that gets rendered when we are in connection mode. 

import React from 'react'
import Radium from 'radium'

import DoubleSleeve from './DoubleSleeve';
import { color, fontSize} from './CommonStyles';
import { Link, Redirect } from 'react-router-dom'

import { ReactComponent as Ear } from '../Assets/ear.svg';
import AppStatusStore from '../Stores/AppStatusStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';
import Websocket from './Websocket';
import AudioManager from './AudioManager';
import BLE from './BLE';
import CustomButton from './CustomButton';
import ProductStore, { PRODUCT } from '../Stores/ProductStore';
import ChildSleeve from './ChildSleeve';

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
      isAnimating: false,
      redirectToPair: false,
      curProduct: ProductStore.getProductName()
    };
    
    // Adult sweater. 
    this.leftTriggerMap = []; 
    this.rightTriggerMap = []; 
    this.leftCallbackMap = []; 
    this.rightCallbackMap = []; 

    // Child sweater
    this.childTriggerMap = []; 
    this.childCallbackMap = []; 
  }

  componentDidMount() {
    AppStatusStore.setMode('CONNECTION');
    this.appStoreRemover = AppStatusStore.subscribe(this.onAppStatusUpdated.bind(this));
    Websocket.joinRoom(this.roomDataCallback.bind(this), this.sensorDataCallback.bind(this));
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));
    this.productStoreSubscription = ProductStore.subscribe(this.onProductUpdated.bind(this)); 
    AudioManager.resetPallete(); 
  }

  componentWillUnmount() {
    AppStatusStore.setMode('SETUP');
    this.appStoreRemover();
    Websocket.leaveRoom(); 
    this.removeSubscription();  
    this.productStoreSubscription(); // Unsubscribe. 
    AudioManager.resetPallete(); 
  }

  render() {
    let message = this.getMessage(); 
    let svgStyle = this.state.roomData === 'userJoined' ? [styles.svgContainer, styles.svgSimplePulse] : 
                    (this.state.roomData === 'roomComplete' && this.state.isAnimating) ? [styles.svgContainer, styles.svgAttackPulse]: [styles.svgContainer];
    
    let sleeve = this.state.curProduct === PRODUCT.SWEATER ? <DoubleSleeve showLife={true} /> : 
      this.state.curProduct === PRODUCT.CHILDA ? <ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={false} isChildA={true} />:
      this.state.curProduct === PRODUCT.CHILDB ? <ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={false} isChildA={false} /> : 
      <React.Fragment></React.Fragment>;

    return this.state.redirectToPair ? (<Redirect to="/setup" />) :
      (<div style={styles.container}>
        {sleeve} 
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

  onProductUpdated(product) {
    this.setState({
      curProduct: product
    }); 
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

  // Here the message from the other client is received, decoded, and 
  // converted into audio signals on the current client. 
  sensorDataCallback(data) {
    if (data !== '' && this.state.roomData === 'roomComplete') {
      if (this.state.curProduct === PRODUCT.SWEATER) {
        this.handleAdultSensorDataCallback(data); 
      } else if (this.state.curProduct === PRODUCT.CHILDA || this.state.curProduct === PRODUCT.CHILDB) {
        this.handleChildSensorDataCallback(data); 
      }
    }
  }

  handleChildSensorDataCallback(data) {
    let msg = data.split('-'); 
    let product = msg[0]; 
    let sensorIdx = parseInt(msg[1]);
    let adsr = msg[2];
    
    // Message is coming from childA
    if (product === 'A') {
      if (adsr === 'T') {
        console.log('Audio Trigger A: ' + sensorIdx); 
        AudioManager.trigger(sensorIdx);
        if (!this.childCallbackMap.includes(sensorIdx)) {
          this.childCallbackMap.push(sensorIdx); 
          if (!this.state.isAnimating) {
            this.setState({
              isAnimating: true
            }); 
          }
        }
      } else {
        if (this.childCallbackMap.includes(sensorIdx)) {
          let idx = this.childCallbackMap.indexOf(sensorIdx);
          this.childCallbackMap.splice(idx, 1); 
          AudioManager.release(sensorIdx); 
          console.log('Audio Trigger A: ' + sensorIdx); 
        }
      }
    } else {
      let newIdx = this.childBIndexMapper(sensorIdx); 
      if (adsr === 'T') {
        console.log('Audio Trigger B: ' + sensorIdx); 
        AudioManager.trigger(newIdx); 
        if (!this.childCallbackMap.includes(sensorIdx)) {
          this.childCallbackMap.push(sensorIdx);
          if (!this.state.isAnimating) {
            this.setState({
              isAnimating: true
            });
          }
        }
      } else {
        if (this.childCallbackMap.includes(sensorIdx)) {
          console.log('Audio Trigger B: ' + sensorIdx); 
          let idx = this.childCallbackMap.indexOf(sensorIdx);
          this.childCallbackMap.splice(idx, 1); 
          AudioManager.release(newIdx);
        }
      }
    }

    if (this.childCallbackMap.length === 0) {
      this.setState({
        isAnimating: false
      });
    }
  }

  childBIndexMapper(curIdx) {
    let newIdx = 0; 
    // Map 0 - 7 into 0-4
    if (curIdx === 0 || curIdx === 1 || curIdx === 2) {
      newIdx = 0; 
    } else if (curIdx === 3) {
      newIdx = 0; 
    } else if (curIdx === 4) {
      newIdx = 1;
    } else if (curIdx === 5) {
      newIdx = 2; 
    } else if (curIdx === 6) {
      newIdx = 3; 
    } 
    return newIdx; 
  }

  handleAdultSensorDataCallback(data) {
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

  // Here the message from the current client is encoded and sent to the central server
  // to be broadcasted to other clients. 
  onSensorData() {
    // If someone has joined the room....
    // Then only try and broadcast sensor data, else don't. 
    if(this.state.roomData === 'roomComplete') {
      if (this.state.curProduct === PRODUCT.SWEATER) {
        this.handleAdultSensorData(); 
      } else if (this.state.curProduct === PRODUCT.CHILDA) {
        this.handleChildSensorData(true); 
      } else {
        this.handleChildSensorData(false); 
      }
    }
  }

  handleChildSensorData(isChildA) {
    if (isChildA) {
      let cutoffVals = DatabaseParamStore.getConfigJson(PRODUCT.CHILDA)[0];
      let childSensorData = SensorDataStore.getChildSweaterData(true)[0]; 
      for (let i = 0; i < childSensorData.length; i++) {
        let cutoffVal = cutoffVals[i]; 
        let data = childSensorData[i]; 
        if (data < cutoffVal) {
          console.log('Broadcasting Trigger data: A');
          if (!this.childTriggerMap.includes(i)) {
            this.childTriggerMap.push(i); 
            Websocket.broadcastChildData('A', i, 'T'); // product (A-childA), sensorIdx, adsrAction (Trigger)
          }
        } else {
          if (this.childTriggerMap.includes(i)) {
            console.log('Broadcasting Release data: A');
            Websocket.broadcastChildData('A', i, 'R'); // product (A-childA), sensorIdx, adsrAction (Trigger)
            let idx = this.childTriggerMap.indexOf(i); 
            this.childTriggerMap.splice(idx, 1); 
          }
        }
      }
    } else {
      let cutoffVals = DatabaseParamStore.getConfigJson(PRODUCT.CHILDB)[0];
      let childSensorData = SensorDataStore.getChildSweaterData(false)[0]; 
      for (let i = 0; i < childSensorData.length; i++) {
        let cutoffVal = cutoffVals[i]; 
        let data = childSensorData[i]; 
        if (data < cutoffVal) {
          if (!this.childTriggerMap.includes(i)) {
            console.log('Broadcasting Trigger data: B');
            this.childTriggerMap.push(i); 
            Websocket.broadcastChildData('B', i, 'T'); // product (B-childB), sensorIdx, adsrAction (Trigger)
          }
        } else {
          if (this.childTriggerMap.includes(i)) {
            console.log('Broadcasting Release data: B');
            Websocket.broadcastChildData('B', i, 'R'); // product (B-childB), sensorIdx, adsrAction (Release)
            let idx = this.childTriggerMap.indexOf(i); 
            this.childTriggerMap.splice(idx, 1); 
          }
        }
      }
    }
  }

  handleAdultSensorData() {
    let config = DatabaseParamStore.getConfigJson(PRODUCT.SWEATER); 
    let chipASensorData = SensorDataStore.getAdultSweaterData(0)['f']; 
    let chipBSensorData = SensorDataStore.getAdultSweaterData(1)['f'];
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
          Websocket.broadcastAdultData(i, 'T', 'L', lifeSignal); 
        }
      } else {
        // N-R-L (left release)
        if (this.leftTriggerMap.includes(i)) {
          Websocket.broadcastAdultData(i, 'R', 'L', lifeSignal); 
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
          Websocket.broadcastAdultData(i, 'T', 'R', lifeSignal); 
        }
      } else {
        // N-R-R (right release)
        // Remove that value from the map.
        if (this.rightTriggerMap.includes(i)) {
          Websocket.broadcastAdultData(i, 'R', 'R', lifeSignal); 
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
    } else {
      message = (
        <React.Fragment>
          <div style={styles.info}>Waiting for a friend to connect...</div>
        </React.Fragment>
      );
    }
    return message; 
  }
}

export default Radium(ConnectionMode);