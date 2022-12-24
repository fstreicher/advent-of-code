// https://adventofcode.com/2022/day/2

/**
 * A: Rock  
 * B: Paper  
 * C: Scissors  
 */
type RPS_Opponent = 'A' | 'B' | 'C';
/**
 * X: Rock  
 * Y: Paper  
 * Z: Scissors  
 */
type RPS_Self = 'X' | 'Y' | 'Z';
/**
 * X: Loss  
 * Y: Draw  
 * Z: Win  
 */
type Outcome = 'X' | 'Y' | 'Z';
type Strategy = `${RPS_Opponent} ${RPS_Self|Outcome}`;

function getOutcomeScore(opponent: RPS_Opponent, self: RPS_Self): 0 | 3 | 6 {
  // win
  if (
    opponent === 'A' && self === 'Y' ||
    opponent === 'B' && self === 'Z' ||
    opponent === 'C' && self === 'X'
  ) {
    return 6;
  }

  // defeat
  if (
    opponent === 'A' && self === 'Z' ||
    opponent === 'B' && self === 'X' ||
    opponent === 'C' && self === 'Y'
  ) {
    return 0;
  }

  // draw
  return 3;
}

function getShapeScore(self: RPS_Self): 1 | 2 | 3 {
  switch (self) {
    case 'X': return 1;
    case 'Y': return 2;
    case 'Z': return 3;
  }
}

function getShapeForOutcome(opponent: RPS_Opponent, outcome: Outcome): RPS_Self {
  switch (outcome) {
    // Loss
    case 'X':
      switch (opponent) {
        case 'A':
          return 'Z';
        case 'B':
          return 'X';
        case 'C':
          return 'Y';
      }
    // Draw
    case 'Y':
      switch (opponent) {
        case 'A':
          return 'X';
        case 'B':
          return 'Y';
        case 'C':
          return 'Z';
      }
    // Win
    case 'Z':
      switch (opponent) {
        case 'A':
          return 'Y';
        case 'B':
          return 'Z';
        case 'C':
          return 'X';
      }
  }
}

// Challenge 1
export function challenge1(input: Array<string>) {
  const scores = input.map((strategy: string) => {
    const [opponent, self] = (strategy as Strategy).split(' ') as [RPS_Opponent, RPS_Self];
    return getOutcomeScore(opponent, self) + getShapeScore(self);
  });

  return scores.reduce((acc, curr) => acc += curr, 0);
}

// Challenge 2
export function challenge2(input: Array<string>) {
  const scores = input.map((strategy: string) => {
    const [opponent, outcome] = (strategy as Strategy).split(' ') as [RPS_Opponent, Outcome];
    const self = getShapeForOutcome(opponent, outcome);
    return getOutcomeScore(opponent, self) + getShapeScore(self);
  });
  return scores.reduce((acc, curr) => acc += curr, 0);
}