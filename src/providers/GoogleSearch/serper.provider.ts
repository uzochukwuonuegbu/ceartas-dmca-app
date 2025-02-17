import { Injectable, UseInterceptors, Inject } from '@nestjs/common';
import axios from 'axios';
import Logger from '../../services/utils/logger.service';
import { SearchProvider } from '../abstract.provider';
import { CircuitBreakerInterceptor } from '@/infra/interceptors/circuitBreaker.intercepter';
import { Queue } from 'bull';

@Injectable()
export class SerperProvider extends SearchProvider<any> {
  private readonly logger = new Logger('SerperProvider');
  private readonly apiKey: string;
  private readonly apiUrl: string;
  constructor(@Inject('SOCIAL_MEDIA_AGENT_DLQ') private readonly deadLetterQ: Queue) {
    super();
    this.apiUrl = 'https://google.serper.dev/search';
    this.apiKey = process.env.SERPER_API_KEY || 'xxx';
  }

  @UseInterceptors(CircuitBreakerInterceptor)
  async processSearch(payload: any): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        { q: payload.username },
        {
          headers: {
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );
      const result = JSON.stringify(response.data);
      return result;
    } catch (error: any) {
      this.logger.error(`Serper.dev API error: ${error.message}`, {});
     await this.fallback({ username: payload.username, data: payload.data }, error)
     throw error;
    }
  }

  async fallback(payload: { username: string; data: any }, error: Error): Promise<string> {
    try {
      // Push failed request to BullMQ for reprocessing
      await this.deadLetterQ.add('processFailedOpenAIRequest', {
        payload,
        error: error.message,
        timestamp: Date.now(),
      });

      return `Fallback response: Serper is temporarily unavailable. Request queued for retry. Username: ${payload.username}`;
    } catch (queueError) {
      return `Critical Failure: Unable to queue request.`;
    }
  }
}