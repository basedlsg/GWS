/**
 * TransmutePage - Word Editor with Code Aesthetic
 * Split-view editor where text appears as code on the right
 */

import { useState, useCallback, useMemo } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import Split from 'react-split';
import { Sparkles } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { DEFAULT_DOCUMENT_CONTENT, CODE_THEMES, DEFAULT_SETTINGS } from './constants';
import { transformToCode, highlightCode } from './utils/textToCode';
import { toggleMark } from './utils/slateHelpers';
import { Element, createLeafRenderer } from './components/SlateRenderers';
import { EditorToolbar } from './components/EditorToolbar';
import { useColorAnimation } from './hooks/useColorAnimation';
import type { CodeLanguage, CustomEditor } from './types';
import './transmute.css';

export function TransmutePage() {
  const [value, setValue] = useState<Descendant[]>(DEFAULT_DOCUMENT_CONTENT);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('javascript');
  const [selectedTheme, setSelectedTheme] = useState('matrix-green');
  const [fontSize, setFontSize] = useState(DEFAULT_SETTINGS.fontSize);
  const [fontFamily, setFontFamily] = useState(DEFAULT_SETTINGS.fontFamily);
  const [colorAnimationEnabled, setColorAnimationEnabled] = useState(DEFAULT_SETTINGS.showRandomColors);

  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  // Color animation
  const { getColorForCharIndex } = useColorAnimation(
    colorAnimationEnabled,
    DEFAULT_SETTINGS.colorAnimationSpeed
  );

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

  // Render element
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);

  // Render leaf with color animation
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    const LeafRenderer = createLeafRenderer(
      colorAnimationEnabled ? getColorForCharIndex : undefined
    );
    return <LeafRenderer {...props} />;
  }, [colorAnimationEnabled, getColorForCharIndex]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!event.ctrlKey && !event.metaKey) return;

    switch (event.key) {
      case 'b': {
        event.preventDefault();
        toggleMark(editor as CustomEditor, 'bold');
        break;
      }
      case 'i': {
        event.preventDefault();
        toggleMark(editor as CustomEditor, 'italic');
        break;
      }
      case 'u': {
        event.preventDefault();
        toggleMark(editor as CustomEditor, 'underline');
        break;
      }
    }
  }, [editor]);

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">Transmute</h1>
        <p className="text-muted-foreground">Word editor where your text looks like code</p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as CodeLanguage)}
          className="px-3 py-2 border rounded text-sm"
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
          className="px-3 py-2 border rounded text-sm"
        >
          <option value="matrix-green">Matrix Green</option>
          <option value="neon-purple">Neon Purple</option>
          <option value="tokyo-nights">Tokyo Nights</option>
          <option value="synthwave">Synthwave</option>
          <option value="hacker-terminal">Hacker Terminal</option>
        </select>

        {/* Color Animation Toggle */}
        <label className="flex items-center space-x-2 border px-3 py-2 rounded cursor-pointer hover:bg-accent">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-normal">Animated Colors</span>
          <input
            type="checkbox"
            checked={colorAnimationEnabled}
            onChange={(e) => setColorAnimationEnabled(e.target.checked)}
            className="ml-2 h-4 w-4"
          />
        </label>

        <div className="flex-1" />

        <Button variant="outline" size="sm">New Document</Button>
        <Button variant="outline" size="sm">Export</Button>
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
          <Card className="overflow-auto p-4 flex flex-col">
            <Slate editor={editor} initialValue={value} onValueChange={handleChange}>
              <EditorToolbar
                fontSize={fontSize}
                fontFamily={fontFamily}
                onFontSizeChange={setFontSize}
                onFontFamilyChange={setFontFamily}
              />
              <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Start writing..."
                spellCheck
                autoFocus
                onKeyDown={handleKeyDown}
                className="outline-none flex-1"
                style={{ fontSize: `${fontSize}px`, fontFamily }}
              />
            </Slate>
          </Card>

          {/* Right: Code Preview */}
          <Card
            className="overflow-auto p-4"
            style={{ backgroundColor: theme.background, color: theme.textColor }}
          >
            <pre
              className="font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </Card>
        </Split>
      </div>
    </div>
  );
}
