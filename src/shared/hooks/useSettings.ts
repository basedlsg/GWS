import { useContext } from 'react';
import { SettingsContext, SettingsContextValue } from '@/shared/context/SettingsContext';

/**
 * Hook to access settings context
 *
 * @throws Error if used outside of SettingsProvider
 * @returns Settings context value
 *
 * @example
 * function MyComponent() {
 *   const { settings, updateSettings, hasGeminiApiKey } = useSettings();
 *
 *   return (
 *     <div>
 *       <p>Theme: {settings.theme}</p>
 *       <button onClick={() => updateSettings({ theme: 'dark' })}>
 *         Switch to Dark
 *       </button>
 *     </div>
 *   );
 * }
 */
export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
}
