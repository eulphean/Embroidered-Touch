// Name: Audio.js
// Author: Amay Kataria. 
// Date: 07/07/2021
// Description: Class reponsible to load all audio files and provide a shim to play these files 
// at the right moment.

// If we want to import from npm package, use this. 
// import p5 from 'p5';
// import 'p5/lib/addons/p5.sound'

// Import all audio files and palettes. 
import {audioFiles, palettes, childPalettes} from './AudioPalettes';

// NOTE: p5 library is now loaded through index.html
// We assign it to a variable that we want to use. 
let p5 = window.p5;  

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
        //this.soundObject.stop();
        this.adsr.triggerRelease(this.soundObject);
        this.isActive = false; 
    }
}

// Use this p5 sketch to load all audio. 
var sketch = (s) => {
    // Adult palettes. 
    let loadedPalettes = [[], [], []]; 
    // Child palettes. 
    let loadedChildPalettes = [[], []]; 

    s.preload = () => {

    }

    s.loadPalette = (isChildPalette, idx) => {
        const promise = new Promise( (resolve, reject) => {
            if (isChildPalette) {
                console.log('Loading child palette: ' + idx);
                let p = childPalettes[idx]; 
                let keys = Object.keys(p);
                // Empty out the array, then start loading the files. 
                let pAudio = loadedChildPalettes[idx]; 
                pAudio.length = 0; 
                s.loadSoundRecursive(0, keys, p, pAudio, resolve); 
                loadedChildPalettes[idx] = pAudio; 
                console.log(loadedChildPalettes[idx]);
            } else {
                console.log('Loading adult palette: ' + idx); 
                let p = palettes[idx]; 
                let keys = Object.keys(p);
                // Empty out the array, then start loading the files. 
                let pAudio = loadedPalettes[idx]; 
                pAudio.length = 0; 
                s.loadSoundRecursive(0, keys, p, pAudio, resolve); 
                // Set the populated palette. 
                loadedPalettes[idx] = pAudio; 
            }
        });
        return promise; 
    }

    s.loadSoundRecursive = (i, keys, p, pAudio, resolve) => {
        if (i < keys.length) {
            let key = keys[i]; 
            let fileIdx = p[key]['sound']; // Get the file index from the palette. 
            let sound = s.loadSound(audioFiles[fileIdx], function() {
                let env = new p5.Envelope(0.1, 0.5, 0.1, 0.5); // Default envelope. 
                let a = new Audio(sound, env); 
                pAudio.push(a); 
                i = i + 1; 
                s.loadSoundRecursive(i, keys, p, pAudio, resolve); 
            }); 
        } else {
            // Once all the files are loaded, resolve the promise. 
            resolve();
        }
    }

    s.setup = () => {
        s.noCanvas();
    };
    
    s.initialLoad = (onAudioLoaded, isIOS) => {
        let p1, p2, p3; // Adult palette promises
        let cp1, cp2; // Child palette promises. 

        if (isIOS) {
            console.log('IOS Device Detected... Only 2 palettes loaded.')
            p1 = s.loadPalette(0); 
            p2 = s.loadPalette(1); 
            Promise.all([p1, p2]).then(() => {
                onAudioLoaded();
            });
        } else {
            console.log('Non-IOS Device Detected... All palettes loaded.');
            // Adult palettes. 
            p1 = s.loadPalette(false, 0); 
            p2 = s.loadPalette(false, 1); 
            p3 = s.loadPalette(false, 2); 
            // Child palettes. 
            cp1 = s.loadPalette(true, 0);
            cp2 = s.loadPalette(true, 1); 
            Promise.all([p1, p2, p3, cp1, cp2]).then(() => {
                onAudioLoaded();
            });
        }
    }

    s.draw = () => {
        s.noLoop(); 
    };

    s.getLoadedPalette = (idx) => {
        return loadedPalettes[idx]; 
    }

    s.emptyThisPalette = (idx) => {
        console.log('Emptying palette: ' + idx); 
        loadedPalettes[idx] = []; 
    }
};

const TimeInterval = 3 * 60 * 1000; // 3 minutes
// Keeps track of the current pallete and is responsible for cycling the palletes. 
class AudioManager {
    constructor() {
        this.myP5 = new p5(sketch);        
        this.curPaletteIdx = 0;
        let isIOS = this.isIOSDevice(); 
        this.myP5.initialLoad(this.onAudioLoaded.bind(this), isIOS);
    }

    onAudioLoaded() {
        console.log('All audio loaded... Setting first palette.');
        this.setPallete();
    }

    startPalleteTimer() {
        this.palleteInterval = setInterval(this.updatePallete.bind(this), TimeInterval); 
    }

    updatePallete() {
        // Stop sounds the previous pallete. 
        this.stopAllSounds(); 

        let isIOS = this.isIOSDevice(); 
        if (isIOS) {
            this.curPaletteIdx = (this.curPaletteIdx + 1) % 2; 
        } else {
            // Set new palette index. 
            this.curPaletteIdx = (this.curPaletteIdx + 1) % palettes.length; 
        }

        // Set ADSR vals in current palette. 
        this.setPallete(); 
    }

    resetPallete() {
        clearInterval(this.palleteInterval); 
        // Stop all sounds from the current pallete. 
        this.stopAllSounds(); 
    }

    setPallete() {
        let p = palettes[this.curPaletteIdx]; 
        let keys = Object.keys(p); 
        let loadedPalette = this.myP5.getLoadedPalette(this.curPaletteIdx); 
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];  
            let a = loadedPalette[k];
            let adsrParams = p[k]['adsr'];
            // Set ADSR values on audio.
            // attack time, attack level, decay time, decay level, release time, release level
            a.setAdsr(adsrParams[0], adsrParams[1], adsrParams[2], adsrParams[3], adsrParams[4], adsrParams[5]); 
        }

        console.log('Current Pal idx: ' + this.curPaletteIdx); 
    }

    trigger(idx, isChipA) {
        if (!this.isIOSDevice()) {
            // ChipA is left and ChipB is right. 
            let audio = this.getAudioByPaletteIdx(idx, isChipA); 
            if (!audio.isActive) {
                audio.trigger(isChipA); 
            }
        }
    }

    release(idx, isChipA) {
        if (!this.isIOSDevice()) {
            let audio = this.getAudioByPaletteIdx(idx, isChipA); 
            audio.release(); 
        }
    }

    getAudioByPaletteIdx(idx, isChipA) {
        // Incoming index is always between 0 - 11. Offset it based on what chip is it. 
        let newIdx = isChipA ? parseInt(idx) : parseInt(idx) + 12; 
        let audio = this.myP5.getLoadedPalette(this.curPaletteIdx)[newIdx];
        return audio; 
    }

    stopAllSounds() {
        let p = palettes[this.curPaletteIdx]; 
        let keys = Object.keys(p); 
        for (let i = 0; i < keys.length; i++) {
            let audio = this.myP5.getLoadedPalette(this.curPaletteIdx)[i];
            audio.release(); 
        }

        console.log('Stopping all sounds on the palette: ' + this.curPaletteIdx);
    }

    isIOSDevice() {
        return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    }
}

// Singleton - Only a single instance please.
export default new AudioManager();