import { redisClient } from '@infra/redisClient';
import { TooManyLoginAttemptsError } from '@domain/errors/TooManyLoginAttemptsError';

const DEFAULT_MAX_ATTEMPTS = 5;
const DEFAULT_WINDOW_SECONDS = 10 * 60;
const DEFAULT_BLOCK_SECONDS = 15 * 60;

export class AuthRateLimitService {
  private readonly maxAttempts: number;
  private readonly windowSeconds: number;
  private readonly blockSeconds: number;

  constructor() {
      this.maxAttempts = Number(process.env.AUTH_MAX_ATTEMPTS) || DEFAULT_MAX_ATTEMPTS;
      this.windowSeconds = Number(process.env.AUTH_WINDOW_SECONDS) || DEFAULT_WINDOW_SECONDS;
      this.blockSeconds = Number(process.env.AUTH_BLOCK_SECONDS) || DEFAULT_BLOCK_SECONDS;
      console.log("ENV_AUTH_BLOCK_SECONDS:", Number(process.env.AUTH_BLOCK_SECONDS));
    }

  private buildKeys(email: string) {
    const normalizedEmail = email.toLowerCase();
    const base = `auth:login:${normalizedEmail}`;
    const block = `auth:block:${normalizedEmail}`;

    return { base, block };
  }

  async checkOrThrow(email: string): Promise<void> {
    console.log("block seconds:", this.blockSeconds);
    const { base, block } = this.buildKeys(email);

    const isBlocked = await redisClient.get(block);
    if (isBlocked) {
      throw new TooManyLoginAttemptsError();
    }

    const attempts = await redisClient.incr(base);

    console.log(`Login attempts for ${email}: ${attempts}`);

    if (attempts === 1) {
      await redisClient.expire(base, this.windowSeconds);
    }

    if (attempts > this.maxAttempts) {
      await redisClient.set(block, '1', { EX: this.blockSeconds });
      await redisClient.del(base);
      throw new TooManyLoginAttemptsError();
    }
  }

  async resetAttempts(email: string): Promise<void> {
    const { base } = this.buildKeys(email);
    await redisClient.del(base);
  }
}