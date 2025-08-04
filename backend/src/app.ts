import express from 'express';
import cors from 'cors';
import router from './routes/index';
import { requestLogger } from './middleware/logger';
import { specs, swaggerUi } from './config/swagger';
import logger from './config/logger';

export function createApp(): express.Application {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logging
  app.use(requestLogger);

  // Swagger documentation
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Dog Breeds API Documentation',
    })
  );

  // Routes
  app.use('/', router);

  // 404 handler
  app.use('*', (req, res) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      error: 'Route not found',
      message: `The route ${req.method} ${req.originalUrl} does not exist`,
      availableRoutes: [
        'GET /health',
        'GET /api/breeds',
        'DELETE /api/breeds/cache/clear',
        'GET /api/breeds/:breed/images',
        'GET /api/favorites',
        'POST /api/favorites',
        'DELETE /api/favorites/:breed',
        'GET /api/docs',
      ],
    });
  });

  // Global error handler
  app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      });
    }
  );

  return app;
}

export default createApp;
