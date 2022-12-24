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
export function challenge2(input: Array<string>): number {
  const fish = (input.pop() || '').split(',').map(str => parseInt(str, 10));
  const days = 256;
  const population = new Array(9).fill(0);

  fish.forEach(age => population[age]++);

  // we will model a circular shift register, with an additional feedback:
  //       0123456           78 
  //   ┌──[       ]─<─(+)───[  ]──┐
  //   └──────>────────┴─────>────┘

  for (let i = 0; i < days; i++) {
    population[(i + 7) % 9] += population[i % 9];
  }

  return population.reduce((acc, curr) => acc += curr, 0);
}
