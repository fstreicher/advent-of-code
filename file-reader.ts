import * as fs from 'fs';

export function readFile(path: string): Array<string> {
  return fs.readFileSync(`${path}/input.txt`)
    .toString()
    .split('\r\n');
}
