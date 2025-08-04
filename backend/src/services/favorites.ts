import fs from 'fs';
import path from 'path';

export interface FavoriteBreed {
  breed: string;
  addedAt: string;
}

export class FavoritesService {
  private readonly favoritesFilePath: string;
  private favorites: Set<string> = new Set();

  constructor() {
    // Store favorites in a JSON file in the project root
    this.favoritesFilePath = path.join(process.cwd(), 'favorites.json');
    this.loadFavorites();
  }

  private loadFavorites(): void {
    try {
      if (fs.existsSync(this.favoritesFilePath)) {
        const data = fs.readFileSync(this.favoritesFilePath, 'utf-8');
        const favoritesArray: FavoriteBreed[] = JSON.parse(data);
        this.favorites = new Set(favoritesArray.map(fav => fav.breed));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Initialize with empty favorites if there's an error
      this.favorites = new Set();
    }
  }

  private saveFavorites(): void {
    try {
      const favoritesArray: FavoriteBreed[] = Array.from(this.favorites).map(breed => ({
        breed,
        addedAt: new Date().toISOString(),
      }));

      fs.writeFileSync(this.favoritesFilePath, JSON.stringify(favoritesArray, null, 2));
    } catch (error) {
      console.error('Error saving favorites:', error);
      throw new Error('Failed to save favorites');
    }
  }

  addFavorite(breed: string): boolean {
    const normalizedBreed = breed.toLowerCase().trim();

    if (!normalizedBreed) {
      throw new Error('Breed name cannot be empty');
    }

    if (this.favorites.has(normalizedBreed)) {
      return false; // Already exists
    }

    this.favorites.add(normalizedBreed);
    this.saveFavorites();
    return true;
  }

  removeFavorite(breed: string): boolean {
    const normalizedBreed = breed.toLowerCase().trim();

    if (this.favorites.has(normalizedBreed)) {
      this.favorites.delete(normalizedBreed);
      this.saveFavorites();
      return true;
    }

    return false; // Didn't exist
  }

  getFavorites(): string[] {
    return Array.from(this.favorites).sort();
  }

  isFavorite(breed: string): boolean {
    return this.favorites.has(breed.toLowerCase().trim());
  }

  getFavoritesCount(): number {
    return this.favorites.size;
  }
}
