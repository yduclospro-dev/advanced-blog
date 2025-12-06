import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().catch((err) => {
  console.error('Erreur de connexion à Redis:', err);
});