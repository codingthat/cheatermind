"use strict"

const ai = require("../src/js/AI");

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

const commandLineArgs = process.argv.slice(2);
let displayDetail = false;
let colourMin, colourMax, slotMin, slotMax;
if (commandLineArgs.length < 2) {
    console.log(`Use the following command line parameters:

        Required:

        -sA,B   Where A and B are the min and max slots to use.
        -cA,B   Where A and B are the min and max colours to use.

        Optional:

        -d      Display more detail for each game analysis.

        If the ranges indicated cover only a single game:
            1.  no summary is displayed
            2.  -d is assumed
    `);
    return;
} else {
    commandLineArgs.forEach(function(element) {
        const matches = element.match(/-(([sc])([0-9]+),([0-9]+)|d)/);
        if (matches === null) {
            console.log(`Not sure what you mean by "${element}"`);
            return;
        }
        if (matches[1] === 'd') {
            displayDetail = true;
        } else if (matches[2] === 's') {
            slotMin = matches[3] * 1;
            slotMax = matches[4] * 1;
        } else if (matches[2] === 'c') {
            colourMin = matches[3] * 1;
            colourMax = matches[4] * 1;     
        }
    }, this);
    if (colourMin === colourMax && slotMin === slotMax) {
        displayDetail = true;
    }
}

let summary = '';
let header = 'c \\ s\t';
for (let slots = slotMin; slots <= slotMax; slots++) {
    header += slots + '\t';
}
if (displayDetail) {
    summary += header;
} else {
    console.log('Get ready for a potentially long, long running analysis.\n');
    console.log(header);
}
for (let colours = colourMin; colours <= colourMax; colours++) {
    let line = colours + '\t';
    for (let slots = slotMin; slots <= slotMax; slots++) {
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
            if (displayDetail) {
                console.log();
                console.log(moves, startingCode, result.grade, result.endingPossibilityCount);
            }
            while (result.grade[0] < slots && moves < 20) {
                let code = ai.bestGuess();
                result = ai.guess(code);
                moves++;
                if (displayDetail) {
                    console.log(moves, code, result.grade, result.endingPossibilityCount);
                }
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
        if (displayDetail) {
            console.log(`\nFor ${slots} slots and ${colours} colours, the min moves needed are ${bestMoves}, using starting code(s):\n ${JSON.stringify(bestCodes)}`);
        }
    }
    if (displayDetail) {
        summary += line;
    } else {
        console.log(line);
    }
}
if (!displayDetail) {
    console.log(summary);
}
