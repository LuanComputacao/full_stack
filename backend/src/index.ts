import { configDotenv } from 'dotenv';
import createApp from './app';
import redisService from './config/redis';
import logger from './config/logger';

configDotenv();

const app = createApp();
const PORT = process.env.PORT || 3001;
const HOSTNAME = process.env.HOSTNAME || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

async function startServer() {
  try {
    // Initialize Redis connection
    await redisService.connect();

    const server = app.listen(PORT, () => {
      logger.info(`🐕 Dog Breeds API is running!`);
      logger.info(`📍 Server: http://${HOSTNAME}:${PORT}`);
      logger.info(`🌍 Environment: ${NODE_ENV}`);
      logger.info(`🚀 Health check: http://${HOSTNAME}:${PORT}/health`);
      logger.info(`🔴 Redis status: ${redisService.isHealthy() ? 'Connected' : 'Disconnected'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await redisService.disconnect();
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await redisService.disconnect();
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

export default app;
