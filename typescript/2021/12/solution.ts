// https://adventofcode.com/2021/day/12

type SmallCave = string;
type LargeCave = string;
type Cave = SmallCave | LargeCave | 'start' | 'end';
type Connection = Array<Cave>;
type Network = Map<Cave, Set<Cave>>;


function isSmallCave(input: unknown): input is SmallCave {
  return (
    typeof input === 'string' &&
    /[a-z]+/.test(input) &&
    input !== 'start' &&
    input !== 'end'
  );
}

function isLargeCave(input: unknown): input is LargeCave {
  return (
    typeof input === 'string' &&
    /[A-Z]+/.test(input)
  );
}

function getNetwork(connections: Array<Connection>): Map<Cave, Set<Cave>> {
  const network = new Map<Cave, Set<Cave>>();

  connections.forEach(c => {
    for (let e of [c, [...c].reverse()]) {
      if (network.has(e[0])) {
        network.get(e[0])!.add(e[1]);
      } else {
        network.set(e[0], new Set([e[1]]));
      }
    };
  });

  return network;
}

function isValidNode(next: Cave, path: Array<Cave>, canVisitSmallTwice = false): boolean {
  if (next === 'start') {
    return false;
  }

  if (
    isSmallCave(next) &&
    path.includes(next) &&
    (canVisitSmallTwice ? hasVisitedSmallCaveTwice(path) : true)
  ) {
    return false;
  }

  return true;
}

function hasVisitedSmallCaveTwice(path: Array<Cave>): boolean {
  for (const cave of path) {
    if (isSmallCave(cave) && path.filter(node => node === cave).length === 2) {
      return true;
    }
  };
  return false;
}

function getNumberOfPaths(network: Network, canVisitSmallTwice = false): number {
  const queue: Array<Array<Cave>> = [['start']];
  const paths: Array<Array<Cave>> = [];

  while (queue.length > 0) {
    const path = queue.pop()!;
    for (const node of network.get(path[path.length - 1])!) {
      if (node === 'end') {
        paths.push(path.concat([node]));

      } else if (isValidNode(node, path, canVisitSmallTwice)) {
        queue.push(path.concat([node]));
      }
    }
  }

  return paths.length;
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  const network = getNetwork(input.map(str => str.split('-')));
  return getNumberOfPaths(network);
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const network = getNetwork(input.map(str => str.split('-')));
  return getNumberOfPaths(network, true);
}