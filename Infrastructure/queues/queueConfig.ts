import Queue, { QueueOptions } from "bull";

const isTest =
  process.env.NODE_ENV === "test" || process.env.TEST_IN_DOCKER === "true";

// Parse Redis URL for Bull (supports rediss:// for Upstash)
function getRedisConfig(): QueueOptions {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  
  // If it's a rediss:// URL (like Upstash), Bull needs TLS config
  if (redisUrl.startsWith("rediss://")) {
    const hostWithPort = redisUrl.replace("rediss://", "");
    const [host] = hostWithPort.split(":");
    
    return {
      redis: {
        port: 6379,
        host: host,
        tls: {
          rejectUnauthorized: false,
        },
      },
    };
  }
  
  // For regular redis:// URLs, return as connection option
  return {
    redis: redisUrl,
  };
}

// Email queue for sending emails asynchronously
export const emailQueue = isTest
  ? new Queue("email") // In-memory for tests
  : new Queue("email", getRedisConfig());

// You can add more queues here as needed
// export const imageProcessingQueue = new Queue('image-processing', redisConfig);
// export const reportQueue = new Queue('report', redisConfig);
