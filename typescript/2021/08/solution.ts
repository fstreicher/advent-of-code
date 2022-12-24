// https://adventofcode.com/2021/day/8

interface Entry {
  input: Array<string>;
  output: Array<string>;
}

interface SegmentConfig extends Record<string, string> {
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  f: string;
  g: string;
}

const DEFAULT_PATTERN = [
  'abcefg',
  'cf',
  'acdeg',
  'acdfg',
  'bcdf',
  'abdfg',
  'abdefg',
  'acf',
  'abcdefg',
  'abcdfg'
]

function readEntries(input: Array<string>): Array<Entry> {
  const sortChars = (chars: Array<string>) => chars.map(chars => chars.split('').sort().join(''));

  return input.map(entry => {
    const [input, output] = entry.split(' | ');
    return {
      input: sortChars(input.split(' ')),
      output: sortChars(output.split(' '))
    };
  });
}

function getConfiguration(input: Array<string>): SegmentConfig {
  const config: SegmentConfig = { a: '', b: '', c: '', d: '', e: '', f: '', g: '' };
  // map inputs by length
  const numberMap = {
    two: input.filter(str => str.length === 2),
    three: input.filter(str => str.length === 3),
    four: input.filter(str => str.length === 4),
    five: input.filter(str => str.length === 5),
    six: input.filter(str => str.length === 6),
    seven: input.filter(str => str.length === 7)
  };

  // Step 1: remove 1 from 7, get A
  const regExOne = new RegExp(`[${numberMap.two}]`, 'g');
  config.a = (numberMap.three[0].replace(regExOne, ''));

  // Step 2: find commons in 2, 3, 5
  const middleChars = numberMap.five[0]
    .split('')
    .filter(char => numberMap.five[1].includes(char) && numberMap.five[2].includes(char))
    .sort();
  // Step 2.5: find common in middleChars and 4, get D & G
  config.d = numberMap.four[0].split('').find(char => middleChars.includes(char))!;
  config.g = middleChars.find(char => char !== config.a && char !== config.d)!;

  // Step 3: take 2, 3, 5 and remove middleChars
  //         find tupel that's not in 4 (2), get E, then C
  const two = numberMap.five
    .map(chars => chars.replace(new RegExp(`[${middleChars.join('')}]`, 'g'), ''))
    .find(tupel => {
      let pass = false;
      tupel.split('').forEach(char => {
        if (!numberMap.four[0].includes(char)) { pass = true; }
      })
      return pass;
    })!;

  config.e = two
    .split('')
    .find(char => !numberMap.four[0].includes(char))!;
  config.c = two.replace(new RegExp(config.e), '');

  // Step 4: find 3 (5 chars, 1 unknown), last unknown is F
  let knownChars = Object.entries(config).map(entry => entry[1]).join('');
  config.f = numberMap.five
    .find(sequence => {
      let unknownChars = 0;
      for (const char of knownChars) {
        if (!sequence.includes(char)) { unknownChars++; }
      }
      return unknownChars === 1;
    })!
    .replace(new RegExp(`[${knownChars}]`, 'g'), '');

  // Step 5: find 5 (5 chars, 1 unknown), last unknown is B
  knownChars = Object.entries(config).map(entry => entry[1]).join('');
  debugger
  config.b = numberMap.five
    .find(sequence => {
      let unknownChars = 0;
      for (const char of sequence) {
        if (!knownChars.includes(char)) { unknownChars++; }
      }
      return unknownChars === 1;
    })!
    .replace(new RegExp(`[${knownChars}]`, 'g'), '');

  return config;
};

function reverseConfig(config: SegmentConfig): SegmentConfig {
  const reverseConfig: SegmentConfig = { a: '', b: '', c: '', d: '', e: '', f: '', g: '' };
  Object.entries(config).forEach(entry => {
    reverseConfig[entry[1]] = entry[0];
  });
  return reverseConfig;
}

function translate(inputSequence: string, config: SegmentConfig): number {
  // replace via config
  let translated = '';
  for (const char of inputSequence) {
    translated += config[char];
  }
  // sort
  const sorted = translated.split('').sort().join('');
  // find match
  return DEFAULT_PATTERN.findIndex(pattern => pattern === sorted);
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  const entries = readEntries(input);
  const outputs = entries.flatMap(entry => entry.output);

  return outputs
    .filter(segments => {
      return segments.length === 2 ||
        segments.length === 3 ||
        segments.length === 4 ||
        segments.length === 7
    })
    .length;
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const entries = readEntries(input);
  let sum = 0;

  entries.forEach(entry => {
    const config = getConfiguration(entry.input);
    const configReversed = reverseConfig(config);
    const digits = entry.output.map(sequence => translate(sequence, configReversed))
    const number = parseInt(digits.join(''));
    sum += number;
  });

  return sum;
}