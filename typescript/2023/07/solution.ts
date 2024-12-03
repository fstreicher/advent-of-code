// https://adventofcode.com/2023/day/07

declare global {
  interface Array<T> {
    like(arr: Array<T>): boolean;
  }
}

// just syntactic sugar for comparing arrays
if (!Array.prototype.like) {
  Array.prototype.like = function like<T>(this: Array<T>, arr: Array<T>): boolean {
    if (this.length !== arr.length) {
      return false;
    }

    for (const [index, value] of this.entries()) {
      if (value !== arr[index]) {
        return false;
      }
    }

    return true;
  }
}

type Card = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A' | 'J';
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
const VALUES_WITH_JOKER = ['J', ...VALUES] as const;

interface Hand {
  cards: string;
  bid: number;
  handType: HandType;
}

enum HandType {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

function parseInput(input: Array<string>): Array<Omit<Hand, 'handType'>> {
  return input.map((line) => {
    const [cards, bid] = line.split(' ');
    return {
      cards,
      bid: parseInt(bid),
    };
  });
}

function getHandType(hand: string): HandType {
  const cardCounts = new Map<string, number>();
  const cards = hand.split('');
  cards.forEach(card => {
    cardCounts.set(card, (cardCounts.get(card) ?? 0) + 1);
  });

  const counts = Array.from(cardCounts.values()).sort().reverse();
  const numberOfJokers = cardCounts.get('J') || 0;

  if (
    counts.like([5]) ||
    counts.like([4, 1]) && numberOfJokers >= 1 ||
    counts.like([3, 2]) && numberOfJokers >= 2
  ) {
    return HandType.FIVE_OF_A_KIND;
  }

  if (
    counts.like([4, 1]) ||
    counts.like([3, 1, 1]) && numberOfJokers >= 1 ||
    counts.like([2, 2, 1]) && numberOfJokers === 2
  ) {
    return HandType.FOUR_OF_A_KIND;
  }

  if (
    counts.like([3, 2]) ||
    counts.like([2, 2, 1]) && numberOfJokers === 1
  ) {
    return HandType.FULL_HOUSE;
  }

  if (
    counts.like([3, 1, 1]) ||
    counts.like([2, 1, 1, 1]) && numberOfJokers >= 1
  ) {
    return HandType.THREE_OF_A_KIND;
  }

  if (
    counts.like([2, 2, 1])
  ) {
    return HandType.TWO_PAIR;
  }

  if (
    counts.like([2, 1, 1, 1]) ||
    counts.like([1, 1, 1, 1, 1]) && numberOfJokers === 1
  ) {
    return HandType.ONE_PAIR;
  }

  return HandType.HIGH_CARD;
}

function compareHands(a: Hand, b: Hand, withJokers = false): number {
  const values = withJokers ? VALUES_WITH_JOKER : VALUES;
  if (a.handType === b.handType) {
    for (let i = 0; i < a.cards.length; i++) {
      const cardA = a.cards[i] as Card;
      const cardB = b.cards[i] as Card;
      if (values.indexOf(cardA) > values.indexOf(cardB)) {
        return 1;
      } else if (values.indexOf(cardA) < values.indexOf(cardB)) {
        return -1;
      }
    }
  }
  return a.handType! - b.handType!;
}

const exampleInput = [
  '32T3K 765',
  'T55J5 684',
  'KK677 28',
  'KTJJT 220',
  'QQQJA 483',
];


// Challenge 1
export function challenge1(input: Array<string>): number {
  const hands: Array<Hand> = parseInput(input).map(h => ({ ...h, handType: getHandType(h.cards) }));
  hands.sort(compareHands);
  return hands.reduce((acc, curr, idx) => acc += curr.bid * (idx + 1), 0);
  return 0;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const hands: Array<Hand> = parseInput(input).map(h => ({ ...h, handType: getHandType(h.cards) }));
  hands.sort((a, b) => compareHands(a, b, true));
  return hands.reduce((acc, curr, idx) => acc += curr.bid * (idx + 1), 0);
}