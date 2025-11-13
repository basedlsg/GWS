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
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Detect double-enter for immediate transformation
  const lastCharRef = useRef('');

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

  // Auto-transform after 5 seconds of no typing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      triggerTransformation();
    }, 5000);

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

  // Generate stable colored version of text for left side (with variety)
  const coloredText = useMemo(() => {
    if (!text) return '';

    // Base colors (cyan/teal) + jarring colors for variety
    const BASE_COLORS = ['#00FFAA', '#00DDCC', '#00CCDD']; // Shades of cyan/teal

    // Use word position to determine color with random variety
    const words = text.split(/(\s+)/);

    return words.map((word) => {
      if (word.trim()) {
        // Random color selection with weights
        const rand = Math.random() * 100;
        let color: string;

        if (rand < 2) {
          // 2% chance: yellow (very rare, eye-catching)
          color = '#FFFF00';
        } else if (rand < 32) {
          // 30% chance: magenta (jarring contrast)
          color = '#FF00FF';
        } else {
          // 68% chance: one of the base cyan/teal colors
          const colorIndex = Math.floor(Math.random() * BASE_COLORS.length);
          color = BASE_COLORS[colorIndex]!;
        }

        const escapedWord = word.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        return `<span style="color: ${color}; transition: color 0.3s ease-in-out;">${escapedWord}</span>`;
      }
      return word.replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
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
          {text !== transformedText && (
            <div className="text-xs text-yellow-500 animate-pulse">
              Transform pending... (Press Enter twice or wait 5s)
            </div>
          )}
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
            <div className="flex-1 overflow-auto p-4 relative">
              {/* Colored text overlay (shows through transparent textarea) */}
              <div
                className="absolute inset-0 p-4 font-mono text-base pointer-events-none whitespace-pre-wrap break-words"
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                  lineHeight: '1.5',
                  overflowWrap: 'break-word',
                }}
                dangerouslySetInnerHTML={{ __html: coloredText || '<span style="color: #666;">Start typing...</span>' }}
              />
              {/* Transparent textarea (for typing) */}
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder=""
                spellCheck={false}
                className="relative w-full h-full min-h-full p-0 font-mono text-base border-none outline-none resize-none"
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
            <div className="p-4 border-b" style={{ borderColor: '#003300' }}>
              <h2 className="text-lg font-semibold" style={{ color: MATRIX_THEME.textColor }}>
                Code Preview
              </h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre
                className="font-mono text-sm m-0"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                  transition: 'all 0.6s ease-in-out',
                  opacity: highlightedCode ? 1 : 0.5,
                  lineHeight: '1.5',
                }}
              />
            </div>
          </Card>
        </Split>
      </div>
    </div>
  );
}
