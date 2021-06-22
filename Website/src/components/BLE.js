// Name: BLE.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Class responsible for everything related to bluetooth communication with Arduino. 
// Receives a callback function in its constructor that gets called after sensor data from the 
// Arduino is parsed.

import p5ble from 'p5ble'
import sensorDataStore from '../Stores/SensorDataStore';

// UART service & characteristic description. 
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
// const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // transmit is from the phone's perspective
// const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";  // receive is from the phone's perspective

class BLE {
  constructor(parseChipsetData) {
    this.myBLE = new p5ble(); 
    this.myRxCharacteristic = '';
    this.myTxCharacteristic = '';
    this.isReceivingData = false;
  }

  connect() {
    // Registered callback to setup service characteristics. 
    // Called if the handshake between client and server is successful. 
    this.myBLE.connect(serviceUuid, this.handleCharacteristics.bind(this)); 
  }

  disconnect() {
    this.myBLE.disconnect();
  }

  stop() {
    // Check if bluetooth has been initialized or not. 
    if (this.myRxCharacteristic !== '') {
        this.myBLE.stopNotifications(this.myRxCharacteristic);
        this.isReceivingData = false;
    } else {
        console.warn("BLE: Not initialized."); 
    }
  }

  // Read UART characteristics. 
  handleCharacteristics(error, characteristics) {
      if (error) {
          console.log('error: ', error);
          return; 
      }

      this.myTxCharacteristic = characteristics[0]; 
      this.myRxCharacteristic = characteristics[1];

      console.log(this.myTxCharacteristic);
      console.log(this.myRxCharacteristic);
      this.myBLE.startNotifications(this.myRxCharacteristic, this.handleIncomingData.bind(this), 'string');

      this.isReceivingData = true; 
      console.log("BLE: Successfully paired. Ready to communicate.")
  }

  // NT-V,V,V,V,V....V
  // N-sensor index, T-data type, V-line value
  // Parse sensor data based on the above format in which 
  // the data is sent from the arduino. 
  handleIncomingData(data) {
      // Clean the string with end of line characters. 
      data = data.replace(/\0[\s\S]*$/g,'');
      let chipsetIdx; let sensorDataType; let sensorData = []; 
      let a = data.split('-');
      chipsetIdx = a[0][0];
      sensorDataType = a[0][1];   
      sensorData = a[1].split(','); 
      
      // Debug: Uncomment for raw sensor data received from bluetooth. 
      // console.log('Chipset Idx, Data type, sensor Data: ' + chipsetIdx + ", " + sensorDataType + ", " + sensorData);
      sensorDataStore.setState(chipsetIdx, sensorDataType, sensorData); 
  }

  // Data buffer must be uint8Array data type of javascript.
  sendBuffer(dataBuffer) {
      if (this.myTxCharacteristic !== '') {
          this.myTxCharacteristic.writeValue(dataBuffer);
          console.log('BLE: Buffer sent: ' + dataBuffer);
      } else {
          console.warn('BLE: Ensure Bluetooth is connected.');
      }
  }

}

// New keyword calls the constructor for the component.
export default new BLE(); 