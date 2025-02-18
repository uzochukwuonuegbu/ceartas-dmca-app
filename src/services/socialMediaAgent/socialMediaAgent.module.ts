import { Module } from '@nestjs/common';
import { SocialMediaAgentService } from './socialMediaAgent.service';
import { ProviderModule } from '@/providers/module.providers';
import { InfraModule } from '@/infra/module.infra';

@Module({
  imports: [InfraModule, ProviderModule],
  providers: [SocialMediaAgentService],
  exports: [SocialMediaAgentService],
})
export class SocialMediaAgentModule {}