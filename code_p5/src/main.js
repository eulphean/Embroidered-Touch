// Author: Amay Kataria & Christine Shallenberg
// Date: 04/21/2020
// Description: Entry file for this p5 sketch. 

const serviceUuid = 0x1234;

let Tcharacteristic;
let Ycharacteristic;
let Xcharacteristic;
let TValue = 0;
let YValue = 0;
let XValue = 0;
let myBLE;

let numfiles = 37;

let tone1; //sound files
let tone2;
let tone3;
let tone4;
let tone5;
let tone6;
let tone7;
let tone8;
let tone9;
let tone10;
let tone11;
let tone12;
let tone13;
let tone14;
let tone15;
let tone16;
let tone17;
let tone18;
let tone19;
let tone20;
let tone21;
let tone22;
let tone23;
let tone24;
let tone25;
let tone26;
let tone27;
let tone28;
let tone29;
let tone30;
let tone31;
let tone32;
let tone33;
let tone34;
let tone35;
let tone36;
let tone37;

//volume level
let n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11, n12, n13, n14, n15, n16, n17, n18, n19, n20, n21, n22, n23, n24, n25, n26, n27, n28, n29, n30, n31, n32, n33, n34, n35, n36, n37;

let startvol = 0.001;
let vol = 0.05;


function preload() {
  
  // for (int n = 1; n <= numfiles; n++) { 
  //   tone[n] = loadSound('tone + n + .wav'); 
  // }
  
  tone1 = loadSound('Audio/bells.wav');
  tone2 = loadSound('Audio/birds1.wav');
  tone3 = loadSound('Audio/cicada.wav');
  tone4 = loadSound('Audio/bells2.wav');
  tone5 = loadSound('Audio/birds2.wav');
  tone6 = loadSound('Audio/leaves.wav');
  tone7 = loadSound('Audio/bells3.wav');
  tone8 = loadSound('Audio/birds3.wav');
  tone9 = loadSound('Audio/wind.wav');
  tone10 = loadSound('Audio/birds4.wav');
  tone11 = loadSound('Audio/leaves.wav');
  tone12 = loadSound('Audio/birds5.wav');
  tone13 = loadSound('Audio/bells.wav');
  tone14 = loadSound('Audio/birds1.wav');
  tone15 = loadSound('Audio/cicada.wav');
  tone16 = loadSound('Audio/bells2.wav');
  tone17 = loadSound('Audio/birds2.wav');
  tone18 = loadSound('Audio/leaves.wav');
  tone19 = loadSound('Audio/bells3.wav');
  tone20 = loadSound('Audio/birds3.wav');
  tone21 = loadSound('Audio/wind.wav');
  tone22 = loadSound('Audio/birds4.wav');
  tone23 = loadSound('Audio/wind2.wav');  
  tone24 = loadSound('Audio/birds5.wav');
  tone25 = loadSound('Audio/bells.wav');
  tone26 = loadSound('Audio/birds1.wav');
  tone27 = loadSound('Audio/cicada.wav');
  tone28 = loadSound('Audio/bells2.wav');
  tone29 = loadSound('Audio/birds2.wav');
  tone30 = loadSound('Audio/leaves.wav');
  tone31 = loadSound('Audio/bells3.wav');
  tone32 = loadSound('Audio/birds3.wav');
  tone33 = loadSound('Audio/leaves.wav');
  tone34 = loadSound('Audio/birds4.wav');
  tone35 = loadSound('Audio/wind2.wav');
  tone36 = loadSound('Audio/birds5.wav');
  tone37 = loadSound('Audio/bells.wav');
}

function setup() {
  createCanvas(600, 400);
  // Create a p5ble class
  myBLE = new p5ble();
  textSize(20);
  textAlign(CENTER, CENTER);
  
  //for (let n = 1; n <= 37; n++) {
     //tone1.setVolume(0.0); 
   //}
  
  // Create a 'Connect and Start Notifications' button
  const connectButton = createButton('Connect and Start Notifications')
  connectButton.mousePressed(connectAndStartNotify);

  // Create a 'Stop Notifications' button
  const stopButton = createButton('Stop Notifications')
  stopButton.mousePressed(stopNotifications);
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  TCharacteristic = characteristics[0];
  YCharacteristic = characteristics[1];
  XCharacteristic = characteristics[2];
  
  myBLE.startNotifications(TCharacteristic, handleT);
  myBLE.startNotifications(YCharacteristic, handleY);
  myBLE.startNotifications(XCharacteristic, handleX);
}

function handleT(data) {
  console.log('Tdata: ', data);
  TValue = Number(data);
}

function handleY(data) {
  console.log('Ydata: ', data);
  YValue = Number(data);
}

function handleX(data) {
  console.log('Xdata: ', data);
  XValue = Number(data);
}

// A function to stop notifications
function stopNotifications() {
  myBLE.stopNotifications(TCharacteristic);
  myBLE.stopNotifications(YCharacteristic);
  myBLE.stopNotifications(XCharacteristic);
}

// function fadeUp(num) {
//    for (let n = 0.0; n <= 1.0; n+=0.1) { 
//      tone[num].setVolume(n, 3); 
//      print("n ="+n);
//    }
// }

function draw() {
  
  if ( XValue > 0 || YValue > 0 || TValue > 0) { 
    startvol = startvol+0.00001;
    vol = vol+0.0001;
  } else {
    startvol = 0.0001;
    vol = 0.001;
  }
    
  if  (XValue == 1){
    if (tone1.isPlaying()) {
    n1 = n1+vol;
      tone1.setVolume(n1);
      print("n1="+n1);
  } else {
    n1 = startvol;
    tone1.setVolume(n1);
    tone1.play();
  }
}

if  (XValue == 2){
    if (tone2.isPlaying()) {
      n2 = n2+vol;
      tone2.setVolume(n2);
  } else {
    n2 = startvol;
    tone2.setVolume(n2);
    tone2.play();
  }
}

if  (XValue == 3){
    if (tone3.isPlaying()) {
      n3 = n3+vol;
      tone3.setVolume(n3);
  } else {   
    n3 = startvol;
    tone3.setVolume(n3);
    tone3.play();
  }
}

if  (XValue == 4){
    if (tone4.isPlaying()) {
      n4 = n4+vol;
      tone4.setVolume(n4);
  } else {
    n4 = startvol;
    tone4.setVolume(n4);
    tone4.play();
  }
}

if  (XValue == 5){
    if (tone5.isPlaying()) {
      n5 = n5+vol;
      tone5.setVolume(n5);
  } else {
    n5 = startvol;
    tone5.setVolume(n5);
    tone5.play();
  }
}

if  (XValue == 6){
    if (tone6.isPlaying()) {
      n6 = n6+vol;
      tone6.setVolume(n6);
  } else {
    n6 = startvol;
    tone6.setVolume(n6);
    tone6.play();
  }
}

if  (XValue == 7){
    if (tone7.isPlaying()) {
    n7 = n7+vol;
    tone7.setVolume(n7);
  } else {
    n7 = startvol;
    tone7.setVolume(n7);
    tone7.play();
  }
}

if  (XValue == 8){
    if (tone8.isPlaying()) {
    n8 = n8+vol;
    tone8.setVolume(n8);
  } else {
    n8 = startvol;
    tone8.setVolume(n8);
    tone8.play();
  }
}

if  (XValue == 9){
    if (tone9.isPlaying()) {
    n9 = n9+vol;
    tone9.setVolume(n9);  
  } else {
    n9 = startvol;
    tone9.setVolume(n9);
    tone9.play();
  }
}

if  (XValue == 10){
    if (tone10.isPlaying()) {
    n10 = n10+vol;
    tone10.setVolume(n10); 
  } else {
    n10 = startvol;
    tone10.setVolume(n10);
    tone10.play();
  }
}

if  (XValue == 11){
    if (tone11.isPlaying()) {
    n11 = n11+vol;
    tone11.setVolume(n11); 
  } else {
    n11 = startvol;
    tone11.setVolume(n11);
    tone11.play();
  }
}

if  (XValue == 12){
    if (tone12.isPlaying()) {
    n12 = n12+vol;
    tone12.setVolume(n12); 
  } else {
    n12 = startvol;
    tone12.setVolume(n12);
    tone12.play();
  }
}
  
  if  (TValue == 1){
    if (tone13.isPlaying()) {
    n13 = n13+vol;
    tone13.setVolume(n13); 
  } else {
    n13 = startvol;
    tone13.setVolume(n13);
    tone13.play();
  }
}
  
    if  (TValue == 2){
    if (tone14.isPlaying()) {
    n14 = n14+vol;
    tone14.setVolume(n14); 
  } else {
    n14 = startvol;
    tone14.setVolume(n14);
    tone14.play();
  }
}
  
    if  (TValue == 3){
    if (tone15.isPlaying()) {
    n15 = n15+vol;
    tone15.setVolume(n15); 
  } else {
    n15 = startvol;
    tone15.setVolume(n15);
    tone15.play();
  }
}
  
    if  (TValue == 4){
    if (tone16.isPlaying()) {
    n16 = n16+vol;
    tone16.setVolume(n16); 
  } else {
    n16 = startvol;
    tone16.setVolume(n16);
    tone16.play();
  }
}
  
    if  (TValue == 5){
    if (tone17.isPlaying()) {
    n17 = n17+vol;
    tone17.setVolume(n17);
  } else {
    n17 = startvol;
    tone17.setVolume(n17);
    tone17.play();
  }
}
  
    if  (TValue == 6){
    if (tone18.isPlaying()) {
    n18 = n18+vol;
    tone18.setVolume(n18);
  } else {
    n18 = startvol;
    tone18.setVolume(n18);
    tone18.play();
  }
}
  
    if  (TValue == 7){
    if (tone19.isPlaying()) {
    n19 = n19+vol;
    tone19.setVolume(n19);
  } else {
    n19 = startvol;
    tone19.setVolume(n19);
    tone19.play();
  }
}
  
    if  (TValue == 8){
    if (tone20.isPlaying()) {
    n20 = n20+vol;
    tone20.setVolume(n20);
  } else {
    n20 = startvol;
    tone20.setVolume(n20);
    tone20.play();
  }
}
  
    if  (TValue == 9){
    if (tone21.isPlaying()) {
    n21 = n21+vol;
    tone21.setVolume(n21);
  } else {
    n21 = startvol;
    tone21.setVolume(n21);
    tone21.play();
  }
}
  
    if  (TValue == 10){
    if (tone22.isPlaying()) {
    n22 = n22+vol;
    tone22.setVolume(n22);
  } else {
    n22 = startvol;
    tone22.setVolume(n22);
    tone22.play();
  }
}
  
    if  (TValue == 11){
    if (tone23.isPlaying()) {
    n23 = n23+vol;
    tone23.setVolume(n23);
  } else {
    n23 = startvol;
    tone23.setVolume(n23);
    tone23.play();
  }
}
  
    if  (TValue == 12){
    if (tone24.isPlaying()) {
    n24 = n24+vol;
    tone24.setVolume(n24);
  } else {
    n24 = startvol;
    tone24.setVolume(n24);
    tone24.play();
  }
}
  
    if  (TValue == 13){
    if (tone25.isPlaying()) {
    n25 = n25+vol;
    tone25.setVolume(n25);
  } else {
    n25 = startvol;
    tone25.setVolume(n25);
    tone25.play();
  }
}
  
    if  (YValue == 1){
    if (tone26.isPlaying()) {
    n26 = n26+vol;
    tone26.setVolume(n26);  
  } else {
    n26 = startvol;
    tone26.setVolume(n26);
    tone26.play();
  }
}
  
    if  (YValue == 2){
    if (tone27.isPlaying()) {
    n27 = n27+vol;
    tone27.setVolume(n27);
  } else {
    n27 = startvol;
    tone27.setVolume(n27);
    tone27.play();
  }
}
  
    if  (YValue == 3){
    if (tone28.isPlaying()) {
    n28 = n28+vol;
    tone28.setVolume(n28);
  } else {
    n28 = startvol;
    tone28.setVolume(n28);
    tone28.play();
  }
}
  
    if  (YValue == 4){
    if (tone29.isPlaying()) {
    n29 = n29+vol;
    tone29.setVolume(n29);
  } else {
    n29 = startvol;
    tone29.setVolume(n29);
    tone29.play();
  }
}
  
    if  (YValue == 5){
    if (tone30.isPlaying()) {
    n30 = n30+vol;
    tone30.setVolume(n30);
  } else {
    n30 = startvol;
    tone30.setVolume(n30);
    tone30.play();
  }
}
  
    if  (YValue == 6){
    if (tone31.isPlaying()) {
    n31 = n31+vol;
    tone31.setVolume(n31);
  } else {
    n31 = startvol;
    tone31.setVolume(n31);
    tone31.play();
  }
}
  
    if  (YValue == 7){
    if (tone32.isPlaying()) {
    n32 = n32+vol;
    tone32.setVolume(n32);
  } else {
    n32 = startvol;
    tone32.setVolume(n32);
    tone32.play();
  }
}
  
    if  (YValue == 8){
    if (tone33.isPlaying()) {
    n33 = n33+vol;
    tone33.setVolume(n33);
  } else {
    n33 = startvol;
    tone33.setVolume(n33);
    tone33.play();
  }
}
  
    if  (YValue == 9){
    if (tone34.isPlaying()) {
    n34 = n34+vol;
    tone34.setVolume(n34);
  } else {
    n34 = startvol;
    tone34.setVolume(n34);
    tone34.play();
  }
}
  
    if  (YValue == 10){
    if (tone35.isPlaying()) {
    n35 = n35+vol;
    tone35.setVolume(n35);
  } else {
    n35 = startvol;
    tone35.setVolume(n35);
    tone35.play();
  }
}
  
    if  (YValue == 11){
    if (tone36.isPlaying()) {
    n36 = n36+vol;
    tone36.setVolume(n36);
  } else {
    n36 = startvol;
    tone36.setVolume(n36);
    tone36.play();
  }
}
  
    if  (YValue == 12){
    if (tone37.isPlaying()) {
    n37 = n37+vol;
    tone37.setVolume(n37);
  } else {
    n37 = startvol;
    tone37.setVolume(n37);
    tone37.play();
  }
 }  
}
