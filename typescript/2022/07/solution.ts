// https://adventofcode.com/2022/day/7

type State = 'waiting' | 'command' | 'readDir';

type File = {
  name: string;
  size: number;
}

type Directory = {
  [name: string]: Directory | number,
  _size: number;
}

function isCdCommand(input: string): boolean {
  return input.startsWith('$ cd ');
}

function getCdPath(input: string): string {
  const result = /^\$ cd (?<dir>\w+|\.\.|\/)/.exec(input);
  return result?.groups?.dir;
}

function isLsCommand(input: string): boolean {
  return input.startsWith('$ ls');
}

function isDir(input: string): false | string {
  const result = /^dir (?<name>\w+)/.exec(input);
  return result?.groups?.name ?? false;
}

function isFile(input: string): false | { name: string, size: number } {
  const result = /^(?<size>\d+) (?<name>[\w\.]+)/.exec(input);
  return result ? { name: result.groups.name, size: parseInt(result.groups.size) } : false;
}

function isDirectory(maybeDir: unknown): maybeDir is Directory {
  return Object.prototype.hasOwnProperty.call(maybeDir, '_size');
}

function setDeepProperty(obj: Directory, path: string, property: Record<string, number>): Directory {
  const parts = path.split(/[/.]/).slice(1);

  const traverseDirectory = (obj: Directory, step: string, rest: Array<string>): Directory => {

    if (!step) {
      // set root level content
      Object.keys(property).forEach(file => obj[file] = property[file]);
    } else if (!rest.length) {
      // arrived at target level
      obj[step] = obj[step] ?? { _size: 0 };
      Object.keys(property).forEach(file => ((obj[step]) as Directory)[file] = property[file]);
    } else {
      // move down one level
      obj[step] = traverseDirectory(obj?.[step] as Directory ?? { _size: 0 }, rest.shift(), rest);
    }

    return obj;
  }

  return traverseDirectory(obj, parts.shift(), parts);
}

function generateTree(input: Array<string>): Directory {
  const fileTree: Directory = {
    _size: 0
  };
  let state: State = 'waiting';
  let currentPath = '';
  let cwdFiles: Record<string, number> = {};
  for (const line of input) {
    if (isCdCommand(line)) {
      // leave file/dir listing
      if (state === 'readDir' && Object.keys(cwdFiles).length) {
        // set current directories contents
        setDeepProperty(fileTree, currentPath, cwdFiles);
        cwdFiles = {};
      }

      state = 'command';
      var path = getCdPath(line);
      switch (path) {
        case '/':
          currentPath = '~';
          break;
        case '..':
          currentPath = currentPath.split('/').slice(0, -1).join('/');
          break;
        default:
          currentPath += `/${path}`;
          break;
      }
      continue;
    }

    if (isLsCommand(line)) {
      // get current dir contents
      state = 'readDir';
      continue;
    }

    if (state === 'readDir') {
      if (isFile(line)) {
        const file = isFile(line) as File;
        cwdFiles[file.name] = file.size;
        continue;
      }
      if (isDir(line)) {
        // FIXME: this ignores emtpy directories
        continue;
      }
    }
  }

  if (state === 'readDir') {
    // set final collected directory contents
    setDeepProperty(fileTree, currentPath, cwdFiles);
    cwdFiles = {};
  }

  return updateDirectorySize(fileTree);
}

function updateDirectorySize(fileTree: Directory): Directory {

  const hasChildren = (dir: Directory | number): dir is Directory => {
    return (
      typeof dir !== 'number' &&
      Object.keys(dir).length > 1
    );
  }

  Object.keys(fileTree).forEach(fileOrDirectory => {
    if (hasChildren(fileTree[fileOrDirectory])) {
      updateDirectorySize(fileTree[fileOrDirectory] as Directory);
    }
  });

  fileTree._size = Object.keys(fileTree)
    .filter(el => el !== '_size')
    .reduce((acc, curr) => acc += (fileTree[curr] as Directory)?._size ?? (fileTree[curr] as number), 0)

  return fileTree;
}

// Challenge 1
export function challenge1(input: Array<string>) {
  const fileSystem = generateTree(input);
  const directoriesUnder100k: Array<number> = [];

  const checkChildDirs = (dir: Directory): void => {
    Object.keys(dir).forEach(dirName => {
      const maybeDir = dir[dirName];
      if (isDirectory(maybeDir)) {
        if (maybeDir._size <= 100_000) {
          directoriesUnder100k.push(maybeDir._size);
        }
        checkChildDirs(maybeDir);
      }
    });
  }

  checkChildDirs(fileSystem);

  return directoriesUnder100k.reduce((acc, curr) => acc += curr, 0);
}


// Challenge 2
export function challenge2(input: Array<string>) {
  const TOTAL_DISK_SPACE = 70_000_000;
  const SPACE_REQUIRED_FOR_UPDATE = 30_000_000;

  const fileSystem = generateTree(input);
  const candidates: Array<number> = [];

  const spaceOccupied = fileSystem._size;
  const spaceNeeded = SPACE_REQUIRED_FOR_UPDATE - (TOTAL_DISK_SPACE - spaceOccupied);

  const checkChildDirs = (dir: Directory): void => {
    Object.keys(dir).forEach(dirName => {
      const maybeDir = dir[dirName];
      if (isDirectory(maybeDir)) {
        if (maybeDir._size >= spaceNeeded) {
          candidates.push(maybeDir._size);
        }
        checkChildDirs(maybeDir);
      }
    });
  }

  checkChildDirs(fileSystem);

  return Math.min(...candidates);
}
