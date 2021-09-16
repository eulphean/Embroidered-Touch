// Name: DatabaseParamStore.js
// Author: Amay Kataria. 
// Date: 06/22/2021
// Description: This data store is responsible to hold parameters, which will be saved onto the database.  

import Websocket from "../components/Websocket";
import {PRODUCT} from './ProductStore.js'

const numSensorChildA = 4; 
const numSensorChildB = 7; 
class DatabaseParamStore {
    constructor() {
        // Cut off values for the entire system.
        // Filled with an initial set of values. 
        // Updated when new values are received from the database. 
        // Each of them goes to its own table. 

        // Main sweater
        this.cutoffValsSweater = {
            0: new Array(12).fill(-1),
            1: new Array(12).fill(-1)
        };

        // Child sweater A.
        this.cutoffValsChildA = {
            0: new Array(numSensorChildA).fill(-1)
        };

        // Child sweater B.
        this.cutoffValsChildB = {
            0: new Array(numSensorChildB).fill(-1)
        }

        // Keeps track if all the products have been calibrated. 
        this.hasCalibrated = [false, false, false]; 

        // Current config. 
        this.curConfigName = '';
        this.curProduct = ''; 

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
    setCutOffVal(product, chipsetId, sensorIdx, cutoffVal) {
        if (product === PRODUCT.SWEATER) {
            if (sensorIdx >=1 && sensorIdx <= 12) {
                sensorIdx = sensorIdx - 1;
            } else {
                sensorIdx = sensorIdx - 12 - 1; 
            }
            // Update chipset data. 
            this.cutoffVals[chipsetId][sensorIdx] = cutoffVal; 
        } else if (product === PRODUCT.CHILDA) {
            sensorIdx = sensorIdx - 1; 
            this.cutoffValsChildA[0][sensorIdx] = cutoffVal; 
        } else if (product === PRODUCT.CHILDB) {
            sensorIdx = sensorIdx - 1; 
            this.cutoffValsChildB[0][sensorIdx] = cutoffVal; 
        }
    }

    getCutOffVal(chipsetId, sensorIdx) {
        return this.cutoffVals[chipsetId][sensorIdx];
    }

    commitConfig(product) {
        // Create the payload with the config name and sensor values. 
        // Both the chip params will be stored to the database. 
        // [name - text, config - json] (Database Payload)
        // JSON object, which gets stringified and goes to the database.
        let jsonObject; let pString = ""; 
        if (product === PRODUCT.SWEATER) {
            this.hasCalibrated[0] = true; // We have calibrated the dress. 
            jsonObject = this.getConfigJson(product);
            pString = 'adult';
        } else if (product === PRODUCT.CHILDA) {
            this.hasCalibrated[1] = true; 
            jsonObject = this.getConfigJson(product); 
            pString = 'childa';
        } else if (product === PRODUCT.CHILDB) {
            this.hasCalibrated[2] = true; 
            jsonObject = this.getConfigJson(product); 
            pString = 'childb';
        }

        // We add a product so we know which database to commit the data to. 
        let dbPayload = {
            'name' : this.configName,
            'config' : JSON.stringify(jsonObject),
            'product' : pString
        };
        console.log(dbPayload);
        Websocket.updateUserConfig(dbPayload);
    }

    // Create a default JSON for each product and return it as an array. 
    getDefaultJson() {
        let json = {}; 

       // Create the JSON for main sweater
        for (let i = 0; i < 2; i++) { // Num chips = 2
            let chipsetData = []; 
            for (let j = 0; j < 12; j++) { // Num sensors = 12
                chipsetData[j] = 0;
            }

            json[i.toString()] = chipsetData; 
        } 

        // Save this flag in the config. 
        json['hasCalibrated'] = this.hasCalibrated[0];

        // JSON for child sweater A.
        let jsonChildA = {}; let dataA = []; 
        for (let i = 0; i < numSensorChildA; i++) {
            dataA[i] = 0; 
        }
        jsonChildA['0'] = dataA; 
        jsonChildA['hasCalibrated'] = this.hasCalibrated[1];


        // JSON for child sweater B.
        let jsonChildB = {}; let dataB = [];
        for (let i = 0; i < numSensorChildB; i++) {
            dataB[i] = 0; 
        }
        jsonChildB['0'] = dataB;
        jsonChildB['hasCalibrated'] = this.hasCalibrated[2]; 
        
        let j = [json, jsonChildA, jsonChildB]; 
        return j; 
    }

    // Based on the product we are using, pull the right config. 
    getConfigJson(product) {
        let json = {};
        switch (product) {
            case PRODUCT.SWEATER: {
                for (let i = 0; i < 2; i++) { // Num chips = 2
                    let chipsetData = []; 
                    for (let j = 0; j < 12; j++) { // Num sensors = 12
                        chipsetData[j] = this.cutoffValsSweater[i][j];
                    }
        
                    json[i.toString()] = chipsetData; 
                } 
        
                // Save this flag in the config. 
                json['hasCalibrated'] = this.hasCalibrated[0];
                break; 
            }

            case PRODUCT.CHILDA: {
                let data = []; 
                for (let i = 0; i < numSensorChildA; i++) {
                    data[i] = this.cutoffValsChildA[0][i]; 
                }
                json['0'] = data; 
                json['hasCalibrated'] = this.hasCalibrated[1];
                break; 
            }

            case PRODUCT.CHILDB: {
                let data = []; 
                for (let i = 0; i < numSensorChildB; i++) {
                    data[i] = this.cutoffValsChildB[0][i]; 
                }
                json['0'] = data; 
                json['hasCalibrated'] = this.hasCalibrated[2];
                break; 
            }

            default: 
                break;
        }

        return json; 
    }

    getDefaultConfigs() {
        let jsonObject = {}; 
        for (let i = 0; i < 2; i++) { // Num chips = 2
            let chipsetData = []; 
            for (let j = 0; j < 12; j++) { // Num sensors = 12
                chipsetData[j] = this.cutoffValsSweater[i][j]; 
            }

            jsonObject[i.toString()] = chipsetData; 
        }

        // Save this flag in the config. 
        jsonObject['hasCalibrated'] = this.hasCalibrated;
        return jsonObject; 
    }

    // Assign fetched config values to the cut off values. 
    setConfig(configs) {
        // Cut off values for sweater
        let sweater = configs[0]; 
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 12; j++) {
                this.cutoffValsSweater[i][j] = sweater[i][j]; 
            }
        }
        // Has calibrated flag. 
        this.hasCalibrated[0] = sweater['hasCalibrated']; 

        // Cut off values for childA 
        let childa = configs[1];
        for (let i = 0; i < numSensorChildA; i++) {
            this.cutoffValsChildA[0][i] = childa[0][i];  
        }
        this.hasCalibrated[1] = childa['hasCalibrated'];
        console.log(this.cutoffValsChildA); 

        // Cut off values for childB
        let childb = configs[2]; 
        for (let i = 0; i < numSensorChildB; i++) {
            this.cutoffValsChildB[0][i] = childb[0][i];
        }
        this.hasCalibrated[2] = childb['hasCalibrated'];
        console.log(this.cutoffValsChildB);
    }

    setConfigName(configName) {
        this.configName = configName; 
        console.log('Set Config Name: ' + configName);
    }
}

export default new DatabaseParamStore();