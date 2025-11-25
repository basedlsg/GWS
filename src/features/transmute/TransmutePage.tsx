/**
 * TransmutePage - Minimal Text Editor with Code Preview
 * Simple textarea with real-time code preview - no Slate.js, no complex state management
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Split from 'react-split';
import { Card } from '@/shared/components/ui/card';
import { highlightCode, textToCode, MATRIX_THEME, type CodeLanguage } from './utils/simpleHighlight';
import './transmute.css';

export function TransmutePage() {
  // Simple state - just the text content and language
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');
  const [transformedText, setTransformedText] = useState(''); // Debounced version for code preview
  const [codeHistory, setCodeHistory] = useState<string[]>([]); // Store transformed code blocks
  const [lastTransformedLength, setLastTransformedLength] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const saveStatusTimeoutRef = useRef<NodeJS.Timeout>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Detect double-enter for immediate transformation
  const lastCharRef = useRef('');

  // Sync scroll positions between overlay and textarea
  const handleScroll = useCallback(() => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem('gws:transmute:autosave');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setText(data.text || '');
        setLanguage(data.language || 'javascript');
        setCodeHistory(data.codeHistory || []);
        setLastTransformedLength(data.text?.length || 0);
      } catch (error) {
        console.error('Failed to load saved content:', error);
      }
    }
  }, []);

  const triggerTransformation = useCallback(() => {
    if (text.length > lastTransformedLength) {
      // Only transform new content
      const newContent = text.slice(lastTransformedLength);
      const newCodeBlock = textToCode(newContent, language);
      setCodeHistory(prev => [...prev, newCodeBlock]);
      setLastTransformedLength(text.length);
    }
    setTransformedText(text);
  }, [text, language, lastTransformedLength]);

  // Save to localStorage
  const saveToLocalStorage = useCallback(() => {
    setSaveStatus('saving');
    try {
      const data = {
        text,
        language,
        codeHistory,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('gws:transmute:autosave', JSON.stringify(data));
      setSaveStatus('saved');

      // Clear save status after 2 seconds
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
      saveStatusTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('idle');
    }
  }, [text, language, codeHistory]);

  // Keyboard shortcut handler (Cmd+S or Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (saveStatusTimeoutRef.current) {
        clearTimeout(saveStatusTimeoutRef.current);
      }
    };
  }, [saveToLocalStorage]);

  // Auto-transform after 2.5 seconds of no typing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      triggerTransformation();
    }, 2500); // 2.5 second delay for natural feel

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, triggerTransformation]);

  // Handle text change with double-enter detection
  const handleTextChange = useCallback((newText: string) => {
    setText(newText);

    // Check for double enter (two consecutive newlines)
    const lastTwo = newText.slice(-2);
    if (lastTwo === '\n\n' && lastCharRef.current !== '\n\n') {
      triggerTransformation();
    }
    lastCharRef.current = lastTwo;
  }, [triggerTransformation]);

  // Generate stable colored version of text for left side (realistic syntax highlighting feel)
  const coloredText = useMemo(() => {
    if (!text) return '';

    // Syntax-highlighting inspired palette (like popular code themes)
    const COLORS = {
      keyword: ['#FF79C6', '#BD93F9', '#8BE9FD'],      // Pink, Purple, Cyan (keywords/built-ins)
      identifier: ['#50FA7B', '#F1FA8C', '#FFB86C'],   // Green, Yellow, Orange (variables/functions)
      string: ['#F1FA8C', '#FFB86C'],                   // Yellow, Orange (string-like)
      special: ['#FF5555', '#FF79C6'],                  // Red, Pink (special/important)
      neutral: ['#6272A4', '#44475A'],                  // Muted blue-gray (comments/punctuation)
    };

    // Simple hash function for deterministic color selection
    const hashString = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
      }
      return Math.abs(hash);
    };

    // Split by words AND punctuation to color them separately
    const tokens = text.split(/(\s+|[.,!?;:()[\]{}'"<>])/);

    return tokens.map((token, index) => {
      if (!token) return '';

      // Handle whitespace - double newlines get filler content 60% of the time
      if (/^\s+$/.test(token)) {
        let result = token;

        // For double+ newlines, add filler content
        result = result.replace(/\n\n+/g, () => {
          const seed = hashString(token + index + Math.random().toString());
          // 40% blank, 60% filler
          if (seed % 100 < 40) {
            return '\n';
          }
          // Random filler snippets that look like code
          const fillers = [
            '};', '});', ']);', '*/','---', '...',
            '// ...', '/* */', '{ }', '[ ]',
            '} else {', '});', 'break;', 'continue;',
            '};', '}}', '));', '> {', '=> {',
            '| |', '&&', '||', '??', '::',
            '++;', '--;', '+=', '-=', '*=',
            '...args', '...props', '=> {}', '() => {}',
          ];
          const filler = fillers[seed % fillers.length];
          const fillerColor = COLORS.neutral[seed % COLORS.neutral.length];
          return `\n<span style="color: ${fillerColor};">${filler}</span>\n`;
        });

        result = result.replace(/ /g, '&nbsp;');
        result = result.replace(/\n/g, '<br/>');
        return result;
      }

      // Handle punctuation - muted colors
      if (/^[.,!?;:()[\]{}'"<>]$/.test(token)) {
        const color = COLORS.neutral[hashString(token + index) % COLORS.neutral.length]!;
        return `<span style="color: ${color};">${token}</span>`;
      }

      // Handle words - choose color category based on word characteristics
      const seed = hashString(token + index);
      const wordLength = token.length;
      let color: string;

      if (wordLength <= 3) {
        // Short words look like keywords
        color = COLORS.keyword[seed % COLORS.keyword.length]!;
      } else if (wordLength <= 6) {
        // Medium words - mix of keyword and identifier
        const pool = [...COLORS.keyword, ...COLORS.identifier];
        color = pool[seed % pool.length]!;
      } else {
        // Longer words look like identifiers/variables
        color = COLORS.identifier[seed % COLORS.identifier.length]!;
      }

      // 8% chance to make it "special" (red/pink) for visual interest
      if (seed % 100 < 8) {
        color = COLORS.special[seed % COLORS.special.length]!;
      }

      const escapedToken = token.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<span style="color: ${color};">${escapedToken}</span>`;
    }).join('');
  }, [text]);

  // Generate code preview from history (appending new blocks)
  const codeText = useMemo(() => codeHistory.join('\n'), [codeHistory]);

  // Apply syntax highlighting
  const highlightedCode = useMemo(() =>
    highlightCode(codeText, language, MATRIX_THEME),
    [codeText, language]
  );

  return (
    <div className="h-screen flex flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Transmute</h1>
        <p className="text-muted-foreground">
          Write text, see it as code
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Language:</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as CodeLanguage)}
            className="px-3 py-2 border rounded text-sm bg-background"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
            <option value="cpp">C++</option>
            <option value="ruby">Ruby</option>
            <option value="java">Java</option>
          </select>
        </label>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {text.length} characters
          </div>
          {saveStatus === 'saved' && (
            <div className="text-xs text-green-500 flex items-center gap-1">
              <span>✓</span>
              <span>Saved</span>
            </div>
          )}
          {saveStatus === 'saving' && (
            <div className="text-xs text-blue-500 flex items-center gap-1">
              <span className="animate-spin">⟳</span>
              <span>Saving...</span>
            </div>
          )}
          {text !== transformedText && (
            <div className="text-xs text-yellow-500 animate-pulse">
              Transform pending... (Enter twice or wait 2.5s)
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Cmd+S</kbd> to save
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="split-container"
          sizes={[50, 50]}
          minSize={300}
          gutterSize={10}
          style={{ display: 'flex', height: '100%' }}
        >
          {/* Left: Text Editor with Colored Overlay */}
          <Card className="overflow-hidden flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="p-4 border-b" style={{ borderColor: '#333' }}>
              <h2 className="text-lg font-semibold">Editor</h2>
            </div>
            <div className="flex-1 relative overflow-hidden">
              {/* Colored text overlay (shows through transparent textarea) */}
              <div
                ref={overlayRef}
                className="absolute inset-0 p-4 font-mono text-base pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                  lineHeight: '1.5',
                  overflowWrap: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: coloredText || '<span style="color: #666;">Start typing...</span>' }}
              />
              {/* Transparent textarea (for typing) */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                onScroll={handleScroll}
                placeholder=""
                spellCheck={false}
                className="absolute inset-0 p-4 font-mono text-base border-none outline-none resize-none overflow-auto"
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                  backgroundColor: 'transparent',
                  color: 'transparent',
                  caretColor: '#00FF00',
                  lineHeight: '1.5',
                }}
              />
            </div>
          </Card>

          {/* Right: Code Preview */}
          <Card
            className="overflow-hidden flex flex-col"
            style={{
              backgroundColor: MATRIX_THEME.background,
              color: MATRIX_THEME.textColor,
            }}
          >
            <div className="p-4 border-b" style={{ borderColor: '#21262d' }}>
              <h2 className="text-lg font-semibold" style={{ color: MATRIX_THEME.textColor }}>
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </h2>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="flex min-h-full">
                {/* Line numbers */}
                <div
                  className="select-none text-right pr-4 py-4 pl-2"
                  style={{
                    color: '#484f58',
                    backgroundColor: '#161b22',
                    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    minWidth: '3rem',
                  }}
                >
                  {(codeText || '// Start typing...').split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                {/* Code content */}
                <pre
                  className="font-mono text-sm m-0 flex-1 py-4 pr-4"
                  dangerouslySetInnerHTML={{ __html: highlightedCode || '<span style="color: #8B949E;">// Start typing...</span>' }}
                  style={{
                    fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                    transition: 'opacity 0.3s ease-in-out',
                    opacity: highlightedCode ? 1 : 0.5,
                    lineHeight: '1.5',
                  }}
                />
              </div>
            </div>
          </Card>
        </Split>
      </div>
    </div>
  );
}
