import { ColorName } from '../cube/CubeState';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSV {
  h: number; // 0-360
  s: number; // 0-1
  v: number; // 0-1
}

/**
 * Converts RGB [0-255] to HSV
 */
export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return { h, s, v };
}

/**
 * Classifies an RGB sample into one of the 6 standard Rubik's cube colors using HSV boundaries
 */
export function classifyColor(rgb: RGB): { color: ColorName; confidence: number } {
  const { r, g, b } = rgb;
  const { h, s, v } = rgbToHsv(r, g, b);

  // White detection: low saturation, moderate-to-high value, balanced RGB
  if (s < 0.22 && v > 0.40) {
    const balance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
    if (balance < 60) {
      return { color: 'white', confidence: Math.min(0.98, 1 - s * 2) };
    }
  }

  // Yellow: Hue 42° - 68°, high saturation & high brightness
  if (h >= 42 && h <= 68 && v > 0.35) {
    return { color: 'yellow', confidence: 0.92 };
  }

  // Orange: Hue 16° - 41°
  if (h >= 16 && h < 42 && v > 0.30) {
    return { color: 'orange', confidence: 0.90 };
  }

  // Red: Hue 340° - 360° or 0° - 15°
  if ((h >= 340 || h < 16) && v > 0.25) {
    return { color: 'red', confidence: 0.93 };
  }

  // Green: Hue 75° - 165°
  if (h >= 75 && h <= 165 && v > 0.25) {
    return { color: 'green', confidence: 0.94 };
  }

  // Blue: Hue 175° - 265°
  if (h >= 175 && h <= 265 && v > 0.25) {
    return { color: 'blue', confidence: 0.94 };
  }

  // Fallback using Euclidean RGB distance to standard reference colors
  const references: Record<ColorName, RGB> = {
    white: { r: 255, g: 255, b: 255 },
    yellow: { r: 255, g: 213, b: 0 },
    green: { r: 0, g: 155, b: 72 },
    blue: { r: 0, g: 70, b: 173 },
    red: { r: 183, g: 18, b: 52 },
    orange: { r: 255, g: 88, b: 0 },
  };

  let bestColor: ColorName = 'white';
  let minDistance = Infinity;

  for (const [col, ref] of Object.entries(references) as [ColorName, RGB][]) {
    const dist = Math.sqrt(
      Math.pow(r - ref.r, 2) + Math.pow(g - ref.g, 2) + Math.pow(b - ref.b, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      bestColor = col;
    }
  }

  return { color: bestColor, confidence: Math.max(0.5, 1 - minDistance / 441) };
}
