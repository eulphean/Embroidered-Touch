// Name: Audio.js
// Author: Amay Kataria. 
// Date: 07/07/2021
// Description: Class reponsible to load all audio files and provide a shim to play these files 
// at the right moment.

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

// Import all audio files and palettes. 
import {audioFiles, palettes} from './AudioPalettes';

class Audio {
    constructor(soundObj, env) {
        this.soundObject = soundObj;
        this.adsr = env; 
    }

    setAdsr(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel) {
        // ADSR parameters
        this.adsr.set(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel); 
    }

    play() {
        this.soundObject.stop();
        this.adsr.triggerAttack(this.soundObject); 
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    let allAudio = [];
    s.preload = () => {
        for (let i = 0; i < audioFiles.length; i++) {
            let sound = s.loadSound(audioFiles[i]); 
            let env = new p5.Envelope(0.1, 0.5, 0.1, 0.5); // Default envelope. 
            let a = new Audio(sound, env); 
            allAudio.push(a); 
        }

        console.log(allAudio);
    }
    
    s.setup = () => {
        s.noCanvas();
    };

    s.draw = () => {
        s.noLoop(); 
    };

    s.getAudio = () => {
        return allAudio; 
    }
};

// Keeps track of the current pallete and is responsible for cycling the palletes. 
class AudioManager {
    constructor() {
        this.myP5 = new p5(sketch);
        this.curPaletteIdx = 0; 
        // We give this a little timeout because the files are being loaded in the beginning. 
        setTimeout(this.setPallete.bind(this), 5000); 
    }

    setPallete() {
        let p = palettes[this.curPaletteIdx]; 
        let keys = Object.keys(p); 
        let allAudio = this.myP5.getAudio(); 
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i]; 
            let soundIdx = p[k]['sound']; 
            let adsrParams = p[k]['adsr'];
            let audio = allAudio[soundIdx];
            // attack time, attack level, decay time, decay level, release time, release level
            audio.setAdsr(adsrParams[0], adsrParams[1], adsrParams[2], adsrParams[3], adsrParams[4], adsrParams[5]); 
        }
    }

    play(sensorIdx) {
        let audioIdx; 
        if (sensorIdx >= 0 && sensorIdx <=11) {
            // Left sleeve. 
            audioIdx = sensorIdx; 
        } else {
            // Right sleeve. 
            audioIdx = sensorIdx - 12; 
        }

        // Play the correct audio track. 
        let audio = this.getAudioByPaletteIdx(audioIdx); 
        audio.play(); 
    }

    getAudioByPaletteIdx(idx) {
        let p = palettes[this.curPaletteIdx]; 
        let soundIdx = p[idx]['sound']; 
        let audio = this.myP5.getAudio()[soundIdx]; 
        return audio; 
    }
}

// Singleton - Only a single instance please.
export default new AudioManager();