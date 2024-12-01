// https://adventofcode.com/2023/day/06

interface Race {
  time: number;
  distance: number;
}

function parseInput(input: Array<string>): Array<{ time: number, distance: number }> {
  const time = input[0].split(/\s+/).slice(1).map(Number);
  const distance = input[1].split(/\s+/).slice(1).map(Number);
  return time.map((time, index) => ({ time, distance: distance[index] }));
}

function getCombinations(race: Race): number {
  let combinationsRace = 0;
  let wasLastRunLonger = false;
  for (let i = 0; i < race.time; i++) {
    const distance = i * (race.time - i);
    if (distance > race.distance) {
      combinationsRace++;
      wasLastRunLonger = true;
    } else
      if (wasLastRunLonger) {
        return combinationsRace;
      }
  }
}

// Challenge 1
export function challenge1(input: Array<string>) {
  const races = parseInput(input);
  const combinations: Array<number> = [];

  for (const race of races) {
    combinations.push(getCombinations(race));
  }
  return combinations.reduce((acc, curr) => acc * curr, 1);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const races = parseInput(input);

  const newRace: Race = {
    time: parseInt(races.reduce((acc, curr) => acc.concat(String(curr.time)), '')),
    distance: parseInt(races.reduce((acc, curr) => acc.concat(String(curr.distance)), ''))
  }

  return getCombinations(newRace);
}
