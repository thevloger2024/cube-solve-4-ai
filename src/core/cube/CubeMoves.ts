import { CubeState, cloneCube, FaceName, ColorName } from './CubeState';

export type MoveName =
  | 'U' | "U'" | 'U2'
  | 'D' | "D'" | 'D2'
  | 'R' | "R'" | 'R2'
  | 'L' | "L'" | 'L2'
  | 'F' | "F'" | 'F2'
  | 'B' | "B'" | 'B2';

export const ALL_MOVES: MoveName[] = [
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'F', "F'", 'F2',
  'B', "B'", 'B2',
];

/**
 * Rotates a 3x3 face array 90 degrees clockwise
 */
function rotateFaceClockwise(face: ColorName[]): ColorName[] {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ];
}

/**
 * Executes a single basic clockwise 90-degree face turn: 'U' | 'D' | 'R' | 'L' | 'F' | 'B'
 */
function applyBaseMove(cube: CubeState, face: 'U' | 'D' | 'R' | 'L' | 'F' | 'B'): CubeState {
  const next = cloneCube(cube);
  next[face] = rotateFaceClockwise(cube[face]);

  switch (face) {
    case 'U': {
      // F[0,1,2] -> L[0,1,2], R[0,1,2] -> F[0,1,2], B[0,1,2] -> R[0,1,2], L[0,1,2] -> B[0,1,2]
      next.F[0] = cube.R[0]; next.F[1] = cube.R[1]; next.F[2] = cube.R[2];
      next.L[0] = cube.F[0]; next.L[1] = cube.F[1]; next.L[2] = cube.F[2];
      next.B[0] = cube.L[0]; next.B[1] = cube.L[1]; next.B[2] = cube.L[2];
      next.R[0] = cube.B[0]; next.R[1] = cube.B[1]; next.R[2] = cube.B[2];
      break;
    }
    case 'D': {
      // Looking from bottom: F[bottom] -> R[bottom] -> B[bottom] -> L[bottom] -> F[bottom]
      next.R[6] = cube.F[6]; next.R[7] = cube.F[7]; next.R[8] = cube.F[8];
      next.B[6] = cube.R[6]; next.B[7] = cube.R[7]; next.B[8] = cube.R[8];
      next.L[6] = cube.B[6]; next.L[7] = cube.B[7]; next.L[8] = cube.B[8];
      next.F[6] = cube.L[6]; next.F[7] = cube.L[7]; next.F[8] = cube.L[8];
      break;
    }
    case 'R': {
      // F[8,5,2] -> U[8,5,2] -> B[0,3,6] -> D[8,5,2] -> F[8,5,2]
      next.U[2] = cube.F[2]; next.U[5] = cube.F[5]; next.U[8] = cube.F[8];
      next.B[6] = cube.U[2]; next.B[3] = cube.U[5]; next.B[0] = cube.U[8];
      next.D[2] = cube.B[6]; next.D[5] = cube.B[3]; next.D[8] = cube.B[0];
      next.F[2] = cube.D[2]; next.F[5] = cube.D[5]; next.F[8] = cube.D[8];
      break;
    }
    case 'L': {
      // U[0,3,6] -> F[0,3,6] -> D[0,3,6] -> B[8,5,2] -> U[0,3,6]
      next.F[0] = cube.U[0]; next.F[3] = cube.U[3]; next.F[6] = cube.U[6];
      next.D[0] = cube.F[0]; next.D[3] = cube.F[3]; next.D[6] = cube.F[6];
      next.B[8] = cube.D[0]; next.B[5] = cube.D[3]; next.B[2] = cube.D[6];
      next.U[0] = cube.B[8]; next.U[3] = cube.B[5]; next.U[6] = cube.B[2];
      break;
    }
    case 'F': {
      // U[6,7,8] -> R[0,3,6] -> D[2,1,0] -> L[8,5,2] -> U[6,7,8]
      next.R[0] = cube.U[6]; next.R[3] = cube.U[7]; next.R[6] = cube.U[8];
      next.D[2] = cube.R[0]; next.D[1] = cube.R[3]; next.D[0] = cube.R[6];
      next.L[8] = cube.D[2]; next.L[5] = cube.D[1]; next.L[2] = cube.D[0];
      next.U[6] = cube.L[8]; next.U[7] = cube.L[5]; next.U[8] = cube.L[2];
      break;
    }
    case 'B': {
      // U[2,1,0] -> L[0,3,6] -> D[6,7,8] -> R[8,5,2] -> U[2,1,0]
      next.L[0] = cube.U[2]; next.L[3] = cube.U[1]; next.L[6] = cube.U[0];
      next.D[6] = cube.L[0]; next.D[7] = cube.L[3]; next.D[8] = cube.L[6];
      next.R[8] = cube.D[6]; next.R[5] = cube.D[7]; next.R[2] = cube.D[8];
      next.U[2] = cube.R[8]; next.U[1] = cube.R[5]; next.U[0] = cube.R[2];
      break;
    }
  }

  return next;
}

/**
 * Applies any standard move (e.g. "R", "U'", "F2") to a CubeState
 */
export function applyMove(cube: CubeState, move: string): CubeState {
  const trimmed = move.trim();
  if (!trimmed) return cube;

  const face = trimmed[0].toUpperCase() as 'U' | 'D' | 'R' | 'L' | 'F' | 'B';
  if (!['U', 'D', 'R', 'L', 'F', 'B'].includes(face)) {
    return cube;
  }

  const modifier = trimmed.slice(1);
  if (modifier === '2') {
    const once = applyBaseMove(cube, face);
    return applyBaseMove(once, face);
  } else if (modifier === "'" || modifier === 'i') {
    const once = applyBaseMove(cube, face);
    const twice = applyBaseMove(once, face);
    return applyBaseMove(twice, face);
  } else {
    return applyBaseMove(cube, face);
  }
}

/**
 * Applies a space-separated sequence of moves to a CubeState
 */
export function applyMoveSequence(cube: CubeState, sequence: string): CubeState {
  const moves = sequence.trim().split(/\s+/).filter(Boolean);
  let current = cube;
  for (const move of moves) {
    current = applyMove(current, move);
  }
  return current;
}

/**
 * Inverts a single move (e.g. "R" -> "R'", "U'" -> "U", "F2" -> "F2")
 */
export function invertMove(move: string): string {
  const trimmed = move.trim();
  if (!trimmed) return '';
  const face = trimmed[0];
  const mod = trimmed.slice(1);
  if (mod === '2') return `${face}2`;
  if (mod === "'") return face;
  return `${face}'`;
}

/**
 * Inverts a full sequence of moves in reverse order
 */
export function invertSequence(sequence: string): string {
  const moves = sequence.trim().split(/\s+/).filter(Boolean);
  return moves.reverse().map(invertMove).join(' ');
}
