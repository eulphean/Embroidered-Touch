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
            0: new Array(12).fill(150),
            1: new Array(12).fill(150)
        }

        this.configName = '';

        // Listeners for this database. 
        this.listeners = []; 

        // Fire an async db call to load all configs.
        // Websocket.requestForConfigs(this.onAllConfigsLoaded.bind(this)); 
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
        return jsonObject; 
    }

    // Assign config values to the cut off values. 
    setConfig(config) {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 12; j++) {
                this.cutoffVals[i][j] = config[i][j]; 
            }
        }
    }

    setConfigName(configName) {
        this.configName = configName; 
        console.log('Set Config Name: ' + configName);
    }
}

export default new DatabaseParamStore(); 



// getCutoffValue(chipsetId, sensorIdx) {
//     if (this.configs[configName]) {
//         let v = this.configs[configName][chipsetId]['cutoff'][sensorIdx];
//         return v;
//     } else {
//         // Return default values when there is no config name.
//         // This happens in the beginning.
//         return this.cutoffVals[chipsetId]['co'][sensorIdx];
//     }
// }

    // TODO: Don't need to load all configs. 
    // onAllConfigsLoaded(data) {
    //     let configs = data; 
    //     for (let i = 0; i < configs.length; i++) {
    //         let name = configs[i]['name'];
    //         let json = configs[i]['config'];
    //         this.configs[name] = json; 
    //     }

    //     console.log(this.configs);

    //     // Intimate all the subscribers of the updates.
    //     for (let i = 0; i < this.listeners.length; i++) {
    //         this.listeners[i](this.configs); 
    //     }
    // }

    // getDefaultConfig() {
    //     let jsonObject = {}; 
    //     for (let i = 0; i < 2; i++) { // Num chips = 2
    //         let chipsetData = {}; 
    //         chipsetData['cutoff'] = {}; 
    //         for (let j = 0; j < 12; j++) { // Num sensors = 12
    //             let cutoffVals = this.cutoffVals[i]['co']; 
    //             chipsetData['cutoff'][j] = cutoffVals[j];  
    //         }

    //         jsonObject[i.toString()] = chipsetData; 
    //     }

    //     return jsonObject; 
    // }