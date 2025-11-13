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

  // Code patterns to randomly choose from (varied to use different syntax elements)
  const patterns = [
    (text: string, lang: CodeLanguage) => {
      // Variable declaration with varied syntax
      const varKeyword = lang === 'python' ? '' : lang === 'rust' ? 'let ' : lang === 'go' ? 'var ' : 'const ';
      const varName = (text.split(' ')[0] || 'var').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const value = Math.random() > 0.5 ? `"${text}"` : Math.floor(Math.random() * 100);
      return `${varKeyword}${varName} = ${value};`;
    },
    (text: string, lang: CodeLanguage) => {
      // Function declaration
      const funcName = (text.split(' ')[0] || 'func').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const keyword = lang === 'python' ? 'def ' : lang === 'rust' ? 'fn ' : lang === 'go' ? 'func ' : 'function ';
      return `${keyword}${funcName}() { return "${text}"; }`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Function call with multiple params
      const words = text.split(' ').filter(w => w.length > 0);
      const funcName = (words[0] || 'func').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const param1 = Math.floor(Math.random() * 50);
      return `${funcName}("${text}", ${param1});`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Object with properties
      const key = (text.split(' ')[0] || 'key').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `{ ${key}: "${text}", value: ${Math.floor(Math.random() * 100)} }`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Array with mixed types
      return `["${text}", ${Math.floor(Math.random() * 50)}, true]`;
    },
    (text: string, lang: CodeLanguage) => {
      // Conditional with operators
      const words = text.split(' ').filter(w => w.length > 0);
      const varName = (words[0] || 'value').toLowerCase().replace(/[^a-z0-9]/g, '_');
      const keyword = lang === 'python' ? 'if' : 'if';
      const num = Math.floor(Math.random() * 20);
      return `${keyword} (${varName} > ${num}) { return "${text}"; }`;
    },
    (text: string, lang: CodeLanguage) => {
      // For loop
      const keyword = lang === 'python' ? 'for' : 'for';
      return `${keyword} (let i = 0; i < 10; i++) { // ${text}`;
    },
    (text: string, lang: CodeLanguage) => {
      // Comment
      const comment = lang === 'python' || lang === 'ruby' ? '#' : '//';
      return `${comment} ${text}`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Return with operations
      const num1 = Math.floor(Math.random() * 30);
      const num2 = Math.floor(Math.random() * 30);
      return `return ${num1} + ${num2}; // ${text}`;
    },
    (text: string, _lang: CodeLanguage) => {
      // Class method
      const method = (text.split(' ')[0] || 'method').toLowerCase().replace(/[^a-z0-9]/g, '_');
      return `class.${method}("${text}");`;
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
