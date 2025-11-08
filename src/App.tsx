import { useEffect } from 'react';
import { SettingsProvider } from '@/shared/context/SettingsContext';
import { useSettings } from '@/shared/hooks/useSettings';
import { Toaster } from '@/shared/components/ui/toaster';
import { AppRouter } from './routes';

/**
 * Theme applier component
 * Applies theme class to document root when theme changes
 */
function ThemeApplier() {
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'cyberpunk');
    root.classList.add(settings.theme);
  }, [settings.theme]);

  return null;
}

/**
 * Groq API Key Initializer
 * Checks for environment variable or prompts user to add API key in settings
 */
function GroqInitializer() {
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    // Check if there's an API key in environment variables (for development)
    const envGroqKey = import.meta.env.VITE_GROQ_API_KEY;

    if (envGroqKey && !settings.groqApiKey) {
      updateSettings({
        groqApiKey: envGroqKey,
        preferredAIProvider: 'groq',
      });
      console.log('✓ Groq API key loaded from environment');
    } else if (!settings.groqApiKey && !settings.geminiApiKey) {
      // No API keys configured - user will need to add them in Settings
      console.log('ℹ️ No AI API keys configured. Add your Groq or Gemini API key in Settings for enhanced features.');
    }
  }, []); // Run only once on mount

  return null;
}

/**
 * Main App component
 * Wraps the app with providers and renders the router
 */
function App() {
  return (
    <SettingsProvider>
      <ThemeApplier />
      <GroqInitializer />
      <AppRouter />
      <Toaster />
    </SettingsProvider>
  );
}

export default App;
