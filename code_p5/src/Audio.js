// Name: Audio.js
// Author: Amay Kataria. 
// Date: 04/28/2021
// Description: This component holds the names of all the audio files corresponding to the sensors and chipsets. 
// Number of sensor lines used should be the same as the number of audio files or there will be empty objects that can 
// lead to errors. 

// List of all the filenames for the sensor lines. 
const sounds = {
    1: 'bells.wav',
    2: 'birds1.wav',
    3: 'synchit.wav', // cicado.wav not found - chaging it synchit
    4: 'bells2.wav',
    5: 'birds2.wav',
    6: 'leaves.wav',
    7: 'bells3.wav',
    8: 'birds3.wav',
    9: 'wind.wav',
    10: 'birds4.wav',
    11: 'leaves.wav',
    12: 'birds5.wav',
    13: 'bells.wav',
    14: 'birds1.wav',
    15: 'synchit.wav',  // cicado.wav not found - chaging it synchit
    16: 'bells2.wav',
    17: 'birds2.wav',
    18: 'leaves.wav',
    19: 'bells3.wav',
    20: 'birds3.wav',
    21: 'wind.wav',
    22: 'birds4.wav',
    23: 'wind2.wav',
    24: 'birds5.wav',
    25: 'bells.wav',
    26: 'birds1.wav',
    27: 'synchit.wav',  // cicado.wav not found - chaging it synchit
    28: 'bells2.wav',
    29: 'birds2.wav',
    30: 'leaves.wav',
    31: 'bells3.wav',
    32: 'birds3.wav',
    33: 'leaves.wav',
    34: 'birds4.wav',
    35: 'wind2.wav',
    36: 'birds5.wav',
    37: 'bells.wav'
}; 

// Directory of the sound files. 
const directory = 'Audio/';

class Audio {
    constructor() {
        this.tones = []; 
        this.assignIdx = 0; // Updates after every tone assignment to each sensor.  
        this.loadSounds(); // Load all sounds in tones. 
        
        // Debug logs. 
        // console.log(this.tones);
    }

    loadSounds() {
        const size = Object.keys(sounds).length; 
        for (let i = 1; i <= size; i++) {
            const filePath = directory + sounds[i];
            let sound = loadSound(filePath);
            this.tones.push(sound);
        }
    }

    assignTone() {
        let sensorTone = this.tones[this.assignIdx]; 
        this.assignIdx++; 
        return sensorTone; 
    }
};