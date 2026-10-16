import { MoveName } from './CubeMoves';
import { CubeState, createSolvedCube } from './CubeState';
import { applyMoveSequence } from './CubeMoves';

const FACES = ['U', 'D', 'R', 'L', 'F', 'B'] as const;
const MODIFIERS = ['', "'", '2'] as const;

const OPPOSITE_FACE: Record<string, string> = {
  U: 'D',
  D: 'U',
  R: 'L',
  L: 'R',
  F: 'B',
  B: 'F',
};

/**
 * Generates an official-style WCA scramble of specified length (default 20 moves)
 */
export function generateScramble(length: number = 20): string {
  const moves: string[] = [];
  let lastFace = '';
  let secondLastFace = '';

  for (let i = 0; i < length; i++) {
    let availableFaces = FACES.filter(f => f !== lastFace);

    // If last two moves were on opposite faces, don't move on either of them again
    if (secondLastFace && OPPOSITE_FACE[lastFace] === secondLastFace) {
      availableFaces = availableFaces.filter(f => f !== secondLastFace);
    }

    const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
    const modifier = MODIFIERS[Math.floor(Math.random() * MODIFIERS.length)];
    const move = `${face}${modifier}`;

    moves.push(move);
    secondLastFace = lastFace;
    lastFace = face;
  }

  return moves.join(' ');
}

/**
 * Generates a scrambled CubeState from a fresh solved cube
 */
export function getScrambledCube(scrambleLength: number = 20): { cube: CubeState; scramble: string } {
  const scramble = generateScramble(scrambleLength);
  const cube = applyMoveSequence(createSolvedCube(), scramble);
  return { cube, scramble };
}
