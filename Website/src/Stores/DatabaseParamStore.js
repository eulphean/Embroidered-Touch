// Name: DatabaseParamStore.js
// Author: Amay Kataria. 
// Date: 06/22/2021
// Description: This data store is responsible to hold parameters, which will be saved onto the database.  

import Websocket from "../components/Websocket";

class DatabaseParamStore {
    constructor() {
        // Cut off values for the entire system.
        // This is the current state. 
        // Initial cutoff values filled.
        this.cutoffVals = [{
            'co': new Array(12).fill(150), // For chipset 0
        }, {
            'co': new Array(12).fill(150) // For chipset 1
        }]; 

        // All use the user configs are loaded and stored in this. 
        // Any save or update should also save and update this.         
        // [NOTE] We should do this based on db success but I'm not plumbing that code for now. 
        // Key is configName, Value is json
        this.configs = {}; 

        // All the listeners subscribed to this database.
        this.listeners = []; 

        // Fire an async db call to load all configs.
        Websocket.requestForConfigs(this.onAllConfigsLoaded.bind(this)); 
    }

    subscribe(listener) {
        this.listeners.push(listener); 
        const removeListener = () => {
            this.listeners = this.listeners.filter((s) => listener !== s);
        };

        return removeListener;
    }

    // Update the store. 
    setState(chipsetId, sensorIdx, cutoffVal) {
        // console.log('ChipsetId: ' + chipsetId + ', sensorIdx: ' + sensorIdx + ', cutoffVal: ' + cutoffVal);
        // Update chipset data. 
        this.cutoffVals[chipsetId]['co'][sensorIdx] = cutoffVal; 
    }

    // TODO: Don't need to load all configs. 
    onAllConfigsLoaded(data) {
        let configs = data; 
        for (let i = 0; i < configs.length; i++) {
            let name = configs[i]['name'];
            let json = configs[i]['config'];
            this.configs[name] = json; 
        }

        console.log(this.configs);

        // Intimate all the subscribers of the updates.
        for (let i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.configs); 
        }
    }

    saveParams(configName, save = true) {
        // Create the payload with the config name and sensor values. 
        // Both the chip params will be stored to the database. 
        // [name - text, config - json]
        // Database payload. 

        // JSON object, which gets stringified and goes to the database.
        let jsonObject = {}; 
        for (let i = 0; i < 2; i++) { // Num chips = 2
            let chipsetData = {}; 
            chipsetData['cutoff'] = {}; 
            for (let j = 0; j < 12; j++) { // Num sensors = 12
                let cutoffVals = this.cutoffVals[i]['co']; 
                chipsetData['cutoff'][j] = cutoffVals[j];  
            }

            jsonObject[i.toString()] = chipsetData; 
        }

        let dbPayload = {
            'name' : configName,
            'config' : JSON.stringify(jsonObject)
        };

        if (save) {
            Websocket.saveUserConfig(dbPayload);
            // Update config state with the new payload. 
            this.configs[configName] = jsonObject;
        } else {
            Websocket.updateUserConfig(dbPayload);
            // Replace the old config here with the new config.
            this.configs[configName] = jsonObject;
        }

    }

    updateParams(configName) {
        this.saveParams(configName, false); 
    }

    getCutoffValue(configName, chipsetId, sensorIdx) {
        if (this.configs[configName]) {
            let v = this.configs[configName][chipsetId]['cutoff'][sensorIdx];
            return v;
        } else {
            // Return default values when there is no config name.
            // This happens in the beginning.
            return this.cutoffVals[chipsetId]['co'][sensorIdx];
        }
    }

    getDefaultConfig() {
        let jsonObject = {}; 
        for (let i = 0; i < 2; i++) { // Num chips = 2
            let chipsetData = {}; 
            chipsetData['cutoff'] = {}; 
            for (let j = 0; j < 12; j++) { // Num sensors = 12
                let cutoffVals = this.cutoffVals[i]['co']; 
                chipsetData['cutoff'][j] = cutoffVals[j];  
            }

            jsonObject[i.toString()] = chipsetData; 
        }

        return jsonObject; 
    }
}

export default new DatabaseParamStore(); 