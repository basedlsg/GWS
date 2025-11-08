/**
 * TransmutePage
 * Main page for the Transmute feature
 * Transforms plain text into beautifully styled, presentation-ready code blocks
 */

import { useState, useEffect } from 'react';
import { Save, Sparkles, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import { useToast } from '@/shared/hooks/use-toast';
import { TransmuteEditor } from './components/TransmuteEditor';
import { ThemeSelector } from './components/ThemeSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { ExportControls } from './components/ExportControls';
import { SavedTransmutations } from './components/SavedTransmutations';
import {
  loadTransmutations,
  saveTransmutation,
  loadDraft,
  saveDraft,
  clearDraft,
} from './utils/storage';
import { detectLanguage } from './utils/syntax';
import { DEFAULT_TEXT } from './constants';
import type { TransmuteTheme, Transmutation } from './types';

export function TransmutePage() {
  const { toast } = useToast();

  // Editor state
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('journal');
  const [theme, setTheme] = useState<TransmuteTheme>('cyberpunk');

  // Saved transmutations
  const [savedTransmutations, setSavedTransmutations] = useState<Transmutation[]>([]);

  // Load initial data
  useEffect(() => {
    // Load saved transmutations
    setSavedTransmutations(loadTransmutations());

    // Load draft or use default text
    const draft = loadDraft();
    if (draft) {
      setText(draft.text);
      setTitle(draft.title);
      setLanguage(draft.language);
      setTheme(draft.theme as TransmuteTheme);
    } else {
      setText(DEFAULT_TEXT);
      setTitle('My Personal Manifesto');
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (text.trim()) {
        saveDraft({ text, title, language, theme });
      }
    }, 1000); // Debounce 1 second

    return () => clearTimeout(timeoutId);
  }, [text, title, language, theme]);

  // Auto-detect language when text changes significantly
  useEffect(() => {
    if (text.length > 50) {
      const detected = detectLanguage(text);
      if (detected !== language && detected !== 'plaintext') {
        setLanguage(detected);
      }
    }
  }, [text]);

  const handleSave = () => {
    if (!text.trim()) {
      toast({
        title: 'Cannot save',
        description: 'Please enter some text first',
        variant: 'destructive',
      });
      return;
    }

    const transmutationTitle = title.trim() || 'Untitled';

    saveTransmutation({
      title: transmutationTitle,
      originalText: text,
      theme,
      language,
    });

    setSavedTransmutations(loadTransmutations());

    toast({
      title: 'Saved!',
      description: `"${transmutationTitle}" has been saved`,
    });
  };

  const handleLoad = (transmutation: Transmutation) => {
    setText(transmutation.originalText);
    setTitle(transmutation.title);
    setLanguage(transmutation.language);
    setTheme(transmutation.theme);
  };

  const handleReset = () => {
    setText(DEFAULT_TEXT);
    setTitle('My Personal Manifesto');
    setLanguage('journal');
    setTheme('cyberpunk');
    clearDraft();

    toast({
      title: 'Reset',
      description: 'Editor reset to default',
    });
  };

  const handleDelete = () => {
    setSavedTransmutations(loadTransmutations());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Transmute</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Transform your thoughts, goals, and reflections into beautifully styled code blocks
        </p>
      </div>

      {/* Main Editor Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Editor</CardTitle>
              <CardDescription>
                Write or paste your text, customize the theme, and watch it transform
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your transmutation a title..."
              className="max-w-md"
            />
          </div>

          <Separator />

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <ThemeSelector value={theme} onChange={setTheme} />
              <LanguageSelector value={language} onChange={setLanguage} />
            </div>

            <div className="flex items-center gap-2">
              <ExportControls text={text} language={language} theme={theme} title={title} />
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>

          <Separator />

          {/* Editor */}
          <TransmuteEditor text={text} language={language} theme={theme} onChange={setText} />
        </CardContent>
      </Card>

      {/* Saved Transmutations */}
      <SavedTransmutations
        transmutations={savedTransmutations}
        onLoad={handleLoad}
        onDelete={handleDelete}
      />

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>1. Write or paste</strong> your personal text - journal entries, goals, affirmations, or any thoughts
          </p>
          <p>
            <strong>2. Choose a theme</strong> - Cyberpunk for neon-accented code, Matrix for classic green-on-black, Retro for warm terminal vibes, or Minimal for clean simplicity
          </p>
          <p>
            <strong>3. Select a type</strong> - Helps categorize and highlight your content appropriately
          </p>
          <p>
            <strong>4. Export</strong> - Copy to clipboard, download as HTML, or save for later
          </p>
          <p className="pt-2 border-t">
            <strong>Tip:</strong> Use markdown syntax like # for headers and - for lists to enhance the styling!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
