/**
 * Simple Syntax Highlighter with Realistic Code Generation
 * Transforms plain text into convincing code-like output
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
  background: '#0D1117',
  textColor: '#C9D1D9',
  keyword: '#FF7B72',
  string: '#A5D6FF',
  number: '#79C0FF',
  comment: '#8B949E',
};

const KEYWORDS: Record<CodeLanguage, string[]> = {
  javascript: ['const', 'let', 'var', 'function', 'class', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'async', 'await', 'export', 'import', 'from', 'try', 'catch', 'throw', 'true', 'false', 'null'],
  python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'self', 'True', 'False', 'None', 'async', 'await', 'try', 'except', 'with', 'as', 'and', 'or', 'not'],
  rust: ['let', 'mut', 'fn', 'impl', 'struct', 'enum', 'pub', 'use', 'return', 'if', 'else', 'for', 'while', 'match', 'Some', 'None', 'Ok', 'Err', 'async', 'await', 'true', 'false'],
  go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range', 'package', 'import', 'defer', 'go', 'chan', 'select', 'case', 'nil', 'true', 'false'],
  cpp: ['auto', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'namespace', 'using', 'template', 'typename', 'virtual', 'override', 'const', 'static', 'true', 'false', 'nullptr'],
  ruby: ['def', 'class', 'end', 'return', 'if', 'else', 'elsif', 'for', 'while', 'do', 'begin', 'rescue', 'ensure', 'module', 'attr_accessor', 'require', 'include', 'true', 'false', 'nil'],
  java: ['public', 'private', 'protected', 'class', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'static', 'final', 'extends', 'implements', 'try', 'catch', 'true', 'false', 'null'],
};

export function highlightCode(code: string, language: CodeLanguage, theme: Theme): string {
  let highlighted = code;

  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const protectedRegions: string[] = [];
  let placeholderIndex = 0;

  // Protect strings
  highlighted = highlighted.replace(/"([^"]*)"/g, (_match, content) => {
    const placeholder = `__P${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">"${content}"</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/'([^']*)'/g, (_match, content) => {
    const placeholder = `__P${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">'${content}'</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+)\b/g, `<span style="color: ${theme.number};">$1</span>`);

  // Highlight keywords
  const keywords = KEYWORDS[language] || [];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword};">$1</span>`);
  });

  // Function calls - cyan
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, `<span style="color: #79C0FF;">$1</span>(`);

  // Property access - purple
  highlighted = highlighted.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g, `.<span style="color: #D2A8FF;">$1</span>`);

  // Operators
  highlighted = highlighted.replace(/([=!<>+\-*/%&|]+)/g, `<span style="color: #FF7B72;">$1</span>`);

  // Brackets - orange
  highlighted = highlighted.replace(/([{}[\]()])/g, `<span style="color: #FFA657;">$1</span>`);

  // Restore protected
  protectedRegions.forEach((region, index) => {
    highlighted = highlighted.replace(`__P${index}__`, region);
  });

  return highlighted;
}

/**
 * Transform plain text into realistic short code lines
 */
export function textToCode(text: string, language: CodeLanguage): string {
  if (!text.trim()) {
    return 'loading...';
  }

  const hash = (str: string, seed = 0): number => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h);
  };

  // Short variable names
  const VARS = ['x', 'y', 'n', 'i', 'j', 'k', 'a', 'b', 'c', 'd', 'e', 'm', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'];
  const NAMES = ['data', 'item', 'node', 'val', 'key', 'idx', 'len', 'cnt', 'sum', 'max', 'min', 'tmp', 'res', 'out', 'buf', 'ptr', 'obj', 'arr', 'str', 'num'];
  const FUNCS = ['get', 'set', 'add', 'del', 'put', 'pop', 'run', 'init', 'load', 'save', 'read', 'send', 'recv', 'open', 'close', 'find', 'sort', 'push', 'pull', 'sync'];
  const PROPS = ['id', 'len', 'key', 'val', 'pos', 'size', 'next', 'prev', 'left', 'right', 'head', 'tail', 'root', 'name', 'type', 'flag'];
  const TYPES = ['Node', 'Item', 'List', 'Map', 'Set', 'Vec', 'Buf', 'Ctx', 'Req', 'Res'];

  const pick = <T>(arr: T[], seed: number): T => arr[seed % arr.length]!;
  const num = (seed: number) => (seed % 99) + 1;

  const lines = text.split('\n').filter(l => l.trim());
  const codeLines: string[] = [];
  let indent = 0;
  let lastPattern = -1;

  // Language syntax
  const py = language === 'python';
  const rb = language === 'ruby';
  const rs = language === 'rust';
  const go = language === 'go';
  const semi = (py || rb || go) ? '' : ';';
  const kw = py ? '' : rs ? 'let ' : go ? '' : 'const ';

  // Short, varied code patterns (all under ~40 chars)
  const patterns = [
    // Simple assignments
    (h: number) => `${kw}${pick(NAMES, h)} = ${num(h)}${semi}`,
    (h: number) => `${pick(NAMES, h)} = ${pick(NAMES, h+1)}${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(VARS, h+1)} + ${num(h)}${semi}`,
    (h: number) => `${pick(NAMES, h)} += ${num(h)}${semi}`,
    (h: number) => `${pick(VARS, h)}++${semi}`,

    // Function calls
    (h: number) => `${pick(FUNCS, h)}()${semi}`,
    (h: number) => `${pick(FUNCS, h)}(${pick(VARS, h)})${semi}`,
    (h: number) => `${pick(FUNCS, h)}(${pick(NAMES, h)}, ${num(h)})${semi}`,
    (h: number) => `${pick(NAMES, h)} = ${pick(FUNCS, h+1)}()${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(FUNCS, h)}(${pick(VARS, h+1)})${semi}`,

    // Property access
    (h: number) => `${pick(NAMES, h)}.${pick(PROPS, h+1)} = ${num(h)}${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(NAMES, h)}.${pick(PROPS, h+1)}${semi}`,
    (h: number) => `${pick(NAMES, h)}.${pick(FUNCS, h)}()${semi}`,

    // Arrays/indexing
    (h: number) => `${pick(NAMES, h)}[${pick(VARS, h)}] = ${num(h)}${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(NAMES, h)}[${num(h)}]${semi}`,
    (h: number) => `${pick(NAMES, h)}.push(${pick(VARS, h)})${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(NAMES, h)}.pop()${semi}`,

    // Conditionals (open block)
    (h: number) => { indent++; return py ? `if ${pick(NAMES, h)}:` : `if (${pick(NAMES, h)}) {`; },
    (h: number) => { indent++; return py ? `if ${pick(VARS, h)} > ${num(h)}:` : `if (${pick(VARS, h)} > ${num(h)}) {`; },
    (h: number) => { indent++; return py ? `while ${pick(VARS, h)} < ${num(h)}:` : `while (${pick(VARS, h)} < ${num(h)}) {`; },
    (h: number) => { indent++; return py ? `for ${pick(VARS, h)} in ${pick(NAMES, h)}:` : `for (${pick(VARS, h)} of ${pick(NAMES, h)}) {`; },

    // Returns
    (h: number) => `return ${pick(NAMES, h)}${semi}`,
    (h: number) => `return ${pick(VARS, h)}${semi}`,
    (h: number) => `return ${num(h)}${semi}`,
    (_h: number) => `return true${semi}`,
    (_h: number) => `return false${semi}`,

    // Boolean/null
    (h: number) => `${pick(NAMES, h)} = true${semi}`,
    (h: number) => `${pick(NAMES, h)} = false${semi}`,
    (h: number) => `${pick(NAMES, h)} = null${semi}`,

    // Short expressions
    (h: number) => `${pick(VARS, h)} = ${pick(VARS, h+1)} * ${pick(VARS, h+2)}${semi}`,
    (h: number) => `${pick(VARS, h)} = ${pick(VARS, h+1)} % ${num(h)}${semi}`,
    (h: number) => `${pick(NAMES, h)} = !${pick(NAMES, h+1)}${semi}`,

    // Type/new
    (h: number) => go ? `${pick(NAMES, h)} := ${pick(TYPES, h)}{}` : rs ? `let ${pick(NAMES, h)} = ${pick(TYPES, h)}::new()${semi}` : `${kw}${pick(NAMES, h)} = new ${pick(TYPES, h)}()${semi}`,
    (h: number) => `${pick(NAMES, h)} = []${semi}`,
    (h: number) => `${pick(NAMES, h)} = {}${semi}`,

    // String assignments
    (h: number) => `${pick(NAMES, h)} = "ok"${semi}`,
    (h: number) => `${pick(NAMES, h)} = ""${semi}`,
    (h: number) => `${pick(VARS, h)} = "."${semi}`,
  ];

  lines.forEach((line, lineIdx) => {
    const h = hash(line, lineIdx);

    // Close blocks sometimes
    if (indent > 0 && h % 3 === 0) {
      indent--;
      if (!py && !rb) codeLines.push('  '.repeat(indent) + '}');
    }

    // Pick pattern (avoid same pattern twice)
    let patternIdx = h % patterns.length;
    if (patternIdx === lastPattern) {
      patternIdx = (patternIdx + 1) % patterns.length;
    }
    lastPattern = patternIdx;

    const pattern = patterns[patternIdx]!;
    const codeLine = pattern(h);

    // Add with proper indent (indent BEFORE line for block openers)
    const currentIndent = codeLine.endsWith('{') || codeLine.endsWith(':')
      ? Math.max(0, indent - 1)
      : indent;
    codeLines.push('  '.repeat(currentIndent) + codeLine);

    // Occasional blank line
    if (h % 5 === 0) codeLines.push('');
  });

  // Close remaining blocks
  while (indent > 0) {
    indent--;
    if (!py && !rb) codeLines.push('  '.repeat(indent) + '}');
  }

  return codeLines.join('\n');
}
