// https://adventofcode.com/2021/day/5

/** 
 * `vertical` is always top -> bottom  
 * `horizontal` is always left -> right  
 * `diagonalUp` is always bottom left -> top right  
 * `diagonalDown` is always top left -> bottom right
 */
type Direction = 'horizontal' | 'vertical' | 'diagonalUp' | 'diagonalDown';

interface Coordinate {
  x: number,
  y: number
}

interface Line {
  start: Coordinate,
  end: Coordinate,
  direction?: Direction
}

function readCoordinates(str: string): Line {
  const split = ' -> ';
  const coords = str.split(split);

  const parseCoordinates = (str: string) => str.split(',').map(str => parseInt(str, 10));
  const { 0: x1, 1: y1 } = parseCoordinates(coords[0]);
  const { 0: x2, 1: y2 } = parseCoordinates(coords[1]);

  const start: Coordinate = { x: x1, y: y1 };
  const end: Coordinate = { x: x2, y: y2 };

  return sortCoordinates({ start, end });
}

function sortCoordinates(line: Line): Line {
  let tmp: Coordinate;
  // vertical line
  if (line.start.x === line.end.x) {
    line.direction = 'vertical';
    if (line.start.y > line.end.y) {
      tmp = line.start;
      line.start = line.end;
      line.end = tmp;
    }
  }

  // horizontal line
  if (line.start.y === line.end.y) {
    line.direction = 'horizontal';
    if (line.start.x > line.end.x) {
      tmp = line.start;
      line.start = line.end;
      line.end = tmp;
    }
  }

  // diagonal line
  if (isDiagonal(line)) {
    // sort LtR
    if (line.start.x > line.end.x) {
      tmp = line.start;
      line.start = line.end;
      line.end = tmp;
    }
    if (line.start.y > line.end.y) {
      line.direction = 'diagonalUp';
    } else {
      line.direction = 'diagonalDown'
    }
  }

  return line;
}

function isDiagonal(line: Line): boolean {
  return (
    line.start.x !== line.end.x &&
    line.start.y !== line.end.y
  );
}

function getVentCount(vents: Array<Line>) {
  // generate empty map
  const maxX = 1 + Math.max(...vents.map(line => Math.max(line.start.x, line.end.x)));
  const maxY = 1 + Math.max(...vents.map(line => Math.max(line.start.y, line.end.y)));
  const map: Array<Array<number>> = new Array(maxX).fill(0).map(() => new Array(maxY).fill(0));

  for (const line of vents) {
    let { x, y } = line.start;

    let lineLength = 1;
    switch (line.direction) {
      case 'horizontal':
      case 'diagonalUp':
      case 'diagonalDown':
        lineLength += line.end.x - line.start.x;
        break;
      case 'vertical':
        lineLength += line.end.y - line.start.y;
        break;
      default:
        throw new Error('unexpected missing direction');
    }

    for (let i = 0; i < lineLength; i++) {
      switch (line.direction) {
        case 'horizontal':
          map[x + i][y] += 1;
          break;
        case 'vertical':
          map[x][y + i] += 1;
          break;
        case 'diagonalUp':
          map[x + i][y - i] += 1;
          break;
        case 'diagonalDown':
          map[x + i][y + i] += 1;
          break;
      }
    }
  }

  return map.reduce((count, currRow) => count += currRow.filter(num => num > 1).length, 0);
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const vents = input.map(line => readCoordinates(line));

  // keep only (h)orizontal and (v)ertical lines
  const hvLines = vents.filter(line => !isDiagonal(line));

  return getVentCount(hvLines);
}

// Challenge 2
export function challenge2(input: Array<string>) {
  const vents = input.map(line => readCoordinates(line));
  return getVentCount(vents);
}