// https://adventofcode.com/2022/day/4

type Pair = `${number}-${number}`;
type Section = Array<number>;

function includes(sectionA: Section, sectionB: Section): boolean {
  return (
    sectionA[0] >= sectionB[0] && sectionA[1] <= sectionB[1] ||
    sectionA[0] <= sectionB[0] && sectionA[1] >= sectionB[1]
  );
}

function overlap(sectionA: Section, sectionB: Section): boolean {
  return (
    sectionB[0] <= sectionA[0] && sectionA[0] <= sectionB[1] ||
    sectionB[0] <= sectionA[1] && sectionA[1] <= sectionB[1] ||
    sectionA[0] <= sectionB[0] && sectionB[0] <= sectionA[1] ||
    sectionA[0] <= sectionB[1] && sectionB[1] <= sectionA[1]
  );
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  let overlaps = 0;
  for (const pair of input) {
    const sections = pair.split(',') as Array<Pair>;
    if (
      includes(
        sections[0].split('-').map(s => parseInt(s)),
        sections[1].split('-').map(s => parseInt(s)))
    ) {
      overlaps++;
    }
  }
  return overlaps;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  let overlaps = 0;
  for (const pair of input) {
    const sections = pair.split(',') as Array<Pair>;
    if (
      overlap(
        sections[0].split('-').map(s => parseInt(s)),
        sections[1].split('-').map(s => parseInt(s)))
    ) {
      overlaps++;
    }
  }
  return overlaps;
}
