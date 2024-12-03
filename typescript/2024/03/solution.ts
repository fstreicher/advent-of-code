// https://adventofcode.com/2024/day/03


function execute(instruction: string): number {
  const parts = /(?<operation>mul)\((?<a>\d{1,3}),(?<b>\d{1,3})\)/.exec(instruction);
  switch (parts?.groups?.operation) {
    case 'mul':
      return parseInt(parts?.groups?.a) * parseInt(parts?.groups?.b);
    default:
      return 0;
  }
}


const exampleInput = [
  'xmul(2,4)&mul[3,7]!^don\'t()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))'
];

// Challenge 1
export function challenge1(input: Array<string>): number {
  const validInstruction = /mul\((\d{1,3}),(\d{1,3})\)/g;

  return input
    .map(line => [...line.matchAll(validInstruction)])
    .flat()
    .map(instruction => execute(instruction[0]))
    .reduce((acc: number, curr: number) => acc += curr, 0);
}


// Challenge 2
export function challenge2(input: Array<string>): number {
  const conditionalInstructions = /mul\((\d{1,3}),(\d{1,3})\)|don\'t\(\)|do\(\)/g;
  let enabled = true;
  const instructions = input
    .map(line => [...line.matchAll(conditionalInstructions)])
    .flat();
  let sum = 0;

  instructions.forEach(instruction => {
    switch (instruction[0]) {
      case 'do()':
        enabled = true;
        break;
      case 'don\'t()':
        enabled = false;
        break;
      default:
        if (enabled) {
          sum += execute(instruction[0]);
        }
    }
  });
  return sum;
}
