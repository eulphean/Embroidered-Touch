// Name: BLE.js
// Author: Amay Kataria. 
// Date: 07/06/2021
// Description: New Bluetooth class, which is responsible to connect to bluetooth and parse the incoming data.
// It also exposes function to write to the bluetooth service to send data to the arduinio. 

import SensorDataStore from '../Stores/SensorDataStore';
import AppStatusStore from '../Stores/AppStatusStore';
import ProductStore, {PRODUCT} from '../Stores/ProductStore';

// UART service & characteristic description. 
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // transmit is from the phone's perspective
const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";  // receive is from the phone's perspective

class BLE {
  constructor() {
    this.myRxCharacteristic = '';
    this.myTxCharacteristic = '';
    this.isReceivingData = false;
    this.device = ''; 
    this.lifeData = [0, 0]; // Left signal, right signal.
    this.chipIdx = '';
    this.sensorData = [];
  }

  connect(hasPaired) {
    // Registered callback to setup service characteristics. 
    navigator.bluetooth.requestDevice({
        filters: [{
          services: [serviceUuid]
        }]
      })
      .then(device => { 
          this.device = device; 
          device.addEventListener('gattserverdisconnected', this.onDisconnected.bind(this));
          return device.gatt.connect();
      })
      .then(server => {
          return server.getPrimaryService(serviceUuid);
      })
      .then(service => {
          service.getCharacteristic(rxCharacteristic).then(rxChar => {
              this.myRxCharacteristic = rxChar;
              this.myRxCharacteristic.startNotifications(); 
              this.myRxCharacteristic.addEventListener('characteristicvaluechanged', this.handleIncomingData.bind(this)); 
              // Callback to indicate we have connected. 
              hasPaired(); 
              AppStatusStore.setBluetoothStatus(true); 
          });
          service.getCharacteristic(txCharacteristic).then(txChar => {
              this.myTxCharacteristic = txChar; 
          });
      })
      .catch(error => { console.error(error); });
  }

  onDisconnected(event) {
    const device = event.target;
    console.log(`Device ${device.name} is disconnected.`);
    AppStatusStore.setBluetoothStatus(false);
  }

  disconnect() {
    if (this.device) {
      this.device.gatt.disconnect();
    }
  }

  stop() {
    // Check if bluetooth has been initialized or not. 
    // if (this.myRxCharacteristic !== '') {
    //     this.myBLE.stopNotifications(this.myRxCharacteristic);
    //     this.isReceivingData = false;
    // } else {
    //     console.warn("BLE: Not initialized."); 
    // }
  }

  // NT-V,V,V,V,V....V
  // N-sensor index, T-data type, V-line value
  // Parse sensor data based on the above format in which 
  // the data is sent from the arduino. 
  handleIncomingData(event) {
    let decoder = new TextDecoder('utf-8', {fatal: true});
    let data = decoder.decode(event.target.value);
    // Clean the string with end of line characters. 
    data = data.replace(/\0[\s\S]*$/g,'');

    // Get product to make sure there is no mismatch. 
    let product = ProductStore.getProductName(); 

    if (data.includes('S') && product === PRODUCT.SWEATER) {
      this.handleAdultSweater(data); 
    } else if (data.includes('A') && product === PRODUCT.CHILDA) {
      // ChildA - 4 line sweater
      this.handleChildASweater(data); 
    } else if (data.includes('B') && product === PRODUCT.CHILDB) {
      // ChildB - 7 line sweater
      this.handleChildBSweater(data); 
    } else {
      console.log('Product Mismatch between Physical and Software Product'); 
    }
  }

  handleAdultSweater(data) {
    if (data.includes('C')) {
      // Is there any pending data that needs to be attended?
      if (this.sensorData.length > 0) {
        // Set sensorData store
        if (this.chipIdx !== "" && this.sensorData.length === 12) {
          //console.log('Chip Idx, Collected Sensor Data: ' + this.chipIdx + ", " + this.sensorData);
          SensorDataStore.setState(this.chipIdx, this.sensorData); 
        } else {
          // Ignore this data and move on.
        }
        // Empty this data
        this.sensorData = []; 
        this.chipIdx = "";
      }

      // This is the beginning of the chip data
      this.chipIdx = parseInt(data[2]); // SC[ChipIdx]
    } else {
      let vals = data.split('-'); // S-sensorVal
      let v = parseInt(vals[1]); 
      this.sensorData.push(v);     
    }
  }

  handleChildASweater(data) {
    if (data.includes('C')) {
      if (this.sensorData.length > 0) {
        // Set sensorData store
        if (this.sensorData.length === 4) {
          // console.log('ChildA, 4-Line Sweater: Collected Sensor Data: ' + this.sensorData);
          //SensorDataStore.setState(this.chipIdx, this.sensorData); // Set data properly in the store. 
        } else {
          // Ignore this data and move on.
        }
        
        // Empty this data
        this.sensorData = []; 
      }
    } else {
        let vals = data.split('-'); 
        let v = parseInt(vals[1]); 
        this.sensorData.push(v);
    }
  }

  handleChildBSweater(data) {
    if (data.includes('C')) {
      if (this.sensorData.length > 0) {
        // Set sensorData store
        if (this.sensorData.length === 7) {
          // console.log('ChildB, 7-Line Sweater: Collected Sensor Data: ' + this.sensorData);
          //SensorDataStore.setState(this.chipIdx, this.sensorData); // Set data properly in the store. 
        } else {
          // Ignore this data and move on.
        }
        
        // Empty this data
        this.sensorData = []; 
      }
    } else {
        let vals = data.split('-'); 
        let v = parseInt(vals[1]); 
        this.sensorData.push(v);
    }
  }

  activateLife(chipIdx) {
    this.setLife(chipIdx, 1);
  }

  deactivateLife(chipIdx) {
    this.setLife(chipIdx, 0);
  }

  // Data buffer must be uint8Array data type of javascript.
  setLife(chipIdx, lifeSignal) {
      if (this.myTxCharacteristic !== '') {
        // Populate the signals. 
        if (chipIdx === 0) {
          this.lifeData[0] = lifeSignal; 
        } else if (chipIdx === 1) {
          this.lifeData[1] = lifeSignal; 
        }        
        let data = Uint8Array.of(this.lifeData[0], this.lifeData[1]);  // We should be sending just a 0 or 1 signal here. 
        this.myTxCharacteristic.writeValue(data)
        .catch((() => {
          console.log('GATT Operation in progress');
        }));
        // console.log('BLE: Buffer sent: ' + data);
      } else {
          console.warn('BLE: Ensure Bluetooth is connected.');
      }
  }

  // Checks if life signal is activate. 
  getLife(chipNum) {
    if (chipNum === 0) {
      return this.lifeData[0];
    } else {
      return this.lifeData[1];
    }
  }
}

// New keyword calls the constructor for the component.
export default new BLE();