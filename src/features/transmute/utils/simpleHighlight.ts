/**
 * Simple Syntax Highlighter with Randomization
 * Creates beautiful, varied code with random indentation and colors
 */

export type CodeLanguage = 'javascript' | 'python' | 'rust' | 'go' | 'cpp' | 'ruby' | 'java';

export interface Theme {
  name: string;
  background: string;
  textColor: string;
  keyword: string;
  string: string;
  number: string;
  comment: string;
}

export const MATRIX_THEME: Theme = {
  name: 'matrix-green',
  background: '#000000',
  textColor: '#AAAAAA',      // Default text: light gray
  keyword: '#00FF00',         // Keywords: bright green
  string: '#00FFFF',          // Strings: cyan
  number: '#FFFF00',          // Numbers: yellow
  comment: '#666666',         // Comments: dark gray
};

// Get random indentation (0-4 levels)
function getRandomIndent(): string {
  const levels = Math.floor(Math.random() * 5);
  return '  '.repeat(levels);
}

/**
 * Keywords for syntax highlighting
 */
const KEYWORDS: Record<CodeLanguage, string[]> = {
  javascript: ['const', 'let', 'var', 'function', 'class', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'constructor', 'console', 'log', 'async', 'await'],
  python: ['def', 'class', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'self', 'print', 'True', 'False', 'None', 'async', 'await'],
  rust: ['let', 'mut', 'fn', 'impl', 'struct', 'enum', 'pub', 'use', 'return', 'if', 'else', 'for', 'while', 'println!', 'vec!'],
  go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range', 'fmt', 'Println', 'package'],
  cpp: ['auto', 'class', 'public', 'private', 'return', 'if', 'else', 'for', 'while', 'std', 'cout', 'endl', 'namespace', 'using'],
  ruby: ['def', 'class', 'end', 'return', 'if', 'else', 'for', 'while', 'puts', 'true', 'false', 'nil', 'require'],
  java: ['public', 'private', 'class', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'System', 'println'],
};

/**
 * Apply syntax highlighting to code text with varied colors
 * Uses placeholder technique to avoid regex conflicts
 */
export function highlightCode(code: string, language: CodeLanguage, theme: Theme): string {
  let highlighted = code;

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Store protected regions with placeholders
  const protectedRegions: string[] = [];
  let placeholderIndex = 0;

  // Protect comments FIRST
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, (match) => {
    const placeholder = `__COMMENT_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.comment}; font-style: italic;">${match}</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/#(.*?)$/gm, (match) => {
    const placeholder = `__COMMENT_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.comment}; font-style: italic;">${match}</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Protect strings
  highlighted = highlighted.replace(/"([^"]*)"/g, (_match, content) => {
    const placeholder = `__STRING_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">"${content}"</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/'([^']*)'/g, (_match, content) => {
    const placeholder = `__STRING_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">'${content}'</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Highlight keywords
  const keywords = KEYWORDS[language] || [];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword}; font-weight: 700;">$1</span>`);
  });

  // Highlight function names (before parentheses)
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(\()/g, `<span style="color: #FF00FF; font-weight: 600;">$1</span>$2`);

  // Highlight variable names (before equals)
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(=)/g, `<span style="color: #00DDFF;">$1</span>$2`);

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, `<span style="color: ${theme.number};">$1</span>`);

  // Highlight operators
  highlighted = highlighted.replace(/([+\-*/%<>!&|]+)/g, `<span style="color: #FF8800;">$1</span>`);

  // Highlight punctuation
  highlighted = highlighted.replace(/([{}[\]();,.])/g, `<span style="color: #999999;">$1</span>`);

  // Restore protected regions
  protectedRegions.forEach((region, index) => {
    const commentPlaceholder = `__COMMENT_${index}__`;
    const stringPlaceholder = `__STRING_${index}__`;
    highlighted = highlighted.replace(commentPlaceholder, region);
    highlighted = highlighted.replace(stringPlaceholder, region);
  });

  return highlighted;
}

/**
 * Transform plain text to beautiful, varied code-like structure
 * Each line gets random treatment - variables, functions, objects, etc.
 */
export function textToCode(text: string, language: CodeLanguage): string {
  if (!text.trim()) {
    return '// Start typing...';
  }

  const lines = text.split('\n');
  const codeLines: string[] = [];

  // Code patterns to randomly choose from
  const patterns = [
    (text: string, lang: CodeLanguage) => {
      // Variable declaration
      const varKeyword = lang === 'python' ? '' : lang === 'rust' ? 'let ' : lang === 'go' ? 'var ' : 'const ';
      const varName = (text.split(' ')[0] || 'var').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `${varKeyword}${varName} = "${text}";`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Function call
      const words = text.split(' ').filter(w => w.length > 0);
      const funcName = (words[0] || 'func').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `${funcName}("${text}");`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Object property
      const key = (text.split(' ')[0] || 'key').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `${key}: "${text}",`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Array element
      return `"${text}",`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Method call with chaining
      const words = text.split(' ').filter(w => w.length > 0);
      const method = (words[0] || 'method').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `.${method}("${text}")`;
    },
    (text: string, lang: CodeLanguage) => {
      // Comment (occasionally)
      const comment = lang === 'python' || lang === 'ruby' ? '#' : '//';
      return `${comment} ${text}`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Return statement
      return `return "${text}";`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Conditional
      const words = text.split(' ').filter(w => w.length > 0);
      const condition = (words[0] || 'condition').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `if (${condition}) { // ${text}`;
    },
  ];

  let lastPatternIndex = -1;

  lines.forEach((line, index) => {
    if (!line.trim()) {
      codeLines.push('');
      return;
    }

    // Random indent
    const indent = getRandomIndent();

    // Random pattern (avoid repeating same pattern twice in a row)
    let patternIndex = Math.floor(Math.random() * patterns.length);
    if (patternIndex === lastPatternIndex && patterns.length > 1) {
      patternIndex = (patternIndex + 1) % patterns.length;
    }
    lastPatternIndex = patternIndex;

    const pattern = patterns[patternIndex];
    if (!pattern) {
      codeLines.push(`${indent}${line}`);
      return;
    }
    const codeLine = pattern(line, language);

    codeLines.push(`${indent}${codeLine}`);

    // Add spacing between code blocks (every 2-3 lines)
    if (index > 0 && Math.random() > 0.6) {
      codeLines.push('');
    }
  });

  return codeLines.join('\n');
}
