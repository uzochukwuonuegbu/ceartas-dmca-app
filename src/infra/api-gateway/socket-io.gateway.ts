import { Injectable, Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Logger from '@/services/utils/logger.service';
import { SocialMediaAgentService } from '@/services/socialMediaAgent/socialMediaAgent.service';
import { Queue } from 'bull';
import { CacheService } from '../abstract.infra';

export interface ServerToClientEvents {
  requestCompleted: (payload: any) => void;
}
@Injectable()
@WebSocketGateway()
export class WebSocket {
  @WebSocketServer() server: Server<any, ServerToClientEvents>;
  private logger = new Logger('WebSocketGateway');

  private readonly socialMediaAgent: SocialMediaAgentService
  constructor(@Inject('SOCIAL_MEDIA_AGENT_QUEUE') private readonly socialMediaAgentQueue: Queue, @Inject('SOCIAL_MEDIA_AGENT_CACHE') private readonly cacheService: CacheService<string>) {
    this.socialMediaAgent = new SocialMediaAgentService(this.cacheService, this.socialMediaAgentQueue)
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized', {});
  }

    handleConnection(client: Socket) {
      const apiKey = client.handshake.headers?.['x-api-key'];
      const expectedApiKey = process.env.API_KEY
  
      if (!apiKey || apiKey !== expectedApiKey) {
        this.logger.log('Connection failed: Invalid or missing API key', {});
        client.disconnect();
      } else {
        this.logger.log('Connection successful: Valid API key', {});
      }
    }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected:', { clientId: client.id });
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket, payload: string) {
    const { username, data } = await this.socialMediaAgent.processRequest(JSON.parse(payload), client.id);
    this.server.to(client.id).emit('requestCompleted', { username, data });
  }
}
