import express from 'express';
import { FavoritesService } from '../services/favorites';

const router: express.Router = express.Router();
const favoritesService = new FavoritesService();

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a favorite breed
 *     description: Adds a dog breed to the favorites list
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteRequest'
 *     responses:
 *       201:
 *         description: Breed successfully added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       400:
 *         description: Bad request - invalid breed name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Conflict - breed already in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/favorites - Add a favorite breed
router.post('/', (req, res) => {
  try {
    const { breed } = req.body;

    if (!breed || typeof breed !== 'string') {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'breed field is required and must be a string',
      });
    }

    const added = favoritesService.addFavorite(breed);

    if (added) {
      res.status(201).json({
        message: 'Breed added to favorites',
        breed: breed.toLowerCase().trim(),
      });
    } else {
      res.status(409).json({
        message: 'Breed is already in favorites',
        breed: breed.toLowerCase().trim(),
      });
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      error: 'Failed to add favorite breed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get all favorite breeds
 *     description: Returns a list of all favorite dog breeds
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: List of favorite breeds
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoritesList'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/favorites - Get all favorite breeds
router.get('/', (req, res) => {
  try {
    const favorites = favoritesService.getFavorites();
    res.json({
      favorites,
      count: favorites.length,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      error: 'Failed to fetch favorite breeds',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @swagger
 * /api/favorites/{breed}:
 *   delete:
 *     summary: Remove a favorite breed
 *     description: Removes a dog breed from the favorites list
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: breed
 *         required: true
 *         description: The breed name to remove from favorites
 *         schema:
 *           type: string
 *           example: bulldog
 *     responses:
 *       200:
 *         description: Breed successfully removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       400:
 *         description: Bad request - breed parameter missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Breed not found in favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /api/favorites/:breed - Remove a favorite breed
router.delete('/:breed', (req, res) => {
  try {
    const { breed } = req.params;

    if (!breed) {
      return res.status(400).json({ error: 'Breed parameter is required' });
    }

    const removed = favoritesService.removeFavorite(breed);

    if (removed) {
      res.json({
        message: 'Breed removed from favorites',
        breed: breed.toLowerCase().trim(),
      });
    } else {
      res.status(404).json({
        message: 'Breed not found in favorites',
        breed: breed.toLowerCase().trim(),
      });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({
      error: 'Failed to remove favorite breed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
