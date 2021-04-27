// Name: Chipsets.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

const numSensors = 12; // Num sensors on each chip. 

class Chipset {
    constructor() {
        this.sensors = [];
        this.initSensors();
    }

    initSensors() {
        for (let i = 0; i < numSensors; i++) {
            this.sensors.push(new Sensor()); 
        }
    }

    setData(sensorDataType, sensorData) {
        for (let i = 0; i < numSensors; i++) {
            this.sensors[i].setData(sensorDataType, sensorData[i]); 
        }
    }
}