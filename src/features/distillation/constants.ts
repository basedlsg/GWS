/**
 * Distillation Feature Constants
 * Persona descriptions, storage keys, and default values
 */

import type { Persona } from '@/shared/types/api';

/**
 * localStorage key for distillation sessions
 */
export const SESSIONS_STORAGE_KEY = 'gws:distillation:sessions';

/**
 * localStorage key for active session ID
 */
export const ACTIVE_SESSION_KEY = 'gws:distillation:activeSession';

/**
 * Maximum number of saved sessions
 */
export const MAX_SAVED_SESSIONS = 30;

/**
 * Persona descriptions for UI
 */
export const PERSONA_INFO: Record<Persona, { name: string; description: string; icon: string }> = {
  strategic: {
    name: 'Strategic',
    description: 'Big-picture thinker. Creates comprehensive plans with long-term vision and clear milestones.',
    icon: '🎯',
  },
  tactical: {
    name: 'Tactical',
    description: 'Action-oriented and practical. Focuses on immediate steps and concrete actions to get started quickly.',
    icon: '⚡',
  },
  creative: {
    name: 'Creative',
    description: 'Innovative and exploratory. Generates diverse approaches and encourages experimentation.',
    icon: '🎨',
  },
  philosophical: {
    name: 'Philosophical',
    description: 'Reflective and thorough. Emphasizes understanding the why before the how, with thoughtful approaches.',
    icon: '🤔',
  },
};

/**
 * Default goal examples for inspiration
 */
export const EXAMPLE_GOALS = [
  'Learn to play guitar',
  'Build a successful online business',
  'Get in the best shape of my life',
  'Write and publish a book',
  'Master a new programming language',
  'Develop better public speaking skills',
  'Create a passive income stream',
  'Learn a foreign language fluently',
  'Launch a podcast',
  'Build a professional network',
];

/**
 * Priority colors for UI
 */
export const PRIORITY_COLORS = {
  high: 'text-red-600 dark:text-red-400',
  medium: 'text-yellow-600 dark:text-yellow-400',
  low: 'text-blue-600 dark:text-blue-400',
} as const;

/**
 * Priority labels
 */
export const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
} as const;

/**
 * Status colors for UI
 */
export const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
} as const;

/**
 * Status labels
 */
export const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
} as const;
