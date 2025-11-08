/**
 * Transmute Feature Constants
 * Theme configurations, language definitions, and storage keys
 */

import type { ThemeConfig, LanguageInfo } from './types';

/**
 * localStorage key for saved transmutations
 */
export const TRANSMUTATIONS_STORAGE_KEY = 'gws:transmute:saved';

/**
 * localStorage key for current draft
 */
export const DRAFT_STORAGE_KEY = 'gws:transmute:draft';

/**
 * Available transmutation themes with styling
 */
export const THEMES: Record<string, ThemeConfig> = {
  cyberpunk: {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    backgroundColor: '#0a0a0f',
    textColor: '#00ffff',
    accentColor: '#ff00ff',
    secondaryColor: '#00ff00',
    borderColor: '#00ffff',
    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, "Courier New", monospace',
    glowEffect: '0 0 10px rgba(0, 255, 255, 0.5)',
    scanlineEffect: true,
  },
  matrix: {
    name: 'matrix',
    displayName: 'Matrix',
    backgroundColor: '#000000',
    textColor: '#00ff00',
    accentColor: '#00ff00',
    secondaryColor: '#003300',
    borderColor: '#00ff00',
    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, "Courier New", monospace',
    glowEffect: '0 0 8px rgba(0, 255, 0, 0.6)',
    scanlineEffect: true,
  },
  retro: {
    name: 'retro',
    displayName: 'Retro Terminal',
    backgroundColor: '#1a1a1a',
    textColor: '#ffb000',
    accentColor: '#ff6b00',
    secondaryColor: '#ffdd00',
    borderColor: '#ffb000',
    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, "Courier New", monospace',
    glowEffect: '0 0 6px rgba(255, 176, 0, 0.4)',
  },
  minimal: {
    name: 'minimal',
    displayName: 'Minimal',
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#3b82f6',
    secondaryColor: '#6366f1',
    borderColor: '#e5e7eb',
    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, "Courier New", monospace',
  },
};

/**
 * Supported "languages" for text categorization
 */
export const LANGUAGES: LanguageInfo[] = [
  {
    id: 'journal',
    name: 'Journal Entry',
    extensions: ['.journal', '.diary'],
    keywords: ['today', 'yesterday', 'tomorrow', 'feeling', 'grateful', 'learned'],
  },
  {
    id: 'goals',
    name: 'Goals & Vision',
    extensions: ['.goals', '.vision'],
    keywords: ['goal', 'achieve', 'accomplish', 'vision', 'dream', 'aspire', 'plan'],
  },
  {
    id: 'affirmations',
    name: 'Affirmations',
    extensions: ['.affirm'],
    keywords: ['I am', 'I will', 'I can', 'I have', 'I deserve', 'I choose'],
  },
  {
    id: 'notes',
    name: 'Notes',
    extensions: ['.notes', '.txt'],
    keywords: ['note', 'remember', 'important', 'idea'],
  },
  {
    id: 'reflection',
    name: 'Reflection',
    extensions: ['.reflection'],
    keywords: ['reflect', 'realize', 'understand', 'learn', 'grow', 'change'],
  },
  {
    id: 'manifesto',
    name: 'Manifesto',
    extensions: ['.manifesto'],
    keywords: ['believe', 'stand for', 'commit', 'promise', 'declare'],
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    extensions: ['.gratitude', '.thanks'],
    keywords: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate'],
  },
  {
    id: 'plaintext',
    name: 'Plain Text',
    extensions: ['.txt'],
  },
];

/**
 * Default text for new transmutation
 */
export const DEFAULT_TEXT = `# My Personal Manifesto

I am committed to growth.
I choose to see challenges as opportunities.
I will take action toward my goals every day.

Today's Priorities:
- Focus on what I can control
- Practice gratitude
- Learn something new
- Help someone else

I am worthy of success and happiness.`;

/**
 * Maximum number of saved transmutations
 */
export const MAX_SAVED_TRANSMUTATIONS = 50;
