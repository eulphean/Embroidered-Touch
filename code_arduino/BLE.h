
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

    // Custom GATT service and characteristics declaration. 
    BLEService grid;
    BLECharacteristic Taxis;
    BLECharacteristic Xaxis;
    BLECharacteristic Yaxis;

  public: 
    BLE() {
      // Initialize service and characteristics. 
      grid = BLEService(0x1234);
      Taxis = BLECharacteristic(0xABCD);
      Xaxis = BLECharacteristic(0xDCBA);
      Yaxis = BLECharacteristic(0xACDC); 
    }

    void init() {
      // Initialise the Bluefruit module.
      Serial.println("Initializing Bluefruit nRF52 subsystem....");
      Bluefruit.begin();
      Bluefruit.setName("Interactive-Fabric");

       // Assign connect/disconnect callback handlers.
      Bluefruit.Periph.setConnectCallback(connect_callback);
      Bluefruit.Periph.setDisconnectCallback(disconnect_callback);

      // Configure and Start the Device Information Service.
      Serial.println("Configuring the Device Information Service,");
      bledis.setManufacturer("Adafruit Industries");
      bledis.setModel("Bluefruit Feather52");
      bledis.begin();

      Serial.println("Configuring the Grid Service.");
      setupGridService();

      // Setup the advertising packet(s)
      Serial.println("Setting up the advertising payload(s).");
      startAdvertising();

      Serial.println("\nAdvertising");
    }

    void setupGridService() {
      grid.begin();

      // This will potentially change because I'll be receiving all the sensor values 
      // from the from arduino // So, I can tweak them the way I want. 
      Taxis.setProperties(CHR_PROPS_INDICATE);
      Taxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
      Taxis.setMaxLen(20);
      Taxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
      Taxis.begin();
      Taxis.write32(0);                    // Use .write for init data

      Xaxis.setProperties(CHR_PROPS_INDICATE);
      Xaxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
      Xaxis.setMaxLen(20);
      Xaxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
      Xaxis.begin();
      Xaxis.write32(0);                    // Use .write for init data

      Yaxis.setProperties(CHR_PROPS_INDICATE);
      Yaxis.setPermission(SECMODE_OPEN, SECMODE_NO_ACCESS);
      Yaxis.setMaxLen(20);
      Yaxis.setCccdWriteCallback(cccd_callback);  // Optionally capture CCCD updates
      Yaxis.begin();
      Yaxis.write32(0);                    // Use .write for init data
    }

    void startAdvertising() {
      // Advertising packet
      Bluefruit.Advertising.addFlags(BLE_GAP_ADV_FLAGS_LE_ONLY_GENERAL_DISC_MODE);
      Bluefruit.Advertising.addTxPower();

      // Include HTM Service UUID
      Bluefruit.Advertising.addService(grid);

      // Include Name.
      Bluefruit.Advertising.addName();

      // Start advertising. 
      Bluefruit.Advertising.restartOnDisconnect(true);
      Bluefruit.Advertising.setInterval(32, 244);    // in unit of 0.625 ms
      Bluefruit.Advertising.setFastTimeout(30);      // number of seconds in fast mode
      Bluefruit.Advertising.start(0);                // 0 = Don't stop advertising after n seconds  
    }

    // This will change absolutely.
    static void cccd_callback(uint16_t conn_hdl, BLECharacteristic* chr, uint16_t cccd_value)
    {
      // Display the raw request packet
      Serial.print("CCCD Updated: ");
      //Serial.printBuffer(request->data, request->len);
      Serial.print(cccd_value);
      Serial.println("");

      // Check the characteristic this CCCD update is associated with in case
      // this handler is used for multiple CCCD records.
      // if (chr->uuid == Taxis.uuid) {
      //     if (chr->indicateEnabled(conn_hdl)) {
      //         Serial.println("Taxis 'Indicate' enabled");
      //     } else {
      //         Serial.println("Taxis 'Indicate' disabled");
      //     }
      // }
    }

    static void connect_callback(uint16_t conn_handle)
    {
      // Get the reference to current connection
      BLEConnection* connection = Bluefruit.Connection(conn_handle);

      char central_name[32] = { 0 };
      connection->getPeerName(central_name, sizeof(central_name));

      Serial.print("Success: Connected to ");
      Serial.println(central_name);
    }

    static void disconnect_callback(uint16_t conn_handle, uint8_t reason)
    {
      (void) conn_handle;
      (void) reason;

      Serial.print("Disconnected, reason = 0x"); Serial.println(reason, HEX);
      Serial.println("Advertising!");
    }
};

#endif
