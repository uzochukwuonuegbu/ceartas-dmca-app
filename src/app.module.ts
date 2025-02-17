import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaAgentModule } from './services/socialMediaAgent/socialMediaAgent.module';
import { ProviderModule } from './providers/module.providers';
import { InfraModule } from './infra/module.infra';
import { HandlerModule } from './handlers/module.handler';
import { SocialAgentController } from './handlers/httpEvents.ts/analyze.controller';
import Logger from './services/utils/logger.service';

@Module({
  imports: [ConfigModule.forRoot(), InfraModule, ProviderModule, SocialMediaAgentModule, HandlerModule],
  controllers: [SocialAgentController],
  providers: [
    Logger,
  ],
})
export class AppModule {}