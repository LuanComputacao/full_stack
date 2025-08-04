import { createClient, RedisClientType } from 'redis';
import logger from './logger';

class RedisService {
  private client: RedisClientType = null as unknown as RedisClientType;
  private isConnected = false;

  async connect(): Promise<void> {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.client = createClient({ url: redisUrl });

      this.client.on('error', (err: Error) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis client connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        logger.warn('Redis client disconnected');
        this.isConnected = false;
      });

      await this.client.connect();
      logger.info('Successfully connected to Redis');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      this.isConnected = false;
      // Don't throw error - let app continue without cache
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null as unknown as RedisClientType;
      this.isConnected = false;
      logger.info('Redis client disconnected');
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, returning null for key:', key);
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, cannot set key:', key);
      return false;
    }

    try {
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.isConnected || !this.client) {
      logger.warn('Redis not connected, cannot delete key:', key);
      return false;
    }

    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis DEL error:', error);
      return false;
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Export a singleton instance
export const redisService = new RedisService();
export default redisService;
