import { readFile } from "./file-reader";

interface Solution {
  challenge1(input: Array<string>): unknown;
  challenge2(input: Array<string>): unknown;
}

const year = process.argv[2];
const days = process.argv.slice(3);

if (!year.length && !days.length) {
  console.error('Expected arguments, none received.');
  process.exit(0);
}

days.forEach(day => {
  if (day && /\d{2}/.test(day)) {
    import(`./${year}/${day}/solution`)
      .then((solution: Solution) => {
        const input = readFile(`${year}/${day}`);
        console.info(`Solutions for day ${day}`);
        console.log('    Challenge 1: ', solution.challenge1([...input]));
        console.log('    Challenge 2: ', solution.challenge2([...input]));
      });
  }
});
