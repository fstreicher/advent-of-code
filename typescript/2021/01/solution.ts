// https://adventofcode.com/2021/day/1

// Challenge 1
export function challenge1(input: Array<string>) {
  const numbers = input.map(str => parseInt(str, 10));

  let prev: number | null = null;
  let counter_1 = 0;

  numbers.forEach(number => {
    if (prev !== null && number > prev) {
      counter_1++;
    }
    prev = number;
  });

  return counter_1;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const numbers = input.map(str => parseInt(str, 10));
  let counter_2 = 0;

  const getWindow = (idx: number) => [numbers[idx], numbers[idx + 1], numbers[idx + 2]];
  const reducer = (acc: number, curr: number) => acc += curr;

  for (let i = 0; i < numbers.length - 3; i++) {
    if (getWindow(i).reduce(reducer, 0) < getWindow(i + 1).reduce(reducer, 0)) {
      counter_2++;
    }
  }

  return counter_2;
}
