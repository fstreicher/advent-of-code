// https://adventofcode.com/2023/day/09

function parseInput(input: Array<string>): Array<Array<number>> {
  return input.map((line) => line.split(' ').map(Number));
}

function predictNextValue(sequence: Array<number>): number {
  const extrapolatedDifferences = getDifferences(sequence);
  return sequence[sequence.length - 1] + extrapolatedDifferences[extrapolatedDifferences.length - 1];
}

function predictPreviousValue(sequence: Array<number>): number {
  const extrapolatedDifferences = getDifferences(sequence);
  return sequence[0] - extrapolatedDifferences[0];
}

/**
 * Recursively extrapolates the differences between the elements of the input sequence
 * @param sequence the input sequence to extrapolate
 * @returns the extrapolated differences
 */
function getDifferences(sequence: Array<number>): Array<number> {
  const currentDifferences = [];
  for (let i = 1; i < sequence.length; i++) {
    currentDifferences.push(sequence[i] - sequence[i - 1]);
  }
  if (currentDifferences.every(d => d === 0)) {
    currentDifferences.push(0);
    currentDifferences.unshift(0);
    return currentDifferences;
  }
  const nextDifferences = getDifferences(currentDifferences);
  // add the extrapolated difference to the end
  currentDifferences.push(
    currentDifferences[currentDifferences.length - 1] +
    nextDifferences[nextDifferences.length - 1]
  );
  // add the extrapolated difference to the beginning
  currentDifferences.unshift(
    currentDifferences[0] -
    nextDifferences[0]
  )

  return currentDifferences;
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  const sequences = parseInput(input);
  const results = sequences.map(predictNextValue);
  return results.reduce((acc, curr) => acc + curr, 0);
}


// Challenge 2
export function challenge2(input: Array<string>): number {
  const sequences = parseInput(input);
  const results = sequences.map(predictPreviousValue);
  return results.reduce((acc, curr) => acc + curr, 0);
}
