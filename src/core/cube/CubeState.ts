export type FaceName = 'U' | 'R' | 'F' | 'D' | 'L' | 'B';

export type ColorName = 'white' | 'red' | 'green' | 'yellow' | 'orange' | 'blue';

export type ColorCode = 'W' | 'R' | 'G' | 'Y' | 'O' | 'B';

export interface FaceDefinition {
  name: FaceName;
  label: string;
  defaultColor: ColorName;
  colorCode: ColorCode;
}

export const FACES: FaceDefinition[] = [
  { name: 'U', label: 'Up', defaultColor: 'white', colorCode: 'W' },
  { name: 'R', label: 'Right', defaultColor: 'red', colorCode: 'R' },
  { name: 'F', label: 'Front', defaultColor: 'green', colorCode: 'G' },
  { name: 'D', label: 'Down', defaultColor: 'yellow', colorCode: 'Y' },
  { name: 'L', label: 'Left', defaultColor: 'orange', colorCode: 'O' },
  { name: 'B', label: 'Back', defaultColor: 'blue', colorCode: 'B' },
];

export const COLOR_HEX: Record<ColorName, string> = {
  white: '#FFFFFF',
  yellow: '#FFD500',
  green: '#009B48',
  blue: '#0046AD',
  red: '#B71234',
  orange: '#FF5800',
};

export const COLOR_TO_CODE: Record<ColorName, ColorCode> = {
  white: 'W',
  yellow: 'Y',
  green: 'G',
  blue: 'B',
  red: 'R',
  orange: 'O',
};

export const CODE_TO_COLOR: Record<ColorCode, ColorName> = {
  W: 'white',
  Y: 'yellow',
  G: 'green',
  B: 'blue',
  R: 'red',
  O: 'orange',
};

// Face to Kociemba letter mapping: U, R, F, D, L, B
export const COLOR_TO_KOCIEMBA_FACE: Record<ColorName, FaceName> = {
  white: 'U',
  red: 'R',
  green: 'F',
  yellow: 'D',
  orange: 'L',
  blue: 'B',
};

export type CubeState = Record<FaceName, ColorName[]>;

/**
 * Creates a standard solved 3x3 Rubik's cube state
 */
export function createSolvedCube(): CubeState {
  return {
    U: Array(9).fill('white'),
    R: Array(9).fill('red'),
    F: Array(9).fill('green'),
    D: Array(9).fill('yellow'),
    L: Array(9).fill('orange'),
    B: Array(9).fill('blue'),
  };
}

/**
 * Deep clones a CubeState
 */
export function cloneCube(cube: CubeState): CubeState {
  return {
    U: [...cube.U],
    R: [...cube.R],
    F: [...cube.F],
    D: [...cube.D],
    L: [...cube.L],
    B: [...cube.B],
  };
}

/**
 * Verifies if every face has 9 identical stickers matching its center sticker
 */
export function isSolved(cube: CubeState): boolean {
  for (const face of ['U', 'R', 'F', 'D', 'L', 'B'] as FaceName[]) {
    const centerColor = cube[face][4];
    for (let i = 0; i < 9; i++) {
      if (cube[face][i] !== centerColor) return false;
    }
  }
  return true;
}

/**
 * Converts CubeState to standard 54-char string representation (order: U1-U9 R1-R9 F1-F9 D1-D9 L1-L9 B1-B9)
 */
export function toKociembaString(cube: CubeState): string {
  // Returns string with face letters (U, R, F, D, L, B) based on center colors
  const centerMap: Partial<Record<ColorName, FaceName>> = {
    [cube.U[4]]: 'U',
    [cube.R[4]]: 'R',
    [cube.F[4]]: 'F',
    [cube.D[4]]: 'D',
    [cube.L[4]]: 'L',
    [cube.B[4]]: 'B',
  };

  let str = '';
  const faceOrder: FaceName[] = ['U', 'R', 'F', 'D', 'L', 'B'];
  for (const f of faceOrder) {
    for (let i = 0; i < 9; i++) {
      const color = cube[f][i];
      str += centerMap[color] || 'U';
    }
  }
  return str;
}

/**
 * Calculates how many stickers of each color are present in the cube
 */
export function countColors(cube: CubeState): Record<ColorName, number> {
  const counts: Record<ColorName, number> = {
    white: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    red: 0,
    orange: 0,
  };

  for (const face of ['U', 'R', 'F', 'D', 'L', 'B'] as FaceName[]) {
    for (let i = 0; i < 9; i++) {
      const c = cube[face][i];
      if (counts[c] !== undefined) {
        counts[c]++;
      }
    }
  }
  return counts;
}
