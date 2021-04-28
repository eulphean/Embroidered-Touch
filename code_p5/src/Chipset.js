// Name: Chipsets.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

const numSensors = 12; // Num sensors on each chip. 

class Chipset {
    constructor(chipsetIdx) {
        this.sensors = [];
        this.sensorsID = "#sensors-" + chipsetIdx; // Sensor indexes. 
        this.filteredValID = "#filtered-val-" + chipsetIdx; // Filtered values.
        this.baseValID = "#base-val-" + chipsetIdx; // Base values.
        this.cutoffKnobID = "#cutoff-knob-" + chipsetIdx; // Cutoff knobs. 
        this.cutoffValID = "#cutoff-val-" + chipsetIdx; // Cutoff values. 
        this.touchIndicatorID = "#touch-indicator-" + chipsetIdx; // Touch indicator. 

        // Populate interface nodes first, then initialize sensor nodes. 
        this.populateUITrees(); 
        this.initSensors();
    }

    update() {
        for (let i = 0; i < numSensors; i++) {
            // Sensor index, parent nodes. 
            this.sensors[i].update();
        }
    }

    populateUITrees() {
        // These are trees to be forwarded to sensors. 
        this.interfaceTrees = {
            'filtered' : select(this.filteredValID),
            'base' : select(this.baseValID),
            'cutoffknob' : select(this.cutoffKnobID),
            'cutoffval' : select(this.cutoffValID),
            'indicator' : select(this.touchIndicatorID),
            'sensors' : select(this.sensorsID)
        }
    }

    initSensors() {
        for (let i = 0; i < numSensors; i++) {
            // Sensor index, parent nodes. 
            this.sensors.push(new Sensor(i, this.interfaceTrees)); 
        }
    }

    setData(sensorDataType, sensorData) {
        for (let i = 0; i < numSensors; i++) {
            this.sensors[i].setData(sensorDataType, sensorData[i]); 
        }
    }
}