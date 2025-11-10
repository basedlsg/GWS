/**
 * Settings type definitions for The Great Work Suite
 */

/**
 * Theme options for the application
 */
export type Theme = 'light' | 'dark' | 'cyberpunk';

/**
 * Transmute-specific settings
 */
export interface TransmuteSettings {
  defaultTheme: 'cyberpunk' | 'matrix' | 'retro' | 'minimal';
  autoSave: boolean;
  fontSize: number;
}

/**
 * Distillation-specific settings
 */
export interface DistillationSettings {
  defaultPersona: 'strategic' | 'tactical' | 'creative' | 'philosophical';
  autoGenerateTasks: boolean;
  showProgressIndicator: boolean;
}

/**
 * Projection-specific settings
 */
export interface ProjectionSettings {
  defaultVoice?: string;
  speechRate: number;
  speechPitch: number;
  autoPlayResponses: boolean;
}

/**
 * Culmination-specific settings
 */
export interface CulminationSettings {
  showTimeline: boolean;
  includeAllFeatures: boolean;
  exportFormat: 'pdf' | 'markdown' | 'json';
}

/**
 * AI provider options
 */
export type AIProvider = 'groq' | 'gemini' | 'template';

/**
 * Global application settings
 */
export interface Settings {
  // Global settings
  geminiApiKey?: string;
  groqApiKey?: string;
  preferredAIProvider: AIProvider;
  theme: Theme;

  // Feature-specific settings
  transmute: TransmuteSettings;
  distillation: DistillationSettings;
  projection: ProjectionSettings;
  culmination: CulminationSettings;

  // Settings version for migrations
  version: number;
}

/**
 * Default settings values
 * Loads Groq API key from environment variable if available
 */
export const DEFAULT_SETTINGS: Settings = {
  geminiApiKey: undefined,
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || undefined,
  preferredAIProvider: import.meta.env.VITE_GROQ_API_KEY ? 'groq' : 'template',
  theme: 'dark',
  transmute: {
    defaultTheme: 'cyberpunk',
    autoSave: true,
    fontSize: 14,
  },
  distillation: {
    defaultPersona: 'strategic',
    autoGenerateTasks: true,
    showProgressIndicator: true,
  },
  projection: {
    defaultVoice: undefined,
    speechRate: 1.0,
    speechPitch: 1.0,
    autoPlayResponses: false,
  },
  culmination: {
    showTimeline: true,
    includeAllFeatures: true,
    exportFormat: 'markdown',
  },
  version: 1,
} as const;
