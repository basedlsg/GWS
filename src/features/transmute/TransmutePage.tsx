/**
 * TransmutePage - Word Editor with Code Aesthetic
 * Split-view editor where text appears as code on the right
 */

import { useState, useCallback, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import Split from 'react-split';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DEFAULT_DOCUMENT_CONTENT, CODE_THEMES } from './constants';
import { transformToCode, highlightCode } from './utils/textToCode';
import type { CodeLanguage } from './types';
import './transmute.css';

export function TransmutePage() {
  const [value, setValue] = useState<Descendant[]>(DEFAULT_DOCUMENT_CONTENT);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('javascript');
  const [selectedTheme, setSelectedTheme] = useState('matrix-green');

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const handleChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
  }, []);

  // Generate code preview
  const codeText = useMemo(() => {
    return transformToCode(value, selectedLanguage, selectedTheme);
  }, [value, selectedLanguage, selectedTheme]);

  const theme = CODE_THEMES[selectedTheme] || CODE_THEMES['matrix-green']!;

  // Highlighted code HTML
  const highlightedCode = useMemo(() => {
    return highlightCode(codeText, selectedLanguage, theme);
  }, [codeText, selectedLanguage, theme]);

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Transmute</h1>
        <p className="text-muted-foreground">Word editor where your text looks like code</p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex gap-4">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as CodeLanguage)}
          className="px-3 py-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
          <option value="cpp">C++</option>
          <option value="ruby">Ruby</option>
          <option value="java">Java</option>
        </select>

        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="matrix-green">Matrix Green</option>
          <option value="neon-purple">Neon Purple</option>
          <option value="tokyo-nights">Tokyo Nights</option>
          <option value="synthwave">Synthwave</option>
          <option value="hacker-terminal">Hacker Terminal</option>
        </select>

        <Button variant="outline">New Document</Button>
        <Button variant="outline">Export</Button>
      </div>

      {/* Split View Editor */}
      <div className="flex-1 overflow-hidden">
        <Split
          className="split-container"
          sizes={[50, 50]}
          minSize={300}
          gutterSize={10}
          style={{ display: 'flex', height: '100%' }}
        >
          {/* Left: Rich Text Editor */}
          <Card className="overflow-auto p-4">
            <Slate editor={editor} initialValue={value} onValueChange={handleChange}>
              <Editable
                placeholder="Start writing..."
                className="outline-none min-h-full"
                style={{ fontSize: '16px', fontFamily: 'system-ui, sans-serif' }}
              />
            </Slate>
          </Card>

          {/* Right: Code Preview */}
          <Card
            className="overflow-auto p-4"
            style={{ backgroundColor: theme.background, color: theme.textColor }}
          >
            <pre
              className="font-mono text-sm"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </Card>
        </Split>
      </div>
    </div>
  );
}
