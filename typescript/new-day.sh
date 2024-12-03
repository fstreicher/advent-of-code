#!/bin/bash

# Check if two arguments are provided
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <year> <day>"
  exit 1
fi

# Assign input arguments to variables
year=$1
day=$2

# Create the nested folder year/day
mkdir -p "$year/$day"

# Create an empty text file
touch "$year/$day/input.txt"

# Create a template typescript file
cat <<EOL > "$year/$day/solution.ts"
// https://adventofcode.com/$year/day/$day



// Challenge 1
export function challenge1(input: Array<string>): number {

  return 0;
}


// Challenge 2
export function challenge2(input: Array<string>): number {

  return 0;
}
EOL