import { Module } from '@nestjs/common';
import { SerperProvider } from './GoogleSearch/serper.provider';
import { OpenAIProvider } from './OpenAI/openai.provider';

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
  ],
  exports: [
    'SEARCH_PROVIDER',
    'LLM_PROVIDER'
  ],
})
export class ProviderModule {}