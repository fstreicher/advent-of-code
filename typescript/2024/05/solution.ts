// https://adventofcode.com/2024/day/05

type Rule = [number, number];

function parseInput(input: Array<string>) {
  const rules: Array<Rule> = [];
  const updates: Array<Array<number>> = [];

  input.forEach((line) => {
    if (/^\d+\|\d+$/.test(line)) {
      rules.push(line.split('|').map(Number) as Rule);
    }
    if (/^\d+(,\d+)+$/.test(line)) {
      updates.push(line.split(',').map(Number));
    }
  });
  return { rules, updates };
}

function checkOrder(update: Array<number>, rules: Array<Rule>): boolean {
  const isInOrder = (first: number, second: number, update: Array<number>) => update.indexOf(first) < update.indexOf(second);
  for (const [index, char] of update.entries()) {
    const applicableRules = rules.filter(([a, b]) => (a === char || b === char) && update.includes(a) && update.includes(b));
    if (applicableRules.length === 0) {
      continue;
    }
    for (const rule of applicableRules) {
      if (!isInOrder(rule[0], rule[1], update)) {
        return false;
      }
    }
  }
  return true;
}

function sortUpdate(update: Array<number>, rules: Array<Rule>): void {
  // brute force solution
  // switch elements until the update is in order
  while (!checkOrder(update, rules)) {
    for (const char of update) {
      const applicableRules = rules.filter(([a, b]) => (a === char || b === char) && update.includes(a) && update.includes(b));
      if (applicableRules.length === 0) {
        continue;
      }
      for (const rule of applicableRules) {
        const [a, b] = rule;
        const aIndex = update.indexOf(a);
        const bIndex = update.indexOf(b);
        if (aIndex > bIndex) {
          update[aIndex] = b;
          update[bIndex] = a;
        }
      }
    }
  }
}

// find number that only appears as the first number of a rule
function findFirstNumber(update: Array<number>, rules: Array<Array<number>>): number {
  for (const page of update) {
    const isFirstNumber = rules
      .filter(r => r[0] === page || r[1] === page)
      .every(r => r[0] === page);
    if (isFirstNumber) {
      return page;
    }
  }
  throw new Error('No first number found');
}

// remove all rules if a number has been sorted
function removeRulesWithNumber(number: number, rules: Array<Array<number>>): void {
  const rulesWithNumber = rules.filter(r => r[0] === number || r[1] === number);
  rulesWithNumber.forEach(r => {
    const index = rules.indexOf(r);
    rules.splice(index, 1);
  });
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  const { rules, updates } = parseInput(input);
  const validUpdates = updates.filter((update) => checkOrder(update, rules));
  const middlePages = validUpdates.map((update) => update[Math.floor(update.length / 2)]);
  return middlePages.reduce((acc, curr) => acc + curr, 0);
}


// Challenge 2
export function challenge2(input: Array<string>): number {
  const { rules, updates } = parseInput(input);
  const invalidUpdates = updates.filter((update) => !checkOrder(update, rules));

  // V1: just switch around the elements until the update is in order
  // invalidUpdates.forEach((update) => sortUpdate(update, rules));
  // const middlePages = invalidUpdates.map((update) => update[Math.floor(update.length / 2)]);
  // return middlePages.reduce((acc, curr) => acc + curr, 0);

  // V2: ~5x faster
  // pick applicable rules, find those that feature a number only as the first number
  // push that number into a new array, remove the rules with that number
  // repeat until the update is sorted
  // reference: https://redd.it/1h74k1o
  const sortedUpdates: Array<Array<number>> = [];
  invalidUpdates.forEach(update => {
    const sorted: Array<number> = [];
    const rulesForUpdate = rules.filter(([a, b]) => update.includes(a) && update.includes(b));
    while (update.length > 0) {
      const firstNumber = findFirstNumber(update, rulesForUpdate);
      const index = update.indexOf(firstNumber);
      sorted.push(update.splice(index, 1).pop()!);
      removeRulesWithNumber(firstNumber, rulesForUpdate);
    }
    sortedUpdates.push(sorted);
  });

  const middlePages = sortedUpdates.map((update) => update[Math.floor(update.length / 2)]);
  return middlePages.reduce((acc, curr) => acc + curr, 0);
}
