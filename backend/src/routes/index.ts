import express from 'express';
import breedsRouter from './breeds';
import favoritesRouter from './favorites';
import redisService from '../config/redis';
import { specs } from '../config/swagger';

const router: express.Router = express.Router();

// API routes
router.use('/api/breeds', breedsRouter);
router.use('/api/favorites', favoritesRouter);

// OpenAPI JSON endpoint
router.get('/api/openapi.json', (req, res) => {
  res.json(specs);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the API status, Redis status and current timestamp
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */
// Health check endpoint
router.get('/health', (req, res) => {
  const redisHealthy = redisService.isHealthy();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    redis: {
      status: redisHealthy ? 'connected' : 'disconnected',
      healthy: redisHealthy,
    },
  });
});

export default router;
