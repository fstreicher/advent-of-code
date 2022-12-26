// https://adventofcode.com/2022/day/6

function getStartMarkerIndex(buffer: string, numberOfCharacters: number): number {
  for (let i = 0; i < buffer.length - numberOfCharacters - 1; i++) {
    const segment = new Set(buffer.split('').slice(i, i + numberOfCharacters));
    if (segment.size === numberOfCharacters) {
      return i + numberOfCharacters;
    }
  }
}

// Challenge 1
export function challenge1(input: Array<string>) {
  return getStartMarkerIndex(input[0], 4);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  return getStartMarkerIndex(input[0], 14);
}
