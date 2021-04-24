// code_arudino.ino
// Author: Amay Kataria & Christine Shallenberg
// Date: 04/23/2021
// Description: Entry file for the arduino code. 

#include "BLE.h"

BLE bluetooth; 

void setup() {
    Serial.begin(9600);
}

void loop() {
  Serial.print("Hello");
  delay(2000);
}
