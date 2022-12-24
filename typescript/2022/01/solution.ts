// https://adventofcode.com/2022/day/1

function getCaloriesPerElf(input: Array<string>): Array<number> {
  const elves: Array<Array<number>> = [];
  let counter = 0;
  input.forEach(calories => {
    if (!elves[counter]) {
      elves[counter] = [];
    }

    if (!calories) {
      counter++;
      return;
    }

    elves[counter].push(parseInt(calories));
  });
  return elves.map(elf => elf.reduce((acc, curr) => acc += curr, 0));
}

// Challenge 1
export function challenge1(input: Array<string>) {
  return Math.max(...getCaloriesPerElf(input));
}


// Challenge 2
export function challenge2(input: Array<string>) {
  return getCaloriesPerElf(input)
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((acc, curr) => acc += curr, 0);
}
