/**
 * TransmutePage - Minimal Text Editor with Code Preview
 * Simple textarea with real-time code preview - no Slate.js, no complex state management
 */

import { useState, useMemo } from 'react';
import Split from 'react-split';
import { Card } from '@/shared/components/ui/card';
import { highlightCode, textToCode, MATRIX_THEME, type CodeLanguage } from './utils/simpleHighlight';
import './transmute.css';

export function TransmutePage() {
  // Simple state - just the text content and language
  const [text, setText] = useState('');
  const [language, setLanguage] = useState<CodeLanguage>('javascript');

  // Generate code preview
  const codeText = useMemo(() => textToCode(text, language), [text, language]);

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

        <div className="text-sm text-muted-foreground">
          {text.length} characters
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
          {/* Left: Text Editor */}
          <Card className="overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Editor</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing..."
                spellCheck={false}
                className="w-full h-full min-h-full p-0 font-mono text-base bg-transparent border-none outline-none resize-none"
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
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
                className="font-mono text-sm leading-relaxed m-0"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
                style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Monaco, monospace',
                }}
              />
            </div>
          </Card>
        </Split>
      </div>
    </div>
  );
}
