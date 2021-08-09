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
        this.isActive = false; 
    }

    setAdsr(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel) {
        // ADSR parameters
        this.adsr.set(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel); 
    }

    trigger(isLeft) {
        if (isLeft) {
            this.soundObject.pan(1); 
        } else {
            this.soundObject.pan(-1); 
        }

        if (this.soundObject.isPlaying()) {
            this.soundObject.stop();
        }
        this.soundObject.playMode('restart');
        this.adsr.triggerAttack(this.soundObject); 
        this.soundObject.loop();
        this.isActive = true; 
    }

    release() {
        // this.soundObject.stop();
        this.adsr.triggerRelease(this.soundObject);
        this.isActive = false; 
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    // Single array that holds all the audio files. 
    let audio = [];
    s.preload = () => {
        for (let i = 0; i < audioFiles.length; i++) {
            let sound = s.loadSound(audioFiles[i]); 
            let env = new p5.Envelope(0.1, 0.5, 0.1, 0.5); // Default envelope. 
            let a = new Audio(sound, env); 
            audio.push(a); 
        }
    }
    
    s.setup = () => {
        s.noCanvas();
    };

    s.draw = () => {
        s.noLoop(); 
    };

    s.getAudio = () => {
        return audio; 
    }
};

const TimeInterval = 3 * 60 * 1000; // 3 minutes
// Keeps track of the current pallete and is responsible for cycling the palletes. 
class AudioManager {
    constructor() {
        this.myP5 = new p5(sketch);
        this.curPaletteIdx = 0; 
        // We give this a little timeout because the files are being loaded in the beginning. 
        setTimeout(this.setPallete.bind(this), 5000); 
    }

    startPalleteTimer() {
        this.palleteInterval = setInterval(this.updatePallete.bind(this), TimeInterval); 
    }

    updatePallete() {
        // Stop sounds the previous pallete. 
        this.stopAllSounds(); 

        // Set new pallete. 
        this.curPaletteIdx = (this.curPaletteIdx + 1) % palettes.length; 
        // this.curPaletteIdx = 0;
        this.setPallete(); 
    }

    resetPallete() {
        clearInterval(this.palleteInterval); 
        // Stop all sounds from the current pallete. 
        this.stopAllSounds(); 
        // Reset the pallete back to beginning.
        this.curPaletteIdx = 0; 
    }

    setPallete() {
        let p = palettes[this.curPaletteIdx]; 
        let keys = Object.keys(p); 
        let audio = this.myP5.getAudio(); 
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i]; 
            let soundIdx = p[k]['sound']; 
            let adsrParams = p[k]['adsr'];

            // Set both audios. 
            let a = audio[soundIdx];

            // Set ADSR on both the audios. 
            // attack time, attack level, decay time, decay level, release time, release level
            a.setAdsr(adsrParams[0], adsrParams[1], adsrParams[2], adsrParams[3], adsrParams[4], adsrParams[5]); 
        }

        console.log('Current Pal idx: ' + this.curPaletteIdx); 
    }

    trigger(idx, isChipA) {
        // ChipA is left and ChipB is right. 
        let audio = this.getAudioByPaletteIdx(idx, isChipA); 
        if (!audio.isActive) {
            audio.trigger(isChipA); 
        }
    }

    release(idx, isChipA) {
        let audio = this.getAudioByPaletteIdx(idx, isChipA); 
        audio.release(); 
    }

    getAudioByPaletteIdx(idx, isChipA) {
        let p = palettes[this.curPaletteIdx]; 
        // Incoming index is always between 0 - 11. Offset it based on what chip is it. 
        let newIdx = isChipA ? parseInt(idx) : parseInt(idx) + 12; 
        let soundIdx = p[newIdx]['sound']; 
        let audio = this.myP5.getAudio()[soundIdx];
        return audio; 
    }

    stopAllSounds() {
        let p = palettes[this.curPaletteIdx]; 
        let keys = Object.keys(p); 
        for (let i = 0; i < keys.length; i++) {
            let soundIdx = p[i]['sound'];
            let audio = this.myP5.getAudio()[soundIdx];
            audio.release(); 
        }
    }
}

// Singleton - Only a single instance please.
export default new AudioManager();