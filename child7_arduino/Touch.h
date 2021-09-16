// Touch.h
// Author: Amay Kataria
// Date: 06/21/2021
// Description: A class that encapsulates all the data related to MPR121 chipsets and its sensor lines. 
// We use this to encapsulate operations like initializing the MPR121 chipsets, construct sensor data to send over bluetooth, etc.  

#ifndef TOUCH_H
#define TOUCH_H
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_MPR121.h"
#include "BLE.h"

const uint8_t numChipsets = 2; // # of MR121 chipsets. 
const uint8_t numSensorLines = 12; // # of touch sensors in each chipset. 
const uint8_t minSensorIdx = 3; // Only 4 lines are active.
const uint8_t maxSensorIdx = 6; // Only 4 lines are active. 
const uint8_t workingSensors[] = {1, 2, 3, 4, 5, 7, 9}; // NOTE: Sensors 1, 2, 3 are dummy for now. Once a proper sweater is bonded, update these sensor numbers. 4, 5, 7, 9 work properly. 
const uint8_t maxBleDataSize = 20; 

class Touch {
    private: 
        // Declare all chipsets and their sensor lines. 
        Adafruit_MPR121 chipsets[numChipsets]; 
        uint8_t addresses[numChipsets] = {0x5A, 0x5B};
        char *bleBuffer; // Sensor data buffer sent over BLE. 
        uint8_t bleBufferLength; 
        
    public: 
        Touch() {
            // Allocate a long lived buffer with its scope tied to the program. 
            bleBuffer = (char *) malloc(maxBleDataSize); 
            // Initialize the touch chipsets.
            for (uint8_t i = 0; i < numChipsets; i++) {
                chipsets[i] = Adafruit_MPR121();
            }
        }

        uint8_t length() {
          return numChipsets;
        }

        void init() {
            Serial.println("Touch: Adafruit MPR121 Capacitive Touch sensor test.");
            
            String msg = String("MPR121#");
            for (uint8_t i = 0; i < numChipsets; i++) {
                chipsets[i].begin(addresses[i]);
                if (!chipsets[i].begin(addresses[i])) {
                    msg += i + " not found, check wiring";
                    Serial.println(msg);
                    // Block thread, don't proceed. 
                    while(1); 
                } else {
                    msg = msg + i;
                    Serial.println(msg);
                    // Reset message.
                    msg = "MPR121#";
                }
            }
        }

        void transmitSensorData(uint8_t chipsetIdx, BLE gridBle) { 
          // Prepare and send chipset index. 
          String data; uint8_t dataLength; 
          data = "BC"; // C denotes the start / end of current data. 
          dataLength = data.length() + 1; 
          data.toCharArray(bleBuffer, dataLength);
          gridBle.transmit(bleBuffer, dataLength);  
          // Serial.println(bleBuffer);
      
          // Send each sensor data.  
          if (chipsetIdx == 0) {
            for (uint8_t i = 0; i < 7; i++) {
              uint8_t sensorNum = workingSensors[i]; 
              data = "B-" + String(chipsets[chipsetIdx].filteredData(sensorNum));
              dataLength = data.length() + 1; 
              data.toCharArray(bleBuffer, dataLength); 
              gridBle.transmit(bleBuffer, dataLength); 
            }
          }
        }

        uint8_t bleBufferSize() {
          return bleBufferLength;
        }

        void resetChipset(uint8_t chipsetIdx) {
          Adafruit_MPR121 chipset = chipsets[chipsetIdx];
          uint8_t addr = addresses[chipsetIdx];
          chipset.begin(addr); 
          if (!chipset.begin(addr)) {
            Serial.println("MPR121 Error: Chipset not found");
          } else {
            String msg = "MPR121# ";
            msg += String(chipsetIdx) + " successfully reset.";
            Serial.println(msg);
          }

          // NOTE: Assign the chip back to the array. 
          chipsets[chipsetIdx] = chipset;
        }

        void updateSensitivity(uint8_t chipsetIdx, uint8_t thresh, uint8_t rel) {
          Adafruit_MPR121 chipset = chipsets[chipsetIdx];
          chipset.setThresholds(thresh, rel); 
          String msg = "MPR121#";
          msg += chipsetIdx + " successfully set Threshold and Release values.";
          Serial.println(msg);
        }
        
        // chipsetIdx: 0-2
        // minLine (sensor line on the chip): >= 0
        // maxLine (sensor line the chip): <= 11
        void localDebug(uint8_t chipsetIdx, uint8_t minLine, uint8_t maxLine) {
            if (chipsetIdx >= 0 && chipsetIdx <= numChipsets-1) {
              // Debugging
              Serial.print("\t\t\t\t\t\t\t\t\t\t\t\t\t 0x"); 
              //Serial.println(cap1.touched(), HEX);
              Serial.print("Filt: ");
              for (uint8_t i=minLine; i<=maxLine; i++) {
                Serial.print(chipsets[chipsetIdx].filteredData(i)); Serial.print("\t");
              }
              Serial.println();
              Serial.print("Base: ");
              for (uint8_t i=minLine; i<=maxLine; i++) {
                Serial.print(chipsets[chipsetIdx].baselineData(i)); Serial.print("\t");
              }
              Serial.println(); 
            }
            delay(500);
        }
};
#endif
