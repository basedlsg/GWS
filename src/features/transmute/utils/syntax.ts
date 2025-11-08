/**
 * Syntax Highlighting Utilities
 * Applies thematic styling to text based on content type
 */

import type { TransmuteTheme } from '../types';
import { THEMES, LANGUAGES } from '../constants';

/**
 * Apply syntax highlighting to text
 */
export function highlightText(text: string, language: string, theme: TransmuteTheme): string {
  const lines = text.split('\n');
  const languageInfo = LANGUAGES.find(l => l.id === language);

  return lines.map((line, index) => highlightLine(line, languageInfo?.keywords || [], theme, index + 1)).join('\n');
}

/**
 * Highlight a single line
 */
function highlightLine(line: string, keywords: string[], theme: TransmuteTheme, lineNumber: number): string {
  const themeConfig = THEMES[theme];

  if (!themeConfig) {
    return line;
  }

  // Line number prefix
  const lineNumPrefix = `<span class="line-number" style="color: ${themeConfig.secondaryColor}; opacity: 0.5; margin-right: 1em; user-select: none;">${lineNumber.toString().padStart(3, ' ')} │ </span>`;

  // Check for markdown headers
  if (line.startsWith('#')) {
    const headerMatch = line.match(/^(#+)\s+(.+)$/);
    if (headerMatch) {
      const hashes = headerMatch[1];
      const content = headerMatch[2];
      return `${lineNumPrefix}<span class="header" style="color: ${themeConfig.accentColor}; font-weight: bold; text-shadow: ${themeConfig.glowEffect || 'none'};">${hashes} ${content}</span>`;
    }
  }

  // Check for list items
  if (line.match(/^\s*[-*]\s/)) {
    const parts = line.split(/^(\s*[-*]\s)/);
    return `${lineNumPrefix}<span class="list-marker" style="color: ${themeConfig.accentColor};">${parts[1] || ''}</span><span style="color: ${themeConfig.textColor};">${parts[2] || ''}</span>`;
  }

  // Highlight keywords
  let highlighted = line;
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${escapeRegex(keyword)})\\b`, 'gi');
    highlighted = highlighted.replace(
      regex,
      `<span class="keyword" style="color: ${themeConfig.accentColor}; font-weight: 600; text-shadow: ${themeConfig.glowEffect || 'none'};">$1</span>`
    );
  });

  // Highlight quoted text
  highlighted = highlighted.replace(
    /"([^"]+)"/g,
    `<span class="string" style="color: ${themeConfig.secondaryColor};">"$1"</span>`
  );

  // Highlight numbers
  highlighted = highlighted.replace(
    /\b(\d+)\b/g,
    `<span class="number" style="color: ${themeConfig.secondaryColor};">$1</span>`
  );

  return `${lineNumPrefix}<span style="color: ${themeConfig.textColor};">${highlighted}</span>`;
}

/**
 * Escape regex special characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate CSS for a theme
 */
export function generateThemeCSS(theme: TransmuteTheme): string {
  const config = THEMES[theme];

  if (!config) {
    return '';
  }

  const scanlines = config.scanlineEffect
    ? `
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        to bottom,
        transparent 50%,
        rgba(0, 0, 0, 0.1) 50%
      );
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 1;
    }
  `
    : '';

  return `
    .transmute-preview {
      background-color: ${config.backgroundColor};
      color: ${config.textColor};
      font-family: ${config.fontFamily};
      border: 2px solid ${config.borderColor};
      border-radius: 8px;
      padding: 1.5rem;
      position: relative;
      overflow: auto;
      ${scanlines}
    }

    .transmute-preview pre {
      margin: 0;
      font-family: inherit;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.6;
      position: relative;
      z-index: 2;
    }

    .transmute-preview .line-number {
      color: ${config.secondaryColor};
      opacity: 0.5;
    }

    .transmute-preview .keyword {
      color: ${config.accentColor};
      font-weight: 600;
      text-shadow: ${config.glowEffect || 'none'};
    }

    .transmute-preview .header {
      color: ${config.accentColor};
      font-weight: bold;
      text-shadow: ${config.glowEffect || 'none'};
    }

    .transmute-preview .string {
      color: ${config.secondaryColor};
    }

    .transmute-preview .number {
      color: ${config.secondaryColor};
    }

    .transmute-preview .list-marker {
      color: ${config.accentColor};
    }
  `;
}

/**
 * Auto-detect language from text content
 */
export function detectLanguage(text: string): string {
  const lowerText = text.toLowerCase();

  for (const lang of LANGUAGES) {
    if (!lang.keywords) continue;

    const matchCount = lang.keywords.filter(keyword => lowerText.includes(keyword.toLowerCase())).length;

    // If 3+ keywords match, likely this language
    if (matchCount >= 3) {
      return lang.id;
    }
  }

  // Check for specific patterns
  if (lowerText.match(/^#+\s/m)) {
    return 'notes'; // Markdown-style headers
  }

  if (lowerText.match(/^[-*]\s/m)) {
    return 'goals'; // List items
  }

  return 'plaintext';
}
