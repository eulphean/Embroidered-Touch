// BLE.h
// Author: Amay Kataria
// Date: 06/21/2021
// Description: A class that encapsulates bluetooth functionality. 

#ifndef BLE_H
#define BLE_H
#include "Arduino.h"
#include <bluefruit.h> 

#ifndef _BV
#define _BV(bit) (1 << (bit)) 
#endif

// Size of the RX buffer from p5.js [chipsetIdx, command, val, val]
const uint8_t buffSize = 2; 

const char* bleName = "TOUCH"; 
class BLE {
  private: 
    // DIS (Device Information Service) helper class instance.
    BLEDis bledis;

  public: 
    // Defined here but declared outside the class. 
    static boolean isConnected; 
    static boolean hasReceivedData; 
    // UART over BLE
    static BLEUart bleuart; 
    static uint8_t rxBuffer[buffSize];
    
    BLE() {}
    
    void init() {
      rxBuffer[0] = 0; rxBuffer[1] = 0; 
      
      // Initialise the Bluefruit module.
      Serial.println("BLE Init: Bluefruit nRF52 subsystem initialization....");

      // Config the peripheral connection maximum bandwidth.
      // Results in more SRAM consumption. 
      Bluefruit.configPrphBandwidth(BANDWIDTH_MAX);
      Bluefruit.begin();
      // Tweak this if you want to control battery life / distance to central client. 
      Bluefruit.setTxPower(4); 
      Bluefruit.setName(bleName);

      // Assign connect/disconnect callback handlers.
      Bluefruit.Periph.setConnectCallback(connect_callback);
      Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

      // Configure and Start the Device Information Service.
      Serial.println("BLE Init: Configuring the Device Information Service,");
      bledis.setManufacturer("Adafruit Industries");
      bledis.setModel("Bluefruit Feather52");
      bledis.begin();

      // Configure and start BLE Uart service. 
      BLE::bleuart.begin(); 
      
      // Setup callback function when data received. 
      BLE::bleuart.setRxCallback(uartCallback); 

      // Setup the advertising packet(s)
      startAdv();
      Serial.println("BLE Init: Advertising");
    }

    void transmit(char *buf, uint8_t bufLength) {
      BLE::bleuart.write(buf, bufLength); 
    }

    void startAdv() {
      // Advertising packet
      Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
      Bluefruit.Advertising.addTxPower();

      // Include bleuart 1280bit uuid
      Bluefruit.Advertising.addService(BLE::bleuart);

      // Include Name.
      Bluefruit.Advertising.addName();

      // Start advertising. 
      Bluefruit.Advertising.restartOnDisconnect(true);
      Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
      Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
      Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
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
    
    // NOTE: Unused code. This is a callback, which is kicked in when 
    // uart receives data from P5. 
    static void uartCallback(uint16_t conn_handle) {
      Serial.println("Payload received:");
      uint8_t i = 0; 

      // Pack all the data in rxBuffer
      while (BLE::bleuart.available()) {
        uint8_t ch;
        ch = (uint8_t) BLE::bleuart.read();
        BLE::rxBuffer[i] = ch; 
        i++;
        Serial.println(ch);
      }
      BLE::hasReceivedData = true; 
    }
};

// Definition of static variables. 
boolean BLE::isConnected = false; 
BLEUart BLE::bleuart;
uint8_t BLE::rxBuffer[buffSize];
boolean BLE::hasReceivedData = false; 

#endif
