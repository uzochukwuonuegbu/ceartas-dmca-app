import { Injectable } from '@nestjs/common';
import * as Redis from 'redis';
import { CacheService } from '../abstract.infra';
import Logger from '../../services/utils/logger.service';

@Injectable()
export class RedisService extends CacheService<any> {
  private client = Redis.createClient({ url: process.env.REDIS_URL });
  private logger = new Logger('RedisService');

  constructor() {
    super()
    this.client.connect().then(() => {})
    this.client.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`, {});
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.del(id);
  }

  async get(id: string) {
    return this.client.get(id)
  }

  async store(id: string, result: string): Promise<void> {
    await this.client.set(id, result);
  }
}
