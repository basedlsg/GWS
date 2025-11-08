/**
 * Unified AI Hook
 * Intelligently selects between Groq, Gemini, and template fallbacks
 */

import { useState, useCallback, useMemo } from 'react';
import { useSettings } from './useSettings';
import { GroqClient, GroqMessage } from '@/lib/groq';
import { GeminiClient } from '@/lib/gemini';

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  provider: 'groq' | 'gemini' | 'template';
  error?: string;
}

/**
 * Hook to manage AI completions with automatic provider selection
 */
export function useAI() {
  const { settings, hasGroqApiKey, hasGeminiApiKey } = useSettings();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize clients
  const groqClient = useMemo(() => {
    if (hasGroqApiKey && settings.groqApiKey) {
      return new GroqClient(settings.groqApiKey);
    }
    return null;
  }, [hasGroqApiKey, settings.groqApiKey]);

  const geminiClient = useMemo(() => {
    if (hasGeminiApiKey && settings.geminiApiKey) {
      return new GeminiClient(settings.geminiApiKey);
    }
    return null;
  }, [hasGeminiApiKey, settings.geminiApiKey]);

  /**
   * Get the active AI provider based on settings and availability
   */
  const activeProvider = useMemo(() => {
    // Respect user's preferred provider if they have the API key
    if (settings.preferredAIProvider === 'groq' && groqClient) {
      return 'groq';
    }
    if (settings.preferredAIProvider === 'gemini' && geminiClient) {
      return 'gemini';
    }

    // Fallback: use whichever is available (prefer Groq for speed)
    if (groqClient) return 'groq';
    if (geminiClient) return 'gemini';

    return 'template';
  }, [settings.preferredAIProvider, groqClient, geminiClient]);

  /**
   * Generate AI completion with automatic provider selection and fallback
   */
  const generateCompletion = useCallback(
    async (
      prompt: string | GroqMessage[],
      options: AIOptions = {},
      fallbackFn?: () => Promise<string> | string
    ): Promise<AIResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Try Groq first if available
        if (activeProvider === 'groq' && groqClient) {
          try {
            const messages: GroqMessage[] = typeof prompt === 'string'
              ? [{ role: 'user', content: prompt }]
              : prompt;

            const text = await groqClient.createChatCompletion(messages, {
              temperature: options.temperature,
              max_tokens: options.maxTokens,
            });

            return {
              text,
              provider: 'groq',
            };
          } catch (groqError: any) {
            console.warn('Groq failed, trying Gemini fallback:', groqError.message);

            // If Groq fails, try Gemini
            if (geminiClient) {
              try {
                const promptText = typeof prompt === 'string'
                  ? prompt
                  : prompt.map(m => m.content).join('\n');

                const response = await geminiClient.generateContent(promptText);
                return {
                  text: response.text,
                  provider: 'gemini',
                };
              } catch (geminiError: any) {
                console.warn('Gemini also failed, using template:', geminiError.message);
              }
            }
          }
        }

        // Try Gemini if it's the active provider
        if (activeProvider === 'gemini' && geminiClient) {
          try {
            const promptText = typeof prompt === 'string'
              ? prompt
              : prompt.map(m => m.content).join('\n');

            const response = await geminiClient.generateContent(promptText);
            return {
              text: response.text,
              provider: 'gemini',
            };
          } catch (geminiError: any) {
            console.warn('Gemini failed, using template:', geminiError.message);
          }
        }

        // Fallback to template
        if (fallbackFn) {
          const text = await Promise.resolve(fallbackFn());
          return {
            text,
            provider: 'template',
          };
        }

        throw new Error('No AI provider available and no fallback provided');

      } catch (err: any) {
        const errorMessage = err.message || 'Failed to generate AI response';
        setError(errorMessage);

        // Final fallback
        if (fallbackFn) {
          const text = await Promise.resolve(fallbackFn());
          return {
            text,
            provider: 'template',
            error: errorMessage,
          };
        }

        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [activeProvider, groqClient, geminiClient]
  );

  return {
    generateCompletion,
    isLoading,
    error,
    activeProvider,
    isConfigured: activeProvider !== 'template',
  };
}
