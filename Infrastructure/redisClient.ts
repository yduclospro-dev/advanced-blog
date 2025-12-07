import { createClient } from "redis";

const isTest =
  process.env.NODE_ENV === "test" ||
  process.env.TEST_IN_DOCKER === "true";

let redisClient: ReturnType<typeof createClient> | null = null;

// Mock Redis pour Jest
const mockRedis = {
  get: async () => null,
  set: async () => null,
  incr: async () => 1,
  expire: async () => null,
  del: async () => null,
  quit: async () => null,
  isOpen: false,
};

export function getRedisClient() {
  if (isTest) return mockRedis;

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://redis:6379",
      socket: { connectTimeout: 2000 },
    });

    redisClient.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    redisClient.connect();
  }

  return redisClient;
}

export default { getRedisClient };