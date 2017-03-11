let possibleCodes = [];
let slotCount = 4;
let colourCount = 6;

const init = (slots, colours) => {
  if (slots < 1) { throw new Error('Must have at least 1 slot'); }
  if (colours < 2) { throw new Error('Must have at least 2 colours'); }

  const possibilities = Math.pow(colours, slots); // eslint-disable-line no-restricted-properties
  if (possibilities > 9000000) {
    throw new Error('Might have too many possibilities for this engine');
  }

  slotCount = slots;
  colourCount = colours;
  possibleCodes = [];

  const currentCode = [];
  for (let i = 0; i < slots; i++) { currentCode.push(0); } // start with all 0's
  for (let left = possibilities; left > 0; left--) { // add every possible code
    possibleCodes.push(currentCode.slice(0));
    let slotsMaxed = 0;
    // how many slots to 'roll over'
    // (like 9's when counting, except left-to-right)
    while (currentCode[slotsMaxed] === colours - 1) { slotsMaxed += 1; }
    if (slotsMaxed > 0) {
      for (let i = 0; i < slotsMaxed; i++) {
        currentCode[i] = 0;
      }
      currentCode[slotsMaxed] += 1; // slotsMaxed is one past the last one we 0'd out
    } else {
      currentCode[0] += 1;
    }
  }
};
const diff = (guess, code) => {
  if (guess.length !== slotCount) {
    throw new Error(`Guess and code must be the same length, but weren't:
      ${guess.length} !== ${slotCount}`);
  }

  let exactCount = 0;
  let inexactCount = 0;
  const extraColours = [];
  const extraPositions = [];
  for (let i = 0; i < colourCount; i++) { extraColours[i] = 0; }
  for (let i = 0; i < guess.length; i++) {
    const colour = code[i];
    if (guess[i] === colour) {
      exactCount += 1;
    } else {
      extraColours[colour] += 1; // is the colour somewhere else?
      extraPositions.push(i);
    }
  }
  extraPositions.forEach((extraPosition) => {
    const guessColour = guess[extraPosition];
    if (guessColour > colourCount - 1) { throw new Error(`Guess contains colour beyond maximum: ${guessColour} > ${colourCount - 1}`); }
    if (extraColours[guessColour] > 0) {
      inexactCount += 1;
      extraColours[guessColour] -= 1;
    }
  });
  return [exactCount, inexactCount, slotCount - exactCount - inexactCount];
  // last index: how many were just plain wrong
};
const guess = (newGuess, narrowDownPossibilities = true) => {
  const startingPossibilityCount = possibleCodes.length;
  if (startingPossibilityCount === 1) { // possible win!
    return {
      grade: diff(newGuess, possibleCodes[0]),
      startingPossibilityCount,
      endingPossibilityCount: 1,
    };
  }
  const gradeBuckets = []; // whichever is largest, that's the official grade
  // (if there's a tie for largest bucket, take a random one to break it)
  const gradeBucketMap = {}; // just for quicker lookup during array filling
  for (const code of possibleCodes) { // eslint-disable-line no-restricted-syntax
    const gradeForCode = diff(newGuess, code);
    if (gradeForCode[0] !== slotCount) { // i.e. code !== guess
      const bucket = gradeForCode.join(',');
      if (typeof (gradeBucketMap[bucket]) === 'undefined') {
        gradeBuckets.push([bucket, []]);
        gradeBucketMap[bucket] = gradeBuckets.length - 1; // the new 0
      }
      gradeBuckets[gradeBucketMap[bucket]][1].push(code);
    }
  }
  gradeBuckets.sort((a, b) => b[1].length - a[1].length);
  const best = gradeBuckets[0][1];
  let pastLastTie = 1;
  if (gradeBuckets.length > 1) {
    while (gradeBuckets[pastLastTie][1] === best) { pastLastTie += 1; }
  }
  let chosenTie = 0;
  if (pastLastTie > 1) { // pick randomly among all the ties for biggest bucket
    // console.log('tiebreaker among', pastLastTie); // I haven't seen these yet in the wild.
    chosenTie = Math.floor(Math.random() * pastLastTie); // exclusive of pastLastTie as an integer
  } // otherwise index 0 is the only one, and that's the default 'chosen tie'
  if (narrowDownPossibilities) {
    // narrow it down based on what we're about to return,
    // but only if this is a real guess
    possibleCodes = gradeBuckets[chosenTie][1];
  }
  return {
    grade: gradeBuckets[chosenTie][0].split(',').map(i => i * 1),
    startingPossibilityCount,
    endingPossibilityCount: gradeBuckets[chosenTie][1].length,
  };
};
const hint = () => {
  if (possibleCodes.length === 1) {
    return possibleCodes[0];
  }
  const logicalIndex = possibleCodes.findIndex((code) => {
    const guessResult = guess(code, false);
    return guessResult.startingPossibilityCount > guessResult.endingPossibilityCount;
  });
  return possibleCodes[logicalIndex];
};

module.exports = { init, diff, guess, hint }; // for ospec compatibility
