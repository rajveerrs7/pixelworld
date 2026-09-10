import { createClient, type RedisClientType } from "redis";

const TERRITORIES_CACHE_KEY = "pixel_empire:territories";
const CACHE_TTL_SECONDS = 60 * 60;

let redisClient: RedisClientType | null = null;

function getRedisUrl(): string | null {
  return process.env.REDIS_URL || null;
}

async function getClient(): Promise<RedisClientType | null> {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    return null;
  }

  if (!redisClient) {
    redisClient = createClient({ url: redisUrl });
    redisClient.on("error", (error: Error) => {
      console.error("Redis client error:", error);
    });
  }

  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    } catch (error) {
      console.error("Redis connection failed:", error);
      return null;
    }
  }

  return redisClient;
}

export async function getCachedTerritories(): Promise<unknown | null> {
  const client = await getClient();
  if (!client) {
    return null;
  }

  try {
    const cachedValue = await client.get(TERRITORIES_CACHE_KEY);
    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    console.error("Failed to read territories cache:", error);
    return null;
  }
}

export async function setCachedTerritories(data: unknown): Promise<void> {
  const client = await getClient();
  if (!client) {
    return;
  }

  try {
    await client.set(TERRITORIES_CACHE_KEY, JSON.stringify(data), {
      EX: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Failed to write territories cache:", error);
  }
}

export async function deleteTerritoriesCache(): Promise<void> {
  const client = await getClient();
  if (!client) {
    return;
  }

  try {
    await client.del(TERRITORIES_CACHE_KEY);
  } catch (error) {
    console.error("Failed to delete territories cache:", error);
  }
}

export { TERRITORIES_CACHE_KEY, CACHE_TTL_SECONDS };
