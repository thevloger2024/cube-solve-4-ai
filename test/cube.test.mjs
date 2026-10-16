import assert from 'node:assert';
import { createSolvedCube, cloneCube, isSolved, countColors, toKociembaString } from '../src/core/cube/CubeState.ts';
import { applyMove, applyMoveSequence, invertMove, invertSequence } from '../src/core/cube/CubeMoves.ts';
import { validateCubeState } from '../src/core/cube/CubeValidation.ts';
import { generateScramble, getScrambledCube } from '../src/core/cube/ScrambleGenerator.ts';
import { solveCubeKociemba } from '../src/core/solver/KociembaSolver.ts';
import { verifySolution } from '../src/core/solver/SolverVerifier.ts';

console.log('--- STARTING CUBE SOLVE 4 AI AUTOMATED TEST SUITE ---');

// Test 1: Solved Cube Invariants
{
  const cube = createSolvedCube();
  assert.strictEqual(isSolved(cube), true, 'Solved cube should return isSolved() === true');

  const counts = countColors(cube);
  for (const [col, count] of Object.entries(counts)) {
    assert.strictEqual(count, 9, `Color ${col} must appear exactly 9 times`);
  }
  console.log('✓ Test 1 Passed: Solved Cube Invariants & Color Counts');
}

// Test 2: Move Inverses (M + M\' = Solved)
{
  const moves = ['U', 'D', 'R', 'L', 'F', 'B'];
  for (const m of moves) {
    const cube = createSolvedCube();
    const turned = applyMove(cube, m);
    assert.strictEqual(isSolved(turned), false, `Single turn ${m} must not leave cube solved`);

    const inverted = applyMove(turned, `${m}'`);
    assert.strictEqual(isSolved(inverted), true, `${m} followed by ${m}' must restore solved state`);

    // Double move twice restores solved
    const doubleTurned = applyMove(applyMove(cube, `${m}2`), `${m}2`);
    assert.strictEqual(isSolved(doubleTurned), true, `${m}2 followed by ${m}2 must restore solved state`);
  }
  console.log('✓ Test 2 Passed: Move Inverses & Double Moves');
}

// Test 3: Complex Move Sequence & Reversal
{
  const cube = createSolvedCube();
  const sequence = "R U R' U' F' U2 F";
  const scrambled = applyMoveSequence(cube, sequence);
  assert.strictEqual(isSolved(scrambled), false, 'Scrambled sequence must not be solved');

  const reverse = invertSequence(sequence);
  const restored = applyMoveSequence(scrambled, reverse);
  assert.strictEqual(isSolved(restored), true, 'Applying inverted sequence must restore solved state');
  console.log('✓ Test 3 Passed: Sequence Application & Inversion');
}

// Test 4: Parity & State Validation
{
  const validCube = createSolvedCube();
  const validResult = validateCubeState(validCube);
  assert.strictEqual(validResult.isValid, true, 'Solved cube must pass validation');

  // Corrupt a sticker: make White 10 and Yellow 8
  const invalidCube = cloneCube(validCube);
  invalidCube.D[0] = 'white';
  const invalidResult = validateCubeState(invalidCube);
  assert.strictEqual(invalidResult.isValid, false, 'Cube with 10 whites must fail validation');
  assert.ok(invalidResult.issues.some(i => i.type === 'color_count'), 'Must flag color_count issue');

  // Opposite colors on edge (e.g. White and Yellow on UF edge)
  const impossibleEdgeCube = cloneCube(validCube);
  impossibleEdgeCube.U[7] = 'white';
  impossibleEdgeCube.F[1] = 'yellow'; // Opposite colors cannot be on same edge!
  const edgeResult = validateCubeState(impossibleEdgeCube);
  assert.strictEqual(edgeResult.isValid, false, 'Opposite colors on edge must fail validation');
  console.log('✓ Test 4 Passed: Cube Parity & Color Validation');
}

// Test 5: Real Kociemba Solver & Move Verification
{
  const solved = createSolvedCube();
  // 6-move scramble
  const scramble = "R U R' U' F2 D";
  const scrambled = applyMoveSequence(solved, scramble);

  const result = solveCubeKociemba(scrambled);
  assert.strictEqual(result.success, true, 'Solver must return success');
  assert.ok(result.moves.length > 0, 'Solver must return moves');
  assert.strictEqual(result.verification.isSuccess, true, 'Solver moves must strictly verify to solved state');

  console.log(`✓ Test 5 Passed: Real Kociemba Solver successfully solved scramble [${scramble}] in ${result.moves.length} moves (${result.moves.join(' ')}) in ${result.durationMs}ms`);
}

// Test 6: WCA Random 20-move Scramble & Solve Verification
{
  const { cube, scramble } = getScrambledCube(20);
  assert.strictEqual(isSolved(cube), false, 'Random scramble must scramble cube');

  const result = solveCubeKociemba(cube);
  assert.strictEqual(result.success, true, 'Random scramble must be solvable');
  assert.strictEqual(result.verification.isSuccess, true, 'Verified final state must be 100% solved');

  console.log(`✓ Test 6 Passed: Full 20-move WCA scramble successfully solved in ${result.moves.length} moves in ${result.durationMs}ms`);
}

console.log('--- ALL 6 AUTOMATED TEST SUITES PASSED! ---');
