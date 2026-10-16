export interface Lesson {
  id: string;
  title: string;
  titleHi: string;
  titleHinglish: string;
  level: 'Beginner' | 'Advanced';
  stageNumber: number;
  durationMin: number;
  description: string;
  keyAlgorithm?: string;
  content: {
    overview: string;
    steps: string[];
    tips: string[];
    commonMistakes: string[];
  };
}

export const LESSONS: Lesson[] = [
  {
    id: 'anatomy-of-cube',
    title: '1. Anatomy of the Cube',
    titleHi: '1. रूबिक्स क्यूब की शारीरिक संरचना',
    titleHinglish: '1. Cube ki Anatomy aur Basics',
    level: 'Beginner',
    stageNumber: 1,
    durationMin: 5,
    description: 'Learn about centers, edges, and corners. Understand why centers never move relative to each other.',
    content: {
      overview: 'A standard 3x3 Rubik\'s Cube consists of 26 exterior pieces and 1 internal core: 6 fixed centers (1 color), 12 edges (2 colors), and 8 corners (3 colors).',
      steps: [
        'Notice that the 6 center pieces never change positions. White is always opposite Yellow, Green opposite Blue, Red opposite Orange.',
        'Edges have 2 stickers and connect centers. Corners have 3 stickers and sit at the vertices.',
        'You never solve stickers in isolation; you solve entire physical pieces into their correct slots.',
      ],
      tips: [
        'Always establish a fixed orientation: Keep White on Top and Green on Front while practicing.',
      ],
      commonMistakes: [
        'Trying to move a center piece to another face (physically impossible on a standard cube).',
        'Confusing an edge piece with a corner piece.',
      ],
    },
  },
  {
    id: 'cube-notation',
    title: '2. Master Cube Notation',
    titleHi: '2. क्यूब नोटेशन (Notation) सीखें',
    titleHinglish: '2. Cube Notation aur Turns',
    level: 'Beginner',
    stageNumber: 2,
    durationMin: 7,
    description: 'Understand U, D, R, L, F, B, clockwise, counter-clockwise (prime \'), and double turns (2).',
    keyAlgorithm: "R U R' U'",
    content: {
      overview: 'Notation is the universal language of cubing. Each letter represents a face: U (Up), D (Down), F (Front), B (Back), R (Right), L (Left).',
      steps: [
        'A single letter (e.g. R) means turn that face 90 degrees CLOCKWISE as if looking directly at that face.',
        'A letter with an apostrophe (e.g. R\') means turn COUNTER-CLOCKWISE 90 degrees.',
        'A letter followed by 2 (e.g. R2) means turn 180 degrees (two turns).',
        'Practice the famous "Sexy Move": R U R\' U\'. Performing it 6 times restores the cube!',
      ],
      tips: [
        'Remember that clockwise is always from the perspective of facing that particular face directly.',
      ],
      commonMistakes: [
        'Turning the B (Back) or D (Down) face in the wrong direction because you are looking at the front.',
      ],
    },
  },
  {
    id: 'white-cross',
    title: '3. The White Cross',
    titleHi: '3. सफेद क्रॉस (White Cross)',
    titleHinglish: '3. White Cross Banana',
    level: 'Beginner',
    stageNumber: 3,
    durationMin: 10,
    description: 'Solve the 4 white edge pieces around the white center while matching adjacent side centers.',
    keyAlgorithm: "F2",
    content: {
      overview: 'The white cross is the foundation of solving. You must align the 4 white edges so their secondary colors match the side center colors (Green, Red, Blue, Orange).',
      steps: [
        'Method A (Beginner Daisy): Put the 4 white edges around the Yellow center first to form a "daisy".',
        'Look at each petal: match its side color with the matching center, then turn that face twice (F2, R2, etc.) to bring it down to the White center.',
        'Check that you have a white cross on bottom and every edge matches its side center.',
      ],
      tips: [
        'Hold yellow on top while building the daisy, then send pieces down to white on bottom.',
      ],
      commonMistakes: [
        'Forming a white cross where the side edge colors don\'t match their centers (e.g. white-red edge next to green center).',
      ],
    },
  },
  {
    id: 'first-layer-corners',
    title: '4. First Layer Corners',
    titleHi: '4. पहली परत के कोने (First Layer Corners)',
    titleHinglish: '4. First Layer ke Corners Solve Karna',
    level: 'Beginner',
    stageNumber: 4,
    durationMin: 10,
    description: 'Insert the 4 bottom corners to complete the entire white face and first layer ring.',
    keyAlgorithm: "R U R' U'",
    content: {
      overview: 'We place the 4 white corner pieces into their correct bottom positions, completing the entire first layer.',
      steps: [
        'Keep White cross on BOTTOM (Yellow on Top).',
        'Find a corner in the top layer that contains White (e.g. White-Red-Green).',
        'Rotate the top layer until that corner is directly above where it belongs (between Red and Green centers).',
        'Apply the 4-move trigger (R U R\' U\') 1 to 5 times until the corner drops into place with white facing down.',
        'Repeat for all 4 corners.',
      ],
      tips: [
        'If a white corner is stuck on the bottom layer in the wrong position, do R U R\' U\' once to pop it into the top layer.',
      ],
      commonMistakes: [
        'Solving the white face with misplaced colors so the side colors don\'t form a solid T or ring.',
      ],
    },
  },
  {
    id: 'middle-layer-edges',
    title: '5. Second Layer Edges',
    titleHi: '5. मध्य परत (Second Layer Edges)',
    titleHinglish: '5. Second Layer ke Edges',
    level: 'Beginner',
    stageNumber: 5,
    durationMin: 12,
    description: 'Insert the 4 non-yellow edge pieces into the middle layer.',
    keyAlgorithm: "U R U' R' U' F' U F",
    content: {
      overview: 'We solve the middle layer by inserting the 4 edge pieces that do not have yellow on them.',
      steps: [
        'Find an edge in the top layer without any yellow (e.g. Green-Red).',
        'Align its front sticker with the matching center color to form a vertical "T".',
        'To insert to the RIGHT: U R U\' R\' U\' F\' U F.',
        'To insert to the LEFT: U\' L\' U L U F U\' F\'.',
        'Repeat for all 4 middle edges.',
      ],
      tips: [
        'Always turn the top layer away from the slot before performing the trigger.',
      ],
      commonMistakes: [
        'Inserting the edge piece flipped (colors reversed). If flipped, insert any dummy yellow edge to pop it out.',
      ],
    },
  },
  {
    id: 'yellow-cross',
    title: '6. The Yellow Cross',
    titleHi: '6. पीला क्रॉस (Yellow Cross)',
    titleHinglish: '6. Top Layer par Yellow Cross',
    level: 'Beginner',
    stageNumber: 6,
    durationMin: 8,
    description: 'Create a yellow cross on the top face using the F R U R\' U\' F\' algorithm.',
    keyAlgorithm: "F R U R' U' F'",
    content: {
      overview: 'Now we look at the top yellow face. Ignore corners for now; we want to orient all 4 yellow edges.',
      steps: [
        'You will see one of 3 patterns: A Dot, an "L" shape (angle), or a horizontal Line.',
        'If you have a Dot: Hold anywhere, do F R U R\' U\' F\'. It becomes an L shape.',
        'If you have an "L" shape: Put the L in the back-left corner (9 and 12 on a clock), do F R U R\' U\' F\'. It becomes a Line.',
        'If you have a horizontal Line: Hold it horizontally, do F R U R\' U\' F\'. You now have a Yellow Cross!',
      ],
      tips: [
        'Never hold the line vertically when performing the algorithm, or you will break the line.',
      ],
      commonMistakes: [
        'Forgetting the final F\' move, which corrupts the first two layers.',
      ],
    },
  },
  {
    id: 'yellow-corners-oll',
    title: '7. Orient Yellow Corners (Sune)',
    titleHi: '7. पीले कोनों को ओरिएंट करना',
    titleHinglish: '7. Yellow Corners ko Orient Karna (Sune)',
    level: 'Beginner',
    stageNumber: 7,
    durationMin: 8,
    description: 'Make the entire top yellow face solid using the Sune algorithm.',
    keyAlgorithm: "R U R' U R U2 R'",
    content: {
      overview: 'Turn all remaining yellow corner stickers facing UP so the entire top face becomes solid yellow.',
      steps: [
        'Look at how many yellow corners are already facing up.',
        'If 1 corner is yellow ("Fish" shape): Place the solved corner in the bottom-left of the top face.',
        'Apply Sune: R U R\' U R U2 R\'.',
        'If no corners or 2 corners are yellow: Place any yellow sticker facing left, and do Sune until you get the Fish shape.',
        'Your top face is now completely yellow!',
      ],
      tips: [
        'Sune is easy to memorize: Right up, Top left, Right down, Top left, Right up, Top twice, Right down.',
      ],
      commonMistakes: [
        'Positioning the fish head in the wrong corner before executing Sune.',
      ],
    },
  },
  {
    id: 'final-layer-pll',
    title: '8. Complete the Cube! (PLL)',
    titleHi: '8. अंतिम क्रमचय और क्यूब पूरा करें!',
    titleHinglish: '8. Cube ko Pura Solve Karna (Final PLL)',
    level: 'Beginner',
    stageNumber: 8,
    durationMin: 10,
    description: 'Permute the corners and edges to complete the entire Rubik\'s cube.',
    keyAlgorithm: "R U' R U R U R U' R' U' R2",
    content: {
      overview: 'We position the corners in their right places, then cycle the remaining edges to complete the solve.',
      steps: [
        'Look for two corners with the same color on one side ("Headlights").',
        'Put headlights in the BACK and apply T-Perm or A-Perm to solve all 4 corners.',
        'Now only 3 or 4 edges need cycling: Apply Ua-Perm: R U\' R U R U R U\' R\' U\' R2.',
        'CONGRATULATIONS! Your Rubik\'s Cube is 100% SOLVED!',
      ],
      tips: [
        'If no headlights exist, do the corner algorithm once from any angle to create headlights.',
      ],
      commonMistakes: [
        'Losing your grip orientation midway through the longer PLL sequence.',
      ],
    },
  },
];
