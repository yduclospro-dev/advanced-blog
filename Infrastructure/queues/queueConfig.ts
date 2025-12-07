import Queue from "bull";

const isTest =
  process.env.NODE_ENV === "test" || process.env.TEST_IN_DOCKER === "true";

// Redis URL for Bull queues
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Email queue for sending emails asynchronously
export const emailQueue = isTest
  ? new Queue("email") // In-memory for tests
  : new Queue("email", redisUrl);

// You can add more queues here as needed
// export const imageProcessingQueue = new Queue('image-processing', redisConfig);
// export const reportQueue = new Queue('report', redisConfig);
