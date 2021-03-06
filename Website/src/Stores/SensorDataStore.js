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

import { PRODUCT } from "./ProductStore";

const numSensorChildA = 4; 
const numSensorChildB = 7;
class SensorDataStore {
    constructor() {
        // Initial state.
        // Array of two objects. Each object holds data from each chip.
        this.adultState = [{
            'f' : new Array(12).fill(0)
        }, {
            'f' : new Array(12).fill(0)
        }]; 

        // Child sweater A.
        this.childAState = {
            0: new Array(numSensorChildA).fill(0)
        };

        // Child sweater B.
        this.childBState = {
            0: new Array(numSensorChildB).fill(0)
        }

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
    setAdultSweaterData(chipsetIdx, sensorData) {
        // Populate the state. 
        for (let i = 0; i < sensorData.length; i++) {
            let v = Number(sensorData[i]); 
            this.adultState[chipsetIdx]['f'][i] = v; 
        }

        // Alert all the listeners that new data is received. 
        for (let listener of this.listeners) {
            listener();
        }
    }

    // Populate the store with children data. 
    setChildSweaterData(isChildA, sensorData) {
        for (let i =0; i < sensorData.length; i++) {
            let v = Number(sensorData[i]); 
            if (isChildA) {
                this.childAState[0][i] = v; 
            } else {
                this.childBState[0][i] = v;
            }
        }

        // Alert all the listeners that new data is received. 
        for (let listener of this.listeners) {
            listener();
        }
    }

    getAdultSweaterData(chipsetIdx) {
        return this.adultState[chipsetIdx]; 
    }

    getChildSweaterData(isChildA) {
        if (isChildA) {
            return this.childAState;
        } else {
            return this.childBState;
        }
    }

    getSensorData(product, chipsetId, sensorIdx) {
        if (product === PRODUCT.SWEATER) {
            sensorIdx = sensorIdx - 1; 
            if (sensorIdx >= 12 && sensorIdx <=23) {
                sensorIdx = sensorIdx - 12; 
            }
            return this.adultState[chipsetId]['f'][sensorIdx];
        } else if (product === PRODUCT.CHILDA) {
            sensorIdx = sensorIdx - 1; 
            return this.childAState[0][sensorIdx];
        } else if (product === PRODUCT.CHILDB) {
            sensorIdx = sensorIdx - 1; 
            return this.childBState[0][sensorIdx]; 
        }
    }
}

export default new SensorDataStore(); 