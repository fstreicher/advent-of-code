// https://adventofcode.com/2023/day/2

interface Game {
  id: number;
  sets: Array<ColorSet>;
}

interface ColorSet {
  red?: number;
  green?: number;
  blue?: number;
}

function getGames(input: Array<string>) {
  const games: Array<Game> = [];

  for (let line of input) {
    line = line.replace(/([;:,])\s/g, '$1');
    const id = line.split(':')[0].split(' ')[1];
    const sets = line.split(':')[1].split(';').map((setString) => {
      const set: ColorSet = {};
      setString
        .split(',')
        .forEach((color) => {
          const [colorValue, colorName] = color.split(' ');
          set[colorName as keyof ColorSet] = Number(colorValue);
        });
      return set;
    });
    games.push({ id: Number(id), sets });
  }

  return games;
}


// Challenge 1
export function challenge1(input: Array<string>) {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  const possibleGames: Array<number> = [];
  getGames(input).forEach(game => {
    const isGamePossible = game.sets.every(({ red, green, blue }) => {
      return (
        (red ?? 0) <= MAX_RED &&
        (green ?? 0) <= MAX_GREEN &&
        (blue ?? 0) <= MAX_BLUE
      );
    })

    if (isGamePossible) {
      possibleGames.push(game.id);
    }
  });

  return possibleGames.reduce((curr, acc) => curr + acc, 0);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const gamePowers: Array<number> = [];

  getGames(input).forEach(game => {
    const maxColors = {
      red: 0,
      green: 0,
      blue: 0,
    };

    game.sets.forEach(({ red, green, blue }) => {
      if (red && red > maxColors.red) {
        maxColors.red = red;
      }
      if (green && green > maxColors.green) {
        maxColors.green = green;
      }
      if (blue && blue > maxColors.blue) {
        maxColors.blue = blue;
      }
    });
    
    gamePowers.push(maxColors.red * maxColors.green * maxColors.blue);
  });

  return gamePowers.reduce((curr, acc) => curr + acc, 0);
}
