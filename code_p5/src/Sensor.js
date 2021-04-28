// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a chipset. 

const activeSensorClass = 'indicator-active';
const unusedSensorClass = 'unused-sensor';

const sliderMin = 50; 
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
        this.tone = ''; 

        this.parseUI(); 
        this.setTone(); 
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
        this.cutoffSlider.attribute('value', 150); // TODO: Read this value from a JSON (save recurring values)
        this.cutoffSlider.attribute('step', sliderStep);
        this.cutoffSlider.elt.addEventListener('input', this.updateCutoffTextVal.bind(this));

        let cutoffValTextNode = this.parentTrees['cutoffval'];
        this.cutoffTextVal = select(this.valueClass, cutoffValTextNode);
        this.cutoffTextVal.value(this.cutoffSlider.value());
        this.cutoffTextVal.elt.addEventListener('input', this.updateCutoffSliderVal.bind(this));

        let sensorsNode = this.parentTrees['sensors'];
        this.sensorNode = select(this.valueClass, sensorsNode);
        
        // Debug logs. 
        // console.log(this.sensorNode);
    }

    setTone() {
        if (this.sensorNode.hasClass(unusedSensorClass)) {
            this.tone = 'NOT APPLICABLE';
        } else {
            this.tone = audio.assignTone();
        }
        
        // Debug logs. 
        // console.log(this.tone);
    }

    updateCutoffSliderVal() {
        this.cutoffSlider.value(this.cutoffTextVal.value());
    }

    updateCutoffTextVal() {
        this.cutoffTextVal.value(this.cutoffSlider.value());
    }

    setData(sensorDataType, sensorVal) {
        if (sensorDataType === 'b') {
            this.baseVal.html(sensorVal);
        } else if (sensorDataType === 'f') {
            this.filteredVal.html(sensorVal);
        }
    }

    update() {
        let cutoffVal = parseInt(this.cutoffTextVal.value());
        let filteredVal = parseInt(this.filteredVal.html());

        if (filteredVal <= cutoffVal) {
            this.touchIndicator.addClass(activeSensorClass);
        } else {
            this.touchIndicator.removeClass(activeSensorClass);
        }
    }
}