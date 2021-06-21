
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

void setup()
{
  Serial.begin(115200);
  // Uncomment if you want Arduino operation to be linked with Serial communication.
  while ( !Serial ) delay(10);   // for nrf52840 with native usb
  
  Serial.println("Fabric Instrument Initialization Routine.");
  Serial.println("-------------------------------------\n");

  gridBle.init();
  touchChipsets.init();
}

void loop() {
  if (BLE::isConnected) { // Start transmitting only when a connection is developed. 
      for (int i = 0; i < touchChipsets.length(); i++) {
        // Reqest filtered data. 
        char *bleBuffer = touchChipsets.getSensorData(i, 'f'); 
        gridBle.transmit(bleBuffer, touchChipsets.bleBufferSize());
        bleBuffer = touchChipsets.getSensorData(i, 'b');
        gridBle.transmit(bleBuffer, touchChipsets.bleBufferSize()); 
        delay(50); // Don't overwhelm the stream
      }
  }

  if (BLE::hasReceivedData) {
    uint8_t chipsetIdx = BLE::rxBuffer[0]; 
    uint8_t command = BLE::rxBuffer[1]; 
    uint8_t threshold = BLE::rxBuffer[2];
    uint8_t release = BLE::rxBuffer[3];

    if (command == RESET_COMMAND) {
      touchChipsets.resetChipset(chipsetIdx); 
    }

    if (command == SENSITIVITY_COMMAND) {
      touchChipsets.updateSensitivity(chipsetIdx, threshold, release); 
    }

    // Mark the flag dirty so we can read the next payload. 
    BLE::hasReceivedData = false; 
  }

  // To enable arduino senssor logs, uncomment below. 
  //touchChips.localDebug(0,6,11);
}
