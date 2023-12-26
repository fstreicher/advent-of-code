// https://adventofcode.com/2023/day/3

interface Position {
  x: number;
  y: number;
}

interface MaybePartNumber {
  value: number;
  start: Position;
  end: Position;
}

function getNumbers(input: Array<string>): Array<MaybePartNumber> {
  const numbers: Array<MaybePartNumber> = [];

  for (let [y, row] of input.entries()) {
    const matches = row.matchAll(/(\d+)/g);

    [...matches].forEach(match => {
      numbers.push({
        value: parseInt(match[0]),
        start: { x: match.index, y },
        end: { x: match.index + match[0].length - 1, y },
      });
    });
  }

  return numbers;
}

function isPartNumber(number: MaybePartNumber, manual: Array<string>): boolean {
  const regex = /[^\d\.]/;
  let rowAbove = '';
  let rowBelow = '';

  if (manual[number.start.y - 1]) {
    // check row above
    rowAbove = manual[number.start.y - 1];
    if (regex.test(rowAbove.slice(number.start.x, number.end.x + 1))) {
      return true;
    }
  }

  if (manual[number.end.y + 1]) {
    // check row below
    rowBelow = manual[number.end.y + 1];
    if (regex.test(rowBelow.slice(number.start.x, number.end.x + 1))) {
      return true;
    }
  }

  if (manual[number.start.y][number.start.x - 1]) {
    // check column to the left
    if (regex.test(manual[number.start.y][number.start.x - 1])) {
      return true;
    }
    // check row above to the left
    if (rowAbove?.[number.start.x - 1] && regex.test(rowAbove[number.start.x - 1])) {
      return true;
    }
    // check row below to the left
    if (rowBelow?.[number.start.x - 1] && regex.test(rowBelow[number.start.x - 1])) {
      return true;
    }
  }

  if (manual[number.start.y][number.end.x + 1]) {
    // check column to the right
    if (regex.test(manual[number.start.y][number.end.x + 1])) {
      return true;
    }
    // check row above to the right
    if (rowAbove?.[number.end.x + 1] && regex.test(rowAbove[number.end.x + 1])) {
      return true;
    }
    // check row below to the right
    if (rowBelow?.[number.end.x + 1] && regex.test(rowBelow[number.end.x + 1])) {
      return true;
    }
  }
  return false;
}

function getGears(input: Array<string>): Array<Position> {
  const gears: Array<Position> = [];

  for (let [y, row] of input.entries()) {
    for (let [x, char] of row.split('').entries()) {
      if (char === '*') {
        gears.push({ x, y });
      }
    }
  }

  return gears;
}

function isNumberAdjacent(gear: Position, number: MaybePartNumber): boolean {
  const { x, y } = gear;
  const { start, end } = number;

  // number is above gear
  if (
    y === start.y + 1 &&
    x >= start.x - 1 && x <= end.x + 1
  ) {
    return true;
  }

  // number is below gear
  if (
    y === start.y - 1 &&
    x >= start.x - 1 && x <= end.x + 1
  ) {
    return true;
  }

  // number is in same row as gear
  if (
    y === start.y &&
    (
      (x === start.x - 1) ||
      (x === end.x + 1)
    )
  ) {
    return true;
  }

  return false;

}

// Challenge 1
export function challenge1(input: Array<string>) {
  return getNumbers(input)
    .filter(maybeNumber => isPartNumber(maybeNumber, input))
    .reduce((acc, curr) => acc + curr.value, 0)
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const numbers = getNumbers(input);
  const gears = getGears(input);
  const ratios: Array<number> = [];

  for (let gear of gears) {
    const adjacentNumbers = numbers.filter(number => isNumberAdjacent(gear, number));
    if (adjacentNumbers.length === 2) {
      ratios.push(adjacentNumbers[0].value * adjacentNumbers[1].value);
    }
  }

  return ratios.reduce((curr, acc) => curr + acc, 0);
}
