/**
 * Gemini API client wrapper
 * Handles communication with Google's Gemini 2.5 Pro API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse, GenerationOptions } from '@/shared/types/api';

/**
 * Gemini API client class
 */
export class GeminiClient {
  private client: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    if (apiKey && apiKey.trim().length > 0) {
      try {
        this.client = new GoogleGenerativeAI(apiKey);
        this.model = this.client.getGenerativeModel({
          model: 'gemini-pro',
        });
      } catch (error) {
        console.error('Failed to initialize Gemini client:', error);
        this.client = null;
        this.model = null;
      }
    }
  }

  /**
   * Check if the client is configured with a valid API key
   */
  isConfigured(): boolean {
    return this.client !== null && this.model !== null;
  }

  /**
   * Generate content using Gemini API
   * @param prompt - The prompt to send to the API
   * @param options - Optional generation parameters
   * @returns Generated text response
   * @throws Error if not configured or API call fails
   */
  async generateContent(
    prompt: string,
    options?: GenerationOptions
  ): Promise<GeminiResponse> {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    try {
      const generationConfig = {
        temperature: options?.temperature ?? 0.7,
        topK: options?.topK ?? 40,
        topP: options?.topP ?? 0.95,
        maxOutputTokens: options?.maxTokens ?? 1024,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = result.response;
      const text = response.text();

      return {
        text,
        finishReason: response.candidates?.[0]?.finishReason,
        safetyRatings: response.candidates?.[0]?.safetyRatings,
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate content'
      );
    }
  }

  /**
   * Generate streaming content (for future use)
   * @param prompt - The prompt to send to the API
   * @param onChunk - Callback for each chunk of generated text
   * @param options - Optional generation parameters
   */
  async generateContentStream(
    prompt: string,
    onChunk: (text: string) => void,
    options?: GenerationOptions
  ): Promise<void> {
    if (!this.model) {
      throw new Error('Gemini API not configured');
    }

    try {
      const generationConfig = {
        temperature: options?.temperature ?? 0.7,
        topK: options?.topK ?? 40,
        topP: options?.topP ?? 0.95,
        maxOutputTokens: options?.maxTokens ?? 1024,
      };

      const result = await this.model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        onChunk(chunkText);
      }
    } catch (error) {
      console.error('Gemini API streaming error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to generate streaming content'
      );
    }
  }
}

/**
 * Create a Gemini client instance
 * @param apiKey - Optional API key (if not provided, client won't be configured)
 * @returns GeminiClient instance
 */
export function createGeminiClient(apiKey?: string): GeminiClient {
  return new GeminiClient(apiKey);
}
