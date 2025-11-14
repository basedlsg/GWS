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
  textColor: '#00FFAA',       // Default text: cyan-green (vibrant fallback)
  keyword: '#00FF00',         // Keywords: bright green
  string: '#FF00FF',          // Strings: magenta
  number: '#FFFF00',          // Numbers: yellow
  comment: '#666666',         // Comments: dark gray
};

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
 * Colors EVERYTHING - no grey text!
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
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string}; font-weight: 500;">"${content}"</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/'([^']*)'/g, (_match, content) => {
    const placeholder = `__STRING_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string}; font-weight: 500;">'${content}'</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Highlight numbers BEFORE keywords (so they don't get caught by word boundaries)
  highlighted = highlighted.replace(/\b(\d+)\b/g, `<span style="color: ${theme.number}; font-weight: 600;">$1</span>`);

  // Highlight keywords
  const keywords = KEYWORDS[language] || [];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword}; font-weight: 700;">$1</span>`);
  });

  // Highlight function names (before parentheses) - CYAN
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(\()/g, `<span style="color: #00FFFF; font-weight: 600;">$1</span>$2`);

  // Highlight variable names (before equals) - ORANGE
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(=)/g, `<span style="color: #FF8800; font-weight: 500;">$1</span>$2`);

  // Highlight property access (after dot) - PINK
  highlighted = highlighted.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g, `.<span style="color: #FF69B4; font-weight: 500;">$1</span>`);

  // Highlight operators - RED/ORANGE
  highlighted = highlighted.replace(/([+\-*/%<>!&|]+)/g, `<span style="color: #FF4444;">$1</span>`);

  // Highlight equals sign specifically - BRIGHT ORANGE
  highlighted = highlighted.replace(/(=)/g, `<span style="color: #FF8800;">$1</span>`);

  // Highlight punctuation - LIGHT PURPLE
  highlighted = highlighted.replace(/([{}[\]();,.])/g, `<span style="color: #AA88FF;">$1</span>`);

  // COLOR ALL REMAINING IDENTIFIERS that haven't been colored yet
  // This ensures NO grey text remains
  const colorPalette = ['#00FFAA', '#00DDFF', '#FFAA00', '#FF66FF', '#66FFFF', '#AAFF00'];
  let colorIndex = 0;

  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
    // Skip if already wrapped in span
    if (match.includes('span') || match.includes('style')) {
      return match;
    }
    const color = colorPalette[colorIndex % colorPalette.length]!;
    colorIndex++;
    return `<span style="color: ${color};">${match}</span>`;
  });

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

  // Pool of realistic variable/function names for variety
  const VAR_NAMES = ['data', 'result', 'value', 'item', 'config', 'options', 'state', 'content', 'element', 'response'];
  const FUNC_NAMES = ['process', 'handle', 'update', 'fetch', 'render', 'validate', 'transform', 'calculate', 'initialize', 'execute'];

  // Simple hash for deterministic selection
  const hashCode = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  // Code patterns to randomly choose from (varied to use different syntax elements)
  const patterns = [
    (text: string, lang: CodeLanguage, lineIndex: number) => {
      // Variable declaration with varied syntax
      const varKeyword = lang === 'python' ? '' : lang === 'rust' ? 'let ' : lang === 'go' ? 'var ' : 'const ';
      const varName = VAR_NAMES[hashCode(text + lineIndex) % VAR_NAMES.length]!;
      const value = (hashCode(text) % 2 === 0) ? `"${text}"` : Math.floor(hashCode(text) % 100);
      return `${varKeyword}${varName} = ${value};`;
    },
    (text: string, lang: CodeLanguage, lineIndex: number) => {
      // Function declaration
      const funcName = FUNC_NAMES[hashCode(text + lineIndex) % FUNC_NAMES.length]!;
      const keyword = lang === 'python' ? 'def ' : lang === 'rust' ? 'fn ' : lang === 'go' ? 'func ' : 'function ';
      return `${keyword}${funcName}() { return "${text}"; }`;
    },
    (text: string, _lang: CodeLanguage, lineIndex: number) => {
      // Function call with multiple params
      const funcName = FUNC_NAMES[hashCode(text + lineIndex) % FUNC_NAMES.length]!;
      const param1 = Math.floor(hashCode(text) % 50);
      return `${funcName}("${text}", ${param1});`;
    },
    (text: string, _lang: CodeLanguage, lineIndex: number) => {
      // Object with properties
      const key = VAR_NAMES[hashCode(text + lineIndex) % VAR_NAMES.length]!;
      return `{ ${key}: "${text}", value: ${Math.floor(hashCode(text) % 100)} }`;
    },
    (text: string, _lang: CodeLanguage, lineIndex: number) => {
      // Array with mixed types
      const num = Math.floor(hashCode(text + lineIndex) % 50);
      return `["${text}", ${num}, true]`;
    },
    (text: string, lang: CodeLanguage, lineIndex: number) => {
      // Conditional with operators
      const varName = VAR_NAMES[hashCode(text + lineIndex) % VAR_NAMES.length]!;
      const keyword = lang === 'python' ? 'if' : 'if';
      const num = Math.floor(hashCode(text) % 20);
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
    (text: string, _lang: CodeLanguage, lineIndex: number) => {
      // Return with operations
      const num1 = Math.floor(hashCode(text + lineIndex) % 30);
      const num2 = Math.floor(hashCode(text + lineIndex + 1) % 30);
      return `return ${num1} + ${num2}; // ${text}`;
    },
    (text: string, _lang: CodeLanguage, lineIndex: number) => {
      // Class method
      const method = FUNC_NAMES[hashCode(text + lineIndex) % FUNC_NAMES.length]!;
      return `class.${method}("${text}");`;
    },
  ];

  let lastPatternIndex = -1;

  lines.forEach((line, index) => {
    if (!line.trim()) {
      codeLines.push('');
      return;
    }

    // Deterministic indent based on line content
    const indentLevel = hashCode(line + index) % 5;
    const indent = '  '.repeat(indentLevel);

    // Deterministic pattern selection (avoid repeating same pattern twice in a row)
    let patternIndex = hashCode(line + index) % patterns.length;
    if (patternIndex === lastPatternIndex && patterns.length > 1) {
      patternIndex = (patternIndex + 1) % patterns.length;
    }
    lastPatternIndex = patternIndex;

    const pattern = patterns[patternIndex];
    if (!pattern) {
      codeLines.push(`${indent}${line}`);
      return;
    }
    const codeLine = pattern(line, language, index);

    codeLines.push(`${indent}${codeLine}`);

    // Add occasional spacing between code blocks (20% chance, deterministic)
    if (index > 0 && (hashCode(line + index) % 5) === 0) {
      codeLines.push('');
    }
  });

  return codeLines.join('\n');
}
