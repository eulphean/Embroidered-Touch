// Name: main.js
// Author: Amay Kataria. 
// Date: 04/21/2020
// Description: Entry file for javascript. 


// Setup BleUART service. 
const serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"; // transmit is from the phone's perspective
const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";  // receive is from the phone's perspective

let myRxCharacteristic;
let myTxCharacteristic;
let myBLE;
let receiveText;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();
  console.log(myBLE);

  // Setup the canvas and buttons. 
  createCanvas(600, 400);
  textSize(20);
  textAlign(CENTER, CENTER);
  
  // Create a 'Connect and Start Notifications' button
  const connectButton = createButton('Connect and Start Notifications')
  connectButton.mousePressed(connectAndStartNotify);

  // Create a 'Stop Notifications' button
  const stopButton = createButton('Stop Notifications')
  stopButton.mousePressed(stopNotifications);

  const sendButton = createButton('Send Data')
  sendButton.mousePressed(sendData);


  // receiveText = createElement('textarea', '').id("receiveText");
  // receiveText.style("width: 100%; height: 100px; ")
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log(characteristics); 
  myTxCharacteristic = characteristics[0]; 
  myRxCharacteristic = characteristics[1];
  myBLE.startNotifications(myRxCharacteristic, handleNotifications, 'string');
}
 
function handleNotifications(data) {
  console.log(data);
}

// A function to stop notifications
function stopNotifications() {
  myBLE.stopNotifications(myCharacteristic);
}

function sendData() {
  console.log('Send Data');
  let buffer = new Uint8Array([0, 20, 30, 40]);
  //myTxCharacteristic.writeValue(bufferToSend);
  //let a = Uint8Array.of("Hello");
  const bufferToSend = new Uint8Array(toUTF8Array("HELLO BABLUUUU"));
  //myBLE.write(myTxCharacteristic, buffer);
  //myTxCharacteristic.writeValue(a);
  myTxCharacteristic.writeValue(bufferToSend);
}

function draw() {
}

function toUTF8Array(str) {
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 
                    0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
          i++;
          charcode = ((charcode&0x3ff)<<10)|(str.charCodeAt(i)&0x3ff)
          utf8.push(0xf0 | (charcode >>18), 
                    0x80 | ((charcode>>12) & 0x3f), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
  }
  return utf8;
}
