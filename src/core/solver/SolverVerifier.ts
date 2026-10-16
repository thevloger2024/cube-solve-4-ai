import { CubeState, isSolved, cloneCube } from '../cube/CubeState';
import { applyMove } from '../cube/CubeMoves';

export interface VerificationResult {
  isSuccess: boolean;
  finalState: CubeState;
  statesAfterEachMove: CubeState[];
  error?: string;
}

/**
 * Verifies that applying the solution moves to the initial state produces a 100% solved cube.
 * Records the state after every single move for step-by-step navigation.
 */
export function verifySolution(initialState: CubeState, moves: string[]): VerificationResult {
  let current = cloneCube(initialState);
  const states: CubeState[] = [cloneCube(current)];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    try {
      current = applyMove(current, move);
      states.push(cloneCube(current));
    } catch (err) {
      return {
        isSuccess: false,
        finalState: current,
        statesAfterEachMove: states,
        error: `Failed applying move "${move}" at step ${i + 1}: ${(err as Error).message}`,
      };
    }
  }

  const solved = isSolved(current);
  return {
    isSuccess: solved,
    finalState: current,
    statesAfterEachMove: states,
    error: solved ? undefined : 'Final cube state after solution moves is not fully solved.',
  };
}
