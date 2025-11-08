/**
 * Syntax Highlighting Utilities
 * Applies thematic styling to text based on content type
 */

import type { TransmuteTheme } from '../types';
import { THEMES, LANGUAGES } from '../constants';

/**
 * Transform plain text into code-like syntax with styling
 */
export function highlightText(text: string, language: string, theme: TransmuteTheme): string {
  console.log('🎨 [highlightText] Called with:');
  console.log('  - text:', text.substring(0, 100) + '...');
  console.log('  - language:', language);
  console.log('  - theme:', theme);

  const themeConfig = THEMES[theme];
  if (!themeConfig) {
    console.warn('⚠️ No theme config found');
    return text;
  }

  const lines = text.split('\n');
  console.log('  - number of lines:', lines.length);

  const result = lines.map((line, index) => transformLineToCode(line, theme, themeConfig, index + 1)).join('\n');

  console.log('  - result (first 300 chars):', result.substring(0, 300));

  return result;
}

/**
 * Transform a line of plain text into code-like syntax
 */
function transformLineToCode(line: string, _theme: TransmuteTheme, themeConfig: any, lineNumber: number): string {
  // Line number prefix
  const lineNumPrefix = `<span class="line-number" style="color: ${themeConfig.secondaryColor}; opacity: 0.5; margin-right: 1em; user-select: none;">${lineNumber.toString().padStart(3, ' ')} │ </span>`;

  // Empty lines
  if (!line.trim()) {
    return lineNumPrefix;
  }

  // Check if line starts with # (header) - treat as comment
  if (line.trim().startsWith('#')) {
    const headerText = line.trim().substring(1).trim();
    return `${lineNumPrefix}<span style="color: ${themeConfig.secondaryColor}; opacity: 0.7;">// ${headerText}</span>`;
  }

  // Check if line starts with - or * (bullet point) - transform to array item or object property
  if (line.trim().match(/^[-*]\s+/)) {
    const content = line.trim().replace(/^[-*]\s+/, '');
    const patterns = [
      // Array item
      `<span style="color: ${themeConfig.accentColor};">  </span><span style="color: ${themeConfig.secondaryColor};">"${content}"</span><span style="color: ${themeConfig.textColor};">,</span>`,
      // Object property
      `<span style="color: ${themeConfig.accentColor};">  ${makeVarName(content)}</span><span style="color: ${themeConfig.textColor};">: </span><span style="color: ${themeConfig.secondaryColor};">"${content}"</span><span style="color: ${themeConfig.textColor};">,</span>`,
    ];
    return lineNumPrefix + patterns[lineNumber % 2];
  }

  // Regular text - transform into various code patterns
  const patterns = [
    // Const declaration
    () => {
      const varName = makeVarName(line);
      return `<span style="color: ${themeConfig.accentColor}; font-weight: 600;">const</span> <span style="color: ${themeConfig.textColor};">${varName}</span> <span style="color: ${themeConfig.accentColor};">=</span> <span style="color: ${themeConfig.secondaryColor};">"${line.trim()}"</span><span style="color: ${themeConfig.textColor};">;</span>`;
    },
    // Function call
    () => {
      const funcName = makeVarName(line);
      return `<span style="color: ${themeConfig.accentColor};">${funcName}</span><span style="color: ${themeConfig.textColor};">(</span><span style="color: ${themeConfig.secondaryColor};">"${line.trim()}"</span><span style="color: ${themeConfig.textColor};">);</span>`;
    },
    // Object property
    () => {
      const key = makeVarName(line);
      return `<span style="color: ${themeConfig.textColor};">{</span> <span style="color: ${themeConfig.accentColor};">${key}</span><span style="color: ${themeConfig.textColor};">:</span> <span style="color: ${themeConfig.secondaryColor};">"${line.trim()}"</span> <span style="color: ${themeConfig.textColor};">}</span>`;
    },
    // Arrow function
    () => {
      const param = makeVarName(line).substring(0, 8);
      return `<span style="color: ${themeConfig.textColor};">(</span><span style="color: ${themeConfig.accentColor};">${param}</span><span style="color: ${themeConfig.textColor};">) </span><span style="color: ${themeConfig.accentColor}; font-weight: 600;">=></span> <span style="color: ${themeConfig.secondaryColor};">"${line.trim()}"</span>`;
    },
    // Return statement
    () => {
      return `<span style="color: ${themeConfig.accentColor}; font-weight: 600;">return</span> <span style="color: ${themeConfig.secondaryColor};">"${line.trim()}"</span><span style="color: ${themeConfig.textColor};">;</span>`;
    },
  ];

  // Use line number to deterministically pick a pattern (so same line always gets same style)
  const patternIndex = lineNumber % patterns.length;
  const selectedPattern = patterns[patternIndex];
  const codeLine = selectedPattern ? selectedPattern() : line;

  return lineNumPrefix + codeLine;
}

/**
 * Convert text to a variable/function name
 */
function makeVarName(text: string): string {
  // Take first few words, remove special chars, camelCase
  const words = text.trim().toLowerCase().split(/\s+/).slice(0, 3);
  if (words.length === 0) return 'value';

  const cleaned = words.map((word, i) => {
    const clean = word.replace(/[^a-z0-9]/g, '');
    if (i === 0) return clean;
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }).filter(w => w.length > 0);

  return cleaned.join('') || 'value';
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
