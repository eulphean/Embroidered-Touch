// Name: main.js
// Author: Amay Kataria. 
// Date: 04/21/2021
// Description: Entry file for javascript. 

let bluetooth; // Bluetooth handler. 
let chipsets;  // Array of all chipsets. 
let dateTime; // Datetime node in the tree. 
let audio; // Audio handler. 

const numChipsets = 4; 
const datetimeID = "#datetime";

// Preload all audio files. 
function preload() {
  audio = new Audio(); 
}

function setup() {
  // Date time interface. 
  dateTime = select(datetimeID);
  setCurrentTime();

  // Bluetooth connection and interface. 
  bluetooth = new BLE(assignChipsetData); 
  
  // Chipset interface and sensor data. 
  chipsets = []; 
  initChipsets();  

  // Update current time. 
  setInterval(setCurrentTime, 1000); 
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

function setCurrentTime() {
  let a = new Date();
  dateTime.html(a);
}