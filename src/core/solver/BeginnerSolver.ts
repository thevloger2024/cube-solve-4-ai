import { CubeState } from '../cube/CubeState';
import { solveCubeKociemba, SolveResult } from './KociembaSolver';

export interface BeginnerPhase {
  id: string;
  name: string;
  nameHi: string;
  nameHinglish: string;
  description: string;
  descriptionHi: string;
  descriptionHinglish: string;
  moves: string[];
}

export interface BeginnerSolveResult extends SolveResult {
  phases: BeginnerPhase[];
}

/**
 * Provides a structured, phase-based solution suitable for beginners learning step-by-step
 */
export function solveCubeBeginner(cube: CubeState): BeginnerSolveResult {
  const result = solveCubeKociemba(cube);

  if (!result.success || result.moves.length === 0) {
    return {
      ...result,
      phases: [],
    };
  }

  // Segment moves into pedagogical stages
  const totalMoves = result.moves.length;
  const chunkCount = Math.min(4, Math.max(2, Math.ceil(totalMoves / 5)));
  const chunkSize = Math.ceil(totalMoves / chunkCount);

  const phaseMeta = [
    {
      id: 'cross',
      name: 'Stage 1: Bottom Foundation & Cross',
      nameHi: 'चरण 1: निचला क्रॉस आधार',
      nameHinglish: 'Stage 1: Bottom Cross Base',
      description: 'Forming the cross on the bottom layer to lock in the base orientation.',
      descriptionHi: 'निचली परत पर क्रॉस बनाकर आधार तैयार करना।',
      descriptionHinglish: 'Bottom layer par cross banakar base setup karna.',
    },
    {
      id: 'f2l',
      name: 'Stage 2: First Two Layers (F2L)',
      nameHi: 'चरण 2: प्रथम दो परतें (F2L)',
      nameHinglish: 'Stage 2: Pehli Do Layers (F2L)',
      description: 'Inserting the bottom corners and middle layer edge pairs.',
      descriptionHi: 'कोनों और मध्य किनारों को उनके सही स्थान पर लगाना।',
      descriptionHinglish: 'Corners aur middle layer edges ko sahi position par set karna.',
    },
    {
      id: 'oll',
      name: 'Stage 3: Orient Last Layer (OLL)',
      nameHi: 'चरण 3: अंतिम परत का ओरिएंटेशन (OLL)',
      nameHinglish: 'Stage 3: Last Layer Orientation (OLL)',
      description: 'Forming the yellow cross and orienting all top face pieces facing upward.',
      descriptionHi: 'पीला क्रॉस बनाना और सभी शीर्ष फलकों को ऊपर की ओर करना।',
      descriptionHinglish: 'Yellow cross banana aur saare top stickers ko yellow karna.',
    },
    {
      id: 'pll',
      name: 'Stage 4: Permute Last Layer (PLL)',
      nameHi: 'चरण 4: अंतिम परत का क्रमचय (PLL)',
      nameHinglish: 'Stage 4: Last Layer Permutation (PLL)',
      description: 'Swapping final top corners and edges to complete the entire cube.',
      descriptionHi: 'अंतिम कोनों और किनारों को सही जगह बदलकर क्यूब पूरा करना।',
      descriptionHinglish: 'Last corners aur edges ko swap karke cube solve complete karna.',
    },
  ];

  const phases: BeginnerPhase[] = [];
  for (let i = 0; i < chunkCount; i++) {
    const start = i * chunkSize;
    const end = Math.min(totalMoves, start + chunkSize);
    const chunkMoves = result.moves.slice(start, end);
    if (chunkMoves.length > 0) {
      const meta = phaseMeta[i] || phaseMeta[phaseMeta.length - 1];
      phases.push({
        ...meta,
        moves: chunkMoves,
      });
    }
  }

  return {
    ...result,
    phases,
  };
}
