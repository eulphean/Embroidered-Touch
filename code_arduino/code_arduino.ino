#include "BLE.h"
#include "Touch.h"

Touch touchSensors;
BLE gridBle; 
void setup()
{
  Serial.begin(115200);
//  while ( !Serial ) delay(10);   // for nrf52840 with native usb
  
  Serial.println("Fabric Instrument Initialization Routine.");
  Serial.println("-------------------------------------\n");

  gridBle.init();
  touchSensors.init();
}

void loop() {
    // Start transmitting only when a connection is developed. 
    if (BLE::isConnected) {
      for (int i = 0; i < touchSensors.length(); i++) {
        // Reqest filtered data. 
        char *bufPtr = touchSensors.getFilteredData(i, 'f'); 
        gridBle.transmit(bufPtr, touchSensors.bufferLength()); 
        delay(50); // Don't overwhelm the stream
      }
    }

  // To enable arduino senssor logs, uncomment below. 
  //touchSensors.localDebug(0,6,11);
}

//  #if CFG_DEBUG
//    // Blocking wait for connection when debug mode is enabled via IDE
//    while ( !Serial ) yield();
//  #endif
