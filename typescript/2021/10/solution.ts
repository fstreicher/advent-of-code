// https://adventofcode.com/2021/day/10

type OpeningChar = '(' | '[' | '{' | '<';
type ClosingChar = ')' | ']' | '}' | '>';

const corruptScoreMap: Record<ClosingChar, number> = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

const completeScoreMap: Record<OpeningChar, number> = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4
}

function isOpeningChar(x: string): x is OpeningChar {
  return ['(', '[', '{', '<'].includes(x);
}
function isClosingChar(x: string): x is ClosingChar {
  return [')', ']', '}', '>'].includes(x);
}

function correponds(a: ClosingChar, b: OpeningChar): boolean {
  switch (a) {
    case ')':
      return b === '(';
    case ']':
      return b === '[';
    case '}':
      return b === '{';
    case '>':
      return b === '<';
  }
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const corruptChars: Array<ClosingChar> = [];
  for (const line of input) {
    const opening: Array<OpeningChar> = [];
    for (const char of line) {
      if (isOpeningChar(char)) {
        opening.unshift(char);
      }
      if (isClosingChar(char)) {
        if (correponds(char, opening[0])) {
          opening.shift();
        } else {
          corruptChars.push(char);
          break;
        }
      }
    }
  }
  return corruptChars.reduce((acc, curr) => acc += corruptScoreMap[curr], 0);
}

// Challenge 2
export function challenge2(input: Array<string>) {
  const incompleteLines: Array<Array<OpeningChar>> = [];
  for (const line of input) {
    const opening: Array<OpeningChar> = [];
    let corrupt = false;
    for (const char of line) {
      if (isOpeningChar(char)) {
        opening.unshift(char);
      }
      if (isClosingChar(char)) {
        if (correponds(char, opening[0])) {
          opening.shift();
        } else {
          corrupt = true;
          break;
        }
      }
    }
    if (opening.length > 0 && !corrupt) {
      incompleteLines.push(opening);
    }
  }

  const completeScores = incompleteLines
    .map(line => line.reduce((acc, curr) => acc = (acc * 5) + completeScoreMap[curr], 0))
    .sort((a, b) => a - b);
  const middleScore = completeScores[Math.floor(completeScores.length / 2)];

  return middleScore;
}