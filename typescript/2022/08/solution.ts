// https://adventofcode.com/2022/day/8

import { writeFileSync } from 'fs';

type Position = {
  x: number;
  y: number;
}

type Forest = Array<Array<number>>;

function convertToForest(input: Array<string>): { forest: Forest, forestTransposed: Forest } {
  const forest = input.map(row => row.split('').map(tree => parseInt(tree)));
  const forestTransposed: Forest = forest.map(row => []);
  // transpose forest to easily access columns
  for (let i = 0; i < forest.length; i++) {
    for (let j = 0; j < forest.length; j++) {
      forestTransposed[j][i] = forest[i][j];
    }
  }

  return { forest, forestTransposed };
}

function isVisible(forest: Forest, forestTransposed: Forest, tree: Position): boolean {
  const treeHeight = forest[tree.x][tree.y];
  const treesToTheLeft = forest[tree.x].slice(0, tree.y);
  const treesToTheRight = forest[tree.x].slice(tree.y + 1, forest[tree.x].length);
  const treesToTheTop = forestTransposed[tree.y].slice(0, tree.x);
  const treesToTheBottom = forestTransposed[tree.y].slice(tree.x + 1, forestTransposed[tree.y].length);

  // check if tree is on the edge
  if (
    tree.x === 0 ||
    tree.y === 0 ||
    tree.x === forest.length - 1 ||
    tree.y === forest[tree.x].length - 1
  ) {
    return true;
  }

  // check to the left and right
  if (
    treesToTheLeft.every(t => t < treeHeight) ||
    treesToTheRight.every(t => t < treeHeight) ||
    treesToTheTop.every(t => t < treeHeight) ||
    treesToTheBottom.every(t => t < treeHeight)
  ) {
    return true;
  }

  return false;
}

function getScenicScore(forest: Forest, forestTransposed: Forest, rowIndex: number, colIndex: number): number {
  const treeHeight = forest[rowIndex][colIndex];
  const treesToTheLeft = forest[rowIndex].slice(0, colIndex);
  const treesToTheRight = forest[rowIndex].slice(colIndex + 1, forest[rowIndex].length);
  const treesToTheTop = forestTransposed[colIndex].slice(0, rowIndex);
  const treesToTheBottom = forestTransposed[colIndex].slice(rowIndex + 1, forestTransposed[colIndex].length);


  const treesVisible = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  };

  for (let i = treesToTheLeft.length - 1; i >= 0; i--) {
    treesVisible.left++;
    if (treesToTheLeft[i] >= treeHeight) {
      break;
    }
  }

  for (let i = 0; i < treesToTheRight.length; i++) {
    treesVisible.right++;
    if (treesToTheRight[i] >= treeHeight) {
      break;
    }
  }

  for (let i = treesToTheTop.length - 1; i >= 0; i--) {
    treesVisible.top++;
    if (treesToTheTop[i] >= treeHeight) {
      break;
    }
  }

  for (let i = 0; i < treesToTheBottom.length; i++) {
    treesVisible.bottom++;
    if (treesToTheBottom[i] >= treeHeight) {
      break;
    }
  }

  return treesVisible.left * treesVisible.right * treesVisible.top * treesVisible.bottom;
}


// Challenge 1
export function challenge1(input: Array<string>) {
  const { forest, forestTransposed } = convertToForest(input);
  let visibleTrees = 0;

  forest.forEach((row, rowIndex) => {
    row.forEach((tree, colIndex) => {
      if (isVisible(forest, forestTransposed, { x: colIndex, y: rowIndex })) {
        visibleTrees++;
      }
    });
  });

  return visibleTrees;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const { forest, forestTransposed } = convertToForest(input);
  const bestPosition: Position & { scenicScore: number } = {
    x: 0,
    y: 0,
    scenicScore: 0,
  };

  forest.forEach((row, rowIndex) => {
    row.forEach((tree, colIndex) => {
      let score = getScenicScore(forest, forestTransposed, rowIndex, colIndex);
      if (score > bestPosition.scenicScore) {
        bestPosition.scenicScore = score;
        bestPosition.x = rowIndex;
        bestPosition.y = colIndex;
      }
    });
  });

  return bestPosition.scenicScore;
}
