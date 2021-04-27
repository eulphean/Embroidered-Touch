// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

const activeSensorClass = 'indicator-active';

class Sensor {
    constructor(sensorIdx, interfaceTrees) {
        this.parentTrees = interfaceTrees; 

        // Value class to read / write sensor data. 
        this.valueClass = ".v" + sensorIdx; // Write value to each of these parents.

        // Pointer to the dom node that holds these values. 
        this.filteredVal = '';
        this.baseVal = '';
        this.cutoffVal = '';
        this.touchIndicator = '';

        this.parseUI(); 
    }
    parseUI() {
        // Filtered value node. 
        let filteredNode = this.parentTrees['filtered'];
        this.filteredVal = select(this.valueClass, filteredNode);
        this.filteredVal.html('FFF');

        let baseNode = this.parentTrees['base'];
        this.baseVal = select(this.valueClass, baseNode);
        this.baseVal.html('BBB');

        let cutoffValNode = this.parentTrees['cutoffval'];
        this.cutoffVal = select(this.valueClass, cutoffValNode);
        this.cutoffVal.html('CCC');

        let touchIndicatorNode = this.parentTrees['indicator'];
        this.touchIndicator = select(this.valueClass, touchIndicatorNode);
    }

    setData(sensorDataType, sensorVal) {
        // if (sensorDataType === 'b') {
        //     this.baseVal = sensorVal;
        // } else if (sensorDataType === 'f') {
        //     this.filteredVal = sensorVal;
        // }
    }

    draw() {
        // If visible, update the Ui with the values. 
        // Update the UI with the values.
        // Update the UI with the values. 
    }
}