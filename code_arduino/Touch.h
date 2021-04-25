// Touch.h
// Author: Amay Kataria
// Date: 04/23/2021
// Description: A class that encapsulates bluetooth functionality. 

#ifndef TOUCH_H
#define TOUCH_H
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_MPR121.h"

const uint8_t numSensors = 4; 
class Touch {
    private: 
        // Declare all the sensors and their addresses. 
        Adafruit_MPR121 sensors[numSensors]; 
        uint8_t addresses[numSensors] = {0x5A, 0x5B, 0x5C, 0x5D};
        String msg = String("MPR121#");
        char *buffer;
        uint8_t buffer_length; 
        
    public: 
        Touch() {
            // Allocate a long lived buffer used to send sensors values. 
            // We never clear this because it's scope is bound to the program. 
            buffer = (char *) malloc(75); 
            // Initialize the sensors. 
            for (uint8_t i = 0; i < numSensors; i++) {
                sensors[i] = Adafruit_MPR121();
            }
        }

        uint8_t length() {
          return numSensors;
        }

        void init() {
            Serial.println("Touch: Adafruit MPR121 Capacitive Touch sensor test.");
            for (uint8_t i = 0; i < 4; i++) {
                sensors[i].begin(addresses[i]);
                if (!sensors[i].begin(addresses[i])) {
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
        char *getFilteredData(uint8_t sensorIdx, char dataType) {
          String dataString = ""; 
          dataString = dataString + String(sensorIdx) + dataType + "-"; 
          uint8_t v; 
          for (uint8_t i = 0; i <= 11; i++) {
            v = sensors[sensorIdx].filteredData(i); 
            dataString += v; 
            if (i != 11) {
              dataString += ","; 
            }
          }
          
          buffer_length = dataString.length() + 1; 
          dataString.toCharArray(buffer, buffer_length); 
          return buffer; 
        }

        uint8_t bufferLength() {
          return buffer_length; 
        }
        
        // sensorIdx: 0-3
        // minLine (touch line on the chip): >= 0
        // maxLine (touch line the chip): <= 11
        void localDebug(uint8_t sensorIdx, uint8_t minLine, uint8_t maxLine) {
            if (sensorIdx >= 0 && sensorIdx <= numSensors-1) {
              // Debugging
              Serial.print("\t\t\t\t\t\t\t\t\t\t\t\t\t 0x"); 
              //Serial.println(cap1.touched(), HEX);
              Serial.print("Filt: ");
              for (uint8_t i=minLine; i<=maxLine; i++) {
                Serial.print(sensors[sensorIdx].filteredData(i)); Serial.print("\t");
              }
              Serial.println();
              Serial.print("Base: ");
              for (uint8_t i=minLine; i<=maxLine; i++) {
                Serial.print(sensors[sensorIdx].baselineData(i)); Serial.print("\t");
              }
              Serial.println(); 
            }
            delay(500);
        }
};
#endif
