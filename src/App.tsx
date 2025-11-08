import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { SettingsProvider } from '@/shared/context/SettingsContext';
import { useSettings } from '@/shared/hooks/useSettings';
import { SettingsDialog } from '@/shared/components/SettingsDialog';
import { Toaster } from '@/shared/components/ui/toaster';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';

function AppContent() {
  const { settings, hasGeminiApiKey } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'cyberpunk');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  return (
    <div className="min-h-screen bg-background text-foreground aurora-bg">
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">The Great Work Suite</h1>
            <p className="text-lg text-muted-foreground">
              Four manifestation and productivity applications in one
            </p>
          </div>
          <div className="flex items-center gap-4">
            {hasGeminiApiKey && (
              <Badge variant="secondary" className="text-xs">
                AI Enabled
              </Badge>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-2">🔮 Transmute</h2>
            <p className="text-muted-foreground">
              Transform plain text into beautifully styled code blocks
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-2">⚗️ Distillation</h2>
            <p className="text-muted-foreground">
              Convert abstract goals into concrete, actionable tasks
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-2">🎯 Projection</h2>
            <p className="text-muted-foreground">
              Practice future scenarios through simulated conversations
            </p>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h2 className="text-2xl font-semibold mb-2">✨ Culmination</h2>
            <p className="text-muted-foreground">
              Visualize and document your future achievements
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg border bg-muted/50">
          <p className="text-sm text-muted-foreground">
            <strong>Current Status:</strong> Settings system complete. Theme: {settings.theme}.{' '}
            {!hasGeminiApiKey && (
              <span>
                Add your Gemini API key in settings for AI-powered features.
              </span>
            )}
          </p>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppContent />
        <Toaster />
      </SettingsProvider>
    </BrowserRouter>
  );
}

export default App;
