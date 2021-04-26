// Name: Bluetooth.js
// Author: Amay Kataria. 
// Date: 04/21/2020
// Description: Class responsible for everything related to bluetooth communication with Arduino. 
// It also stores all the s

// UART service & characteristic description. 
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // transmit is from the phone's perspective
const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";  // receive is from the phone's perspective

class BLE {
    constructor(parseChipsetData) {
        this.myBLE = new p5ble();
        this.myRxCharacteristic = '';
        this.myTxCharacteristic = '';
        this.callbackData = parseChipsetData;
        // Store all chipset data. 
        this.sensors = new Chipset()[numChipsets];
    }

    connect() {
        // Registered callback to setup service characteristics. 
        // Called if the handshake between client and server is successful. 
        this.myBLE.connect(serviceUuid, this.handleCharacteristics.bind(this)); 
    }

    stop() {
        // Check if bluetooth has been initialized or not. 
        if (this.myRxCharacteristic !== '') {
            this.myBLE.stopNotifications(this.myRxCharacteristic);
        } else {
            console.warn("BLE: Not initialized."); 
        }
    }

    // Read UART characteristics. 
    handleCharacteristics(error, characteristics) {
        if (error) console.log('error: ', error);
        this.myTxCharacteristic = characteristics[0]; 
        this.myRxCharacteristic = characteristics[1];
        this.myBLE.startNotifications(this.myRxCharacteristic, this.handleIncomingData.bind(this), 'string');
        console.log("BLE: Successfully paired. Ready to communicate.")
    }

    
    // NT-V,V,V,V,V....V
    // N - sensor index, T - data type, V - line value
    // Parse sensor data based on the above format in which 
    // the data is sent from the arduino. 
    handleIncomingData(data) {
        let chipsetIdx; let sensorDataType; let sensorData = []; 
        let a = data.split('-');
        chipsetIdx = a[0][0];
        sensorDataType = a[0][1];   
        sensorData = a[1].split(','); 
        
        // Debug: Uncomment for raw sensor data received from bluetooth. 
        // console.log('Chipset Idx, Data type, sensor Data: ' + chipsetIdx + ", " + sensorDataType + ", " + sensorData);

        this.callbackData(chipsetIdx, sensorDataType, sensorData);
    }
}