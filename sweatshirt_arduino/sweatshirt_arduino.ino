// sweatshirt_arduino.h
// Author: Amay Kataria
// Date: 06/21/2021
// Description: Entry file for arudino code on the sweatshirt. 

#include "BLE.h"
#include "Touch.h"

Touch touchChipsets;
BLE gridBle; 

const uint8_t RESET_COMMAND = 0; 
const uint8_t SENSITIVITY_COMMAND = 1;
const uint8_t LEFT_LIFE_PIN = 10; 
const uint8_t RIGHT_LIFE_PIN = 2; 

void setup()
{
  Serial.begin(115200);
  // Uncomment if you want Arduino operation to be linked with Serial communication.
  // while ( !Serial ) delay(10);   // for nrf52840 with native usb
  
  Serial.println("Fabric Instrument Initialization Routine.");
  Serial.println("-------------------------------------\n");

  pinMode(LEFT_LIFE_PIN, OUTPUT); 
  pinMode(RIGHT_LIFE_PIN, OUTPUT);

  gridBle.init();
  touchChipsets.init();
}

void loop() {
  if (BLE::isConnected) { // Start transmitting only when a connection is developed. 
      for (int i = 0; i < touchChipsets.length(); i++) {
        touchChipsets.transmitSensorData(i, gridBle); 
        // Reqest filtered data. 
        //char *bleBuffer = touchChipsets.getSensorData(i, 'f'); 
        //gridBle.transmit(bleBuffer, touchChipsets.bleBufferSize());
        //Serial.println(touchChipsets.bleBufferSize());
        //Serial.println(bleBuffer);
        //bleBuffer = touchChipsets.getSensorData(i, 'b');
        //gridBle.transmit(bleBuffer, touchChipsets.bleBufferSize()); 
        //delay(100); // Don't overwhelm the stream
      }
  }

  // Handle the logic for life. 
  handleLife(); 

  // To enable arduino senssor logs, uncomment below. 
  //touchChips.localDebug(0,6,11);
}

void handleLife() {
  uint8_t leftSignal = BLE::rxBuffer[0]; 
  uint8_t rightSignal = BLE::rxBuffer[1]; 

  if (leftSignal == 1) {
    digitalWrite(LEFT_LIFE_PIN, HIGH); 
    //Serial.println("LEFT LIFE ON"); 
  } else if (leftSignal == 0) {
    digitalWrite(LEFT_LIFE_PIN, LOW);      
    //Serial.println("LEFT LIFE OFF"); 
  }

  if (rightSignal == 1) {
    digitalWrite(RIGHT_LIFE_PIN, HIGH);
    //Serial.println("RIGHT LIFE ON"); 
  } else if (rightSignal == 0) {
    digitalWrite(RIGHT_LIFE_PIN, LOW);
    //Serial.println("RIGHT LIFE OFF"); 
  }
}
