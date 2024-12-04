// https://adventofcode.com/2024/day/04

function findWord(word: string, matrix: Array<string>): number {
  const [rows, cols] = [matrix.length, matrix[0].length];
  const wordLength = word.length;
  let count = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] === word[0]) {
        let found: Boolean;
        // check right
        if (j + wordLength <= cols) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i][j + k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check left
        if (j - (wordLength - 1) >= 0) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i][j - k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check down
        if (i + wordLength <= rows) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i + k][j] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check up
        if (i - (wordLength - 1) >= 0) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i - k][j] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check diagonal right & down
        if (i + wordLength <= rows && j + wordLength <= cols) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i + k][j + k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check diagonal right & up
        if (i - (wordLength - 1) >= 0 && j + wordLength <= cols) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i - k][j + k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check diagonal left & down
        if (i + wordLength <= rows && j - (wordLength - 1) >= 0) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i + k][j - k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }

        // check diagonal left & up
        if (i - (wordLength - 1) >= 0 && j - (wordLength - 1) >= 0) {
          found = true;
          for (let k = 1; k < wordLength; k++) {
            if (matrix[i - k][j - k] !== word[k]) {
              found = false;
              break;
            }
          }
          if (found) {
            count++;
          }
        }
      }
    }
  }

  return count;
}

function findXMas(matrix: Array<string>): number {
  const [rows, cols] = [matrix.length, matrix[0].length];
  let count = 0;
  for (let i = 1; i < rows - 1; i++) {
    for (let j = 1; j < cols - 1; j++) {
      // example
      // S.M | M.M
      // .A. | .A.
      // S.M | S.S

      if (
        matrix[i][j] === 'A' &&
        (  // check right up and left down
          matrix[i - 1][j + 1] === 'M' && matrix[i + 1][j - 1] === 'S' ||
          matrix[i - 1][j + 1] === 'S' && matrix[i + 1][j - 1] === 'M'
        ) &&
        (  // check left up and right down
          matrix[i - 1][j - 1] === 'M' && matrix[i + 1][j + 1] === 'S' ||
          matrix[i - 1][j - 1] === 'S' && matrix[i + 1][j + 1] === 'M'
        )
      ) {
        count++;
      }
    }
  }

  return count;
}


// Challenge 1
export function challenge1(input: Array<string>): number {
  return findWord('XMAS', input);
}


// Challenge 2
export function challenge2(input: Array<string>): number {
  return findXMas(input);
}
