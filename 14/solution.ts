// https://adventofcode.com/2021/day/14

const testinput = [
  'NNCB',
  '',
  'CH -> B',
  'HH -> N',
  'CB -> H',
  'NH -> C',
  'HB -> C',
  'HC -> B',
  'HN -> C',
  'NN -> C',
  'BH -> H',
  'NC -> B',
  'NB -> B',
  'BN -> B',
  'BB -> N',
  'BC -> B',
  'CC -> N',
  'CN -> C',
];

interface Instruction {
  sequence: string;
  insert: string;
}

function readInput(input: Array<string>): { template: string, instructions: Array<Instruction> } {
  const template = input.shift();
  input.shift();
  const instructions = input.map(line => {
    const [sequence, insert] = line.split(' -> ');
    return { sequence, insert };
  });
  return { template, instructions };
}

function pairInsertion(polymer: string, rules: Array<Instruction>): string {
  const pairs = [];
  for (let i = 0; i < polymer.length - 1; i++) {
    pairs.push(polymer.slice(i, i + 2));
  }

  return pairs
    .map(pair => {
      const rule = rules.find(r => r.sequence === pair);
      return `${pair[0]}${rule.insert}`;
    })
    .join('') + polymer.slice(-1);
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const { template, instructions } = readInput(input);
  const steps = 10;
  let polymer = template;
  for (let i = 0; i < steps; i++) {
    polymer = pairInsertion(polymer, instructions);
  }

  const elementMap: Record<string, number> = {};
  for (const char of polymer) {
    if (elementMap[char]) {
      elementMap[char]++;
    } else {
      elementMap[char] = 1;
    }
  }

  return Math.max(...Object.values(elementMap)) - Math.min(...Object.values(elementMap));
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const { template, instructions } = readInput(input);
  const steps = 40;

  const pairDictionary: Record<string, number> = {};

  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2);
    if (pairDictionary[pair]) {
      pairDictionary[pair]++;
    } else {
      pairDictionary[pair] = 1;
    }
  }

  const last = template.slice(-1);

  for (let i = 0; i < steps; i++) {
    const tempMap: Record<string, number> = {};

    for (const pair in pairDictionary) {
      const insert = instructions.find(i => i.sequence === pair).insert;
      const count = pairDictionary[pair];
      delete pairDictionary[pair];

      const newPair1 = pair[0] + insert;
      const newPair2 = insert + pair[1];
      if (tempMap[newPair1]) {
        tempMap[newPair1] += count;
      } else {
        tempMap[newPair1] = count;
      }
      if (tempMap[newPair2]) {
        tempMap[newPair2] += count;
      } else {
        tempMap[newPair2] = count;
      }
    }

    for (const tempPair in tempMap) {
      if (pairDictionary[tempPair]) {
        pairDictionary[tempPair] += tempMap[tempPair];
      } else {
        pairDictionary[tempPair] = tempMap[tempPair];
      }

    }
  }

  const elementMap: Record<string, number> = {
    [last]: 1
  };

  for (const pair in pairDictionary) {
    if (elementMap[pair[0]]) {
      elementMap[pair[0]] += pairDictionary[pair];
    } else {
      elementMap[pair[0]] = pairDictionary[pair];
    }
  }

  return Math.max(...Object.values(elementMap)) - Math.min(...Object.values(elementMap));
}