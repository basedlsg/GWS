/**
 * TransmuteEditor Component
 * Main editor with live preview
 */

import { useEffect, useRef } from 'react';
import { Textarea } from '@/shared/components/ui/textarea';
import { highlightText, generateThemeCSS } from '../utils/syntax';
import type { TransmuteTheme } from '../types';

interface TransmuteEditorProps {
  text: string;
  language: string;
  theme: TransmuteTheme;
  onChange: (text: string) => void;
}

export function TransmuteEditor({ text, language, theme, onChange }: TransmuteEditorProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  // Update preview when text, language, or theme changes
  useEffect(() => {
    console.log('🔍 [Transmute] useEffect triggered');
    console.log('  - text length:', text.length);
    console.log('  - language:', language);
    console.log('  - theme:', theme);
    console.log('  - previewRef.current:', previewRef.current);

    if (previewRef.current) {
      const highlighted = highlightText(text, language, theme);
      console.log('  - highlighted HTML (first 200 chars):', highlighted.substring(0, 200));

      previewRef.current.innerHTML = `<pre>${highlighted}</pre>`;
      console.log('  - innerHTML set successfully');
    } else {
      console.warn('  - previewRef.current is null!');
    }
  }, [text, language, theme]);

  // Inject theme-specific CSS
  useEffect(() => {
    console.log('🎨 [Transmute] Injecting CSS for theme:', theme);

    const styleId = 'transmute-theme-styles';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleEl) {
      console.log('  - Creating new style element');
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    } else {
      console.log('  - Updating existing style element');
    }

    const css = generateThemeCSS(theme);
    console.log('  - Generated CSS (first 300 chars):', css.substring(0, 300));

    styleEl.textContent = css;
    console.log('  - CSS injected successfully');

    return () => {
      // Cleanup on unmount
      const el = document.getElementById(styleId);
      if (el) {
        el.remove();
      }
    };
  }, [theme]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-2">
        <label htmlFor="input-text" className="block text-sm font-medium text-foreground">
          Input Text
        </label>
        <Textarea
          id="input-text"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your text here... Try markdown headers (#), lists (-), or just write freely."
          className="min-h-[400px] font-mono text-sm resize-y"
          spellCheck={false}
        />
        <p className="text-xs text-muted-foreground">
          {text.length} characters • {text.split('\n').length} lines
        </p>
      </div>

      {/* Preview Panel */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Live Preview</label>
        <div
          id="transmute-preview"
          ref={previewRef}
          className="transmute-preview min-h-[400px] max-h-[600px] overflow-auto"
        />
        <p className="text-xs text-muted-foreground">Preview updates in real-time as you type</p>
      </div>
    </div>
  );
}
