// https://adventofcode.com/2022/day/5

type Instruction = {
  amount: number;
  from: number;
  to: number;
};

function processInput(input: Array<string>): { initialConfig: Array<Array<string>>, instructions: Array<Instruction> } {
  let splitIndex = input.findIndex(line => !line);
  const instructions = [...input]
    .slice(splitIndex + 1)
    .map(i => {
      const regex = /^move (?<amount>\d+) from (?<from>\d+) to (?<to>\d+)$/;
      const groups = regex.exec(i).groups;
      return {
        amount: parseInt(groups.amount),
        from: parseInt(groups.from) - 1,
        to: parseInt(groups.to) - 1
      }
    }) as Array<Instruction>;

  const stacks: Array<Array<string>> = [];
  const stacksRaw = [...input]
    .slice(0, splitIndex)
    .reverse();

  for (const line of stacksRaw) {
    const regex = /\[(?<material>[A-Z])\]/g;
    let match;
    while (match = regex.exec(line)) {
      const index = match.index === 0 ? 0 : match.index / 4;
      if (!stacks[index]) {
        stacks[index] = [];
      }
      stacks[index].push(match.groups.material);
    }
  }

  return {
    initialConfig: stacks,
    instructions
  };
}

// Challenge 1
export function challenge1(input: Array<string>) {
  const { initialConfig: stacks, instructions } = processInput(input);
  for (const instruction of instructions) {
    for (let i = 0; i < instruction.amount; i++) {
      stacks[instruction.to].push(stacks[instruction.from].pop());
    }
  }
  return stacks.map(column => column[column.length - 1]).join('');
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const { initialConfig: stacks, instructions } = processInput(input);
  for (const instruction of instructions) {
    stacks[instruction.to].push(
      ...stacks[instruction.from].splice(
        stacks[instruction.from].length - instruction.amount,
        instruction.amount
      )
    );
  }
  return stacks.map(column => column[column.length - 1]).join('');
}
