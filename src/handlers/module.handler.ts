import { Module } from '@nestjs/common';
import { SocialMediaAgentWorker } from './queueEvents.ts/socialMediaAgent.worker';
import { SocialMediaAgentService } from '@/services/socialMediaAgent/socialMediaAgent.service';
import { ProviderModule } from '@/providers/module.providers';
import { InfraModule } from '@/infra/module.infra';
import { SocialAgentController } from './httpEvents.ts/analyze.controller';

@Module({
  imports: [InfraModule, ProviderModule],
  controllers: [SocialAgentController],
  providers: [
    SocialAgentController,
    SocialMediaAgentService,
    SocialMediaAgentWorker],
  exports: [SocialAgentController]
})
export class HandlerModule {}