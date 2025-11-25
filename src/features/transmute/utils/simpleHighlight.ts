/**
 * Simple Syntax Highlighter with Realistic Code Generation
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
 * Transform plain text into realistic random code
 */
export function textToCode(text: string, language: CodeLanguage): string {
  if (!text.trim()) return '';

  // Seeded random based on text
  let seed = 0;
  for (let i = 0; i < text.length; i++) {
    seed = ((seed << 5) - seed) + text.charCodeAt(i);
    seed = seed & seed;
  }
  seed = Math.abs(seed);

  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed;
  };

  const pick = <T>(arr: T[]): T => arr[rand() % arr.length]!;
  const num = () => rand() % 256;
  const small = () => rand() % 20;
  const chance = (pct: number) => (rand() % 100) < pct;

  // Variable pools
  const v1 = ['x', 'y', 'z', 'i', 'j', 'k', 'n', 'm', 'p', 'q'];
  const v2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 's', 't'];
  const names = ['data', 'item', 'node', 'val', 'key', 'buf', 'tmp', 'res', 'ptr', 'idx', 'len', 'cnt', 'pos', 'cur', 'prev', 'next', 'src', 'dst', 'out', 'err'];
  const fns = ['get', 'set', 'add', 'del', 'put', 'pop', 'run', 'init', 'read', 'write', 'open', 'close', 'find', 'sort', 'load', 'save', 'send', 'recv', 'push', 'pull', 'map', 'filter', 'parse', 'check', 'update', 'reset', 'clear', 'copy', 'move', 'swap'];
  const props = ['id', 'len', 'key', 'val', 'pos', 'size', 'next', 'prev', 'head', 'tail', 'name', 'type', 'flag', 'count', 'index', 'state'];
  const types = ['Node', 'Item', 'List', 'Map', 'Set', 'Vec', 'Buf', 'Ctx', 'Ptr', 'Box'];
  const strings = ['ok', 'err', 'nil', 'end', 'start', 'done', 'ready', 'busy', 'on', 'off'];

  const py = language === 'python';
  const rb = language === 'ruby';
  const rs = language === 'rust';
  const go = language === 'go';
  const semi = (py || rb || go) ? '' : ';';
  const kw = py ? '' : rs ? 'let ' : go ? '' : 'const ';
  const kwMut = py ? '' : rs ? 'let mut ' : go ? '' : 'let ';

  const lines: string[] = [];
  const textLines = text.split('\n').filter(l => l.trim());

  // Generate multiple code lines per text line for density
  textLines.forEach(() => {
    const baseIndent = rand() % 4; // 0-3 base indent
    const ind = '  '.repeat(baseIndent);

    // Generate 1-3 lines per input line
    const linesPerInput = 1 + (rand() % 3);

    for (let li = 0; li < linesPerInput; li++) {
      const extraIndent = chance(30) ? '  ' : '';
      const prefix = ind + extraIndent;

      // Pick a random pattern type
      const patternType = rand() % 25;

      let line = '';
      switch (patternType) {
        case 0: line = `${kw}${pick(names)} = ${num()}${semi}`; break;
        case 1: line = `${pick(names)} = ${pick(names)}${semi}`; break;
        case 2: line = `${pick(v1)} = ${pick(v1)} + ${small()}${semi}`; break;
        case 3: line = `${pick(v1)}++${semi}`; break;
        case 4: line = `${pick(fns)}()${semi}`; break;
        case 5: line = `${pick(fns)}(${pick(v1)})${semi}`; break;
        case 6: line = `${pick(fns)}(${pick(names)}, ${small()})${semi}`; break;
        case 7: line = `${pick(names)} = ${pick(fns)}()${semi}`; break;
        case 8: line = `${pick(v1)} = ${pick(fns)}(${pick(v2)})${semi}`; break;
        case 9: line = `${pick(names)}.${pick(props)} = ${small()}${semi}`; break;
        case 10: line = `${pick(v1)} = ${pick(names)}.${pick(props)}${semi}`; break;
        case 11: line = `${pick(names)}.${pick(fns)}()${semi}`; break;
        case 12: line = `${pick(names)}[${pick(v1)}] = ${small()}${semi}`; break;
        case 13: line = `${pick(v1)} = ${pick(names)}[${small()}]${semi}`; break;
        case 14: line = `return ${pick(names)}${semi}`; break;
        case 15: line = `return ${pick(v1)}${semi}`; break;
        case 16: line = `return ${small()}${semi}`; break;
        case 17: line = `${pick(names)} = true${semi}`; break;
        case 18: line = `${pick(names)} = false${semi}`; break;
        case 19: line = `${pick(v1)} = ${pick(v2)} * ${pick(v1)}${semi}`; break;
        case 20: line = `${kwMut}${pick(names)} = []${semi}`; break;
        case 21: line = `${kw}${pick(names)} = {}${semi}`; break;
        case 22: line = `${pick(names)} = "${pick(strings)}"${semi}`; break;
        case 23: line = go ? `${pick(names)} := ${pick(types)}{}` : rs ? `let ${pick(names)} = ${pick(types)}::new()${semi}` : `${kw}${pick(names)} = new ${pick(types)}()${semi}`; break;
        case 24: line = `${pick(names)}.${pick(fns)}(${pick(v1)}, ${pick(v2)})${semi}`; break;
      }

      lines.push(prefix + line);
    }

    // Occasionally add block structures
    if (chance(15)) {
      const blockInd = '  '.repeat(rand() % 3);
      if (py) {
        lines.push(`${blockInd}if ${pick(names)}:`);
        lines.push(`${blockInd}  ${pick(names)} = ${small()}${semi}`);
      } else {
        lines.push(`${blockInd}if (${pick(names)}) {`);
        lines.push(`${blockInd}  ${pick(names)} = ${small()}${semi}`);
        lines.push(`${blockInd}}`);
      }
    }

    // Rare blank line (only 8% chance)
    if (chance(8)) lines.push('');
  });

  return lines.join('\n');
}
