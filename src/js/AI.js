let allPossibleCodes = [];
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
  allPossibleCodes = possibleCodes.slice(0);
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
  // (if there's a tie for largest bucket, use tiebreaker algorithm)
  const gradeBucketMap = new Map(); // just for quicker lookup during array filling
  for (const code of possibleCodes) { // eslint-disable-line no-restricted-syntax
    const gradeForCode = diff(newGuess, code);
    if (gradeForCode[0] !== slotCount) { // i.e. code !== guess
      if (typeof (gradeBucketMap[gradeForCode]) === 'undefined') {
        gradeBuckets.push([gradeForCode, []]);
        gradeBucketMap[gradeForCode] = gradeBuckets.length - 1; // the new 0
      }
      gradeBuckets[gradeBucketMap[gradeForCode]][1].push(code);
    }
  }
  gradeBuckets.sort((a, b) => b[1].length - a[1].length);
  const bestGrade = gradeBuckets[0][1].length;
  let pastLastTie = 1;
  while (gradeBuckets.length > pastLastTie
    && gradeBuckets[pastLastTie][1].length === bestGrade) { pastLastTie += 1; }
  let bestBucket = gradeBuckets[0]; // default, unless there's a tie
  if (pastLastTie > 1) { // tie: prefer less white pegs, then more black pegs
    let tieBuckets = gradeBuckets.slice(0, pastLastTie);
    const base = slotCount + 1;
    const value = grade => (base - grade[1]) * base + grade[0];
    tieBuckets.sort((a, b) => value(b[0]) - value(a[0]));
    bestBucket = tieBuckets[0];
    // for (let bucket of tieBuckets) {
    //   console.log(`${bucket[0]} would leave ${bucket[1].length} possibilities, ${value(bucket[0])}`)
    // }
  } // otherwise index 0 is the only one, and that's the default 'chosen tie'
  // if (JSON.stringify(bestBucket[0])==='[0,1,3]' && narrowDownPossibilities) {
  //   for (let code of bestBucket[1]) {
  //     let str = '';
  //     for (let slot of code) {
  //       str += (slot + 1);
  //     }
  //     console.log(str)
  // }
  // throw new Error();
  // }
  if (narrowDownPossibilities) {
    // narrow it down based on what we're about to return,
    // but only if this is a real guess
    possibleCodes = bestBucket[1];
  }
  return {
    grade: bestBucket[0],
    startingPossibilityCount,
    endingPossibilityCount: bestBucket[1].length,
  };
};
const hint = () => { // a logical guess, but not the most efficient
  if (possibleCodes.length === 1) {
    return possibleCodes[0];
  }
  const logicalIndex = possibleCodes.findIndex((code) => {
    const guessResult = guess(code, false);
    return guessResult.startingPossibilityCount > guessResult.endingPossibilityCount;
  });
  return possibleCodes[logicalIndex];
};
const bestGuess = () => {
  if (possibleCodes.length === 1) {
    return possibleCodes[0];
  }
  let bestEndingCount = Infinity;
  let bestEndingIndex = -1;
  const value = (code) => {
    let sum = 0;
    for (let i = 0; i < slotCount; i++) {
      // eslint-disable-next-line no-restricted-properties
      sum += code[i] * Math.pow(colourCount, slotCount - i - 1);
    }
    return sum;
  };
  for (let i = 0; i < allPossibleCodes.length; i++) {
    const guessResult = guess(allPossibleCodes[i], false);
    // console.log(`code ${allPossibleCodes[i]}: ${guessResult.grade} ${guessResult.endingPossibilityCount}`);
    if (guessResult.endingPossibilityCount <= bestEndingCount) {
      if (guessResult.endingPossibilityCount === bestEndingCount
         && value(allPossibleCodes[i]) > value(allPossibleCodes[bestEndingIndex])) {
        continue; // eslint-disable-line no-continue
      }
      bestEndingCount = guessResult.endingPossibilityCount;
      bestEndingIndex = i;
      // console.log(`new best code ${allPossibleCodes[i]}: ${bestEndingCount}`)
    }
  }
  const ties = [];
  for (let i = 0; i < allPossibleCodes.length; i++) {
    const guessResult = guess(allPossibleCodes[i], false);
    if (guessResult.endingPossibilityCount === bestEndingCount) {
      ties.push(allPossibleCodes[i]);
    }
  }
  ties.sort((a,b) => value(b) - value(a));
  for (let i = 0; i < ties.length; i++) {
    // console.log(`code ${ties[i]} ties for best count ${bestEndingCount}`)
  }
  return allPossibleCodes[bestEndingIndex];
};

module.exports = { init, diff, guess, hint, bestGuess }; // for ospec compatibility
