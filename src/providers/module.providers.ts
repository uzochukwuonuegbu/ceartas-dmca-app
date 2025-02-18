import { Module } from '@nestjs/common';
import { SerperProvider } from './GoogleSearch/serper.provider';
import { OpenAIProvider } from './OpenAI/openai.provider';
import { socialMediaAgentDLQ } from '@/infra/queue/bullMQ.queues';

@Module({
  imports: [
  ],
  providers: [
    {
        provide: 'SEARCH_PROVIDER',
        useClass: SerperProvider,
      },
      {
        provide: 'LLM_PROVIDER',
        useClass: OpenAIProvider,
      },
      {
        provide: 'SOCIAL_MEDIA_AGENT_DLQ',
        useValue: socialMediaAgentDLQ,
      },
  ],
  exports: [
    'SEARCH_PROVIDER',
    'LLM_PROVIDER'
  ],
})
export class ProviderModule {}