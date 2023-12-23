// https://adventofcode.com/2023/day/1



// Challenge 1
export function challenge1(input: Array<string>) {
  const values: Array<number> = [];
  for (let line of input) {
    const digits: Array<string> = [];
    const regex = /\d/g;
    let match;
    while (match = regex.exec(line)) {
      digits.push(match[0]);
    }
    values.push(parseInt(digits[0] + digits[digits.length - 1]));
  }

  return values.reduce((a, b) => a + b, 0);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const digitMap = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9'
  } as const;
  
  const values: Array<number> = [];
  
  for (let line of input) {
    const digits: Array<string> = [];
    const regex = /one|two|three|four|five|six|seven|eight|nine|\d/g;
    let match;
    while (match = regex.exec(line)) {
      const digit = digitMap[match[0] as keyof typeof digitMap] ?? match[0];
      // handle special cases like 'oneeight'
      regex.lastIndex = match.index + 1;
      digits.push(digit);
    }
    values.push(parseInt(digits[0] + digits[digits.length - 1]));
  }
  
  return values.reduce((a, b) => a + b, 0);
}
