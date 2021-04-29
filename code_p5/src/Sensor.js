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

        // p5 sound object. 
        this.tone = ''; 

        // Is this unused. 
        this.isSensorUnused = false; 

        this.parseUI(); 
        this.setTone(); 
    }

    parseUI() {
        // Sensor index title node. 
        let chipsetSensorNode = this.parentTrees['sensors'];
        this.sensorNode = select(this.valueClass, chipsetSensorNode);
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

    setTone() {
        // Don't assign a sound for an unused sensor line. 
        if (this.isSensorUnused) {
            this.tone = 'NA';
        } else {
            this.tone = audio.assignTone();
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
        if (!this.isSensorUnused) {
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
            if (!this.tone.isPlaying()) {
                this.tone.setVolume(0.5); // SHOULD COME FROM THE gui
                this.tone.play(); 
                this.tone.loop();          }
        } 

        if (command === 'stop') {
            if (this.tone.isPlaying()) {
                this.tone.stop();
            }
        }
    }

    setSensorValue(val) {
        this.cutoffSlider.value(val);
        this.cutoffTextVal.value(val);
    }
}