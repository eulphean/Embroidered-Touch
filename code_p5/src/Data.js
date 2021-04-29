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
                let currentChipset = chipsets[i];
                chipsetData['thresh'] = currentChipset.thresholdInput.value();
                chipsetData['rel'] = currentChipset.releaseInput.value();
                let sensors = currentChipset.sensors;
                const cutoffPrefix = "co"; 
                for (let j = 0; j < sensors.length; j++) {
                    let a = cutoffPrefix + j;
                    chipsetData[a] = sensors[j].cutoffTextVal.value();
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
                currentChipset.thresholdInput.value(savedChipsetData['thresh']);
                currentChipset.releaseInput.value(savedChipsetData['rel']);
                
                let sensors = currentChipset.sensors;
                const cutoffPrefix = "co"; 
                for (let j = 0; j < sensors.length; j++) {
                    let sensorKey = cutoffPrefix + j;
                    sensors[j].setSensorValue(savedChipsetData[sensorKey]);
                }
            }
        }
    }
}