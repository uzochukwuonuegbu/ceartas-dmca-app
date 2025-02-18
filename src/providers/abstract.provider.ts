export abstract class SearchProvider<T> {
  abstract processSearch(payload: T): Promise<T>;
  abstract fallback(payload: T, error: Error): Promise<string>;
}

export abstract class LLMProvider<T> {
  abstract processPrompt(payload: T, username: string): Promise<T>;
  abstract fallback(payload: T, error: Error): Promise<string>;
}