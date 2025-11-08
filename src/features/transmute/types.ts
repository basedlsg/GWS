/**
 * Transmute Feature Type Definitions
 * Defines types for code styling, theming, and transmutation storage
 */

/**
 * Available transmutation themes
 */
export type TransmuteTheme = 'cyberpunk' | 'matrix' | 'retro' | 'minimal';

/**
 * Export format options
 */
export type ExportFormat = 'html' | 'png' | 'markdown';

/**
 * A saved transmutation
 */
export interface Transmutation {
  id: string;
  title: string;
  originalText: string;
  theme: TransmuteTheme;
  language: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Theme configuration for styling
 */
export interface ThemeConfig {
  name: string;
  displayName: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  secondaryColor: string;
  borderColor: string;
  fontFamily: string;
  glowEffect?: string;
  scanlineEffect?: boolean;
}

/**
 * Language configuration for syntax highlighting
 */
export interface LanguageInfo {
  id: string;
  name: string;
  extensions: string[];
  keywords?: string[];
  operators?: string[];
  builtins?: string[];
}
