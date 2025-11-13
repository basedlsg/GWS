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
  textColor: '#00FF00',
  keyword: '#00FF00',
  string: '#00CC00',
  number: '#00FF88',
  comment: '#008800',
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
 * Apply syntax highlighting to code text
 */
export function highlightCode(code: string, language: CodeLanguage, theme: Theme): string {
  let highlighted = code;

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Apply keyword highlighting
  const keywords = KEYWORDS[language] || [];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword}; font-weight: 600;">${keyword}</span>`);
  });

  // Apply string highlighting (content in quotes)
  highlighted = highlighted.replace(/"([^"]*)"/g, `<span style="color: ${theme.string};">"$1"</span>`);
  highlighted = highlighted.replace(/'([^']*)'/g, `<span style="color: ${theme.string};">'$1'</span>`);

  // Apply number highlighting
  highlighted = highlighted.replace(/\b\d+\b/g, match => `<span style="color: ${theme.number};">${match}</span>`);

  // Apply comment highlighting (must be done after other replacements)
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, match => `<span style="color: ${theme.comment};">${match}</span>`);
  highlighted = highlighted.replace(/#(.*?)$/gm, match => `<span style="color: ${theme.comment};">${match}</span>`);

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

  lines.forEach((line) => {
    if (!line.trim()) {
      codeLines.push('');
      return;
    }

    // Random indent
    const indent = getRandomIndent();

    // Random pattern
    const patternIndex = Math.floor(Math.random() * patterns.length);
    const pattern = patterns[patternIndex];
    if (!pattern) {
      codeLines.push(`${indent}${line}`);
      return;
    }
    const codeLine = pattern(line, language);

    codeLines.push(`${indent}${codeLine}`);
  });

  return codeLines.join('\n');
}
