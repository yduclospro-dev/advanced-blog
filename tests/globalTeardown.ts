import { prisma } from "../Infrastructure/prismaClient";
import { getRedisClient } from "../Infrastructure/redisClient";

export default async () => {
  try {
    await prisma.$disconnect();
  } catch (e) {
    console.error("Prisma disconnect error:", e);
  }

  try {
    const redis = getRedisClient();

    if (redis && redis.quit && redis.isOpen) {
      await redis.quit();
      console.log("✔ Redis quit");
    } else {
      console.log("✔ Redis mock or not open, skipping quit");
    }
  } catch (err) {
    console.error("❌ Redis close error:", err);
  }
};
