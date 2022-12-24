// https://adventofcode.com/2021/day/13

type Sheet = Array<Array<boolean>>;
type Axis = 'x' | 'y';
interface Instruction {
  axis: Axis;
  number: number;
}
interface Coordinate {
  x: number,
  y: number
}

function isAxis(input: unknown): input is Axis {
  return input === 'x' || input === 'y';
}

function readInput(input: Array<string>): { paper: Sheet, instructions: Array<Instruction> } {
  const coordinates: Array<Coordinate> = [];
  const instructions: Array<Instruction> = [];
  let reachedEmptyLine = false;
  input.forEach(line => {
    if (line === '') {
      reachedEmptyLine = true;
      return;
    }
    if (!reachedEmptyLine) {
      const parseCoordinates = (str: string) => str.split(',').map(str => parseInt(str, 10));
      const { 0: y, 1: x } = parseCoordinates(line);
      coordinates.push({ x, y });
    } else {
      const [axis, num] = line.replace('fold along ', '').split('=');
      if (!isAxis(axis)) { throw new Error('invalid instruction'); }
      instructions.push({ axis, number: parseInt(num, 10) });
    }
  });

  const maxX = 2 * instructions.find(i => i.axis === 'x')!.number + 1;
  const maxY = 2 * instructions.find(i => i.axis === 'y')!.number + 1;
  const paper: Sheet = new Array(maxY).fill(false).map(() => new Array(maxX).fill(false));

  coordinates.forEach(c => paper[c.x][c.y] = true);

  return { paper, instructions };
}

function fold(paper: Sheet, instruction: Instruction): void {
  const dimensions = {
    x: paper[0].length,
    y: paper.length
  };

  // fold left
  if (instruction.axis === 'x') {
    for (let row = 0; row < dimensions.y; row++) {
      for (let col = 0; col < instruction.number; col++) {
        paper[row][col] = paper[row][col] || paper[row][dimensions.x - col - 1];

      }
      paper[row] = paper[row].slice(0, instruction.number);
    }
  }

  // fold up
  if (instruction.axis === 'y') {
    for (let row = 0; row < instruction.number; row++) {
      for (let col = 0; col < dimensions.x; col++) {
        paper[row][col] = paper[row][col] || paper[dimensions.y - row - 1][col];
      }
    }
    paper.splice(instruction.number, paper.length - instruction.number);
  }
}

function count(paper: Sheet): number {
  let count = 0;
  for (let row = 0; row < paper.length; row++) {
    for (let col = 0; col < paper[0].length; col++) {
      count += paper[row][col] ? 1 : 0;
    }
  }
  return count;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const { paper, instructions } = readInput(input);
  fold(paper, instructions[0]);
  return count(paper);
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const { paper, instructions } = readInput(input);
  instructions.forEach(instruction => fold(paper, instruction));
  console.info(paper.map(row => row.map(col => col ? '#' : ' ').join(' ')).join('\n'));
  //    # #       # #     # # # #       # #   #     #   # # # #     # #     #     #
  //  #     #   #     #   #               #   #     #         #   #     #   #   #
  //  #         #     #   # # #           #   # # # #       #     #         # #
  //  #         # # # #   #               #   #     #     #       #         #   #
  //  #     #   #     #   #         #     #   #     #   #         #     #   #   #
  //    # #     #     #   #           # #     #     #   # # # #     # #     #     #
  return 0;
}