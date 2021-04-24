// Touch.h
// Author: Amay Kataria
// Date: 04/23/2021
// Description: A class that encapsulates bluetooth functionality. 

#ifndef TOUCH_H
#define TOUCH_H
#include <Arduino.h>
#include <Wire.h>
#include "Adafruit_MPR121.h"

class Touch {
    private: 
        // Declare all the sensors and their addresses. 
        Adafruit_MPR121 sensors[4]; 
        uint8_t addresses[4] = {0x5A, 0x5B, 0x5C, 0x5D};
        String msg = String("MPR121#");
        
    public: 
        Touch() {
            // Initialize the sensors. 
            for (uint8_t i = 0; i < 4; i++) {
                sensors[i] = Adafruit_MPR121();
            }
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

        // sensorIdx: 0-3
        // minLine (touch line on the chip): >= 0
        // maxLine (touch line the chip): <= 11
        void localDebug(uint8_t sensorIdx, uint8_t minLine, uint8_t maxLine) {
            if (sensorIdx >= 0 && sensorIdx <= 3) {
              // Debugging
              Serial.print("\t\t\t\t\t\t\t\t\t\t\t\t\t 0x"); 
              //Serial.println(cap1.touched(), HEX);
              Serial.print("Filt: ");
              for (uint8_t i=minLine; i<maxLine; i++) {
                Serial.print(sensors[sensorIdx].filteredData(i)); Serial.print("\t");
              }
              Serial.println();
              Serial.print("Base: ");
              for (uint8_t i=minLine; i<maxLine; i++) {
                Serial.print(sensors[sensorIdx].baselineData(i)); Serial.print("\t");
              }
              Serial.println(); 
            }
            delay(500);
        }
};
#endif
