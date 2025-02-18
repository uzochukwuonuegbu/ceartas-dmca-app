import test from 'node:test';
import assert from 'node:assert';
import { SocialMediaAgentService } from './socialMediaAgent.service';
import { CacheService } from '@/infra/abstract.infra';
import { ProcessAnalysisDto } from '@/handlers/httpEvents.ts/dto/ProcessRequest.dto';
import { Queue } from 'bull';


// JUST PROOF OF CONCEPT BECUASE OF LIMITED TIME --- Ideally should run in CI/CD Pipeline

const mockCacheService = {
  get: async (key: string) => null,
  store: async (key: string, value: string) => {},
};

const mockQueue = {
  add: async (jobName: string, payload: any) => {},
};

// Instantiate service with mocks
const service = new SocialMediaAgentService(
  mockCacheService as unknown as CacheService<any>,
  mockQueue as unknown as Queue
);

test('should return default response if username is missing', async () => {
  const payload = {} as ProcessAnalysisDto;
  const result = await service.processRequest(payload, 'client123');
  
  assert.deepStrictEqual(result, { username: undefined, data: null });
});

test('should return cached data if available', async () => {
  const mockData = { Instagram: { followers: '11M' } };
  mockCacheService.get = async () => null;
  
  const payload = { username: 'john_doe' } as ProcessAnalysisDto;
  const result = await service.processRequest(payload, 'client123');

  assert.deepStrictEqual(result, { username: 'john_doe', data: mockData });
});

test('should store request and add to queue if no cache exists', async () => {
  const payload = { username: 'new_user' } as ProcessAnalysisDto;

  let storedKey = '';
  let addedJob = '';
  mockCacheService.store = async (key, value) => { storedKey = key; };
  mockQueue.add = async (job, data) => { addedJob = job; };

  const result = await service.processRequest(payload, 'client123');

  assert.strictEqual(storedKey.startsWith('req_new_user_'), true, 'Cache key should be generated');
  assert.strictEqual(addedJob, 'processSocialMediaEvent', 'Job should be added to queue');
  assert.strictEqual(result.username, 'new_user');
  assert.deepStrictEqual(result.data.Instagram?.followers, '11M');
});
