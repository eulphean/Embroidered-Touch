// Name: ADSR.js
// Author: Amay Kataria. 
// Date: 05/10/2021
// Description: ADSR module responsible to control the attack, decay, and release levels and times

// ADSR properties. 
const maxLevel = 10;
const maxTime = 20; 
const step = 0.1; 
const defaultAttackLevel = 1.0;
const defaultAttackTime = 0.5;
const defaultDecayLevel = 0.8;
const defaultDecayTime = 0.5;
const defaultReleaseLevel = 0.0;
const defaultReleaseTime = 0.5;

class ADSR {
    constructor(knobCollection, isSensorUnused) {
        // Save this, so we can take actions based on this in the future. 
        this.isSensorUnused = isSensorUnused; 
        this.knobTree = knobCollection; 
        this.parseUI();

        // Don't assign a sound for an unused sensor line. 
        if (this.isSensorUnused) {
            this.soundObj = 'NA';
        } else {
            this.soundObj = audio.assignTone();
            this.soundObj.loop();  
            this.env = new p5.Env();
            this.env.setInput(this.soundObj); 
            // Attack time, attack level, decay time, decay level, release time, release level. 
            let attackTime = this.attackTimeKnob.value();
            let attackLevel = this.attackLevelKnob.value();
            let decayTime = this.decayTimeKnob.value();
            let decayLevel = this.decayLevelKnob.value();
            let releaseTime = this.releaseTimeKnob.value();
            let releaseLevel = this.releaseLevelKnob.value();

            this.env.set(attackTime, attackLevel, decayTime, decayLevel, releaseTime, releaseLevel);
            
            // Is the ADSR already active?
            this.isActive = false; 
        }

    }

    parseUI() {
        this.attackLevelKnob = select('.attackLevel', this.knobTree);
        this.setInitialAttributes(this.attackLevelKnob, defaultAttackLevel, true); 
        this.attackLevelKnob.elt.addEventListener('input', this.onUpdateAttackLevel.bind(this));

        this.attackTimeKnob = select('.attackTime', this.knobTree);
        this.setInitialAttributes(this.attackTimeKnob, defaultAttackTime, false);
        this.attackTimeKnob.elt.addEventListener('input', this.onUpdateAttackTime.bind(this));

        this.decayLevelKnob = select('.decayLevel', this.knobTree);
        this.setInitialAttributes(this.decayLevelKnob, defaultDecayLevel, true);
        this.decayLevelKnob.elt.addEventListener('input', this.onUpdateDecayLevel.bind(this));

        this.decayTimeKnob = select('.decayTime', this.knobTree);
        this.setInitialAttributes(this.decayTimeKnob, defaultDecayTime, false);
        this.decayTimeKnob.elt.addEventListener('input', this.onUpdateDecayTime.bind(this)); 

        
        this.releaseLevelKnob = select('.releaseLevel', this.knobTree);
        this.setInitialAttributes(this.releaseLevelKnob, defaultReleaseLevel, true); 
        this.releaseLevelKnob.elt.addEventListener('input', this.onUpdateReleaseLevel.bind(this));

        this.releaseTimeKnob = select('.releaseTime', this.knobTree);
        this.setInitialAttributes(this.releaseTimeKnob, defaultReleaseTime, false);
        this.releaseTimeKnob.elt.addEventListener('input', this.onUpdateReleaseTime.bind(this));

        this.knobVal = select('.knob-val', this.knobTree);
    }

    setInitialAttributes(knob, defaultVal, isLevel) {
        knob.attribute('step', step);
        if (isLevel) {
            knob.attribute('max', maxLevel);
        } else {
            knob.attribute('max', maxTime);
        }
        
        // Set initial value to 0.
        knob.value(defaultVal);
        knob.attribute("title", defaultVal); 
    }

    trigger() {
        // this.soundObj.play(); 
        
        // this.env.play();
        this.env.triggerAttack();
        this.isActive = true; 
    }

    release() {
        this.env.triggerRelease(); 
        this.isActive = false; 
    }

    onUpdateAttackLevel() {
        let v = this.attackLevelKnob.value();
        this.attackLevelKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.aLevel = v; 
    }

    onUpdateAttackTime() {
        let v = this.attackTimeKnob.value();
        this.attackTimeKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.aTime = v;
    }

    onUpdateDecayLevel() {
        let v = this.decayLevelKnob.value();
        this.decayLevelKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.dLevel = v; 
    }

    onUpdateDecayTime() {
        let v = this.decayTimeKnob.value();
        this.decayTimeKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.dTime = v;
    }

    onUpdateReleaseLevel() {
        let v = this.releaseLevelKnob.value();
        this.releaseLevelKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.rLevel = v; 
    }

    onUpdateReleaseTime() {
        let v = this.releaseTimeKnob.value();
        this.releaseTimeKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.rTime = v; 
    }
}
