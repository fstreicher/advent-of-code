// https://adventofcode.com/2022/day/3

function getPriority(item: string): number {
  const value = item.charCodeAt(0);
  if (value >= 97 && value <= 122) {
    return value - 96;
  }
  if (value >= 65 && value <= 90) {
    return value - 38;
  }
  throw new Error(`Invalid item: ${item}`);
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  const rucksacks = input.map(items => {
    return [items.slice(0, items.length / 2), items.slice(items.length / 2)]
  });

  const itemsInBoth: Array<string> = [];
  for (const rucksack of rucksacks) {
    for (const item of rucksack[0]) {
      if (rucksack[1].includes(item)) {
        itemsInBoth.push(item);
        break;
      }
    }
  }

  return itemsInBoth.reduce((acc, curr) => acc += getPriority(curr), 0);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const groups = [];

  for (let i = 0; i < input.length; i += 3) {
    const group = [input[i], input[i + 1], input[i + 2]];
    groups.push(
      [...new Set(group[0].split(''))]
        .filter(item => group[1].includes(item) && group[2].includes(item))
        .pop()
    );
  }

  return groups.reduce((acc, curr) => acc += getPriority(curr), 0);
}
