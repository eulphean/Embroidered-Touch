// Name: main.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Entry file for javascript. 

let bluetooth; // Bluetooth handler. 
let chipsets;  // Array of all chipsets. 
const numChipsets = 4; 

function setup() {
  bluetooth = new BLE(assignChipsetData); 
  chipsets = []; 
  initChipsets();  
}

function draw() {
  if (bluetooth.isReceivingData) {
    // Update all sensors to check for cuttoff values. 
    for (let i = 0; i < numChipsets; i++) {
      // Chipset index. 
      chipsets[i].update();
    }
  }
}

function initChipsets() {
  for (let i = 0; i < numChipsets; i++) {
    // Chipset index. 
    chipsets.push(new Chipset(i)); 
  }
}

// chipsetIdx: int: 0 - numChipsets
// sensorDataType: char: b: base, f: filtered
// sensorData: array: 0-11
function assignChipsetData(chipsetIdx, sensorDataType, sensorData) {
  chipsets[chipsetIdx].setData(sensorDataType, sensorData); 
}