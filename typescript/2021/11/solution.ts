// https://adventofcode.com/2021/day/11

interface Octopus {
  energyLevel: number;
  hasFlashed: boolean;
}

function increaseEnergyOfAll(octopi: Array<Array<Octopus>>): void {
  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[i].length; j++) {
      octopi[i][j].energyLevel++;
    }
  }
}

function increaseEnergyOfNeighbors(x: number, y: number, octopi: Array<Array<Octopus>>): number {
  const [maxX, maxY] = [octopi.length - 1, octopi[x].length - 1];
  let flashes = 0;
  const flashOne = (x: number, y: number) => {
    octopi[x][y].hasFlashed = true;
    return 1 + increaseEnergyOfNeighbors(x, y, octopi);
  }
  //#region orthogonal
  if (x > 0) {
    octopi[x - 1][y].energyLevel++;
    if (octopi[x - 1][y].energyLevel > 9 && !octopi[x - 1][y].hasFlashed) {
      flashes += flashOne(x - 1, y);
    }
  }
  if (x < maxX) {
    octopi[x + 1][y].energyLevel++;
    if (octopi[x + 1][y].energyLevel > 9 && !octopi[x + 1][y].hasFlashed) {
      flashes += flashOne(x + 1, y);
    }
  }
  if (y > 0) {
    octopi[x][y - 1].energyLevel++;
    if (octopi[x][y - 1].energyLevel > 9 && !octopi[x][y - 1].hasFlashed) {
      flashes += flashOne(x, y - 1);
    }
  }
  if (y < maxY) {
    octopi[x][y + 1].energyLevel++;
    if (octopi[x][y + 1].energyLevel > 9 && !octopi[x][y + 1].hasFlashed) {
      flashes += flashOne(x, y + 1);
    }
  }
  //#endregion
  //#region diagonal
  if (x > 0 && y > 0) {
    octopi[x - 1][y - 1].energyLevel++;
    if (octopi[x - 1][y - 1].energyLevel > 9 && !octopi[x - 1][y - 1].hasFlashed) {
      flashes += flashOne(x - 1, y - 1);
    }
  }
  if (x < maxX && y < maxY) {
    octopi[x + 1][y + 1].energyLevel++;
    if (octopi[x + 1][y + 1].energyLevel > 9 && !octopi[x + 1][y + 1].hasFlashed) {
      flashes += flashOne(x + 1, y + 1);
    }
  }
  if (x < maxX && y > 0) {
    octopi[x + 1][y - 1].energyLevel++;
    if (octopi[x + 1][y - 1].energyLevel > 9 && !octopi[x + 1][y - 1].hasFlashed) {
      flashes += flashOne(x + 1, y - 1);
    }
  }
  if (x > 0 && y < maxY) {
    octopi[x - 1][y + 1].energyLevel++;
    if (octopi[x - 1][y + 1].energyLevel > 9 && !octopi[x - 1][y + 1].hasFlashed) {
      flashes += flashOne(x - 1, y + 1);
    }
  }
  //#endregion
  return flashes;
}

function flash(octopi: Array<Array<Octopus>>): number {
  let flashes = 0;
  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[i].length; j++) {
      const octopus = octopi[i][j];
      if (octopus.energyLevel > 9 && !octopus.hasFlashed) {
        octopus.hasFlashed = true;
        flashes++;
        flashes += increaseEnergyOfNeighbors(i, j, octopi);
      };
    }
  }
  return flashes;
}

function reset(octopi: Array<Array<Octopus>>): number {
  let numFlashed = 0;
  for (let i = 0; i < octopi.length; i++) {
    for (let j = 0; j < octopi[i].length; j++) {
      const octopus = octopi[i][j];
      if (octopus.hasFlashed) {
        numFlashed++;
        octopus.energyLevel = 0;
        octopus.hasFlashed = false;
      }
    }
  }
  return numFlashed;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const octopi: Array<Array<Octopus>> = input.map(row => row.split('').map(str => ({ energyLevel: parseInt(str), hasFlashed: false })));
  const steps = 100;
  let totalFlashes = 0;

  for (let i = 1; i <= steps; i++) {
    increaseEnergyOfAll(octopi);
    totalFlashes += flash(octopi);
    reset(octopi);
  }

  return totalFlashes;
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const octopi: Array<Array<Octopus>> = input.map(row => row.split('').map(str => ({ energyLevel: parseInt(str), hasFlashed: false })));
  let step = 0;
  let numFlashed = 0;

  do {
    increaseEnergyOfAll(octopi);
    flash(octopi);
    numFlashed = reset(octopi);
    step++;
  } while (numFlashed !== 100)

  return step;
}