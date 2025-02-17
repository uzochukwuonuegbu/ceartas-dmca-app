import { Injectable, Inject } from '@nestjs/common';
import { Queue } from 'bull';
import { CacheService } from '@/infra/abstract.infra';
import { ProcessAnalysisDto, RetrieveDataDto } from '@/handlers/httpEvents.ts/dto/ProcessRequest.dto';
import { SocialMediaStats } from '@/types';
import Logger from '../utils/logger.service';

@Injectable()
export class SocialMediaAgentService {
  private logger = new Logger('SocialMediaAgentService');

  constructor(
    @Inject('SOCIAL_MEDIA_AGENT_CACHE') private readonly cacheService: CacheService<string>,
    @Inject('SOCIAL_MEDIA_AGENT_QUEUE') private readonly socialMediaAgentQueue: Queue
  ) {}

  async processRequest(payload: ProcessAnalysisDto, clientId: string): Promise<SocialMediaStats> {
    const { username } = payload;
    if (!username) {
      return { "username": username,
      "data": {}
    };
    }
    const requestId = `req_${username}_${Date.now()}`;
    this.logger.log(`Processing request: ${requestId}`, {});

    const cachedResult = await this.cacheService.get(`cache:${username}`);
    if (cachedResult) {
      this.logger.log(`Cache hit for username: ${username}`, {});
      const cachedRes = JSON.parse(cachedResult)
      return { username, data: { ...cachedRes } };
    }

    await this.cacheService.store(requestId, clientId);
    await this.socialMediaAgentQueue.add('processSocialMediaEvent', { requestId, username, payload });

    return { "username": username,
      "data": {}
    };
  }

  async retrieveData(payload: RetrieveDataDto): Promise<SocialMediaStats> {
    const { username } = payload;
    if (!username) {
      return { "username": username,
      "data": {}
    };
    }
    const cachedResult = await this.cacheService.get(`cache:${username}`);
    if (cachedResult) {
      this.logger.log(`Cache hit for username: ${username}`, {});
      const cachedRes = JSON.parse(cachedResult)
      return { username, data: { ...cachedRes } };
    }
    return { "username": username,
      "data": {}
    };
  }
}