"use strict"

const IntegerPartition = require('./integer-partition');

const startingCodes = (slots, colours) => {
    // return [[0,0,1,1]]
    const codes = [];
    for (const part of IntegerPartition.zs1(slots)) {
        if (part.length > colours) { continue; }
        const code = [];
        for (let colour = 0; colour < part.length; colour++) {
            for (let i = 0; i < part[colour]; i++) {
                code.push(colour);
            }
        }
        codes.push(code);
    }
    return codes;
}

var ai = require("../src/js/AI")

// let colours = 6;
// let slots = 4;
console.log('Get ready for a long, long running analysis.\n'); // which is currently incorrect
const colourMax = 6;
const slotMax = 4;
let header = '\t';
for (let slots = 2; slots <= slotMax; slots++) {
    header += slots + '\t';
}
console.log(header);
for (let colours = 2; colours <= colourMax; colours++) {
    let line = colours + '\t';
    for (let slots = 2; slots <= slotMax; slots++) {
        let bestCodes = [];
        let bestMoves = Infinity;

        for (let startingCode of startingCodes(slots, colours)) {
            try {
                ai.init(slots, colours);
            } catch (e) {
                break;
            }
            let result = ai.guess(startingCode);
            let moves = 1;
            // console.log();
            // console.log(moves, startingCode, result.grade, result.endingPossibilityCount);
            while (result.grade[0] < slots && moves < 20) {
                let code = ai.bestGuess();
                result = ai.guess(code);
                moves++;
                // console.log(moves, code, result.grade, result.endingPossibilityCount);
            }
            if (moves < bestMoves) {
                bestMoves = moves;
                bestCodes = [startingCode];
            } else if (moves === bestMoves) {
                bestCodes.push(startingCode);
            }
        }
        if (bestMoves === Infinity) {
            bestMoves = '-';
        }
        line += bestMoves + '\t';
    }
    console.log(line);
}
// console.log(`\nFor ${slots} slots and ${colours} colours, the min moves needed are ${bestMoves}, using starting code(s):\n ${JSON.stringify(bestCodes)}`);
