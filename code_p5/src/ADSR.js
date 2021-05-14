// Name: ADSR.js
// Author: Amay Kataria. 
// Date: 05/10/2021
// Description: ADSR module responsible to control the attack, decay, and release levels and times for each sensor's audio.

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
            this.env = new p5.Env();

            // Change this to false if you want Linear envelope
            // You'll need to tweak Levels and Times.
            this.env.setExp(true); 
            // this.env.setInput(this.soundObj); 

            // // Read the default values that were set when parsing the UI. 
            let attackTime = this.attackTimeKnob.value();
            let attackLevel = this.attackLevelKnob.value();
            let decayTime = this.decayTimeKnob.value();
            let decayLevel = this.decayLevelKnob.value();
            let releaseTime = this.releaseTimeKnob.value();
            let releaseLevel = this.releaseLevelKnob.value();
            
            // // Attack time, attack level, decay time, decay level, release time, release level. 
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
        this.soundObj.stop();
        this.soundObj.loop();
        this.env.triggerAttack(this.soundObj);
        this.isActive = true; 
    }

    release() {
        this.env.triggerRelease(this.soundObj); 
        // this.soundObj.stop();
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

        // EDGE CASE
        if (!this.isActive) {
            this.env.triggerRelease();
        }
    }

    onUpdateReleaseTime() {
        let v = this.releaseTimeKnob.value();
        this.releaseTimeKnob.attribute("title", v); 
        this.knobVal.html(v);
        this.env.rTime = v; 
        
        if (!this.isActive) {
            this.env.triggerRelease();
        }
    }

    getAttackLevel() {
        return this.attackLevelKnob.value();
    }

    getAttackTime() {
        return this.attackTimeKnob.value();
    }

    getDecayLevel() {
        return this.decayLevelKnob.value();
    }

    getDecayTime() {
        return this.decayTimeKnob.value();
    }

    getReleaseLevel() {
        return this.releaseLevelKnob.value();
    }

    getReleaseTime() {
        return this.releaseTimeKnob.value();
    }

    setValuesFromJSON(attackLevel, attackTime, decayLevel, decayTime, releaseLevel, releaseTime) {
        if (this.env) {
            // Attack level. 
            this.setKnobValue(this.attackLevelKnob, attackLevel);
            this.env.aLevel = attackLevel; 

            // Attack time.
            this.setKnobValue(this.attackTimeKnob, attackTime);
            this.env.aTime = attackTime; 

            // Decay level.
            this.setKnobValue(this.decayLevelKnob, decayLevel);
            this.env.dLevel = decayLevel;

            // Decay time. 
            this.setKnobValue(this.decayTimeKnob, decayTime);
            this.env.dTime = decayTime; 

            // Release level. 
            this.setKnobValue(this.releaseLevelKnob, releaseLevel);
            this.env.rLevel = releaseLevel;

            // Release time. 
            this.setKnobValue(this.releaseTimeKnob, releaseTime);
            this.env.rTime = releaseTime; 
        }
    }

    setKnobValue(knob, value) {
        knob.value(value);
        knob.attribute('title', value);
    }
}
