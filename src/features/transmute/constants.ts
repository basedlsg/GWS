/**
 * Transmute Feature Constants
 * Theme configurations, language definitions, and storage keys
 */

import type { CodeTheme, CodeLanguage } from './types';

/**
 * localStorage keys
 */
export const DOCUMENTS_STORAGE_KEY = 'gws:transmute:documents';
export const DOCUMENTS_META_STORAGE_KEY = 'gws:transmute:meta';
export const CURRENT_DOC_KEY = 'gws:transmute:current';
export const SETTINGS_STORAGE_KEY = 'gws:transmute:settings';

/**
 * Code themes with cyberpunk aesthetic
 */
export const CODE_THEMES: Record<string, CodeTheme> = {
  'matrix-green': {
    name: 'matrix-green',
    background: '#000000',
    textColor: '#00FF00',
    keyword: '#00FF00',
    string: '#00CC00',
    number: '#00FF88',
    comment: '#008800',
    function: '#00FF00',
    variable: '#00CC00',
    className: '#00FFAA',
    operator: '#00FF00',
  },
  'neon-purple': {
    name: 'neon-purple',
    background: '#0a0a0f',
    textColor: '#E040FB',
    keyword: '#FF00FF',
    string: '#BA68C8',
    number: '#F48FB1',
    comment: '#7B1FA2',
    function: '#FF00FF',
    variable: '#E040FB',
    className: '#FF80FF',
    operator: '#E040FB',
  },
  'tokyo-nights': {
    name: 'tokyo-nights',
    background: '#1a1b26',
    textColor: '#7dcfff',
    keyword: '#bb9af7',
    string: '#9ece6a',
    number: '#ff9e64',
    comment: '#565f89',
    function: '#7aa2f7',
    variable: '#c0caf5',
    className: '#2ac3de',
    operator: '#89ddff',
  },
  'synthwave': {
    name: 'synthwave',
    background: '#2b213a',
    textColor: '#f92aad',
    keyword: '#fede5d',
    string: '#72f1b8',
    number: '#ff8b39',
    comment: '#848bbd',
    function: '#f97e72',
    variable: '#f92aad',
    className: '#fede5d',
    operator: '#ff8b39',
  },
  'hacker-terminal': {
    name: 'hacker-terminal',
    background: '#1c1c1c',
    textColor: '#FFB86C',
    keyword: '#FF5555',
    string: '#F1FA8C',
    number: '#BD93F9',
    comment: '#6272A4',
    function: '#50FA7B',
    variable: '#FFB86C',
    className: '#8BE9FD',
    operator: '#FF79C6',
  },
};

/**
 * Programming language patterns for code transformation
 */
export const CODE_LANGUAGES: Record<CodeLanguage, { name: string; extension: string }> = {
  javascript: { name: 'JavaScript', extension: '.js' },
  python: { name: 'Python', extension: '.py' },
  rust: { name: 'Rust', extension: '.rs' },
  go: { name: 'Go', extension: '.go' },
  cpp: { name: 'C++', extension: '.cpp' },
  ruby: { name: 'Ruby', extension: '.rb' },
  java: { name: 'Java', extension: '.java' },
};

/**
 * Font family options
 */
export const FONT_FAMILIES = [
  { name: 'Monospace', value: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace' },
  { name: 'Sans Serif', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { name: 'Courier', value: '"Courier New", Courier, monospace' },
  { name: 'Console', value: 'Consolas, "Liberation Mono", monospace' },
];

/**
 * Font size options (in pixels)
 */
export const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24];

/**
 * Default editor settings
 */
export const DEFAULT_SETTINGS = {
  fontSize: 16,
  fontFamily: FONT_FAMILIES[0]?.value || 'monospace',
  showRandomColors: true,
  colorAnimationSpeed: 4000, // 4 seconds
  codeLanguage: 'javascript' as CodeLanguage,
  codeTheme: 'matrix-green',
};

/**
 * Default empty document
 */
export const DEFAULT_DOCUMENT_CONTENT: Array<{ type: 'heading-1' | 'paragraph'; children: Array<{ text: string }> }> = [
  {
    type: 'heading-1' as const,
    children: [{ text: 'Untitled Document' }],
  },
  {
    type: 'paragraph' as const,
    children: [{ text: 'Start writing...' }],
  },
];

/**
 * Pagination settings
 */
export const DOCUMENTS_PER_PAGE = 20;

/**
 * Auto-save debounce time (milliseconds)
 */
export const AUTOSAVE_DELAY = 2000;

/**
 * Code transformation debounce time (milliseconds)
 */
export const TRANSFORM_DELAY = 100;
