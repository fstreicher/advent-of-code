// https://adventofcode.com/2024/day/02



function parseInput(input: Array<string>): Array<Array<number>> {
  return input.map((line) => {
    return line.split(/\s+/).map(level => parseInt(level));
  });
}

function isSafe(report: Array<number>): boolean {
  const diffs: Array<number> = [];
  const unsafeLevels = new Set<number>();

  // calculate the difference between each level
  for (let i = 0; i < report.length - 1; i++) {
    diffs.push(report[i] - report[i + 1]);
  }

  // find indices of levels that are outside the margin [1, 3]
  const outsideMargin = diffs
    .map((d, idx) => (Math.abs(d) > 3 || Math.abs(d) < 1) ? idx : -1)
    .filter(i => i > -1);

  outsideMargin.forEach(i => unsafeLevels.add(i));

  // check if only [tolerance] levels differ outside margin [1, 3]
  if (outsideMargin.length > 0) {
    return false;
  }

  // check if all levels are either increasing or decreasing
  const positiveDiffs = diffs
    .map((d, idx) => d > 0 ? idx : -1)
    .filter(d => d > -1);
  const negativeDiffs = diffs
    .map((d, idx) => d < 0 ? idx : -1)
    .filter(d => d > -1);

  if (positiveDiffs.length > 0 && negativeDiffs.length > 0) {
    // if there are only 2 levels, they must be increasing or decreasing
    if (diffs.length > 2 && positiveDiffs.length === negativeDiffs.length) {
      return false;
    }

    const direction = positiveDiffs.length > negativeDiffs.length ? 'dec' : 'inc';
    if (direction === 'inc') {
      negativeDiffs.forEach(d => unsafeLevels.add(d));
    }
    if (direction === 'dec') {
      positiveDiffs.forEach(d => unsafeLevels.add(d));
    }
  }

  return unsafeLevels.size <= 0;
}

function checkReportWithTolerance(unsafeReport: Array<number>): boolean {
  for (let i = 0; i < unsafeReport.length; i++) {
    const newReport = [...unsafeReport];
    newReport.splice(i, 1);
    if (isSafe(newReport)) {
      return true;
    }
  }
  return false;
}


// Challenge 1
export function challenge1(input: Array<string>) {
  const reports = parseInput(input);
  return reports.filter(isSafe).length;
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const safeReports: Array<Array<number>> = [];
  const unsafeReports: Array<Array<number>> = [];
  const reports = parseInput(input);
  reports.forEach(report => {
    if (isSafe(report)) {
      safeReports.push(report);
    } else {
      unsafeReports.push(report);
    }
  });

  unsafeReports.forEach(unsafeReport => {
    if (checkReportWithTolerance(unsafeReport)) {
      safeReports.push(unsafeReport);
    }
  });

  return safeReports.length;
}

