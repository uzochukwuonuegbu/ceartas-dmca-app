import { Injectable, Inject } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { WebSocket } from '../../infra/api-gateway/socket-io.gateway';
import { SearchProvider, LLMProvider } from '@/providers/abstract.provider';
import { CacheService } from '@/infra/abstract.infra';
import { Agent } from '../../types';
import Logger from '@/services/utils/logger.service';

@Injectable()
export class SocialMediaAgentWorker extends Agent {
  private logger = new Logger('SocialMediaAgentWorker');

  constructor(
    @Inject('SOCIAL_MEDIA_AGENT_WEBSOCKET') private readonly websocketGateway: WebSocket,
    @Inject('SOCIAL_MEDIA_AGENT_CACHE') private readonly cacheService: CacheService<string>,
    @Inject('SOCIAL_MEDIA_AGENT_QUEUE') private readonly socialMediaAgentQueue: Queue,
    @Inject('SOCIAL_MEDIA_AGENT_DLQ') private readonly socialMediaAgentDlq: Queue,
    @Inject('SEARCH_PROVIDER') private readonly searchProvider: SearchProvider<string>,
    @Inject('LLM_PROVIDER') private readonly llmProvider: LLMProvider<string>,
  ) {
    super(
      'Social Media Analyst',
      'Analyze social media profiles and extract follower counts or recent posts.',
      'You are an AI agent tasked with gathering and analyzing social media data for a given username.',
      'Retrieve social media information for a given username and output it as JSON.'
    )
    this.setupWorkers();
  }

  private setupWorkers() {
    this.socialMediaAgentQueue.process('processSocialMediaEvent', this.processSocialMediaEvent.bind(this));
    this.socialMediaAgentDlq.process('processFailedRequest', this.processFailedRequest.bind(this));
  }

  async processSocialMediaEvent(job: Job<any>): Promise<void> {
    const { requestId, username, payload } = job.data;
    this.logger.log(`Processing request: ${requestId}`, {});

    const searchResults = await this.searchProvider.processSearch(payload);

    const data = JSON.parse(searchResults);

    const snippets = data?.organic.map((result: any, index: number) =>
        `${index + 1}. ${result?.title || 'N/A'} - ${result?.snippet || 'N/A'} (${result?.link || 'N/A'})`
    )
    .join('\n') || 'No search results found.';


    const prompt = `Analyze the following search results and extract information about social media platforms, 
    follower counts, likes, or posts. Provide the result in JSON format where the keys are the 
    platform names and the values are their metrics:\n\n${snippets}`;

    const llmResponse = await this.llmProvider.processPrompt(prompt, username);

    await this.cacheService.store(`cache:${payload.username}`, JSON.stringify(llmResponse));
    const clientId = await this.cacheService.get(requestId);
    if (clientId) {
      this.websocketGateway.server.to(clientId).emit('requestCompleted', { requestId, data: llmResponse });
    } else {
      return;
    }
  }

  async processFailedRequest(job: Job<any>): Promise<void> {
    // - Report using cloudwatch alarms
    // - Reprocess data is needed
    return;
  }
}