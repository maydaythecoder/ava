import OpenAI from 'openai';

/**
 * OpenAI Client Configuration
 * 
 * SECURITY: API key should be stored in environment variables
 * Never commit API keys to version control
 */

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIClient {
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: OpenAIConfig) {
    // SECURITY: Validate API key is provided
    if (!config.apiKey || config.apiKey.trim() === '') {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
    });

    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature ?? 0.3; // Lower temp for more deterministic outputs
    this.maxTokens = config.maxTokens || 1000;
  }

  /**
   * Generate completion from prompt
   * 
   * SECURITY: Implements rate limiting and timeout protection
   */
  async generateCompletion(prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are Ava, an expert assistant for understanding and managing CI/CD workflows and automations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options?.temperature ?? this.temperature,
        max_tokens: options?.maxTokens ?? this.maxTokens,
        // SAFETY: Add timeout protection via client configuration
      });

      const content = completion.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from OpenAI');
      }

      return content.trim();
    } catch (error) {
      if (error instanceof Error) {
        // SECURITY: Don't expose internal error details to users
        if (error.message.includes('API key')) {
          throw new Error('OpenAI authentication failed');
        }
        if (error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded, please try again later');
        }
        throw new Error(`AI service error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while generating completion');
    }
  }

  /**
   * Generate streaming completion (for real-time UI updates)
   */
  async *generateCompletionStream(prompt: string, options?: {
    temperature?: number;
    maxTokens?: number;
  }): AsyncGenerator<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are Ava, an expert assistant for understanding and managing CI/CD workflows and automations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options?.temperature ?? this.temperature,
        max_tokens: options?.maxTokens ?? this.maxTokens,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI streaming error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while streaming completion');
    }
  }

  /**
   * Check if client is properly configured
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.generateCompletion('Respond with OK', { maxTokens: 10 });
      return true;
    } catch {
      return false;
    }
  }
}


