// https://adventofcode.com/2021/day/2
type Direction = 'forward' | 'down' | 'up';

// Challenge 1
export function challenge1(input: Array<string>) {
  let pos = 0;
  let depth = 0;

  input.forEach(instruction => {
    const [dir, value] = instruction.split(' ');
    switch (dir as Direction) {
      case 'forward':
        pos += parseInt(value, 10);
        break;
      case 'down':
        depth += parseInt(value, 10);
        break;
      case 'up':
        depth -= parseInt(value, 10);
        break;
    }
  });

  return pos * depth;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  let pos = 0;
  let depth = 0;
  let aim = 0;

  input.forEach(instruction => {
    const [dir, val] = instruction.split(' ');
    const value = parseInt(val, 10);
    switch (dir as Direction) {
      case 'forward':
        pos += value;
        depth += value * aim;
        break;
      case 'down':
        aim += value;
        break;
      case 'up':
        aim -= value;
        break;
    }
  });

  return pos * depth;
}
