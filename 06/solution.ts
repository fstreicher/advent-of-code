// https://adventofcode.com/2021/day/6

// Challenge 1
export function challenge1(input: Array<string>): number {
  const fish = (input.pop() || '').split(',').map(str => parseInt(str, 10));

  for (let i = 0; i < 80; i++) {
    fish.forEach((num, idx) => {
      if (num === 0) {
        fish[idx] = 6;
        fish.push(8);
      } else {
        fish[idx] -= 1;
      }
    });
  }

  return fish.length;
}

// Challenge 2
export function challenge2(input: Array<string>) { }
