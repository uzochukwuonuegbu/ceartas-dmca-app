export abstract class CacheService<T> {
  abstract store(id: string, data: string): Promise<T>;
  abstract get(id: string): Promise<T>;
  abstract delete(id: string): Promise<T>;
}