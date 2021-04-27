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

  // Setup the canvas and buttons. 
  // createCanvas(600, 400);
  // textSize(20);
  // textAlign(CENTER, CENTER);
  
  // const connectButton = createButton('Connect and Start Notifications')
  // connectButton.mousePressed(connectBluetooth);
  // const stopButton = createButton('Stop Notifications')
  // stopButton.mousePressed(stopNotifications);
}

function draw() {
  // Update the UI with sensor data. 
}

function connectBluetooth() {
  bluetooth.connect(); 
}

function stopNotifications() {
  bluetooth.stop(); 
}

function initChipsets() {
  for (let i = 0; i < numChipsets; i++) {
    chipsets.push(new Chipset()); 
  }
}
// chipsetIdx: int: 0 - numChipsets
// sensorDataType: char: b: base, f: filtered
// sensorData: array: 0-11
function assignChipsetData(chipsetIdx, sensorDataType, sensorData) {
  chipsets[chipsetIdx].setData(sensorDataType, sensorData); 
}