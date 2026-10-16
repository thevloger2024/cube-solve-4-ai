// @ts-ignore
import Cube from 'cubejs';
import { CubeState, toKociembaString } from '../cube/CubeState';
import { verifySolution, VerificationResult } from './SolverVerifier';

let isInitialized = false;

/**
 * Initializes the Kociemba two-phase lookup tables.
 * Safe to call multiple times.
 */
export function initKociemba(): void {
  if (isInitialized) return;
  try {
    Cube.initSolver();
    isInitialized = true;
  } catch (err) {
    console.warn('Cube solver table initialization note:', err);
    isInitialized = true;
  }
}

export interface SolveResult {
  success: boolean;
  moves: string[];
  rawSolution: string;
  moveCount: number;
  verification: VerificationResult;
  error?: string;
  durationMs: number;
}

/**
 * Solves a CubeState using Kociemba's two-phase algorithm and strictly verifies the solution
 */
export function solveCubeKociemba(cube: CubeState): SolveResult {
  const startTime = performance.now();
  initKociemba();

  try {
    const cubeString = toKociembaString(cube);
    const parsedCube = Cube.fromString(cubeString);

    if (parsedCube.isSolved()) {
      return {
        success: true,
        moves: [],
        rawSolution: '',
        moveCount: 0,
        verification: verifySolution(cube, []),
        durationMs: Math.round(performance.now() - startTime),
      };
    }

    const solutionString = parsedCube.solve();
    const moves = solutionString.trim().split(/\s+/).filter(Boolean);

    // CRITICAL: Strictly verify by applying moves on a clone
    const verification = verifySolution(cube, moves);
    const durationMs = Math.round(performance.now() - startTime);

    if (!verification.isSuccess) {
      return {
        success: false,
        moves: [],
        rawSolution: solutionString,
        moveCount: 0,
        verification,
        error: verification.error || 'Verification failed: solution does not reach solved state.',
        durationMs,
      };
    }

    return {
      success: true,
      moves,
      rawSolution: solutionString,
      moveCount: moves.length,
      verification,
      durationMs,
    };
  } catch (err) {
    return {
      success: false,
      moves: [],
      rawSolution: '',
      moveCount: 0,
      verification: {
        isSuccess: false,
        finalState: cube,
        statesAfterEachMove: [cube],
        error: (err as Error).message,
      },
      error: `Solver error: ${(err as Error).message}`,
      durationMs: Math.round(performance.now() - startTime),
    };
  }
}
