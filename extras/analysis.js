"use strict"

const IntegerPartition = require('./integer-partition');

const startingCodes = (slots, colours) => {
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

let slots = 4;
let colours = 6;
let bestCodes = [];
let bestMoves = Infinity;

for (let startingCode of startingCodes(slots, colours)) {
    ai.init(slots, colours);
    let result = ai.guess(startingCode);
    let moves = 1;
    console.log();
    console.log(moves, startingCode, result.grade, result.endingPossibilityCount);
    while (result.grade[0] < slots && moves < 20) {
        let code = ai.bestGuess();
        result = ai.guess(code);
        moves++;
        console.log(moves, code, result.grade, result.endingPossibilityCount);
    }
    if (moves < bestMoves) {
        bestMoves = moves;
        bestCodes = [startingCode];
    } else if (moves === bestMoves) {
        bestCodes.push(startingCode);
    }
}
console.log(`For ${slots} slots and ${colours} colours, the min moves needed are ${bestMoves}, using starting code(s): ${JSON.stringify(bestCodes)}`);