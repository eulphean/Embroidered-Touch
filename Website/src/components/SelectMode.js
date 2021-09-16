// Name: SelectMode.js
// Author: Amay Kataria. 
// Date: 06/28/2021
// Description: Component that allows one to switch between multiple modes. 

import React from 'react'
import Radium from 'radium'
import { color, padding, fontSize } from './CommonStyles';
import { Link, Redirect } from 'react-router-dom';

import DoubleSleeve from './DoubleSleeve';
import CustomButton from './CustomButton';

import AppStatusStore from '../Stores/AppStatusStore';
import DatabaseParamStore from '../Stores/DatabaseParamStore';
import SensorDataStore from '../Stores/SensorDataStore';
import ProductStore, { PRODUCT } from '../Stores/ProductStore';
import AudioManager from './AudioManager';
import BLE from './BLE';
import ChildSleeve from './ChildSleeve';
import Product from './Product';

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
    zIndex: 2,
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
      isSoloActive: false,
      redirectToPair: false,
      curProduct: ProductStore.getProductName()
    };

    this.leftTriggerMap = [];
    this.rightTriggerMap = []; 
  }

  componentDidMount() {
    // Subscribe to sensor data store, so when it's receiving new data. 
    // We can trigger the audio engine by correlating the parameters with the 
    // DatabaseParamStore (where the current configuration for calibration is stored.)
    this.removeSubscription = SensorDataStore.subscribe(this.onSensorData.bind(this));
    this.appStoreRemover = AppStatusStore.subscribe(this.onAppStatusUpdated.bind(this));
    this.productStoreRemover = ProductStore.subscribe(this.onProductUpdated.bind(this)); 
  }

  componentWillUnmount() {
    // Unsubscribe from the sensor data store.
    this.removeSubscription();  
    this.appStoreRemover();
    this.productStoreRemover(); 
    // Stop all sounds when this component gets unmounted. 
    // User might try to leave the page without deactivating Solo mode.
    AudioManager.resetPallete();
  }

  render() {
    let sleeve = this.getSleeve();
    return this.state.redirectToPair ? (<Redirect to="/setup" />) :
      (<div style={styles.container}>
        {sleeve}
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

  getSleeve() {
    if (this.state.curProduct === PRODUCT.SWEATER) {
      return (<DoubleSleeve showLife={true} />);
    } else if (this.state.curProduct === PRODUCT.CHILDA) {
      return (<ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={false} isChildA={true} />); 
    } else if (this.state.curProduct === PRODUCT.CHILDB) {
      return (<ChildSleeve subscribeToStore={true} notFixed={true} showNumbers={false} isChildA={false} />);
    }
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

  onSensorData() {
    let product = ProductStore.getProductName(); 
    if (product === PRODUCT.SWEATER) {
      let config = DatabaseParamStore.getConfigJson(product); 
      let chipASensorData = SensorDataStore.getAdultSweaterData(0)['f']; 
      let chipBSensorData = SensorDataStore.getAdultSweaterData(1)['f'];
  
      // Only when we are in solo mode. 
      if (this.state.isSoloActive) {
        // Chip A sensor lines. 
        let chipACutoffVal = config[0]; 
        for (let i = 0; i < chipASensorData.length; i++) {
          let cutoffVal = chipACutoffVal[i]; 
          let data = chipASensorData[i]; 
          if (data < cutoffVal) {
            if (!this.leftTriggerMap.includes(i)) {
              this.leftTriggerMap.push(i); 
              AudioManager.trigger(i, true); 
              if (BLE.getLife(0) === 0) { // 0: left chip.
                BLE.activateLife(0); // chip, signal (active)
              }
            }
          } else {
            if (this.leftTriggerMap.includes(i)) {
              AudioManager.release(i, true); 
              // Remove that value from the map. 
              let idx = this.leftTriggerMap.indexOf(i); 
              this.leftTriggerMap.splice(idx, 1);
            }
  
            // Nothing is triggered on this side, so deactivate life. 
            if (this.leftTriggerMap.length === 0) {
              if (BLE.getLife(0) === 1) {
                BLE.deactivateLife(0); 
              }
            }
          }
        }
  
        // Chip B sensor lines. 
        let chipBCutoffVal = config[1]; 
        for (let i = 0; i < chipBSensorData.length; i++) {
          let cutoffVal = chipBCutoffVal[i]; 
          let data = chipBSensorData[i]; 
          if (data < cutoffVal) {
            if (!this.rightTriggerMap.includes(i)) {
              this.rightTriggerMap.push(i); 
              AudioManager.trigger(i, false); 
              if (BLE.getLife(1) === 0) { // 1: right chip.
                BLE.activateLife(1); // chip, signal (active)
              }
            }
          } else {
            // Remove that value from the map.
            if (this.rightTriggerMap.includes(i)) {
              AudioManager.release(i, false); 
              let idx = this.rightTriggerMap.indexOf(i); 
              this.rightTriggerMap.splice(idx, 1); 
            }
  
            // Nothing is triggered on this side, so deactivate life. 
            if (this.rightTriggerMap.length === 0) {
              if (BLE.getLife(1) === 1) {
                BLE.deactivateLife(1); 
              }
            }
          }
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