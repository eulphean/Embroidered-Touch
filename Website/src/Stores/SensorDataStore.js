// Name: SensorDataStore.js
// Author: Amay Kataria. 
// Date: 06/21/2021
// Description: Custom data store is responsible to hold all sensor data for each chip. Component subscribe to this store
// or call its general access methods to get the data. 
// State structure. 
// [
//     {
//         'f': [xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx],
//         'b': [xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx]
//     },
//     {
//         'f': [xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx],
//         'b': [xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx, xx]
//     }
// ]

class SensorDataStore {
    constructor() {
        // Initial state.
        // Array of two objects. Each object holds data from each chip.
        this.state = [{
            'f' : new Array(12).fill(0),
            'b' : new Array(12).fill(0)
        }, {
            'f' : new Array(12).fill(0),
            'b' : new Array(12).fill(0)
        }]; 

        this.listeners = []; 
    }

    // Returns the method to be called to remove itself as listener. 
    // Component must call that on unmounting. 
    subscribe(listener) {
        this.listeners.push(listener); 
        const removeListener = () => {
            this.listeners = this.listeners.filter((s) => listener !== s);
        };

        return removeListener;
    }

    // Populates the store. 
    setState(chipsetIdx, sensorDataType, sensorData) {
        // console.log('Chipset Idx, Data type, sensor Data: ' + chipsetIdx + ", " + sensorDataType + ", " + sensorData);
        // Populate the state. 
        for (let i = 0; i < sensorData.length; i++) {
            let v = Number(sensorData[i]); 
            this.state[chipsetIdx][sensorDataType][i] = v; 
        }

        // Alert all the listeners that new data is received. 
        for (let listener of this.listeners) {
            listener();
        }
    }

    getChipData(chipsetIdx) {
        return this.state[chipsetIdx]; 
    }

    getSensorData(chipsetId, sensorIdx) {
        return this.state[chipsetId]['f'][sensorIdx];
    }
}

export default new SensorDataStore(); 