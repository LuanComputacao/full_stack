import axios from 'axios';
import redisService from '../config/redis';
import logger from '../config/logger';

export interface DogApiBreedResponse {
  message: Record<string, string[]>;
  status: string;
}

export interface DogApiImageResponse {
  message: string[];
  status: string;
}

export class DogApiService {
  private readonly baseUrl = 'https://dog.ceo/api';
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly BREEDS_CACHE_KEY = 'dog_breeds_all';

  async getAllBreeds(): Promise<string[]> {
    try {
      // Try to get from cache first
      const cachedBreeds = await redisService.get(this.BREEDS_CACHE_KEY);
      if (cachedBreeds) {
        logger.info('Returning breeds from cache');
        return JSON.parse(cachedBreeds);
      }

      logger.info('Cache miss, fetching breeds from API');
      const response = await axios.get<DogApiBreedResponse>(`${this.baseUrl}/breeds/list/all`);



      if (response.data.status !== 'success') {
        throw new Error('Failed to fetch breeds from Dog API');
      }


      const breedsAndSubBreeds: string[] = [];

      for (const [breed, subBreeds] of Object.entries(response.data.message)) {
        if (subBreeds.length > 0) {
          subBreeds.forEach(subBreed => breedsAndSubBreeds.push(`${breed}|${subBreed}`));
        } else {
          breedsAndSubBreeds.push(breed);
        }
      }

      // Sort alphabetically using localeCompare for reliable sorting
      breedsAndSubBreeds.sort((a, b) => a.localeCompare(b));
      const breeds = breedsAndSubBreeds;

      // Cache the result for 5 minutes
      await redisService.set(this.BREEDS_CACHE_KEY, JSON.stringify(breeds), this.CACHE_TTL);
      logger.info(`Cached ${breeds.length} breeds for ${this.CACHE_TTL} seconds`);

      return breeds;
    } catch (error) {
      logger.error('Error fetching breeds:', error);
      throw new Error('Failed to fetch dog breeds');
    }
  }

  async getBreedImages(breed: string, count: number = 3): Promise<string[]> {
    try {
      const breedRouteParts = breed.split('|').map(part => part.trim());
      const breedPath = breedRouteParts.join('/');
      const response = await axios.get<DogApiImageResponse>(
        `${this.baseUrl}/breed/${breedPath}/images/random/${count}`
      );

      if (response.data.status !== 'success') {
        throw new Error(`Failed to fetch images for breed: ${breed}`);
      }

      return response.data.message;
    } catch (error) {
      logger.error(`Error fetching images for breed ${breed}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(`Breed '${breed}' not found`);
      }
      throw new Error(`Failed to fetch images for breed: ${breed}`);
    }
  }
}
