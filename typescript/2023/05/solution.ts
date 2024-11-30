// https://adventofcode.com/2023/day/5

interface Almanac {
  seeds: Array<number>;
  seedToSoil: Array<AlmanacMap>;
  soilToFertilizer: Array<AlmanacMap>;
  fertilizerToWater: Array<AlmanacMap>;
  waterToLight: Array<AlmanacMap>;
  lightToTemperature: Array<AlmanacMap>;
  temperatureToHumidity: Array<AlmanacMap>;
  humidityToLocation: Array<AlmanacMap>;
}

interface AlmanacMap {
  sourceRangeStart: number;
  sourceRangeEnd: number;
  destinationOffset: number;
}

const exampleInput = [
  'seeds: 79 14 55 13',
  '',
  'seed-to-soil map:',
  '50 98 2',
  '52 50 48',
  '',
  'soil-to-fertilizer map:',
  '0 15 37',
  '37 52 2',
  '39 0 15',
  '',
  'fertilizer-to-water map:',
  '49 53 8',
  '0 11 42',
  '42 0 7',
  '57 7 4',
  '',
  'water-to-light map:',
  '88 18 7',
  '18 25 70',
  '',
  'light-to-temperature map:',
  '45 77 23',
  '81 45 19',
  '68 64 13',
  '',
  'temperature-to-humidity map:',
  '0 69 1',
  '1 0 69',
  '',
  'humidity-to-location map:',
  '60 56 37',
  '56 93 4',
];

function convertAlmanac(input: Array<string>): Almanac {
  const almanac: Almanac = {
    seeds: [],
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  };

  let status = '';
  for (let row of input) {
    if (row === '') { continue; }

    if (row.startsWith('seeds:')) {
      almanac.seeds = row
        .slice(row.indexOf(':') + 1)
        .split(/\s+/)
        .filter(Boolean)
        .map(n => parseInt(n));
    } else if (row.startsWith('seed-to-soil')) {
      status = 'seedToSoil';
    } else if (row.startsWith('soil-to-fertilizer')) {
      status = 'soilToFertilizer';
    } else if (row.startsWith('fertilizer-to-water')) {
      status = 'fertilizerToWater';
    } else if (row.startsWith('water-to-light')) {
      status = 'waterToLight';
    } else if (row.startsWith('light-to-temperature')) {
      status = 'lightToTemperature';
    } else if (row.startsWith('temperature-to-humidity')) {
      status = 'temperatureToHumidity';
    } else if (row.startsWith('humidity-to-location')) {
      status = 'humidityToLocation';
    } else {
      const [destinationRangeStart, sourceRangeStart, rangeLength] = row.split(/\s+/);
      almanac[status as keyof Omit<Almanac, 'seeds'>].push({
        sourceRangeStart: parseInt(sourceRangeStart),
        sourceRangeEnd: parseInt(sourceRangeStart) + parseInt(rangeLength) - 1,
        destinationOffset: parseInt(destinationRangeStart) - parseInt(sourceRangeStart),
      });
    }
  }
  return almanac;
}

function getDestinationNumber(input: number, maps: Array<AlmanacMap>): number {
  const map = maps.find(map => input >= map.sourceRangeStart && input <= map.sourceRangeEnd);
  if (input >= map?.sourceRangeStart && input <= map?.sourceRangeEnd) {
    return input + map.destinationOffset;
  }
  return input;
}

function getLocation(seed: number, almanac: Almanac): number {
  const soil = getDestinationNumber(seed, almanac.seedToSoil);
  const fertilizer = getDestinationNumber(soil, almanac.soilToFertilizer);
  const water = getDestinationNumber(fertilizer, almanac.fertilizerToWater);
  const light = getDestinationNumber(water, almanac.waterToLight);
  const temperature = getDestinationNumber(light, almanac.lightToTemperature);
  const humidity = getDestinationNumber(temperature, almanac.temperatureToHumidity);
  const location = getDestinationNumber(humidity, almanac.humidityToLocation);
  return location;
}


// Challenge 1
export function challenge1(input: Array<string>) {
  const almanac = convertAlmanac(input);

  return Math.min(...almanac.seeds.map(seed => getLocation(seed, almanac)));
}


// Challenge 2
export function challenge2(input: Array<string>) {
  // input = exampleInput;

  const almanac = convertAlmanac(input);
  const locations: Array<number> = [];

  for (let i = 0; i < almanac.seeds.length; i += 2) {
    const startSeed = almanac.seeds[i];
    const seedRange = almanac.seeds[i + 1];

    // this works for the example input, but breaks for the real input because the numbers are too big
    for (let seed = startSeed; seed < startSeed + seedRange; seed++) {
      locations.push(getLocation(seed, almanac));
    }
  }

  return Math.min(...locations);
}
