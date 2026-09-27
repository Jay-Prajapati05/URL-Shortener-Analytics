import redisClient from '../config/redis.js';

const DEFAULT_TTL = 60 * 60; // 1 hour (seconds)

export const getCache = async (key) => {
  return await redisClient.get(key);
};

export const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  await redisClient.set(key, value, { EX: ttl });
};