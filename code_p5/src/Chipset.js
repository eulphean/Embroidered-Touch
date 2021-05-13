// Name: Chipsets.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Class responsible for storing information related to a MPR121 chipset and all the interactive controls. 

const numSensors = 12; // Num sensors on each chip. 

// Commands for send buffer.
const RESET_COMMAND = 0; 
const SENSITIVITY_COMMAND = 1; 
const defaultThreshold = 12;
const defaultRelease = 6; 

class Chipset {
    constructor(chipsetIdx) {
        this.sensors = [];
        this.chipsetControlID = "#chipset-controls-" + chipsetIdx;
        this.sensorsID = "#sensors-" + chipsetIdx; // Sensor indexes. 
        this.filteredValID = "#filtered-val-" + chipsetIdx; // Filtered values.
        this.baseValID = "#base-val-" + chipsetIdx; // Base values.
        this.cutoffKnobID = "#cutoff-knob-" + chipsetIdx; // Cutoff knobs. 
        this.cutoffValID = "#cutoff-val-" + chipsetIdx; // Cutoff values. 
        this.adsrValID = "#adsr-val-" + chipsetIdx; // Cutoff values
        this.touchIndicatorID = "#touch-indicator-" + chipsetIdx; // Touch indicator. 

        // Populate interface nodes first, then initialize sensor nodes. 
        this.populateUITrees(); 
        this.initSensors();

        // Initialize a send bufffer for chipset controls. 
        this.sendBuffer = new Uint8Array(4); // [chipindex, command, value, value]
        this.sendBuffer[0] = chipsetIdx;
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
            'adsr' : select(this.adsrValID),
            'sensors' : select(this.sensorsID)
        }

        // Parse the interactive chipset controls for threshold / sensitivity / resetting the sensor. 
        this.chipsetControls = select(this.chipsetControlID); 
        this.resetButton = select(".b-reset", this.chipsetControls); 
        this.thresholdSlider = select(".s0", this.chipsetControls); 
        this.thresholdInput = select(".i0", this.chipsetControls); 
        this.releaseSlider = select(".s1", this.chipsetControls); 
        this.releaseInput  = select(".i1", this.chipsetControls); 
        this.sendButton = select(".b-send", this.chipsetControls);

        this.setupChipsetControls();         
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

    setupChipsetControls() {
        // Assign the values of sliders to the text inputs. 
        this.thresholdInput.value(this.thresholdSlider.value());
        this.releaseInput.value(this.releaseSlider.value());

        // Assign callbacks.
        this.resetButton.mousePressed(this.onReset.bind(this));
        this.sendButton.mousePressed(this.onSend.bind(this));

        // Slider input changes. 
        this.thresholdSlider.elt.addEventListener('input', this.handleThresholdSlider.bind(this));
        this.releaseSlider.elt.addEventListener("input", this.handleReleaseSlider.bind(this));

        // Text input changes. 
        this.thresholdInput.elt.addEventListener('input', this.handleThresholdTextInput.bind(this));
        this.releaseInput.elt.addEventListener('input', this.handleReleaseTextInput.bind(this));
    }

    onReset() {
        this.sendBuffer[1] = RESET_COMMAND; 
        bluetooth.sendBuffer(this.sendBuffer);

        // Reset sliders and text inputs to default value. 
        this.thresholdInput.value(defaultThreshold);
        this.thresholdSlider.value(defaultThreshold);

        this.releaseInput.value(defaultRelease);
        this.releaseSlider.value(defaultRelease);
    }

    onSend() {
        this.sendBuffer[1] = SENSITIVITY_COMMAND;
        this.sendBuffer[2] = this.thresholdInput.value();
        this.sendBuffer[3] = this.releaseInput.value();
        bluetooth.sendBuffer(this.sendBuffer);
    }

    handleThresholdSlider() {
        let v = this.thresholdSlider.value(); 
        this.thresholdInput.value(v); 
    }

    handleThresholdTextInput() {
        let v = this.thresholdInput.value(); 
        this.thresholdSlider.value(v);
    }

    handleReleaseSlider() {
        let v = this.releaseSlider.value(); 
        this.releaseInput.value(v);
    }

    handleReleaseTextInput() {
        let v = this.releaseInput.value(); 
        this.releaseSlider.value(v);
    }

    setSensorVal(sensorIdx, val) {
        let sensor = this.sensors[sensorIdx];
        sensor.setSensorVal(val);
    }
}