// https://adventofcode.com/2024/day/05

import { assert } from 'console';

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
  // switch elements until the update is in order
  while (!checkOrder(update, rules)) {
    for (const [index, char] of update.entries()) {
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
  invalidUpdates.forEach((update) => sortUpdate(update, rules));
  const middlePages = invalidUpdates.map((update) => update[Math.floor(update.length / 2)]);
  return middlePages.reduce((acc, curr) => acc + curr, 0);
}
