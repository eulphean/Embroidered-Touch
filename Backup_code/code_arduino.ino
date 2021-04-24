
#include <bluefruit.h> 

#include <Wire.h>
#include "Adafruit_MPR121.h"

#ifndef _BV
#define _BV(bit) (1 << (bit)) 
#endif

BLEService grid = BLEService(0x1234);
BLECharacteristic Taxis = BLECharacteristic(0xABCD);
BLECharacteristic Xaxis = BLECharacteristic(0xDCBA);
BLECharacteristic Yaxis = BLECharacteristic(0xACDC);

BLEDis bledis;    // DIS (Device Information Service) helper class instance

// You can have up to 4 on one i2c bus but one is enough for testing!
Adafruit_MPR121 cap1 = Adafruit_MPR121();
Adafruit_MPR121 cap2 = Adafruit_MPR121();
Adafruit_MPR121 cap3 = Adafruit_MPR121();
Adafruit_MPR121 cap4 = Adafruit_MPR121();

int TValue = 0;
int XValue = 0;
int YValue = 0;

// Advanced function prototypes
void startAdv(void);
void setupGrid(void);
void connect_callback(uint16_t conn_handle);
void disconnect_callback(uint16_t conn_handle, uint8_t reason);

// Keeps track of the last pins touched
// so we know when buttons are 'released'
uint16_t lasttouched = 0;
uint16_t currtouched = 0;

void setup()
{
  Serial.begin(115200);
  while ( !Serial ) delay(10);   // for nrf52840 with native usb

  Serial.println("Bluefruit52 Grid Test");
  Serial.println("-------------------------------------\n");

  // Initialise the Bluefruit module
  Serial.println("Initialise the Bluefruit nRF52 module");
  Bluefruit.begin();
  Bluefruit.setName("Bluefruit52");

  // Set the connect/disconnect callback handlers
  Bluefruit.Periph.setConnectCallback(connect_callback);
  Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

  // Configure and Start the Device Information Service
  Serial.println("Configuring the Device Information Service");
  bledis.setManufacturer("Adafruit Industries");
  bledis.setModel("Bluefruit Feather52");
  bledis.begin();;

  // Setup the Heath Thermometer service using
  // BLEService and BLECharacteristic classes
  Serial.println("Configuring the Grid Service");
  setupGrid();

  // Setup the advertising packet(s)
  Serial.println("Setting up the advertising payload(s)");
  startAdv();

  Serial.println("Ready Player One!!!");
  Serial.println("\nAdvertising");

  Serial.println("Adafruit MPR121 Capacitive Touch sensor test");

  cap1.begin(0x5A);
    if (!cap1.begin(0x5A)) {
      Serial.println("MPR121#1 not found, check wiring?");
      while (1);
    }
    Serial.println("MPR121#1 found!");

    cap2.begin(0x5B);
    if (!cap2.begin(0x5B)) {
      Serial.println("MPR121#2 not found, check wiring?");
      while (1);
    }
    Serial.println("MPR121#2 found!");

    cap3.begin(0x5C);
    if (!cap3.begin(0x5C)) {
      Serial.println("MPR121#3 not found, check wiring?");
      while (1);
    }
    Serial.println("MPR121#3 found!");

    cap4.begin(0x5D);
    if (!cap4.begin(0x5D)) {
      Serial.println("MPR121#4 not found, check wiring?");
      while (1);
    }
    Serial.println("MPR121#4 found!");
}

void startAdv(void)
{
  // Advertising packet
  Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
  Bluefruit.Advertising.addTxPower();

  // Include HTM Service UUID
  Bluefruit.Advertising.addService(grid);

  // Include Name
  Bluefruit.Advertising.addName();
  
  /* Start Advertising
   * - Enable auto advertising if disconnected
   * - Interval:  fast mode = 20 ms, slow mode = 152.5 ms
   * - Timeout for fast mode is 30 seconds
   * - Start(timeout) with timeout = 0 will advertise forever (until connected)
   * 
   * For recommended advertising interval
   * https://developer.apple.com/library/content/qa/qa1931/_index.html   
   */
  Bluefruit.Advertising.restartOnDisconnect(true);
  Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
  Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
  Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
}

void setupGrid(void)
{

  grid.begin();

  // Note: You must call .begin() on the BLEService before calling .begin() on
  // any characteristic(s) within that service definition.. Calling .begin() on
  // a BLECharacteristic will cause it to be added to the last BLEService that
  // was 'begin()'ed!

  Taxis.setProperties(CHR_PROPS_INDICATE);
  Taxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  Taxis.setMaxLen(20);
  Taxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
  Taxis.begin();
  Taxis.write32(TValue);                    // Use .write for init data

  Xaxis.setProperties(CHR_PROPS_INDICATE);
  Xaxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  Xaxis.setMaxLen(20);
  Xaxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
  Xaxis.begin();
  Xaxis.write32(XValue);                    // Use .write for init data

  Yaxis.setProperties(CHR_PROPS_INDICATE);
  Yaxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
  Yaxis.setMaxLen(20);
  Yaxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
  Yaxis.begin();
  Yaxis.write32(YValue);                    // Use .write for init data
}

void connect_callback(uint16_t conn_handle)
{
  // Get the reference to current connection
  BLEConnection* connection = Bluefruit.Connection(conn_handle);

  char central_name[32] = { 0 };
  connection->getPeerName(central_name, sizeof(central_name));

  Serial.print("Connected to ");
  Serial.println(central_name);
}

/**
 * Callback invoked when a connection is dropped
 * @param conn_handle connection where this event happens
 * @param reason is a BLE_HCI_STATUS_CODE which can be found in ble_hci.h
 */
void disconnect_callback(uint16_t conn_handle, uint8_t reason)
{
  (void) conn_handle;
  (void) reason;

  Serial.print("Disconnected, reason = 0x"); Serial.println(reason, HEX);
  Serial.println("Advertising!");
}

void cccd_callback(uint16_t conn_hdl, BLECharacteristic* chr, uint16_t cccd_value)
{
    // Display the raw request packet
    Serial.print("CCCD Updated: ");
    //Serial.printBuffer(request->data, request->len);
    Serial.print(cccd_value);
    Serial.println("");

    // Check the characteristic this CCCD update is associated with in case
    // this handler is used for multiple CCCD records.
    if (chr->uuid == Taxis.uuid) {
        if (chr->indicateEnabled(conn_hdl)) {
            Serial.println("Taxis 'Indicate' enabled");
        } else {
            Serial.println("Taxis 'Indicate' disabled");
        }
    }
}

void loop()
{
  digitalToggle(LED_RED);
    
    if (cap3.filteredData(0) < 167) {
    Serial.println("6T");
    TValue = 6;
  } 
    else if (cap3.filteredData(2) < 172) {
    Serial.println("5T");
    TValue = 5;
  }
     else if (cap3.filteredData(4) < 179) {
    Serial.println("4T");
    TValue = 4;
  }
      else  if (cap3.filteredData(6) < 179) {
    Serial.println("3T");
    TValue = 3;
  }
      else  if (cap3.filteredData(8) < 183) {
    Serial.println("2T");
    TValue = 2;
  }
       else if (cap3.filteredData(10) < 183) {
    Serial.println("1T");
    TValue = 1;
  }
   else  if (cap4.filteredData(10) < 172) {
    Serial.println("7T");
    TValue = 7;
  }
  else if (cap4.filteredData(9) < 173) {
    Serial.println("8T");
    TValue = 8;
  }
    else  if (cap4.filteredData(8) < 180) {
    Serial.println("9T");
    TValue = 9;
  }
      else  if (cap4.filteredData(6) < 181) {
    Serial.println("10T");
    TValue = 10;
  }
      else  if (cap4.filteredData(4) < 188) {
    Serial.println("11T");
    TValue = 11;
  }
      else  if (cap4.filteredData(2) < 184) {
    Serial.println("12T");
    TValue = 12;
  }
      else  if (cap4.filteredData(0) < 184) {
    Serial.println("13T");
    TValue = 13;
  } else {
    TValue = 0;
  }

      if (cap2.filteredData(0) < 148) {
    Serial.println("1x");
    XValue = 1;
  }
    else if (cap2.filteredData(1) < 150) {
    Serial.println("2x");
    XValue = 2;
      }
       else if (cap2.filteredData(2) < 153) {
    Serial.println("3x");
    XValue = 3;
        }
       else if (cap2.filteredData(3) < 150) {
    Serial.println("4x");
    XValue = 4;
        }
       else if (cap2.filteredData(4) < 153) {
    Serial.println("5x");
    XValue = 5;
        }
       else if (cap2.filteredData(5) < 162) {
   Serial.println("6x");
    XValue = 6;
        }
       else if (cap2.filteredData(6) < 80) {
    //Serial.println("7x");
    //XValue = 7;
        }
       else if (cap2.filteredData(7) < 161) {
    Serial.println("8x");
    XValue = 8;
        }
       else if (cap2.filteredData(8) < 156) {
    Serial.println("9x");
    XValue = 9;
        }
       else if (cap2.filteredData(9) < 155) {
    Serial.println("10x");
    XValue = 10;
        }
      else if (cap2.filteredData(10) < 154) {
    Serial.println("11x");
    XValue = 11;
        }
      else if (cap2.filteredData(11) < 164) {
    Serial.println("12x");
    XValue = 12;
  } else {
    XValue = 0;
  }

        if (cap1.filteredData(0) < 180) {
    Serial.println("1y");
    YValue = 1;
  }
       else if (cap1.filteredData(1) < 170) {
    Serial.println("2y");
    YValue = 2;
  }
      else if (cap1.filteredData(2) < 187) {
    Serial.println("3y");
    YValue = 3;
  }
     else if (cap1.filteredData(3) < 172) {
    Serial.println("4y");
    YValue = 4;
  }
     else if (cap1.filteredData(4) < 174) {
    Serial.println("5y");
    YValue = 5;
  }
      else if (cap1.filteredData(5) < 169) {
    Serial.println("6y");
    YValue = 6;
  }
       else if (cap1.filteredData(6) < 166) {
    Serial.println("7y");
    YValue = 7;
  }
       else if (cap1.filteredData(7) < 162) {
    Serial.println("8y");
    YValue = 8;
  }
       else if (cap1.filteredData(8) < 164) {
    Serial.println("9y");
    YValue = 9;
  }
      else if (cap1.filteredData(9) < 157) {
    Serial.println("10y");
    YValue = 10;
  }
      else if (cap1.filteredData(10) < 180) {
    //Serial.println("11y");
    //YValue = 11;
  }
      else if (cap1.filteredData(11) < 175) {
    Serial.println("12y");
    YValue = 12;
  } else {
    YValue = 0;
  }
  
  if ( Bluefruit.connected() ) {
    if (Taxis.indicate32(TValue)){
      Serial.print("TValue:"); Serial.println(TValue); 
    }else{
      Serial.println("ERROR: T Indicate not set in the CCCD or not connected!");
    }

     if (Xaxis.indicate32(XValue)){
      Serial.print("XValue:"); Serial.println(XValue); 
    }else{
      Serial.println("ERROR: X Indicate not set in the CCCD or not connected!");
    }

         if (Yaxis.indicate32(YValue)){
      Serial.print("YValue:"); Serial.println(YValue); 
    }else{
      Serial.println("ERROR: Y Indicate not set in the CCCD or not connected!");
    }
  }

   // comment out this line for detailed data from the sensor!
  return;
  
  // debugging info, what
  Serial.print("\t\t\t\t\t\t\t\t\t\t\t\t\t 0x"); Serial.println(cap1.touched(), HEX);
  Serial.print("Filt: ");
  for (uint8_t i=6; i<12; i++) {
    Serial.print(cap1.filteredData(i)); Serial.print("\t");
  }
  Serial.println();
  Serial.print("Base: ");
  for (uint8_t i=6; i<12; i++) {
    Serial.print(cap1.baselineData(i)); Serial.print("\t");
  }
  Serial.println();
  
  // put a delay so it isn't overwhelming
  delay(500);
}
