// https://adventofcode.com/2021/day/3

function getBitCount(input: Array<string>): Array<number> {
  const bitMap: Array<number> = [];

  input.forEach(binary => {
    const digits = binary.split('');
    digits.forEach((digit, idx) => {
      const bit = parseInt(digit);
      if (bitMap[idx]) {
        bitMap[idx] += bit;
      } else {
        bitMap[idx] = bit;
      }
    });
  });
  return bitMap;
}

// Challenge 1
export function challenge1(input: Array<string>): number {
  const bitMap = getBitCount(input);

  const mostCommonBit = bitMap.map(count => count > input.length / 2 ? 1 : 0);
  const leastCommonBit = bitMap.map(count => count < input.length / 2 ? 1 : 0);
  const gammaRate = parseInt(mostCommonBit.join(''), 2);
  const epsilonRate = parseInt(leastCommonBit.join(''), 2);

  return gammaRate * epsilonRate;
}

// Challenge 2
export function challenge2(input: Array<string>): number {
  const bitMap = getBitCount(input);

  const mostCommonBit = bitMap.map(count => count >= input.length / 2 ? 1 : 0);
  const leastCommonBit = bitMap.map(count => count < input.length / 2 ? 1 : 0);

  const getValidCode = (codes: Array<string>, bitArray: Array<number>, d: 'most' | 'least') => {
    for (let i = 0; i < bitArray.length; i++) {
      const bit = bitArray[i];
      codes = codes.filter(bits => bits[i] === String(bit));
      const bitCount = getBitCount(codes);
      bitArray = bitCount.map(count => {
        if (d === 'most')
          return count >= codes.length / 2 ? 1 : 0
        else
          return count < codes.length / 2 ? 1 : 0
      });
      if (codes.length <= 1) {
        break;
      }
    }
    return codes.pop() ?? '';
  }

  const o2GeneratorRating = parseInt(getValidCode(input, mostCommonBit, 'most'), 2);
  const o2ScruberRating = parseInt(getValidCode(input, leastCommonBit, 'least'), 2);;

  return o2GeneratorRating * o2ScruberRating;
}