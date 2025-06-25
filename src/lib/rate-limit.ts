import { LRUCache } from "lru-cache";

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number) ?? 0;

        if (tokenCount >= limit) {
          reject(new Error("Rate limit exceeded"));
          return;
        }

        tokenCache.set(token, tokenCount + 1);
        resolve();
      }),
  };
}
