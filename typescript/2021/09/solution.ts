// https://adventofcode.com/2021/day/9

interface Coordinate2D {
  x: number;
  y: number;
}
interface Coordinate3D extends Coordinate2D {
  z: number;
}

type HeightMap = Array<Array<number>>
type Map = Array<Array<number | 'x'>>

function isLowPoint(point: Coordinate3D, map: HeightMap): boolean {
  const { x, y, z } = point;

  if (x > 0 && map[x - 1][y] <= z) { return false; }
  if (y > 0 && map[x][y - 1] <= z) { return false; }

  if (x < map.length - 1 && map[x + 1][y] <= z) { return false; }
  if (y < map[x].length - 1 && map[x][y + 1] <= z) { return false; }

  return true;
}

function floodFill(x: number, y: number, map: Map): number {
  const [maxX, maxY] = [map.length - 1, map[0].length - 1];
  const queue: Array<Coordinate2D> = [];
  // add start point
  queue.push({ x, y });

  let area = 0;
  while (queue.length) {
    const current = queue.shift()!;
    const height = map[current.x][current.y]
    if (height === 9 || height === 'x') {
      continue;
    }
    map[current.x][current.y] = 'x';

    area++;
    queue.push(...getNeighbors(current, maxX, maxY));
  }
  return area;
}

function getNeighbors(coordinate: Coordinate2D, maxX: number, maxY: number): Array<Coordinate2D> {
  const neighbors: Array<Coordinate2D> = [];
  if (coordinate.x > 0) {
    neighbors.push({ x: coordinate.x - 1, y: coordinate.y });
  }
  if (coordinate.x < maxX) {
    neighbors.push({ x: coordinate.x + 1, y: coordinate.y });
  }
  if (coordinate.y > 0) {
    neighbors.push({ x: coordinate.x, y: coordinate.y - 1 });
  }
  if (coordinate.y < maxY) {
    neighbors.push({ x: coordinate.x, y: coordinate.y + 1 });
  }
  return neighbors;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const map: HeightMap = input.map(row => row.split('').map(str => parseInt(str)));

  const lowPoints: Array<Coordinate3D> = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {

      const point: Coordinate3D = {
        x: i,
        y: j,
        z: map[i][j]
      };
      if (isLowPoint(point, map)) {
        lowPoints.push(point);
      }
    }
  }

  return lowPoints.reduce((acc, curr) => acc += (curr.z + 1), 0);
}

// Challenge 2
export function challenge2(input: Array<string>) {
  const map: Map = input.map(row => row.split('').map(str => parseInt(str)));
  // console.table(map);
  const areas: Array<number> = [];

  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[x].length; y++) {
      if (map[x][y] !== 9 && map[x][y] !== 'x') {
        areas.push(floodFill(x, y, map));
      }
    }
  }

  const largestThree = areas.sort((a, b) => a - b).slice(-3);
  return largestThree.reduce((acc, curr) => acc *= curr, 1);
}
