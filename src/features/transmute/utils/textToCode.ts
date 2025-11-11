/**
 * Smart Text-to-Code Transformation
 * Intelligently converts rich text to code-like structures
 */

import { Descendant, Element, Text } from 'slate';
import type { CodeLanguage, CodeTheme, CustomElement } from '../types';
import { CODE_THEMES } from '../constants';

/**
 * Extract plain text from Slate node
 */
function extractText(node: Descendant): string {
  if (Text.isText(node)) {
    return node.text;
  }
  if (Element.isElement(node)) {
    return node.children.map(extractText).join('');
  }
  return '';
}

/**
 * Generate a variable name from text
 */
function makeVarName(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 20) || 'var';
}

/**
 * Generate random hex value
 */
function randomHex(): string {
  return '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
}

/**
 * Transform heading to code
 */
function transformHeading(node: CustomElement, language: CodeLanguage): string {
  const text = extractText(node);
  const className = makeVarName(text).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

  switch (language) {
    case 'javascript':
      return `\n// ${'='.repeat(40)}\n// ${text}\n// ${'='.repeat(40)}\n\nclass ${className} {\n  constructor() {\n    this.initialized = true;\n  }\n}`;

    case 'python':
      return `\n# ${'=' .repeat(40)}\n# ${text}\n# ${'='.repeat(40)}\n\nclass ${className}:\n    def __init__(self):\n        self.initialized = True`;

    case 'rust':
      return `\n// ${'='.repeat(40)}\n// ${text}\n// ${'='.repeat(40)}\n\npub struct ${className} {\n    initialized: bool,\n}`;

    case 'go':
      return `\n// ${'='.repeat(40)}\n// ${text}\n// ${'='.repeat(40)}\n\ntype ${className} struct {\n    Initialized bool\n}`;

    case 'cpp':
      return `\n// ${'='.repeat(40)}\n// ${text}\n// ${'='.repeat(40)}\n\nclass ${className} {\npublic:\n    ${className}() : initialized(true) {}\nprivate:\n    bool initialized;\n};`;

    case 'ruby':
      return `\n# ${'='.repeat(40)}\n# ${text}\n# ${'='.repeat(40)}\n\nclass ${className}\n  def initialize\n    @initialized = true\n  end\nend`;

    case 'java':
      return `\n// ${'='.repeat(40)}\n// ${text}\n// ${'='.repeat(40)}\n\npublic class ${className} {\n    private boolean initialized = true;\n}`;

    default:
      return `\n// ${text}\n`;
  }
}

/**
 * Transform paragraph to code
 */
function transformParagraph(node: CustomElement, language: CodeLanguage): string {
  const text = extractText(node);
  const words = text.split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) return '';

  const varName = makeVarName(words.slice(0, 3).join(' '));
  const hexValue = randomHex();

  switch (language) {
    case 'javascript':
      return `  // ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n  const ${varName} = ${hexValue};\n  console.log(${varName});\n`;

    case 'python':
      return `    # ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    ${varName} = ${hexValue}\n    print(${varName})\n`;

    case 'rust':
      return `    // ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    let ${varName} = ${hexValue};\n    println!("{:?}", ${varName});\n`;

    case 'go':
      return `    // ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    ${varName} := ${hexValue}\n    fmt.Println(${varName})\n`;

    case 'cpp':
      return `    // ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    auto ${varName} = ${hexValue};\n    std::cout << ${varName} << std::endl;\n`;

    case 'ruby':
      return `    # ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    ${varName} = ${hexValue}\n    puts ${varName}\n`;

    case 'java':
      return `    // ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}\n    int ${varName} = ${hexValue};\n    System.out.println(${varName});\n`;

    default:
      return `  // ${text}\n`;
  }
}

/**
 * Transform list to code
 */
function transformList(node: CustomElement, language: CodeLanguage): string {
  if (node.type !== 'bulleted-list' && node.type !== 'numbered-list') return '';

  const items = node.children.map(child => extractText(child)).filter(t => t.length > 0);

  if (items.length === 0) return '';

  const arrayName = 'items';

  switch (language) {
    case 'javascript':
      const jsItems = items.map(item => `    "${item}",`).join('\n');
      return `  const ${arrayName} = [\n${jsItems}\n  ];\n`;

    case 'python':
      const pyItems = items.map(item => `        "${item}",`).join('\n');
      return `    ${arrayName} = [\n${pyItems}\n    ]\n`;

    case 'rust':
      const rsItems = items.map(item => `        "${item}",`).join('\n');
      return `    let ${arrayName} = vec![\n${rsItems}\n    ];\n`;

    case 'go':
      const goItems = items.map(item => `        "${item}",`).join('\n');
      return `    ${arrayName} := []string{\n${goItems}\n    }\n`;

    case 'cpp':
      const cppItems = items.map(item => `        "${item}",`).join('\n');
      return `    std::vector<std::string> ${arrayName} = {\n${cppItems}\n    };\n`;

    case 'ruby':
      const rbItems = items.map(item => `        "${item}",`).join('\n');
      return `    ${arrayName} = [\n${rbItems}\n    ]\n`;

    case 'java':
      const javaItems = items.map(item => `        "${item}",`).join('\n');
      return `    String[] ${arrayName} = {\n${javaItems}\n    };\n`;

    default:
      return items.map(item => `  - ${item}\n`).join('');
  }
}

/**
 * Transform link to code
 */
function transformLink(node: CustomElement, language: CodeLanguage): string {
  if (node.type !== 'link') return '';

  const text = extractText(node);
  const url = node.url;

  switch (language) {
    case 'javascript':
      return `  const link = "${url}"; // ${text}\n`;

    case 'python':
      return `    link = "${url}"  # ${text}\n`;

    case 'rust':
      return `    let link = "${url}"; // ${text}\n`;

    case 'go':
      return `    link := "${url}" // ${text}\n`;

    case 'cpp':
      return `    std::string link = "${url}"; // ${text}\n`;

    case 'ruby':
      return `    link = "${url}"  # ${text}\n`;

    case 'java':
      return `    String link = "${url}"; // ${text}\n`;

    default:
      return `  ${text}: ${url}\n`;
  }
}

/**
 * Main transformation function
 * Converts Slate document to code-like text
 */
export function transformToCode(
  content: Descendant[],
  language: CodeLanguage,
  themeName: string
): string {
  const theme = CODE_THEMES[themeName];
  if (!theme) return '// Invalid theme';

  const codeLines: string[] = [];

  for (const node of content) {
    if (!Element.isElement(node)) continue;

    switch (node.type) {
      case 'heading-1':
      case 'heading-2':
      case 'heading-3':
        codeLines.push(transformHeading(node, language));
        break;

      case 'paragraph':
        codeLines.push(transformParagraph(node, language));
        break;

      case 'bulleted-list':
      case 'numbered-list':
        codeLines.push(transformList(node, language));
        break;

      case 'link':
        codeLines.push(transformLink(node, language));
        break;

      case 'list-item':
        // List items are handled by parent list
        break;
    }
  }

  return codeLines.join('\n');
}

/**
 * Apply syntax highlighting to code
 */
export function highlightCode(code: string, language: CodeLanguage, theme: CodeTheme): string {
  // Keywords for each language
  const keywords: Record<CodeLanguage, string[]> = {
    javascript: ['const', 'let', 'var', 'function', 'class', 'return', 'if', 'else', 'for', 'while', 'new', 'this', 'constructor', 'console', 'log'],
    python: ['def', 'class', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'self', 'print', 'True', 'False'],
    rust: ['let', 'mut', 'fn', 'impl', 'struct', 'enum', 'pub', 'use', 'return', 'if', 'else', 'for', 'while', 'println!'],
    go: ['func', 'var', 'const', 'type', 'struct', 'interface', 'return', 'if', 'else', 'for', 'range', 'fmt', 'Println'],
    cpp: ['auto', 'class', 'public', 'private', 'return', 'if', 'else', 'for', 'while', 'std', 'cout', 'endl', 'namespace'],
    ruby: ['def', 'class', 'end', 'return', 'if', 'else', 'for', 'while', 'puts', 'true', 'false', 'nil'],
    java: ['public', 'private', 'class', 'void', 'int', 'String', 'return', 'if', 'else', 'for', 'while', 'new', 'System', 'println'],
  };

  let highlighted = code;

  // Apply keyword highlighting
  keywords[language].forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    highlighted = highlighted.replace(regex, `<span style="color: ${theme.keyword}; font-weight: 600;">${keyword}</span>`);
  });

  // Apply string highlighting (content in quotes)
  highlighted = highlighted.replace(/"([^"]*)"/g, `<span style="color: ${theme.string};">"$1"</span>`);

  // Apply number highlighting (hex values)
  highlighted = highlighted.replace(/\b0x[0-9A-F]+\b/g, match => `<span style="color: ${theme.number};">${match}</span>`);

  // Apply comment highlighting
  highlighted = highlighted.replace(/\/\/(.*?)$/gm, match => `<span style="color: ${theme.comment};">${match}</span>`);
  highlighted = highlighted.replace(/#(.*?)$/gm, match => `<span style="color: ${theme.comment};">${match}</span>`);

  return highlighted;
}
