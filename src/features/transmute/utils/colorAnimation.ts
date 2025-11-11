/**
 * Weighted Random Color Animation System
 * Generates and animates colors with weighted distribution
 */

import { COLOR_WEIGHTS } from '../types';

/**
 * Select a color based on weighted random distribution
 */
export function getWeightedRandomColor(): string {
  const totalWeight = COLOR_WEIGHTS.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (const { color, weight } of COLOR_WEIGHTS) {
    random -= weight;
    if (random <= 0) {
      return color;
    }
  }

  // Fallback to last color or cyan
  return COLOR_WEIGHTS[COLOR_WEIGHTS.length - 1]?.color || '#00FFFF';
}

/**
 * Generate a random color for each character in text
 */
export function generateColoredText(text: string): Array<{ char: string; color: string }> {
  return text.split('').map(char => ({
    char,
    color: getWeightedRandomColor(),
  }));
}

/**
 * Create a color map for animating text
 * Returns a map of character indices to colors
 */
export function createColorMap(textLength: number): Map<number, string> {
  const colorMap = new Map<number, string>();

  for (let i = 0; i < textLength; i++) {
    colorMap.set(i, getWeightedRandomColor());
  }

  return colorMap;
}

/**
 * Update color map with new random colors
 * Used for animation frames
 */
export function updateColorMap(colorMap: Map<number, string>): Map<number, string> {
  const newMap = new Map<number, string>();

  colorMap.forEach((_, index) => {
    newMap.set(index, getWeightedRandomColor());
  });

  return newMap;
}

/**
 * Get random animation interval (3-5 seconds)
 */
export function getRandomAnimationInterval(): number {
  return 3000 + Math.random() * 2000; // 3000-5000ms
}
