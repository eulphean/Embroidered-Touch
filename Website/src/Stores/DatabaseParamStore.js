// Name: DatabaseParamStore.js
// Author: Amay Kataria. 
// Date: 06/22/2021
// Description: This data store is responsible to hold parameters, which will be saved onto the database.  

import Websocket from "../components/Websocket";

class DatabaseParamStore {
    constructor() {
        // Cut off values for the entire system.
        // Filled with an initial set of values. 
        // Updated when new values are received from the database. 
        this.cutoffVals = {
            0: new Array(12).fill(0),
            1: new Array(12).fill(0)
        };

        // Keep track if the user has calibrated the system. 
        this.hasCalibrated = false; 

        this.configName = '';

        // Listeners for this database. 
        this.listeners = []; 
    }

    subscribe(listener) {
        this.listeners.push(listener); 
        const removeListener = () => {
            this.listeners = this.listeners.filter((s) => listener !== s);
        };

        return removeListener;
    }

    // Update the data in memory. 
    setCutOffVal(chipsetId, sensorIdx, cutoffVal) {
        if (sensorIdx >=1 && sensorIdx <= 12) {
            sensorIdx = sensorIdx - 1;
        } else {
            sensorIdx = sensorIdx - 12 - 1; 
        }
        // Update chipset data. 
        this.cutoffVals[chipsetId][sensorIdx] = cutoffVal; 
    }

    getCutOffVal(chipsetId, sensorIdx) {
        return this.cutoffVals[chipsetId][sensorIdx];
    }

    commitConfig() {
        // Create the payload with the config name and sensor values. 
        // Both the chip params will be stored to the database. 
        // [name - text, config - json] (Database Payload)
        // JSON object, which gets stringified and goes to the database.
        this.hasCalibrated = true; // We have calibrated the dress. 
        let jsonObject = this.getConfigJson();
        let dbPayload = {
            'name' : this.configName,
            'config' : JSON.stringify(jsonObject)
        };
        console.log(dbPayload);
        Websocket.updateUserConfig(dbPayload);
    }

    getConfigJson() {
        let jsonObject = {}; 
        for (let i = 0; i < 2; i++) { // Num chips = 2
            let chipsetData = []; 
            for (let j = 0; j < 12; j++) { // Num sensors = 12
                chipsetData[j] = this.cutoffVals[i][j]; 
            }

            jsonObject[i.toString()] = chipsetData; 
        }

        // Save this flag in the config. 
        jsonObject['hasCalibrated'] = this.hasCalibrated;
        return jsonObject; 
    }

    // Assign fetched config values to the cut off values. 
    setConfig(config) {
        // Cut off values. 
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 12; j++) {
                this.cutoffVals[i][j] = config[i][j]; 
            }
        }

        // Has calibrated flag. 
        this.hasCalibrated = config['hasCalibrated']; 
    }

    setConfigName(configName) {
        this.configName = configName; 
        console.log('Set Config Name: ' + configName);
    }
}

export default new DatabaseParamStore();