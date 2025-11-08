/**
 * Groq API Client
 * Wrapper for Groq SDK with rate limiting and error handling
 */

import Groq from 'groq-sdk';

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export class GroqClient {
  private client: Groq | null = null;
  private apiKey: string | null = null;
  private retryDelay = 1000; // Start with 1 second
  private maxRetries = 3;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.setApiKey(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  isConfigured(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  /**
   * Create chat completion with rate limit handling
   */
  async createChatCompletion(
    messages: GroqMessage[],
    options: GroqCompletionOptions = {}
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Groq client not configured. Please add API key in Settings.');
    }

    const {
      model = 'llama-3.1-70b-versatile', // Default to Llama 3.1 70B
      temperature = 0.7,
      max_tokens = 1024,
      top_p = 1,
    } = options;

    return this.executeWithRetry(async () => {
      if (!this.client) throw new Error('Client not initialized');

      const completion = await this.client.chat.completions.create({
        messages,
        model,
        temperature,
        max_tokens,
        top_p,
      });

      return completion.choices[0]?.message?.content || '';
    });
  }

  /**
   * Execute request with exponential backoff for rate limiting
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      // Check if it's a rate limit error (429)
      if (error?.status === 429 && retryCount < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, retryCount); // Exponential backoff

        console.warn(
          `Rate limit hit. Retrying in ${delay}ms... (${retryCount + 1}/${this.maxRetries})`
        );

        await this.sleep(delay);
        return this.executeWithRetry(fn, retryCount + 1);
      }

      // Check for capacity errors (498)
      if (error?.status === 498) {
        throw new Error(
          'Groq capacity exceeded. Please try again in a few moments.'
        );
      }

      // Check for server errors (500)
      if (error?.status === 500) {
        throw new Error('Groq server error. Please try again later.');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get available models
   */
  static getAvailableModels() {
    return [
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B (Best Quality)',
        description: 'Most capable model, best for complex tasks',
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B (Fastest)',
        description: 'Fast responses, good for simple tasks',
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Good balance of speed and quality',
      },
      {
        id: 'gemma-7b-it',
        name: 'Gemma 7B',
        description: 'Efficient model by Google',
      },
    ];
  }
}
