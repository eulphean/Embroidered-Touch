// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

const activeSensorClass = 'indicator-active';

const sliderMin = 0; 
const sliderMax = 250;
const sliderStep = 1; 
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

        let touchIndicatorNode = this.parentTrees['indicator'];
        this.touchIndicator = select(this.valueClass, touchIndicatorNode);


        // Cutoff
        let cutoffKnobNode = this.parentTrees['cutoffknob'];
        this.cutoffSlider = select(this.valueClass, cutoffKnobNode);
        this.cutoffSlider.attribute('min', sliderMin);
        this.cutoffSlider.attribute('max', sliderMax);
        this.cutoffSlider.attribute('value', 100); // TODO: Read this value from a JSON (save recurring values)
        this.cutoffSlider.attribute('step', sliderStep);
        this.cutoffSlider.elt.addEventListener('input', this.updateCutoffVal.bind(this));

        let cutoffValNode = this.parentTrees['cutoffval'];
        this.cutoffVal = select(this.valueClass, cutoffValNode);
        this.cutoffVal.html(this.cutoffSlider.value());
    }

    updateCutoffVal() {
        this.cutoffVal.html(this.cutoffSlider.value());
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