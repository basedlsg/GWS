/**
 * Hook for interacting with Gemini API with automatic fallback support
 */

import { useState, useMemo, useCallback } from 'react';
import { useSettings } from './useSettings';
import { createGeminiClient } from '@/lib/gemini';
import {
  generateTasksFallback,
  generateMeetingDialogueFallback,
  generateAchievementNarativeFallback,
  parseTasksFromText,
} from '@/shared/services/fallbackGenerators';
import {
  Task,
  Persona,
  ScenarioType,
  ParticipantRole,
  ConversationMessage,
} from '@/shared/types/api';

/**
 * Hook for Gemini API interactions with fallback support
 */
export function useGeminiAPI() {
  const { settings, hasGeminiApiKey } = useSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create Gemini client (memoized)
  const client = useMemo(
    () => createGeminiClient(settings.geminiApiKey),
    [settings.geminiApiKey]
  );

  /**
   * Generate tasks from a goal
   * Uses Gemini API if available, falls back to template-based generation
   */
  const generateTasks = useCallback(
    async (goal: string, persona: Persona = 'strategic'): Promise<Task[]> => {
      if (!goal.trim()) {
        return [];
      }

      setIsGenerating(true);
      setError(null);

      try {
        if (client.isConfigured()) {
          // Use Gemini API
          const prompt = `You are a ${persona} productivity coach. Break down this goal into 6-8 specific, actionable tasks. Prioritize them as high, medium, or low priority.

Goal: ${goal}

Format your response as a numbered list with clear, actionable items. Each task should be specific and measurable. Indicate priority level (high/medium/low) if relevant.`;

          const response = await client.generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 800,
          });

          const tasks = parseTasksFromText(response.text);

          if (tasks.length === 0) {
            // Fall back if parsing failed
            return generateTasksFallback(goal, persona);
          }

          return tasks;
        } else {
          // Use fallback templates
          return generateTasksFallback(goal, persona);
        }
      } catch (err) {
        console.error('Error generating tasks:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate tasks');

        // Fall back to templates on error
        return generateTasksFallback(goal, persona);
      } finally {
        setIsGenerating(false);
      }
    },
    [client]
  );

  /**
   * Generate meeting dialogue response
   * Uses Gemini API if available, falls back to contextual templates
   */
  const generateMeetingResponse = useCallback(
    async (
      scenarioType: ScenarioType,
      participantRole: ParticipantRole,
      userMessage: string,
      conversationHistory: ConversationMessage[] = [],
      scenarioContext?: string
    ): Promise<string> => {
      if (!userMessage.trim()) {
        return '';
      }

      setIsGenerating(true);
      setError(null);

      try {
        if (client.isConfigured()) {
          // Build conversation history for context
          const historyText = conversationHistory
            .map(msg => `${msg.role === 'user' ? 'You' : 'Participant'}: ${msg.content}`)
            .join('\n');

          const prompt = `You are simulating a ${scenarioType} scenario. You are playing the role of a ${participantRole}.

${scenarioContext ? `Scenario context: ${scenarioContext}` : ''}

${historyText ? `Conversation so far:\n${historyText}\n` : ''}

Respond to the following message in character. Be realistic, professional, and challenging but fair. Ask follow-up questions to simulate a real ${scenarioType}.

User: ${userMessage}

Participant response:`;

          const response = await client.generateContent(prompt, {
            temperature: 0.8,
            maxTokens: 300,
          });

          return response.text.trim();
        } else {
          // Use fallback dialogue generator
          return generateMeetingDialogueFallback(
            scenarioType,
            participantRole,
            userMessage,
            conversationHistory
          );
        }
      } catch (err) {
        console.error('Error generating dialogue:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate response');

        // Fall back to templates on error
        return generateMeetingDialogueFallback(
          scenarioType,
          participantRole,
          userMessage,
          conversationHistory
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [client]
  );

  /**
   * Generate achievement narrative
   * Uses Gemini API if available, falls back to template-based generation
   */
  const generateAchievementNarrative = useCallback(
    async (
      title: string,
      description: string,
      category: string
    ): Promise<string> => {
      if (!title.trim()) {
        return '';
      }

      setIsGenerating(true);
      setError(null);

      try {
        if (client.isConfigured()) {
          const prompt = `Write an inspiring achievement narrative for the following accomplishment. Make it professional, motivating, and reflective. Include sections for Impact and Key Learnings.

Title: ${title}
Description: ${description}
Category: ${category}

Write in first person, past tense. Keep it concise but meaningful (2-3 paragraphs plus Impact and Learnings sections).`;

          const response = await client.generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 500,
          });

          return response.text.trim();
        } else {
          // Use fallback narrative generator
          return generateAchievementNarativeFallback(title, description, category);
        }
      } catch (err) {
        console.error('Error generating narrative:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate narrative');

        // Fall back to templates on error
        return generateAchievementNarativeFallback(title, description, category);
      } finally {
        setIsGenerating(false);
      }
    },
    [client]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isGenerating,
    error,
    hasAPIKey: hasGeminiApiKey,
    isUsingAI: client.isConfigured(),

    // Methods
    generateTasks,
    generateMeetingResponse,
    generateAchievementNarrative,
    clearError,
  };
}
