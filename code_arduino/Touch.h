// Touch.h
// Author: Amay Kataria
// Date: 04/23/2021
// Description: A class that encapsulates all the data related to MPR121 chipsets and its sensor lines. 
// We use this to encapsulate operations like initializing the MPR121 chipsets, construct sensor data to send over bluetooth, etc.  

#ifndef TOUCH_H
#define TOUCH_H
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_MPR121.h"

const uint8_t numChipsets = 4; // # of MR121 chipsets. 
const uint8_t numSensorLines = 12; // # of touch sensors in each chipset. 
const uint8_t minSensorIdx = 0; 
const uint8_t maxSensorIdx = 11; 

class Touch {
    private: 
        // Declare all chipsets and their sensor lines. 
        Adafruit_MPR121 chipsets[numChipsets]; 
        uint8_t addresses[numChipsets] = {0x5A, 0x5B, 0x5C, 0x5D};
        char *bleBuffer; // Sensor data buffer sent over BLE. 
        uint8_t bleBufferLength; 
        
    public: 
        Touch() {
            // Allocate a long lived buffer with its scope tied to the program. 
            bleBuffer = (char *) malloc(75); 
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

        // NT-V,V,V,V,V....V
        // N - sensor index, T - data type, V - line value
        char *getFilteredData(uint8_t chipsetIdx, char sensorDataType) {
          String dataString = ""; 
          dataString = dataString + String(chipsetIdx) + sensorDataType + "-"; 
          uint8_t v; 
          for (uint8_t i = minSensorIdx; i <= maxSensorIdx; i++) {
            v = chipsets[chipsetIdx].filteredData(i); 
            dataString += v; 
            if (i != maxSensorIdx) {
              dataString += ","; 
            }
          }
          
          bleBufferLength = dataString.length() + 1; 
          dataString.toCharArray(bleBuffer, bleBufferLength); 
          return bleBuffer; 
        }

        uint8_t bleBufferSize() {
          return bleBufferLength;
        }
        
        // chipsetIdx: 0-3
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
