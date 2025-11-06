/**
 * Application-wide constants
 */

// localStorage namespace prefix
export const STORAGE_PREFIX = 'gws';

// localStorage keys
export const STORAGE_KEYS = {
  SETTINGS: `${STORAGE_PREFIX}:settings`,
  TRANSMUTE_SNIPPETS: `${STORAGE_PREFIX}:transmute:snippets`,
  DISTILLATION_TASKS: `${STORAGE_PREFIX}:distillation:tasks`,
  PROJECTION_SCENARIOS: `${STORAGE_PREFIX}:projection:scenarios`,
  CULMINATION_PORTFOLIOS: `${STORAGE_PREFIX}:culmination:portfolios`,
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  TRANSMUTE: '/transmute',
  DISTILLATION: '/distillation',
  PROJECTION: '/projection',
  CULMINATION: '/culmination',
  SETTINGS: '/settings',
} as const;

// Theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  CYBERPUNK: 'cyberpunk',
} as const;

// Storage limits (in bytes)
export const STORAGE_LIMITS = {
  WARNING_THRESHOLD: 5 * 1024 * 1024, // 5MB
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// App metadata
export const APP_INFO = {
  NAME: 'The Great Work Suite',
  VERSION: '1.0.0',
  DESCRIPTION: 'Four manifestation and productivity applications in one',
} as const;
