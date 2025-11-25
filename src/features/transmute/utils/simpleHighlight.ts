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
  background: '#0D1117',           // GitHub dark background
  textColor: '#C9D1D9',            // Light gray text
  keyword: '#FF7B72',              // Red-orange keywords
  string: '#A5D6FF',               // Light blue strings
  number: '#79C0FF',               // Blue numbers
  comment: '#8B949E',              // Gray comments
};

/**
 * Keywords for syntax highlighting
 */
const KEYWORDS: Record<CodeLanguage, string[]> = {
  javascript: ['const', 'let', 'var', 'function', 'class', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'async', 'await', 'export', 'import', 'from', 'try', 'catch', 'throw'],
  python: ['def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'self', 'True', 'False', 'None', 'async', 'await', 'try', 'except', 'with', 'as'],
  rust: ['let', 'mut', 'fn', 'impl', 'struct', 'enum', 'pub', 'use', 'return', 'if', 'else', 'for', 'while', 'match', 'Some', 'None', 'Ok', 'Err', 'async', 'await'],
  go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range', 'package', 'import', 'defer', 'go', 'chan', 'select', 'case'],
  cpp: ['auto', 'class', 'public', 'private', 'protected', 'return', 'if', 'else', 'for', 'while', 'namespace', 'using', 'template', 'typename', 'virtual', 'override', 'const', 'static'],
  ruby: ['def', 'class', 'end', 'return', 'if', 'else', 'elsif', 'for', 'while', 'do', 'begin', 'rescue', 'ensure', 'module', 'attr_accessor', 'require', 'include'],
  java: ['public', 'private', 'protected', 'class', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'static', 'final', 'extends', 'implements', 'try', 'catch'],
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

  // Store protected regions with placeholders
  const protectedRegions: string[] = [];
  let placeholderIndex = 0;

  // Protect comments FIRST
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, (match) => {
    const placeholder = `__PROTECTED_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.comment}; font-style: italic;">${match}</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/#(.*?)$/gm, (match) => {
    const placeholder = `__PROTECTED_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.comment}; font-style: italic;">${match}</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Protect strings
  highlighted = highlighted.replace(/"([^"]*)"/g, (_match, content) => {
    const placeholder = `__PROTECTED_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">"${content}"</span>`;
    placeholderIndex++;
    return placeholder;
  });
  highlighted = highlighted.replace(/'([^']*)'/g, (_match, content) => {
    const placeholder = `__PROTECTED_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">'${content}'</span>`;
    placeholderIndex++;
    return placeholder;
  });
  // Template literals
  highlighted = highlighted.replace(/`([^`]*)`/g, (_match, content) => {
    const placeholder = `__PROTECTED_${placeholderIndex}__`;
    protectedRegions[placeholderIndex] = `<span style="color: ${theme.string};">\`${content}\`</span>`;
    placeholderIndex++;
    return placeholder;
  });

  // Highlight numbers
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, `<span style="color: ${theme.number};">$1</span>`);

  // Highlight keywords
  const keywords = KEYWORDS[language] || [];
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword}; font-weight: 600;">$1</span>`);
  });

  // Highlight function calls - cyan
  highlighted = highlighted.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g, `<span style="color: #79C0FF;">$1</span>(`);

  // Highlight property access - light purple
  highlighted = highlighted.replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)/g, `.<span style="color: #D2A8FF;">$1</span>`);

  // Highlight operators
  highlighted = highlighted.replace(/([+\-*/%<>!&|=]+)/g, `<span style="color: #FF7B72;">$1</span>`);

  // Highlight brackets/braces - yellow
  highlighted = highlighted.replace(/([{}[\]()])/g, `<span style="color: #FFA657;">$1</span>`);

  // Restore protected regions
  protectedRegions.forEach((region, index) => {
    highlighted = highlighted.replace(`__PROTECTED_${index}__`, region);
  });

  return highlighted;
}

/**
 * Transform plain text into realistic-looking code
 * Creates structured code blocks with proper indentation
 */
export function textToCode(text: string, language: CodeLanguage): string {
  if (!text.trim()) {
    return '// Waiting for input...';
  }

  // Hash function for deterministic randomness
  const hash = (str: string, seed = 0): number => {
    let h = seed;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h);
  };

  // Convert text to camelCase variable name
  const toCamelCase = (str: string): string => {
    const words = str.toLowerCase().split(/\s+/).filter(w => w.length > 0).slice(0, 3);
    if (words.length === 0) return 'data';
    return words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('').replace(/[^a-zA-Z0-9]/g, '');
  };

  // Variable and function name pools
  const VARS = ['data', 'result', 'value', 'config', 'state', 'response', 'payload', 'context', 'handler', 'callback'];
  const FUNCS = ['process', 'handle', 'update', 'fetch', 'render', 'validate', 'transform', 'execute', 'initialize', 'compute'];
  const TYPES = ['User', 'Item', 'Config', 'Response', 'Request', 'Handler', 'Service', 'Controller', 'Manager', 'Factory'];
  const PROPS = ['id', 'name', 'type', 'status', 'count', 'value', 'enabled', 'active', 'timestamp', 'version'];

  const pick = <T>(arr: T[], seed: number): T => arr[seed % arr.length]!;

  const lines = text.split('\n').filter(l => l.trim());
  const codeLines: string[] = [];
  let currentIndent = 0;
  let inBlock = false;
  let blockDepth = 0;

  // Language-specific syntax helpers
  const syntax = {
    varKeyword: language === 'python' ? '' : language === 'rust' ? 'let ' : language === 'go' ? '' : 'const ',
    funcKeyword: language === 'python' ? 'def' : language === 'rust' ? 'fn' : language === 'go' ? 'func' : language === 'java' ? 'public void' : 'function',
    classKeyword: language === 'python' ? 'class' : language === 'rust' ? 'struct' : language === 'go' ? 'type' : 'class',
    comment: language === 'python' || language === 'ruby' ? '#' : '//',
    semi: language === 'python' || language === 'ruby' || language === 'go' ? '' : ';',
    arrow: language === 'python' ? ':' : language === 'rust' ? ' ->' : language === 'go' ? '' : ' =>',
    blockStart: language === 'python' ? ':' : ' {',
    blockEnd: language === 'python' ? '' : '}',
  };

  const indent = () => '  '.repeat(currentIndent);

  // Code block generators
  const generators = [
    // Import/use statement
    (text: string, idx: number) => {
      const module = pick(TYPES, hash(text, idx)).toLowerCase();
      if (language === 'python') return `from ${module} import ${pick(FUNCS, hash(text, idx + 1))}`;
      if (language === 'rust') return `use crate::${module}::${pick(TYPES, hash(text, idx + 1))};`;
      if (language === 'go') return `import "${module}"`;
      if (language === 'java') return `import com.app.${module}.${pick(TYPES, hash(text, idx + 1))};`;
      return `import { ${pick(FUNCS, hash(text, idx + 1))} } from './${module}'${syntax.semi}`;
    },

    // Variable assignment with object
    (text: string, idx: number) => {
      const varName = toCamelCase(text) || pick(VARS, hash(text, idx));
      const prop1 = pick(PROPS, hash(text, idx));
      const prop2 = pick(PROPS, hash(text, idx + 1));
      const val = hash(text, idx) % 100;
      return `${syntax.varKeyword}${varName} = { ${prop1}: ${val}, ${prop2}: "${pick(VARS, hash(text, idx + 2))}" }${syntax.semi}`;
    },

    // Function call with callback
    (text: string, idx: number) => {
      const func = pick(FUNCS, hash(text, idx));
      const arg = pick(VARS, hash(text, idx + 1));
      if (language === 'python') return `${func}(${arg}, lambda x: x.${pick(PROPS, hash(text, idx + 2))})`;
      return `${func}(${arg}, (x)${syntax.arrow} x.${pick(PROPS, hash(text, idx + 2))})${syntax.semi}`;
    },

    // Async function start (opens block)
    (text: string, idx: number) => {
      const funcName = pick(FUNCS, hash(text, idx)) + pick(TYPES, hash(text, idx + 1));
      inBlock = true;
      blockDepth++;
      if (language === 'python') return `async def ${funcName}(${pick(VARS, hash(text, idx + 2))}):`;
      if (language === 'rust') return `async fn ${funcName}(${pick(VARS, hash(text, idx + 2))}: &str) -> Result<()> {`;
      if (language === 'go') return `func ${funcName}(${pick(VARS, hash(text, idx + 2))} string) error {`;
      return `async ${syntax.funcKeyword} ${funcName}(${pick(VARS, hash(text, idx + 2))})${syntax.blockStart}`;
    },

    // Method chain
    (text: string, idx: number) => {
      const base = pick(VARS, hash(text, idx));
      const m1 = pick(FUNCS, hash(text, idx + 1));
      const m2 = pick(FUNCS, hash(text, idx + 2));
      const m3 = ['map', 'filter', 'reduce', 'find', 'forEach'][hash(text, idx + 3) % 5]!;
      return `${base}.${m1}().${m2}().${m3}(item => item)${syntax.semi}`;
    },

    // Try-catch/error handling
    (text: string, idx: number) => {
      const varName = pick(VARS, hash(text, idx));
      if (language === 'python') return `try:\n${indent()}    ${varName} = await ${pick(FUNCS, hash(text, idx + 1))}()`;
      if (language === 'rust') return `let ${varName} = ${pick(FUNCS, hash(text, idx + 1))}().await?;`;
      if (language === 'go') return `${varName}, err := ${pick(FUNCS, hash(text, idx + 1))}()`;
      return `const ${varName} = await ${pick(FUNCS, hash(text, idx + 1))}()${syntax.semi}`;
    },

    // Conditional with body
    (text: string, idx: number) => {
      const varName = pick(VARS, hash(text, idx));
      const prop = pick(PROPS, hash(text, idx + 1));
      const op = ['===', '!==', '>', '<', '>='][hash(text, idx + 2) % 5]!;
      const val = hash(text, idx + 3) % 50;
      inBlock = true;
      blockDepth++;
      if (language === 'python') return `if ${varName}.${prop} ${op.replace('===', '==')} ${val}:`;
      return `if (${varName}.${prop} ${op} ${val})${syntax.blockStart}`;
    },

    // Return statement
    (text: string, idx: number) => {
      const varName = pick(VARS, hash(text, idx));
      const prop = pick(PROPS, hash(text, idx + 1));
      return `return ${varName}.${prop}${syntax.semi}`;
    },

    // Comment with user's text
    (text: string, _idx: number) => {
      return `${syntax.comment} ${text}`;
    },

    // Array operation
    (text: string, idx: number) => {
      const arr = pick(VARS, hash(text, idx)) + 's';
      const method = ['map', 'filter', 'reduce', 'find', 'every', 'some'][hash(text, idx + 1) % 6]!;
      const prop = pick(PROPS, hash(text, idx + 2));
      if (language === 'python') return `${arr} = [x.${prop} for x in ${pick(VARS, hash(text, idx + 3))}]`;
      return `${syntax.varKeyword}${arr} = ${pick(VARS, hash(text, idx + 3))}.${method}(x => x.${prop})${syntax.semi}`;
    },

    // Object destructuring
    (text: string, idx: number) => {
      const p1 = pick(PROPS, hash(text, idx));
      const p2 = pick(PROPS, hash(text, idx + 1));
      const source = pick(VARS, hash(text, idx + 2));
      if (language === 'python') return `${p1}, ${p2} = ${source}.${p1}, ${source}.${p2}`;
      if (language === 'rust') return `let ${pick(TYPES, hash(text, idx))} { ${p1}, ${p2}, .. } = ${source};`;
      if (language === 'go') return `${p1}, ${p2} := ${source}.${pick(FUNCS, hash(text, idx + 3))}()`;
      return `const { ${p1}, ${p2} } = ${source}${syntax.semi}`;
    },

    // Class/struct property
    (text: string, idx: number) => {
      const prop = pick(PROPS, hash(text, idx));
      const type = pick(TYPES, hash(text, idx + 1));
      if (language === 'python') return `self.${prop} = ${pick(VARS, hash(text, idx + 2))}`;
      if (language === 'rust') return `${prop}: ${type},`;
      if (language === 'java') return `private ${type} ${prop};`;
      return `this.${prop} = ${pick(VARS, hash(text, idx + 2))}${syntax.semi}`;
    },
  ];

  lines.forEach((line, idx) => {
    // Occasionally close a block
    if (inBlock && blockDepth > 0 && hash(line, idx) % 4 === 0) {
      currentIndent = Math.max(0, currentIndent - 1);
      if (syntax.blockEnd) {
        codeLines.push(`${indent()}${syntax.blockEnd}`);
      }
      blockDepth--;
      if (blockDepth === 0) inBlock = false;
    }

    // Select generator based on content hash
    const genIdx = hash(line, idx) % generators.length;
    const generator = generators[genIdx]!;
    const codeLine = generator(line, idx);

    codeLines.push(`${indent()}${codeLine}`);

    // Increase indent after opening a block
    if (inBlock && codeLine.endsWith(syntax.blockStart)) {
      currentIndent++;
    }

    // Add blank line occasionally for readability
    if (hash(line, idx + 100) % 4 === 0) {
      codeLines.push('');
    }
  });

  // Close any remaining blocks
  while (blockDepth > 0) {
    currentIndent = Math.max(0, currentIndent - 1);
    if (syntax.blockEnd) {
      codeLines.push(`${indent()}${syntax.blockEnd}`);
    }
    blockDepth--;
  }

  return codeLines.join('\n');
}
