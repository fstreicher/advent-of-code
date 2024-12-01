// https://adventofcode.com/2024/day/1



// Challenge 1
export function challenge1(input: Array<string>) {
  const leftList: Array<number> = [];
  const rightList: Array<number> = [];
  let distance = 0;

  for (const line of input) {
    const splits = line.split('   ');
    leftList.push(parseInt(splits[0]));
    rightList.push(parseInt(splits[1]));
  }

  leftList.sort();
  rightList.sort();

  leftList.forEach((numLeft, index) => {
    distance += Math.abs(numLeft - rightList[index]);
  });

  return distance;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const leftList: Array<number> = [];
  const rightList: Array<number> = [];
  let similarityScore = 0;

  for (const line of input) {
    const splits = line.split('   ');
    leftList.push(parseInt(splits[0]));
    rightList.push(parseInt(splits[1]));
  }

  leftList.forEach(numLeft => {
    const count = rightList.filter(n => n === numLeft).length;
    similarityScore += numLeft * count;
  });

  return similarityScore;
}
