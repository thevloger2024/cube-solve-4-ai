import { CubeState, FaceName, ColorName, countColors, FACES } from './CubeState';

export interface ValidationIssue {
  type: 'color_count' | 'center_mismatch' | 'duplicate_colors' | 'impossible_corner' | 'impossible_edge' | 'parity';
  message: string;
  hindiMessage: string;
  hinglishMessage: string;
  highlightedStickers?: { face: FaceName; index: number }[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  issues: ValidationIssue[];
}

// 8 physical corner locations and their corresponding face stickers
export const CORNERS: { name: string; stickers: [FaceName, number][] }[] = [
  { name: 'UFL', stickers: [['U', 6], ['F', 0], ['L', 2]] },
  { name: 'UFR', stickers: [['U', 8], ['F', 2], ['R', 0]] },
  { name: 'URB', stickers: [['U', 2], ['R', 2], ['B', 0]] },
  { name: 'UBL', stickers: [['U', 0], ['B', 2], ['L', 0]] },
  { name: 'DFL', stickers: [['D', 0], ['F', 6], ['L', 8]] },
  { name: 'DFR', stickers: [['D', 2], ['F', 8], ['R', 6]] },
  { name: 'DRB', stickers: [['D', 8], ['R', 8], ['B', 6]] },
  { name: 'DBL', stickers: [['D', 6], ['B', 8], ['L', 6]] },
];

// 12 physical edge locations and their corresponding face stickers
export const EDGES: { name: string; stickers: [FaceName, number][] }[] = [
  { name: 'UF', stickers: [['U', 7], ['F', 1]] },
  { name: 'UR', stickers: [['U', 5], ['R', 1]] },
  { name: 'UB', stickers: [['U', 1], ['B', 1]] },
  { name: 'UL', stickers: [['U', 3], ['L', 1]] },
  { name: 'DF', stickers: [['D', 1], ['F', 7]] },
  { name: 'DR', stickers: [['D', 5], ['R', 7]] },
  { name: 'DB', stickers: [['D', 7], ['B', 7]] },
  { name: 'DL', stickers: [['D', 3], ['L', 7]] },
  { name: 'FL', stickers: [['F', 3], ['L', 5]] },
  { name: 'FR', stickers: [['F', 5], ['R', 3]] },
  { name: 'BR', stickers: [['B', 3], ['R', 5]] },
  { name: 'BL', stickers: [['B', 5], ['L', 3]] },
];

const OPPOSITE_COLORS: Record<ColorName, ColorName> = {
  white: 'yellow',
  yellow: 'white',
  green: 'blue',
  blue: 'green',
  red: 'orange',
  orange: 'red',
};

/**
 * Validates the complete cube state
 */
export function validateCubeState(cube: CubeState): ValidationResult {
  const issues: ValidationIssue[] = [];

  // 1. Check Color Counts
  const counts = countColors(cube);
  const colorNames: ColorName[] = ['white', 'yellow', 'green', 'blue', 'red', 'orange'];
  for (const color of colorNames) {
    if (counts[color] !== 9) {
      const diff = counts[color] - 9;
      issues.push({
        type: 'color_count',
        message: `${color.charAt(0).toUpperCase() + color.slice(1)} appears ${counts[color]} times (needs exactly 9, ${diff > 0 ? `remove ${diff}` : `add ${-diff}`}).`,
        hindiMessage: `${color} रंग ${counts[color]} बार आया है (ठीक 9 होने चाहिए).`,
        hinglishMessage: `${color} color ${counts[color]} baar hai (exactly 9 hona chahiye).`,
      });
    }
  }

  // 2. Check Centers (ensure each center is unique and matches standard)
  const centers: Record<ColorName, number> = {
    white: 0,
    yellow: 0,
    green: 0,
    blue: 0,
    red: 0,
    orange: 0,
  };
  for (const f of FACES) {
    const centerColor = cube[f.name][4];
    centers[centerColor] = (centers[centerColor] || 0) + 1;
  }
  for (const [col, count] of Object.entries(centers)) {
    if (count !== 1) {
      issues.push({
        type: 'center_mismatch',
        message: `Center stickers must be 6 unique colors. "${col}" appears ${count} times as a center.`,
        hindiMessage: `सभी 6 केंद्र स्टिकर अलग रंग के होने चाहिए.`,
        hinglishMessage: `Sabhi 6 center stickers alag-alag color ke hone chahiye.`,
      });
    }
  }

  // 3. Check Corner Combinations
  const seenCorners = new Set<string>();
  for (const corner of CORNERS) {
    const [s1, s2, s3] = corner.stickers;
    const c1 = cube[s1[0]][s1[1]];
    const c2 = cube[s2[0]][s2[1]];
    const c3 = cube[s3[0]][s3[1]];

    const highlights = [
      { face: s1[0], index: s1[1] },
      { face: s2[0], index: s2[1] },
      { face: s3[0], index: s3[1] },
    ];

    // Check duplicate colors in same corner
    if (c1 === c2 || c1 === c3 || c2 === c3) {
      issues.push({
        type: 'duplicate_colors',
        message: `Invalid corner at ${corner.name}: piece has duplicate colors (${c1}, ${c2}, ${c3}).`,
        hindiMessage: `अमान्य कोना (${corner.name}): एक ही रंग दोहराया गया है.`,
        hinglishMessage: `Invalid corner piece (${corner.name}): same color repeat ho raha hai.`,
        highlightedStickers: highlights,
      });
      continue;
    }

    // Check opposite colors in same corner
    if (OPPOSITE_COLORS[c1] === c2 || OPPOSITE_COLORS[c1] === c3 || OPPOSITE_COLORS[c2] === c3) {
      issues.push({
        type: 'impossible_corner',
        message: `Invalid corner at ${corner.name}: opposite colors (${c1} & ${c2 === OPPOSITE_COLORS[c1] ? c2 : c3}) cannot be on the same corner.`,
        hindiMessage: `अमान्य कोना (${corner.name}): विपरीत रंग एक साथ नहीं हो सकते.`,
        hinglishMessage: `Invalid corner (${corner.name}): opposite colors ek saath nahi ho sakte.`,
        highlightedStickers: highlights,
      });
      continue;
    }

    const sortedKey = [c1, c2, c3].sort().join('-');
    if (seenCorners.has(sortedKey)) {
      issues.push({
        type: 'duplicate_colors',
        message: `Duplicate corner piece: two identical corners found (${c1}, ${c2}, ${c3}).`,
        hindiMessage: `एक ही कोना दो बार मौजूद है.`,
        hinglishMessage: `Duplicate corner piece mila (${c1}, ${c2}, ${c3}).`,
        highlightedStickers: highlights,
      });
    }
    seenCorners.add(sortedKey);
  }

  // 4. Check Edge Combinations
  const seenEdges = new Set<string>();
  for (const edge of EDGES) {
    const [s1, s2] = edge.stickers;
    const c1 = cube[s1[0]][s1[1]];
    const c2 = cube[s2[0]][s2[1]];

    const highlights = [
      { face: s1[0], index: s1[1] },
      { face: s2[0], index: s2[1] },
    ];

    if (c1 === c2) {
      issues.push({
        type: 'duplicate_colors',
        message: `Invalid edge at ${edge.name}: edge has duplicate color ${c1}.`,
        hindiMessage: `अमान्य किनारा (${edge.name}): एक ही रंग दोहराया गया है.`,
        hinglishMessage: `Invalid edge (${edge.name}): same color repeat ho raha hai.`,
        highlightedStickers: highlights,
      });
      continue;
    }

    if (OPPOSITE_COLORS[c1] === c2) {
      issues.push({
        type: 'impossible_edge',
        message: `Invalid edge at ${edge.name}: opposite colors ${c1} and ${c2} cannot share an edge.`,
        hindiMessage: `अमान्य किनारा (${edge.name}): ${c1} और ${c2} एक किनारे पर नहीं हो सकते.`,
        hinglishMessage: `Invalid edge (${edge.name}): opposite colors ek edge par nahi ho sakte.`,
        highlightedStickers: highlights,
      });
      continue;
    }

    const sortedKey = [c1, c2].sort().join('-');
    if (seenEdges.has(sortedKey)) {
      issues.push({
        type: 'duplicate_colors',
        message: `Duplicate edge piece: two identical edges found (${c1}, ${c2}).`,
        hindiMessage: `एक ही किनारा दो बार मौजूद है.`,
        hinglishMessage: `Duplicate edge piece mila (${c1}, ${c2}).`,
        highlightedStickers: highlights,
      });
    }
    seenEdges.add(sortedKey);
  }

  return {
    isValid: issues.length === 0,
    errors: issues.map(i => i.message),
    issues,
  };
}
