// Load audio files here. 
import a0 from '../Audio/4singingpark.m4a';
import a1 from '../Audio/churchbells.m4a';
import a2 from '../Audio/desert.mp3';
import a3 from '../Audio/drone.mp3';
import a4 from '../Audio/zoo7.m4a';
import a5 from '../Audio/forest.mp3';
import a6 from '../Audio/gibber.mp3';
import a7 from '../Audio/strings2.mp3';
import a8 from '../Audio/drone2.mp3';
import a9 from '../Audio/HvonK.m4a';
import a10 from '../Audio/music.m4a';
import a11 from '../Audio/ocean.mp3';
import a12 from '../Audio/scale.mp3';
import a13 from '../Audio/song.mp3';
import a14 from '../Audio/strings.mp3';
import a15 from '../Audio/Grunewald.m4a';
import a16 from '../Audio/tango.m4a';
import a17 from '../Audio/thunder.mp3';
import a18 from '../Audio/Tiergarten.m4a';
import a19 from '../Audio/watertalking.m4a';
import a20 from '../Audio/zoo3.m4a';
import a21 from '../Audio/drone3.mp3';
import a22 from '../Audio/EWbirds.m4a';
import a23 from '../Audio/strings3.mp3';
import a24 from '../Audio/strings.mp3';
import a25 from '../Audio/blowout.mp3';
import a26 from '../Audio/dissonant.mp3';
import a27 from '../Audio/drone4.mp3';
import a28 from '../Audio/feedback.mp3';
import a29 from '../Audio/frantic.mp3';
import a30 from '../Audio/friction.mp3';
import a31 from '../Audio/gibber2.mp3';
import a32 from '../Audio/knocking.mp3';
import a33 from '../Audio/loop.mp3';
import a34 from '../Audio/meditative.mp3';
import a35 from '../Audio/gibbermix.mp3';
import a36 from '../Audio/gibber3.mp3';
import a37 from '../Audio/polyhits.mp3';
import a38 from '../Audio/quickstring.mp3';
import a39 from '../Audio/quietstring.mp3';
import a40 from '../Audio/reverse.mp3';
import a41 from '../Audio/gibber4.mp3';
import a42 from '../Audio/softhits.mp3';
import a43 from '../Audio/static.mp3';
import a44 from '../Audio/twinkle.mp3';
import a45 from '../Audio/drone5.mp3';
import a46 from '../Audio/churchbells.m4a';
import a47 from '../Audio/bowstring.mp3';
import a48 from '../Audio/breathing.mp3';
import a49 from '../Audio/camera.mp3';
import a50 from '../Audio/words3.mp3';
import a51 from '../Audio/country.mp3';
import a52 from '../Audio/dissonant.mp3';
import a53 from '../Audio/door.mp3';
import a54 from '../Audio/playing2.mp3';
import a55 from '../Audio/fire.mp3';
import a56 from '../Audio/freedom.mp3';
import a57 from '../Audio/knocking.mp3';
import a58 from '../Audio/lavie.mp3';
import a59 from '../Audio/words2.mp3';
import a60 from '../Audio/ocean.mp3';
import a61 from '../Audio/playing.mp3';
import a62 from '../Audio/drum.mp3';
import a63 from '../Audio/pond.mp3';
import a64 from '../Audio/restaurant.mp3';
import a65 from '../Audio/revolution.mp3';
import a66 from '../Audio/thunder.mp3';
import a67 from '../Audio/underwater.mp3';
import a68 from '../Audio/words1.mp3';
import a69 from '../Audio/musicbox.mp3';
import a70 from '../Audio/cheer.mp3';
import a71 from '../Audio/spider.m4a';
import a72 from '../Audio/nightingale.mp3';
import a73 from '../Audio/meow.mp3';
import a74 from '../Audio/rooster.mp3';
import a75 from '../Audio/cow.mp3';
// Add new audio pointer here. 

// Update this array if adding a new file. 
export let audioFiles = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30, a31, a32, a33, a34, a35, a36, a37, a38, a39, a40, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50, a51, a52, a53, a54, a55, a56, a57, a58, a59, a60, a61, a62, a63, a64, a65, a66, a67, a68, a69, a70, a71, a72, a73, a74, a75]; 

// Create these palletes in another file.
let ap1 = {
    0 : {
        'sound': 0, // File index. 
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 1,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    2: {
        'sound': 2,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    3: {
        'sound': 3,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    4: {
        'sound': 4,
        'adsr':  [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    5: {
        'sound': 5,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    6: {
        'sound': 6,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    7: {
        'sound': 7,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    8: {
        'sound': 8,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    9: {
        'sound': 9,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    10: {
        'sound': 10,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    11: {
        'sound': 11,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    12: {
        'sound': 12,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    13: {
        'sound': 13,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    14: {
        'sound': 14,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    15: {
        'sound': 15,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    16: {
        'sound': 16,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    17: {
        'sound': 17,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    18: {
        'sound': 18,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    19: {
        'sound': 19,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    20: {
        'sound': 20,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    21: {
        'sound': 21,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    22: {
        'sound': 22,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    23: {
        'sound': 23,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    }
};

let ap2 = {
    0 : {
        'sound': 24, // File index. 
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 25,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    2: {
        'sound': 26,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    3: {
        'sound': 27,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    4: {
        'sound': 28,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    5: {
        'sound': 29,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    6: {
        'sound': 30,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    7: {
        'sound': 31,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    8: {
        'sound': 32,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    9: {
        'sound': 33,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    10: {
        'sound': 34,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    11: {
        'sound': 35,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    12: {
        'sound': 36,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    13: {
        'sound': 37,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    14: {
        'sound': 38,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    15: {
        'sound': 39,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    16: {
        'sound': 40,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    17: {
        'sound': 41,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    18: {
        'sound': 42,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    19: {
        'sound': 43,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    20: {
        'sound': 44,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    21: {
        'sound': 45,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    22: {
        'sound': 46,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    23: {
        'sound': 47,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    }
};

let ap3 = {
    0 : {
        'sound': 48, // File index. 
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0] // Attack time, attack level (0-1), decay time, decay level (0-1), releaseTime, releaseLevel (0-1)
    },
    1 : {
        'sound': 49,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    2: {
        'sound': 50,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    3: {
        'sound': 51,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    4: {
        'sound': 52,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    5: {
        'sound': 53,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    6: {
        'sound': 54,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    7: {
        'sound': 55,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    8: {
        'sound': 56,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    9: {
        'sound': 57,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    10: {
        'sound': 58,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    11: {
        'sound': 59,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    12: {
        'sound': 60,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    13: {
        'sound': 61,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    14: {
        'sound': 62,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    15: {
        'sound': 63,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    16: {
        'sound': 64,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    17: {
        'sound': 65,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    18: {
        'sound': 66,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    19: {
        'sound': 67,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    20: {
        'sound': 68,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    21: {
        'sound': 69,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    22: {
        'sound': 70,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    23: {
        'sound': 8,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    }
};

let cp1 = {
    0: {
        'sound': 71,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    1: {
        'sound': 72,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    2: {
        'sound': 73,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    3: {
        'sound': 74,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    }
};

let cp2 = {
    0: {
        'sound': 75,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    1: {
        'sound': 71,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    2: {
        'sound': 72,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    },
    3: {
        'sound': 73,
        'adsr': [5.0, 0.5, 1.0, 0.5, 2.0, 0.0]
    }
}

// Export all the palettes. 
export let palettes = [ap1, ap2, ap3]; 
export let childPalettes = [cp1, cp2]; 