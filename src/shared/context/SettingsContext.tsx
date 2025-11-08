import { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
import { STORAGE_KEYS } from '@/shared/utils/constants';
import {
  Settings,
  DEFAULT_SETTINGS,
  TransmuteSettings,
  DistillationSettings,
  ProjectionSettings,
  CulminationSettings,
} from '@/shared/types/settings';

/**
 * Settings context value interface
 */
export interface SettingsContextValue {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  updateTransmuteSettings: (updates: Partial<TransmuteSettings>) => void;
  updateDistillationSettings: (updates: Partial<DistillationSettings>) => void;
  updateProjectionSettings: (updates: Partial<ProjectionSettings>) => void;
  updateCulminationSettings: (updates: Partial<CulminationSettings>) => void;
  resetSettings: () => void;
  hasGeminiApiKey: boolean;
}

/**
 * Settings context
 */
export const SettingsContext = createContext<SettingsContextValue | null>(null);

/**
 * Settings provider props
 */
interface SettingsProviderProps {
  children: React.ReactNode;
}

/**
 * Settings provider component
 * Manages global application settings with localStorage persistence
 */
export function SettingsProvider({ children }: SettingsProviderProps) {
  // Use localStorage hook to persist settings
  const [settings, setSettings] = useLocalStorage<Settings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  );

  /**
   * Update top-level settings
   */
  const updateSettings = useCallback(
    (updates: Partial<Settings>) => {
      setSettings(prev => ({
        ...prev,
        ...updates,
      }));
    },
    [setSettings]
  );

  /**
   * Update Transmute-specific settings
   */
  const updateTransmuteSettings = useCallback(
    (updates: Partial<TransmuteSettings>) => {
      setSettings(prev => ({
        ...prev,
        transmute: {
          ...prev.transmute,
          ...updates,
        },
      }));
    },
    [setSettings]
  );

  /**
   * Update Distillation-specific settings
   */
  const updateDistillationSettings = useCallback(
    (updates: Partial<DistillationSettings>) => {
      setSettings(prev => ({
        ...prev,
        distillation: {
          ...prev.distillation,
          ...updates,
        },
      }));
    },
    [setSettings]
  );

  /**
   * Update Projection-specific settings
   */
  const updateProjectionSettings = useCallback(
    (updates: Partial<ProjectionSettings>) => {
      setSettings(prev => ({
        ...prev,
        projection: {
          ...prev.projection,
          ...updates,
        },
      }));
    },
    [setSettings]
  );

  /**
   * Update Culmination-specific settings
   */
  const updateCulminationSettings = useCallback(
    (updates: Partial<CulminationSettings>) => {
      setSettings(prev => ({
        ...prev,
        culmination: {
          ...prev.culmination,
          ...updates,
        },
      }));
    },
    [setSettings]
  );

  /**
   * Reset all settings to defaults
   */
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  /**
   * Check if Gemini API key is configured
   */
  const hasGeminiApiKey = useMemo(() => {
    return Boolean(settings.geminiApiKey && settings.geminiApiKey.trim().length > 0);
  }, [settings.geminiApiKey]);

  /**
   * Memoize context value to prevent unnecessary re-renders
   */
  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      updateSettings,
      updateTransmuteSettings,
      updateDistillationSettings,
      updateProjectionSettings,
      updateCulminationSettings,
      resetSettings,
      hasGeminiApiKey,
    }),
    [
      settings,
      updateSettings,
      updateTransmuteSettings,
      updateDistillationSettings,
      updateProjectionSettings,
      updateCulminationSettings,
      resetSettings,
      hasGeminiApiKey,
    ]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
