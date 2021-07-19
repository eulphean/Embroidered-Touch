// Load audio files here. 
import a0 from '../Audio/2hit.wav';
import a1 from '../Audio/2minor.wav';
import a2 from '../Audio/2softhit.wav';
import a3 from '../Audio/3minor.wav';
import a4 from '../Audio/3tone.wav';
import a5 from '../Audio/4hit.wav';
import a6 from '../Audio/4minor.wav';
import a7 from '../Audio/bells.wav';
import a8 from '../Audio/bells2.wav';
import a9 from '../Audio/bells3.wav';
import a10 from '../Audio/birds1.wav';
import a11 from '../Audio/birds2.wav';
import a12 from '../Audio/birds3.wav';
import a13 from '../Audio/birds4.wav';
import a14 from '../Audio/birds5.wav';
import a15 from '../Audio/cicada.wav';
import a16 from '../Audio/creak.wav';
import a17 from '../Audio/flick.wav';
import a18 from '../Audio/flutter.wav';
import a19 from '../Audio/histring.wav';
import a20 from '../Audio/leaves.wav';
import a21 from '../Audio/lowhi.wav';
import a22 from '../Audio/lowhits.wav';
import a23 from '../Audio/manytone.wav';
import a24 from '../Audio/minor.wav';
import a25 from '../Audio/quickhi.wav';
import a26 from '../Audio/quickhigh.wav';
import a27 from '../Audio/rollflick.wav';
import a28 from '../Audio/rollscrape.wav';
import a29 from '../Audio/rush.wav';
import a30 from '../Audio/scrape.wav';
import a31 from '../Audio/softrhythm.wav';
import a32 from '../Audio/steadyscrape.wav';
import a33 from '../Audio/sweet.wav';
import a34 from '../Audio/synchit.wav';
import a35 from '../Audio/wind.wav';
import a36 from '../Audio/wind2.wav';
// Add new audio pointer here. 

// Update this array if adding a new file. 
export let audioFiles = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36]; 

// Create these palletes in another file.
let ap1 = {
    0 : {
        'sound': 0, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 1,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    2: {
        'sound': 2,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    3: {
        'sound': 3,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    4: {
        'sound': 4,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    5: {
        'sound': 5,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    6: {
        'sound': 6,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    7: {
        'sound': 7,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    8: {
        'sound': 8,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    9: {
        'sound': 9,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    10: {
        'sound': 10,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    11: {
        'sound': 11,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    12 : {
        'sound': 12, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    13 : {
        'sound': 13,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    14: {
        'sound': 14,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    15: {
        'sound': 15,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    16: {
        'sound': 16,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    17: {
        'sound': 17,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    18: {
        'sound': 18,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    19: {
        'sound': 19,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    20: {
        'sound': 20,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    21: {
        'sound': 21,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    22: {
        'sound': 22,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    23: {
        'sound': 23,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    }
};


let ap2 = {
    0 : {
        'sound': 24, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 25,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    2: {
        'sound': 26,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    3: {
        'sound': 27,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    4: {
        'sound': 28,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    5: {
        'sound': 29,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    6: {
        'sound': 30,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    7: {
        'sound': 31,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    8: {
        'sound': 32,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    9: {
        'sound': 33,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    10: {
        'sound': 34,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    11: {
        'sound': 35,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    12 : {
        'sound': 36, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    13 : {
        'sound': 0,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    14: {
        'sound': 1,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    15: {
        'sound': 2,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    16: {
        'sound': 3,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    17: {
        'sound': 4,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    18: {
        'sound': 5,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    19: {
        'sound': 6,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    20: {
        'sound': 7,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    21: {
        'sound': 8,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    22: {
        'sound': 9,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    23: {
        'sound': 10,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    }
};

let ap3 = {
    0 : {
        'sound': 11, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 12,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    2: {
        'sound': 13,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    3: {
        'sound': 14,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    4: {
        'sound': 15,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    5: {
        'sound': 16,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    6: {
        'sound': 17,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    7: {
        'sound': 18,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    8: {
        'sound': 19,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    9: {
        'sound': 20,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    10: {
        'sound': 21,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    11: {
        'sound': 22,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    12 : {
        'sound': 23, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    13 : {
        'sound': 24,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    14: {
        'sound': 25,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    15: {
        'sound': 26,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    16: {
        'sound': 27,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    17: {
        'sound': 28,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    18: {
        'sound': 29,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    19: {
        'sound': 30,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    20: {
        'sound': 31,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    21: {
        'sound': 32,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    22: {
        'sound': 33,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    23: {
        'sound': 34,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    }
};

let ap4 = {
    0 : {
        'sound': 35, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 36,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    2: {
        'sound': 0,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    3: {
        'sound': 1,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    4: {
        'sound': 2,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    5: {
        'sound': 3,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    6: {
        'sound': 4,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    7: {
        'sound': 5,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    8: {
        'sound': 6,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    9: {
        'sound': 7,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    10: {
        'sound': 8,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    11: {
        'sound': 9,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    12 : {
        'sound': 10, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    13 : {
        'sound': 11,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    14: {
        'sound': 12,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    15: {
        'sound': 13,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    16: {
        'sound': 14,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    17: {
        'sound': 15,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    18: {
        'sound': 16,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    19: {
        'sound': 17,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    20: {
        'sound': 18,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    21: {
        'sound': 19,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    22: {
        'sound': 20,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    23: {
        'sound': 21,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    }
};

let ap5 = {
    0 : {
        'sound': 22, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 23,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    2: {
        'sound': 24,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    3: {
        'sound': 25,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    4: {
        'sound': 26,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    5: {
        'sound': 27,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    6: {
        'sound': 28,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    7: {
        'sound': 29,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    8: {
        'sound': 30,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    9: {
        'sound': 31,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    10: {
        'sound': 32,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    11: {
        'sound': 33,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    12 : {
        'sound': 34, // File index. 
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    13 : {
        'sound': 35,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    14: {
        'sound': 36,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    15: {
        'sound': 0,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    16: {
        'sound': 1,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    17: {
        'sound': 2,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    18: {
        'sound': 3,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    19: {
        'sound': 4,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    20: {
        'sound': 5,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    21: {
        'sound': 6,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    22: {
        'sound': 7,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    },
    23: {
        'sound': 8,
        'adsr': [0.1, 0.7, 0.3, 0.1, 0.5, 0.0]
    }
};

// Export all the palettes. 
export let palettes = [ap1, ap2, ap3, ap4, ap5]; 