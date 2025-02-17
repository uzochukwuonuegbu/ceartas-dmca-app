import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { socialMediaAgentQueue, socialMediaAgentDLQ } from './queue/bullMQ.queues';
import { WebSocket } from './api-gateway/socket-io.gateway';
import { RedisService } from './cache/redis.cache';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'social-media-agent' },
    ),
    BullModule.registerQueue({ name: 'social-media-agent-dlq' }),
  ],
  providers: [
    { provide: 'SOCIAL_MEDIA_AGENT_QUEUE', useValue: socialMediaAgentQueue },
    { provide: 'SOCIAL_MEDIA_AGENT_DLQ', useValue: socialMediaAgentDLQ },
    { provide: 'SOCIAL_MEDIA_AGENT_WEBSOCKET', useClass: WebSocket },
    { provide: 'SOCIAL_MEDIA_AGENT_CACHE', useClass: RedisService },
  ],
  exports: [
    'SOCIAL_MEDIA_AGENT_QUEUE',
    'SOCIAL_MEDIA_AGENT_DLQ',
    'SOCIAL_MEDIA_AGENT_WEBSOCKET',
    'SOCIAL_MEDIA_AGENT_CACHE',
  ],
})
export class InfraModule {}