/**
 * useColorAnimation Hook
 * Manages animated random colors for text characters
 */

import { useState, useEffect, useCallback } from 'react';
import { getWeightedRandomColor } from '../utils/colorAnimation';

export function useColorAnimation(enabled: boolean, speed: number) {
  const [colorVersion, setColorVersion] = useState(0);

  // Force re-render to trigger new colors
  const updateColors = useCallback(() => {
    setColorVersion(prev => prev + 1);
  }, []);

  // Animation interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      updateColors();
    }, speed);

    return () => clearInterval(interval);
  }, [enabled, speed, updateColors]);

  // Generate color for a character based on current version
  const getColorForCharIndex = useCallback((_charIndex: number) => {
    if (!enabled) return undefined;

    // Colors change on timer (colorVersion) but are consistent within a render
    // _charIndex is reserved for future use (seeded randomness)
    return getWeightedRandomColor();
  }, [enabled, colorVersion]);

  return { getColorForCharIndex, updateColors };
}
