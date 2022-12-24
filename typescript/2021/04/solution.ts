// https://adventofcode.com/2021/day/4

type BingoBoard = Array<Array<number | string>>;

class BingoException extends Error {
  constructor(
    public board: BingoBoard,
    public number: number
  ) {
    super();
  }
}

function setup(input: Array<string>): { numbers: Array<number>, boards: Array<BingoBoard> } {
  const numbers = input.shift()!.split(',').map(str => parseInt(str, 10));
  const boards: Array<BingoBoard> = [];

  for (let i = 0; i < input.length; i += 6) {
    const board = [];
    for (let j = 1; j <= 5; j++) {
      board.push(parseLine(input[i + j]));
    }
    boards.push(board);
  }

  return { numbers, boards };
}

function parseLine(line: string): Array<number> {
  return line.trim().split(/\s+/)
    .map(str => parseInt(str, 10));
}

function runGame(numbers: Array<number>, boards: Array<BingoBoard>, type: 'getWinning' | 'getLosing' = 'getWinning'): void {
  numbers.forEach(number => {
    // mark number on all boards
    boards.forEach(board => {
      board.forEach(row => {
        row.forEach((val, idx) => {
          if (val === number) {
            row[idx] = 'x';
          }
        });
        // check for winning board
        if (isBingo(board)) {
          if (type === 'getWinning') {
            throw new BingoException(board, number);
          } else {
            // get last board once it has won
            if (boards.length === 1) {
              throw new BingoException(boards[0], number);
            }
          }
        }
      });
    });

    // remove boards that have already won
    boards = boards.filter(board => !isBingo(board));

  });
}

function isBingo(board: BingoBoard): boolean {
  const boardTransposed: BingoBoard = board.map(row => []);
  // transpose board to easily access columns
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      boardTransposed[j][i] = board[i][j];
    }
  }

  for (const row of board) {
    if (row.filter(element => element !== 'x').length === 0) {
      return true;
    }
  }

  for (const col of boardTransposed) {
    if (col.filter(element => element !== 'x').length === 0) {
      return true;
    }
  }

  return false;
}

function getBoardScore(result: BingoException): number {
  const boardScore = result.board
    .reduce((score, row) => {
      return score += row
        .filter(<(x: unknown) => x is number>(value => typeof value == 'number'))
        .reduce((rowScore, number) => rowScore += number, 0)
    }, 0);
  return boardScore * result.number;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const { numbers, boards: bingoBoards } = setup(input);

  try {
    runGame(numbers, bingoBoards);
  } catch (err) {
    if (err instanceof BingoException) {
      return getBoardScore(err);
    }
  }

  return 0;
}

// Challenge 2
export function challenge2(input: Array<string>) {
  const { numbers, boards: bingoBoards } = setup(input);

  try {
    runGame(numbers, bingoBoards, 'getLosing');
  } catch (err) {
    if (err instanceof BingoException) {
      return getBoardScore(err);
    }
  }
  return 0;
}