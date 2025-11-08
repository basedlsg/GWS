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
 * Main App component
 * Wraps the app with providers and renders the router
 */
function App() {
  return (
    <SettingsProvider>
      <ThemeApplier />
      <AppRouter />
      <Toaster />
    </SettingsProvider>
  );
}

export default App;
