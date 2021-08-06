// Name: BLE.js
// Author: Amay Kataria. 
// Date: 07/06/2021
// Description: New Bluetooth class, which is responsible to connect to bluetooth and parse the incoming data.
// It also exposes function to write to the bluetooth service to send data to the arduinio. 

import sensorDataStore from '../Stores/SensorDataStore';
import AppStatusStore from '../Stores/AppStatusStore';

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
    this.device.gatt.disconnect();
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
    let decoder = new TextDecoder('utf8');
    let data = decoder.decode(event.target.value);
    //   // Clean the string with end of line characters. 
    data = data.replace(/\0[\s\S]*$/g,'');
    let chipsetIdx; let sensorDataType; let sensorData = []; 
    let a = data.split('-');
    chipsetIdx = a[0][0];
    sensorDataType = a[0][1];   
    sensorData = a[1].split(','); 
    
    // Debug: Uncomment for raw sensor data received from bluetooth. 
    console.log('Chipset Idx, Data type, sensor Data: ' + chipsetIdx + ", " + sensorDataType + ", " + sensorData);
    sensorDataStore.setState(chipsetIdx, sensorDataType, sensorData); 
  }

  // Data buffer must be uint8Array data type of javascript.
  sendBuffer(dataBuffer) {
      if (this.myTxCharacteristic !== '') {
        let a = Uint8Array.of('10', '11');  // We should be sending just a 0 or 1 signal here. 
        this.myTxCharacteristic.writeValue(a);
        console.log('BLE: Buffer sent: ' + a);
      } else {
          console.warn('BLE: Ensure Bluetooth is connected.');
      }
  }
}

// New keyword calls the constructor for the component.
export default new BLE();