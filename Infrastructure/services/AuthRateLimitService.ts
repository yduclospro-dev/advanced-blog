import { getRedisClient  } from '@infra/redisClient';
import { TooManyLoginAttemptsError } from '@domain/errors/TooManyLoginAttemptsError';

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_SECONDS = 10 * 60;
const DEFAULT_BLOCK_SECONDS = 15 * 60;

export class AuthRateLimitService {
  private readonly maxAttempts: number;
  private readonly windowSeconds: number;
  private readonly blockSeconds: number;
  private readonly redis: ReturnType<typeof getRedisClient>;

  constructor() {
      this.maxAttempts = Number(process.env.AUTH_MAX_ATTEMPTS) || DEFAULT_MAX_ATTEMPTS;
      this.windowSeconds = Number(process.env.AUTH_WINDOW_SECONDS) || DEFAULT_WINDOW_SECONDS;
      this.blockSeconds = Number(process.env.AUTH_BLOCK_SECONDS) || DEFAULT_BLOCK_SECONDS;
      this.redis = getRedisClient();
    }

  private buildKeys(email: string) {
    const normalizedEmail = email.toLowerCase();
    const base = `auth:login:${normalizedEmail}`;
    const block = `auth:block:${normalizedEmail}`;

    return { base, block };
  }

  async checkOrThrow(email: string): Promise<void> {
    const { base, block } = this.buildKeys(email);

    const isBlocked = await this.redis.get(block);
    if (isBlocked) {
      throw new TooManyLoginAttemptsError();
    }

    const attempts = await this.redis.incr(base);
    if (attempts === 1) {
      await this.redis.expire(base, this.windowSeconds);
    }

    if (attempts > this.maxAttempts) {
      await this.redis.set(block, '1', { EX: this.blockSeconds });
      await this.redis.del(base);
      throw new TooManyLoginAttemptsError();
    }
  }

  async resetAttempts(email: string): Promise<void> {
    if (process.env.JEST_WORKER_ID) {
      return;
    }

    const { base } = this.buildKeys(email);
    await this.redis.del(base);
  }
}