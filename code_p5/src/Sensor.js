// Name: Sensor.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Stores and operates on all the sensor related information for each chipset. 

const activeSensorClass = 'indicator-active';
const unusedSensorClass = 'unused-sensor';

const sliderMin = 0; 
const sliderMax = 200;
const sliderStep = 1; 
const defaultValue = 100;

// Default sound properties. 
const defaultVolume = 0.5; 
const maxVolume = 20.0;
const interpolationRate = 0.0005;
 
class Sensor {
    constructor(sensorIdx, interfaceTrees) {
        this.parentTrees = interfaceTrees; 

        // Value class to read / write sensor data. 
        this.valueClass = ".v" + sensorIdx; // Write value to each of these parents.

        // Pointer to the dom node that holds these values. 
        this.filteredVal = '';
        this.baseVal = '';
        this.cutoffTextVal = '';
        this.touchIndicator = '';

        // Is this unused. 
        this.isSensorUnused = false; 

        // This can be changed by button press.
        this.isSensorActive = true; 

        this.parseUI(); 

        // Initialize sound engine. 
        let knobCollection = select(this.valueClass, this.parentTrees['adsr']);
        this.adsr = new ADSR(knobCollection, this.isSensorUnused); 
    }

    parseUI() {
        // Sensor index title node. 
        let chipsetSensorNode = this.parentTrees['sensors'];
        this.sensorNode = select(this.valueClass, chipsetSensorNode);
        this.sensorNode.mousePressed(this.onSensorPressed.bind(this));
        if (this.sensorNode.hasClass(unusedSensorClass)) {
            this.isSensorUnused = true;
        }

        // Filtered value node. 
        let filteredNode = this.parentTrees['filtered'];
        this.filteredVal = select(this.valueClass, filteredNode);
        this.filteredVal.html('FFF');

        let baseNode = this.parentTrees['base'];
        this.baseVal = select(this.valueClass, baseNode);
        this.baseVal.html('BBB');

        let touchIndicatorNode = this.parentTrees['indicator'];
        this.touchIndicator = select(this.valueClass, touchIndicatorNode);

        // Cutoff knob. 
        let cutoffKnobNode = this.parentTrees['cutoffknob'];
        this.cutoffSlider = select(this.valueClass, cutoffKnobNode);
        this.cutoffSlider.attribute('min', sliderMin);
        this.cutoffSlider.attribute('max', sliderMax);
        this.cutoffSlider.attribute('value', 100); // TODO: Read this value from a JSON (save recurring values)
        this.cutoffSlider.attribute('step', sliderStep);
        this.cutoffSlider.elt.addEventListener('input', this.updateCutoffTextVal.bind(this));

        // Cutoff text input.
        let cutoffValTextNode = this.parentTrees['cutoffval'];
        this.cutoffTextVal = select(this.valueClass, cutoffValTextNode);
        this.cutoffTextVal.value(this.cutoffSlider.value());
        this.cutoffTextVal.elt.addEventListener('input', this.updateCutoffSliderVal.bind(this));
    }

    onSensorPressed() {
        if (!this.isSensorUnused) {
            this.isSensorActive = !this.isSensorActive; 
            this.setSensorActiveStyle();
        }
    }

    setSensorActiveStyle() {
        if (this.isSensorActive) {
            this.sensorNode.removeClass('disabled-sensor');
        } else {                
            this.sensorNode.addClass('disabled-sensor');
        }
    }

    updateCutoffSliderVal() {
        this.cutoffSlider.value(this.cutoffTextVal.value());
    }

    updateCutoffTextVal() {
        this.cutoffTextVal.value(this.cutoffSlider.value());
    }

    setData(sensorDataType, sensorVal) {
        if (!this.isSensorUnused) {
            if (sensorDataType === 'b') {
                this.baseVal.html(sensorVal);
            } else if (sensorDataType === 'f') {
                this.filteredVal.html(sensorVal);
            }
        }
    }

    update() {
        // Sensor should be used and be active. 
        if (!this.isSensorUnused && this.isSensorActive) {
            let cutoffVal = parseInt(this.cutoffTextVal.value());
            let filteredVal = parseInt(this.filteredVal.html());
    
            if (filteredVal <= cutoffVal) {
                this.touchIndicator.addClass(activeSensorClass);
                this.handleSound('play');
            } else {
                this.touchIndicator.removeClass(activeSensorClass);
                this.handleSound('stop');
            }
        }
    }

    handleSound(command) {
        if (command === 'play') {
            if (!this.adsr.isActive) {
                this.adsr.trigger(); 
            }
        } 

        if (command === 'stop') {
            this.adsr.release(); 
        }
    }

    setSensorValue(val) {
        this.cutoffSlider.value(val);
        this.cutoffTextVal.value(val);
    }

    interpolate(a, b, f){
        return a + f * (b - a);
    }
}