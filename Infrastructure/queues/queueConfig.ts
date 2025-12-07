import Queue, { QueueOptions } from "bull";

const isTest =
  process.env.NODE_ENV === "test" || process.env.TEST_IN_DOCKER === "true";

function getRedisConfig(): QueueOptions {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  
  if (redisUrl.startsWith("rediss://")) {
    try {
      const url = new URL(redisUrl);
      
      return {
        redis: {
          host: url.hostname,
          port: parseInt(url.port) || 6379,
          username: url.username || undefined,
          password: url.password || undefined,
          tls: {
            rejectUnauthorized: false,
          },
        },
      };
    } catch (error) {
      console.error("Failed to parse Redis URL:", error);
      throw error;
    }
  }
  
  return {
    redis: redisUrl,
  };
}

export const emailQueue = isTest
  ? new Queue("email")
  : new Queue("email", getRedisConfig());
