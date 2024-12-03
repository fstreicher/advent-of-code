// https://adventofcode.com/2023/day/08

interface NavigationMap {
  instructions: Array<string>;
  nodes: {
    [key: string]: {
      right: string;
      left: string;
    }
  }
}

function parseInput(input: Array<string>): NavigationMap {
  const map: NavigationMap = {
    instructions: [],
    nodes: {}
  };
  map.instructions = input.splice(0, 2)[0].split('');
  const nodeRegex = /(?<root>[A-Z0-9]{3}) = \((?<left>[A-Z0-9]{3}), (?<right>[A-Z0-9]{3})\)/;
  input.forEach(node => {
    const { root, left, right } = nodeRegex.exec(node)?.groups!;
    map.nodes[root] = { left, right };
  });
  return map;
}

function navigate(
  instructions: NavigationMap['instructions'],
  nodes: NavigationMap['nodes'],
  start: string,
  target: string = 'ZZZ'
): number {
  let current = start;
  let index = 0;
  let steps = 0;

  while (current !== 'ZZZ') {
    current = step(instructions[index], nodes, current);
    index = (index + 1) % instructions.length;
    steps++;
  }
  return steps;
}

function step(
  instruction: string,
  nodes: NavigationMap['nodes'],
  start: string,
): string {
  return instruction === 'L' ? nodes[start].left : nodes[start].right;
}

function gcd(acc: any, val: any): number {
  return val ? gcd(val, acc % val) : acc;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const map = parseInput(input);
  return navigate(map.instructions, map.nodes, 'AAA');
}


// Challenge 2
export function challenge2(input: Array<string>): number {
  const map = parseInput(input);
  const startNodes = Object.keys(map.nodes).filter(node => node.endsWith('A'));
  const pathLengths: Array<number> = [];

  startNodes.forEach(node => {
    let steps = 0;
    let index = 0;
    let current = node;
    // each node has exactly on path that leads to a Z node
    // that also loops back to the start node
    while (!current.endsWith('Z')) {
      current = step(map.instructions[index], map.nodes, current);
      index = (index + 1) % map.instructions.length;
      steps++;
    }
    pathLengths.push(steps);
  });

  // find LCM of all path lengths
  return pathLengths.reduce((acc, val) => acc * val / gcd(acc, val), 1);
}

