import Queue, { QueueOptions } from 'bull';

const REDIS_HOST = process.env.REDIS_HOST || 'redis://localhost:6379';

const queueOpts: QueueOptions = {
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: {
      age: 86_400, // 24 hours
    },
  },
};

export const socialMediaAgentQueue = new Queue('social-media-agent', REDIS_HOST, queueOpts);
export const socialMediaAgentDLQ = new Queue('social-media-agent-dlq', REDIS_HOST, queueOpts);