import express from 'express';
import { DogApiService } from '../services/dogApi';
import redisService from '../config/redis';
import logger from '../config/logger';

const router: express.Router = express.Router();
const dogApiService = new DogApiService();

/**
 * @swagger
 * /api/breeds:
 *   get:
 *     summary: Get all dog breeds
 *     description: Fetches all available dog breeds from the Dog CEO API
 *     tags: [Breeds]
 *     responses:
 *       200:
 *         description: List of all dog breeds
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["affenpinscher", "african", "airedale", "akbash"]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/breeds - Get all dog breeds
router.get('/', async (req, res) => {
  try {
    const breeds = await dogApiService.getAllBreeds();
    res.json(breeds);
  } catch (error) {
    logger.error('Error fetching breeds:', error);
    res.status(500).json({
      error: 'Failed to fetch dog breeds',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/breeds/cache/clear:
 *   delete:
 *     summary: Clear breeds cache
 *     description: Clears the cached dog breeds data, forcing a fresh fetch from the API on next request
 *     tags: [Breeds]
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Breeds cache cleared successfully"
 *                 cleared:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /api/breeds/cache/clear - Clear breeds cache
router.delete('/cache/clear', async (req, res) => {
  try {
    const cleared = await redisService.del('dog_breeds_all');
    logger.info('Breeds cache cleared manually');
    res.json({
      message: 'Breeds cache cleared successfully',
      cleared: cleared,
    });
  } catch (error) {
    logger.error('Error clearing breeds cache:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/breeds/{breed}/images:
 *   get:
 *     summary: Get images for a specific breed
 *     description: Fetches 3 random images for the specified dog breed
 *     tags: [Breeds]
 *     parameters:
 *       - in: path
 *         name: breed
 *         required: true
 *         description: The breed name (e.g., bulldog, retriever)
 *         schema:
 *           type: string
 *           example: bulldog
 *     responses:
 *       200:
 *         description: Array of 3 image URLs for the breed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: [
 *                 "https://images.dog.ceo/breeds/bulldog-boston/n02096585_1023.jpg",
 *                 "https://images.dog.ceo/breeds/bulldog-boston/n02096585_1042.jpg",
 *                 "https://images.dog.ceo/breeds/bulldog-boston/n02096585_1047.jpg"
 *               ]
 *       400:
 *         description: Bad request - breed parameter missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Breed not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/breeds/:breed/images - Get images for a specific breed
router.get('/:breed/images', async (req, res) => {
  try {
    const { breed } = req.params;

    if (!breed) {
      return res.status(400).json({ error: 'Breed parameter is required' });
    }

    const images = await dogApiService.getBreedImages(breed, 3);
    res.json(images);
  } catch (error) {
    console.error(`Error fetching images for breed ${req.params.breed}:`, error);

    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        error: `Breed '${req.params.breed}' not found`,
        message: error.message,
      });
    }

    res.status(500).json({
      error: 'Failed to fetch breed images',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
