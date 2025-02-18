import { Injectable, UseInterceptors, Inject } from '@nestjs/common';
import { OpenAI } from 'openai';
import { LLMProvider } from '../abstract.provider';
import { CircuitBreakerInterceptor } from '@/infra/interceptors/circuitBreaker.intercepter';
import { Queue } from 'bull';
import Logger from '@/services/utils/logger.service';

@Injectable()
export class OpenAIProvider extends LLMProvider<any> {
  private readonly logger = new Logger('OpenAIProvider');
  private readonly openai: OpenAI;

  constructor(@Inject('SOCIAL_MEDIA_AGENT_DLQ') private readonly deadLetterQ: Queue) {
    super();
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'xyz' });
  }

  @UseInterceptors(CircuitBreakerInterceptor)
  async processPrompt(prompt: string, username: string): Promise<any> {
    try {
      // const response = await this.openai.chat.completions.create({
      //   model: 'gpt-4o',
      //   messages: [
      //     {"role": "system", "content": "You are a helpful assistant. Provide information in JSON format."},
      //     {"role": "user", "content": prompt}
      // ],
      // max_tokens: 500,
      // temperature: 0.5
      // });

      // MOCKING, I NEED TO PAY TO USE OPENAI
      return {
        "username": username,
        "Instagram": {
          "followers": "11M",
          "following": "378",
          "posts": "271",
          "likes": "83K",
          "comments": "1296"
        },
        "Facebook": {
          "likes": "9540",
          "talking_about_this": "3"
        },
        "YouTube": {
          "views": "1.4M"
        },
        "TikTok": {
          "likes": "8.1M",
          "followers": "1.4M"
        },
        "LinkedIn": {
          "members": "1 billion"
        }
      };
    } catch (error: any) {
      this.logger.error(`OpenAI API error: ${error.message}`, {});
      await this.fallback({ username, data: {} }, error)
      throw error;
    }
  }

  async fallback(payload: { username: string; data: any }, error: Error): Promise<string> {
    try {
      // Push failed request to BullMQ for reprocessing
      await this.deadLetterQ.add('processFailedRequest', {
        payload,
        error: error.message,
        timestamp: Date.now(),
      });

      return `Fallback response: OpenAI is temporarily unavailable. Request queued for retry. Username: ${payload.username}`;
    } catch (queueError) {
      return `Critical Failure: Unable to queue request.`;
    }
  }
}