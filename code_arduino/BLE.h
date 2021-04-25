
// BLE.h
// Author: Amay Kataria
// Date: 04/23/2021
// Description: A class that encapsulates bluetooth functionality. 
// TODO: Use BLEUart to send the bufffer of data to the central client.

#ifndef BLE_H
#define BLE_H
#include "Arduino.h"
#include <bluefruit.h> 

#ifndef _BV
#define _BV(bit) (1 << (bit)) 
#endif

class BLE {
  private: 
    // DIS (Device Information Service) helper class instance.
    BLEDis bledis;
    // Uart over ble
    BLEUart bleuart; 
  public: 
    // Defined here but declared outside the class. 
    static boolean isConnected; 
    
    BLE() {}
    
    void init() {
      // Initialise the Bluefruit module.
      Serial.println("BLE Init: Bluefruit nRF52 subsystem initialization....");

      // Config the peripheral connection maximum bandwidth.
      // Results in more SRAM consumption. 
      Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);
      Bluefruit.begin();
      // Tweak this if you want to control battery life / distance to central client. 
      Bluefruit.setTxPower(4); 
      Bluefruit.setName("BLE-Fabric");

      // Assign connect/disconnect callback handlers.
      Bluefruit.Periph.setConnectCallback(connect_callback);
      Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

      // Configure and Start the Device Information Service.
      Serial.println("BLE Init: Configuring the Device Information Service,");
      bledis.setManufacturer("Adafruit Industries");
      bledis.setModel("Bluefruit Feather52");
      bledis.begin();

      // Configure and start BLE Uart service. 
      bleuart.begin(); 

      // Setup callback function when data received. 
      bleuart.setRxCallback(uartCallback); 

      // Setup the advertising packet(s)
      startAdv();
      Serial.println("BLE Init: Advertising");
    }

    void transmit(char *buf, uint8_t bufLength) {
      bleuart.write(buf, bufLength); 
    }

    void startAdv() {
      // Advertising packet
      Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
      Bluefruit.Advertising.addTxPower();

      // Include bleuart 1280bit uuid
      Bluefruit.Advertising.addService(bleuart);

      // Include Name.
      Bluefruit.Advertising.addName();

      // Start advertising. 
      Bluefruit.Advertising.restartOnDisconnect(true);
      Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
      Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
      Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
    }

    static void uartCallback(uint16_t conn_handle) {
//      String fullstring = "";
//      // Or make an uint8_t array. 
//      while(bleuart.available()) {
//        uint8_t c; 
//        c = (uint8_t) bleuart.read();
//        fullstring+=(char)ch; 
//      }
//      Serial.println(fullstring);
    }


    static void connect_callback(uint16_t conn_handle){
      // Get the reference to current connection
      BLEConnection* connection = Bluefruit.Connection(conn_handle);

      char central_name[32] = { 0 };
      connection->getPeerName(central_name, sizeof(central_name));

      Serial.print("BLE: Connected to... ");
      Serial.println(central_name);

      BLE::isConnected = true; 
    }

    static void disconnect_callback(uint16_t conn_handle, uint8_t reason){
      (void) conn_handle;
      (void) reason;

      Serial.print("BLE Disconnected, reason = 0x"); Serial.println(reason, HEX);
      Serial.println("BLE Advertising!");

      BLE::isConnected = false; 
    }
};

boolean BLE::isConnected = false; 

#endif
