// https://adventofcode.com/2021/day/7

// Challenge 1
export function challenge1(input: Array<string>): number {
  const crabs = input[0]
    .split(',')
    .map(str => parseInt(str, 10))
    .sort((a, b) => a - b);

  const mid = Math.floor(crabs.length / 2);
  let optimalPosition = 0;

  if (crabs.length % 2 === 0) {
    optimalPosition = (crabs[mid - 1] + crabs[mid]) / 2;
  } else {
    optimalPosition = crabs[mid];
  }

  const fuel = crabs
    .map(pos => Math.abs(pos - optimalPosition))
    .reduce((acc, curr) => acc += curr, 0);

  return fuel;
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const crabs = input[0].split(',').map(str => parseInt(str, 10));
  const mean = Math.floor(crabs.reduce((acc, curr) => acc += curr) / crabs.length);
  // mean is only close to optimal, so we have to check two positions
  const optimalPositions = [mean, mean + 1];

  const fuel = optimalPositions.map(position => {
    return crabs
      .map(pos => {
        const dist = Math.abs(pos - position);
        return (dist ** 2 + dist) / 2;
      })
      .reduce((acc, curr) => acc += curr, 0);
  });

  return Math.min(...fuel);
}



/*  FIRST ITERATION          */
/*  Looping over everything  */

// Challenge 1
function challenge1_loop(input: Array<string>): number {
  const crabs = input[0]
    .split(',')
    .map(str => parseInt(str, 10));

  const positions = new Array(Math.max(...crabs) + 1).fill(0);
  crabs.forEach(pos => positions[pos] += 1);

  let bestPosition = 0;
  let fuelNeeded = Number.MAX_VALUE;

  for (let i = 0; i < positions.length; i++) {
    const fuel = positions
      .map((cnt, pos) => cnt * Math.abs(pos - i))
      .reduce((acc, curr) => acc += curr, 0);

    if (fuel < fuelNeeded) {
      fuelNeeded = fuel;
      bestPosition = i;
    }
  }

  return fuelNeeded;
}

// Challenge 2
function challenge2_loop(input: Array<string>): number {
  const crabs = input[0].split(',').map(str => parseInt(str, 10));
  const positions = new Array(Math.max(...crabs) + 1).fill(0);
  crabs.forEach(pos => positions[pos] += 1);

  let bestPosition = 0;
  let fuelNeeded = Number.MAX_VALUE;

  for (let i = 0; i < positions.length; i++) {
    const fuel = positions
      .map((cnt, pos) => {
        const dist = Math.abs(pos - i);
        let fuelConsumption = (dist ** 2 + dist) / 2;
        return cnt * fuelConsumption;
      })
      .reduce((acc, curr) => acc += curr, 0);

    if (fuel < fuelNeeded) {
      fuelNeeded = fuel;
      bestPosition = i;
    }
  }

  return fuelNeeded;
}