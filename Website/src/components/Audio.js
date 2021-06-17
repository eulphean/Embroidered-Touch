// Name: Audio.js
// Author: Amay Kataria. 
// Date: 06/15/2021
// Description: Class responsible to load all audio files. It's done by instantiating the 
// p5 engine in instance mode and calling into through a custom wrapper. 

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

// Load audio files here. 
import testAudio from '../Audio/testsound.wav'

let t1 = 0.1; // attack time in seconds
let l1 = 0.7; // attack level 0.0 to 1.0
let t2 = 0.3; // decay time in seconds
let l2 = 0.1; // decay level  0.0 to 1.0

var sketch = (s) => {
    let file; 
    let env; 
    s.preload = () => {
        file = s.loadSound(testAudio);
    }
    
    s.setup = () => {
        //s.createCanvas(window.innerWidth, window.innerHeight);
        s.noCanvas();
        s.background(0);
        env = new p5.Envelope(t1, l1, t2, l2);
    };

    s.draw = () => {
        s.noLoop(); 
    };

    s.play = () => {
        file.stop();
        file.loop();
        env.triggerAttack(file);
    }
};

class Audio {
    constructor() {
        this.myP5 = new p5(sketch);
    }

    play() {
        this.myP5.play(); 
    }
}

export default new Audio();