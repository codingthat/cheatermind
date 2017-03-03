var possibleCodes = [];
var slotCount = 4;
var colourCount = 6;

const init = (slots, colours) => {
    if (slots <= 0) { throw new Error("Must have positive slots"); }
    if (colours <= 0) { throw new Error("Must have positive colours"); }

    const possibilities = Math.pow(colours, slots);
    if (possibilities > 11000000) { throw new Error("Might have too many possibilities for this engine"); }

    slotCount = slots;
    colourCount = colours;
    possibleCodes = [];

    let currentCode = [];
    for (let i=0; i<slots; i++) { currentCode.push(0); } // start with all 0's
    for (let left=possibilities; left > 0; left--) { // add every possible code
        possibleCodes.push(currentCode.slice(0));
        let slotsMaxed = 0;
        while (currentCode[slotsMaxed] === colours - 1) { slotsMaxed++; } // how many slots to 'roll over' (like 9's when counting, except left-to-right)
        if (slotsMaxed > 0) {
            for (let i=0; i<slotsMaxed; i++) {
                currentCode[i] = 0;
            }
            currentCode[slotsMaxed]++; // slotsMaxed is one past the last one we 0'd out
        } else {
            currentCode[0]++;
        }
    }
}
const diff = (guess, code) => {
    if (guess.length !== slotCount) { throw new Error(`Guess and code must be the same length, but weren't: ${guess.length}, ${slotCount}`); }

    let exactCount = 0,
        inexactCount = 0,
        extraColours = [],
        extraPositions = [];
    for (let i=0; i<colourCount; i++) { extraColours[i] = 0; }
    for (let i=0; i<guess.length; i++) {
        let colour = code[i];
        if (guess[i] === colour) {
            exactCount++;
        } else {
            extraColours[colour]++; // is the colour somewhere else?
            extraPositions.push(i);
        }
    }
    for (let extraPosition of extraPositions) {
        let guessColour = guess[extraPosition];
        if (guessColour > extraColours.length - 1) { throw new Error("Guess contains colour beyond maximum: ", guessColour, colourCount); }
        if (extraColours[guessColour] > 0) {
            inexactCount++;
            extraColours[guessColour]--;
        }
    }
    return [exactCount, inexactCount, slotCount - exactCount - inexactCount]; // last one: how many were just plain wrong
}
const guess = (guess) => {
    if (possibleCodes.length === 1) { return diff(guess, possibleCodes[0]); } // win!
    let gradeBuckets = [], // whichever is largest (or random amongst ties for largest), that's the official grade
        gradeBucketMap = {}; // just for quicker lookup during array filling
    for (let code of possibleCodes) {
        const gradeForCode = diff(guess, code);
        if (gradeForCode[0] === slotCount) { // i.e. code === guess
            continue; // player is never right (unless that's the only option left)
        }
        const bucket = gradeForCode.join(',');
        if (typeof (gradeBucketMap[bucket]) === 'undefined') {
            gradeBuckets.push([bucket, []]);
            gradeBucketMap[bucket] = gradeBuckets.length - 1; // the new 0
        }
        gradeBuckets[gradeBucketMap[bucket]][1].push(code);
    }
    gradeBuckets.sort( (a,b) => b[1].length - a[1].length );
    const best = gradeBuckets[0][1];
    let pastLastTie = 1;
    if (gradeBuckets.length > 1) { while (gradeBuckets[pastLastTie][1] === best) { pastLastTie++; } }
    let chosenTie = 0;
    if (pastLastTie > 1) { // pick randomly among all the ties for biggest bucket
        console.log("tiebreaker among", pastLastTie)
        chosenTie = Math.floor(Math.random() * pastLastTie); // exclusive of pastLastTie as an integer
    } // otherwise index 0 is the only one, and that's the default 'chosen tie'
    possibleCodes = gradeBuckets[chosenTie][1]; // narrow it down based on what we're about to return
    // console.log(possibleCodes[0], possibleCodes.length)
    return gradeBuckets[chosenTie][0].split(',').map(i => i*1);
}

// module.exports works for ospec, but makes rollup produce an invalid bundle (client-side error)
//module.exports = { init, diff, guess };
// export makes a valid bundle, but chokes ospec
export { init, diff, guess };