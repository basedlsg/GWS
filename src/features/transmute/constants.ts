/**
 * Transmute Feature Constants - Minimal
 * Just the essentials for the simple editor
 */

import type { Theme, CodeLanguage } from './types';

/**
 * localStorage keys
 */
export const STORAGE_KEY = 'gws:transmute:content';

/**
 * Matrix Green Theme (the only theme we need)
 */
export const MATRIX_THEME: Theme = {
  name: 'matrix-green',
  background: '#000000',
  textColor: '#00FF00',
  keyword: '#00FF00',
  string: '#00CC00',
  number: '#00FF88',
  comment: '#008800',
};

/**
 * Programming language metadata
 */
export const LANGUAGES: Record<CodeLanguage, { name: string; extension: string }> = {
  javascript: { name: 'JavaScript', extension: '.js' },
  python: { name: 'Python', extension: '.py' },
  rust: { name: 'Rust', extension: '.rs' },
  go: { name: 'Go', extension: '.go' },
  cpp: { name: 'C++', extension: '.cpp' },
  ruby: { name: 'Ruby', extension: '.rb' },
  java: { name: 'Java', extension: '.java' },
};
