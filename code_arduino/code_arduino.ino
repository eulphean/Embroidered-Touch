//#include "BLE.h"
#include "Touch.h"

// Bluetooth subsystem.
// BLE gridBle; 
Touch touchSensors;

void setup()
{
  Serial.begin(115200);
  while ( !Serial ) delay(10);   // for nrf52840 with native usb

  delay(3000);
  Serial.println("Bluefruit52 Grid Test");
  Serial.println("-------------------------------------\n");

  // gridBle.init();
  touchSensors.init();
}

void loop() {
 touchSensors.localDebug(0, 6, 12);
}
