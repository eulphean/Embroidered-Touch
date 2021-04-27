// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

class Sensor {
    constructor() {
        this.filteredVal = '';
        this.baseVal = '';
        this.cutOff = '';
    }

    setData(sensorDataType, sensorVal) {
        if (sensorDataType === 'b') {
            this.baseVal = sensorVal;
        } else if (sensorDataType === 'f') {
            this.filteredVal = sensorVal;
        }
    }

    draw() {
        // If visible, update the Ui with the values. 
        // Update the UI with the values.
        // Update the UI with the values. 
    }
}