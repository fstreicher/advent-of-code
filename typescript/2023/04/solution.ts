// https://adventofcode.com/2023/day/4

interface ScratchCard {
  index: number;
  numbers: Array<number>;
  winningNumbers: Array<number>;
}

function getScratchCards(input: Array<string>): Array<ScratchCard> {
  const scratchCards: Array<ScratchCard> = [];

  for (let row of input) {
    const card: ScratchCard = {
      index: 0,
      numbers: [],
      winningNumbers: [],
    };
    card.index = parseInt(/Card\s+(?<index>\d+)/.exec(row).groups.index);
    card.winningNumbers = row
      .slice(row.indexOf(':') + 1, row.indexOf('|'))
      .split(/\s+/)
      .filter(Boolean)
      .map(n => parseInt(n));
    card.numbers = row
      .slice(row.indexOf('|') + 1)
      .split(/\s+/)
      .filter(Boolean)
      .map(n => parseInt(n));

    scratchCards.push(card);
  }

  return scratchCards;
}


// Challenge 1
export function challenge1(input: Array<string>) {
  const scratchCards = getScratchCards(input);
  const scores: Array<number> = [];

  for (let card of scratchCards) {
    const matches = card.numbers.filter(n => card.winningNumbers.includes(n));
    if (matches.length) {
      scores.push(Math.pow(2, matches.length - 1));
    }
  }

  return scores.reduce((a, b) => a + b, 0);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const scratchCards = getScratchCards(input);
  const copies: Record<number, number> = {};

  for (let card of scratchCards) {
    copies[card.index] = (copies[card.index] || 0) + 1;
    const matches = card.numbers.filter(n => card.winningNumbers.includes(n));
    
    for (let i = 1; i <= matches.length; i++) {
      copies[card.index + i] = (copies[card.index + i] || 0) + (copies[card.index]);
    }
  }

  return Object.values(copies).reduce((a, b) => a + b, 0);
}
