import { readFile } from "./file-reader";

interface Solution {
  challenge1(input: Array<string>): any;
  challenge2(input: Array<string>): any;
}


const days = process.argv.slice(2);

if (!days.length) {
  console.error('Expected arguments, none received.');
  process.exit(0);
}

days.forEach(day => {
  if (day && /\d{2}/.test(day)) {
    import(`./${day}/solution`)
      .then((solution: Solution) => {
        const input = readFile(day);
        console.info(`Solutions for day ${day}`);
        console.log('    Challenge 1: ', solution.challenge1(input));
        console.log('    Challenge 2: ', solution.challenge2(input));
      });
  }
});
