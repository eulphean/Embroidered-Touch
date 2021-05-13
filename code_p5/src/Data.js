// Name: Data.js
// Author: Amay Kataria. 
// Date: 04/29/2021
// Description: Class responsible to collect, save JSON data. And also load existing files from the disk. 

const jsontreeID = '#jsoncontrols';
const saveButtonClass = '.b-savejson';
const loadButtonClass = '.b-loadjson';
const fileinputID = '#file-input'; // This is hidden right now. 

class Data {
    constructor() {
        this.saveButton = '';
        this.loadButton = '';
        this.jsonObj = {}; 
        this.fileHandle = '';

        this.parseUI(); 
    }

    parseUI() {
        const jsontree = select(jsontreeID);
        this.saveButton = select(saveButtonClass, jsontree);
        this.loadButton = select(loadButtonClass, jsontree);
        this.fileHandle = select(fileinputID);

        // Assign callbacks. 
        this.saveButton.mousePressed(this.saveAppData.bind(this));
        this.loadButton.mousePressed(this.loadJSONData.bind(this));
        this.fileHandle.elt.addEventListener('change', this.handleFileSelect.bind(this));
    }

    saveAppData() {
        if (chipsets.length > 0) {
            for (let i = 0; i < chipsets.length; i++) {
                let chipsetData = {};

                // Chipset properties. 
                let currentChipset = chipsets[i];
                chipsetData['thresh'] = currentChipset.thresholdInput.value();
                chipsetData['rel'] = currentChipset.releaseInput.value();
                
                // Sensor properties.
                let sensors = currentChipset.sensors;
                
                // Cutoff values.
                chipsetData['cutoff'] = {}; 
                for (let j = 0; j < sensors.length; j++) {
                    chipsetData['cutoff'][j] = sensors[j].cutoffTextVal.value();
                }
                
                // Active/Inactive state
                chipsetData['state'] = {}; 
                for (let j = 0; j < sensors.length; j++) {
                    chipsetData['state'][j] = sensors[j].isSensorActive;
                }

                // ADSR values
                chipsetData['adsr'] = {}; 
                for (let j = 0; j < sensors.length; j++) {
                    let adsr = sensors[j].adsr; 
                    
                    // Hold adsr values for each object. 
                    let adsrObj = {}; 
                    adsrObj['attackLevel'] = adsr.getAttackLevel();
                    adsrObj['attackTime'] = adsr.getAttackTime();
                    adsrObj['decayLevel'] = adsr.getDecayLevel();
                    adsrObj['decayTime'] = adsr.getDecayTime();
                    adsrObj['releaseLevel'] = adsr.getReleaseLevel();
                    adsrObj['releaseTime'] = adsr.getReleaseTime();
                    chipsetData['adsr'][j] = adsrObj;
                }

                this.jsonObj[i.toString()] = chipsetData; 
            }
        }

        // P5.js call to save data. 
        saveJSON(this.jsonObj, "fabric_instrument_backup.json");
    }

    loadJSONData() {
        this.fileHandle.elt.click();
    }

    handleFileSelect (e) {
        var files = e.target.files;
        if (files.length < 1) {
            alert('select a file...');
            return;
        }

        // Load the first file chosen.
        var file = files[0];
        var reader = new FileReader();
        reader.onload = this.onFileLoaded.bind(this);
        reader.readAsDataURL(file);
    }
    
    onFileLoaded (e) {
        var match = /^data:(.*);base64,(.*)$/.exec(e.target.result);
        if (match == null) {
            throw 'Could not parse result'; // should not happen
        }
        var url = match[0];
        // var mimeType = match[1];
        // var content = match[2];
        loadJSON(url, this.onJSONLoaded.bind(this));
    }

    onJSONLoaded(json) {
        // Read this data and assign to all the right components in the application. 
        if (chipsets.length > 0) {
            for (let i = 0; i < chipsets.length; i++) {
                let chipsetData = {};
                let currentChipset = chipsets[i];

                let savedChipsetData = json[i];

                // Chipsets values. 
                currentChipset.thresholdInput.value(savedChipsetData['thresh']);
                currentChipset.releaseInput.value(savedChipsetData['rel']);
                
                let sensors = currentChipset.sensors;

                // Sensor values
                // Cutoff
                let cutoffValues = savedChipsetData['cutoff'];
                for (let j = 0; j < sensors.length; j++) {
                    sensors[j].setSensorValue(cutoffValues[j]);
                }

                // Sensor state
                let stateValues = savedChipsetData['state'];
                for (let j = 0; j < sensors.length; j++) {
                    sensors[j].isSensorActive = stateValues[j]; 
                    sensors[j].setSensorActiveStyle();
                }

                // ADSR values
                let adsrValues = savedChipsetData['adsr'];
                for (let j = 0; j < sensors.length; j++) {
                    let adsr = sensors[j].adsr
                    let attackLevel = adsrValues[j]['attackLevel'];
                    let attackTime = adsrValues[j]['attackTime'];
                    let decayLevel = adsrValues[j]['decayLevel'];
                    let decayTime = adsrValues[j]['decayTime'];
                    let releaseLevel = adsrValues[j]['releaseLevel'];
                    let releaseTime = adsrValues[j]['releaseTime'];
                    adsr.setValuesFromJSON(attackLevel, attackTime, decayLevel, decayTime, releaseLevel, releaseTime);
                }
            }
        }
    }
}