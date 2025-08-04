import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export interface CachedImage {
  url: string
  timestamp: number
}

export const useBreedImagesStore = defineStore('breedImages', () => {
  const imageCache = ref<Map<string, CachedImage>>(new Map())
  const loading = ref<Map<string, boolean>>(new Map())
  const errors = ref<Map<string, string>>(new Map())

  const CACHE_EXPIRATION = 30 * 60 * 1000

  const getBreedKey = (breedName: string, subBreed?: string): string => {
    return subBreed ? `${breedName}|${subBreed}` : breedName
  }

  const isImageCacheValid = (cachedImage: CachedImage): boolean => {
    const now = Date.now()
    return (now - cachedImage.timestamp) < CACHE_EXPIRATION
  }

  const getRandomImage = async (breedName: string, subBreed?: string): Promise<string | null> => {
    const key = getBreedKey(breedName, subBreed)

    const cachedImage = imageCache.value.get(key)
    if (cachedImage && isImageCacheValid(cachedImage)) {
      return cachedImage.url
    }

    if (loading.value.get(key)) {
      return null
    }

    errors.value.delete(key)
    loading.value.set(key, true)

    try {
      const imageUrl = await api.fetchBreedRandomImage(breedName, subBreed)

      imageCache.value.set(key, {
        url: imageUrl,
        timestamp: Date.now()
      })

      return imageUrl
    } catch (err) {
      let errorMessage = 'Failed to fetch image'

      if (err instanceof ApiError) {
        errorMessage = `API Error: ${err.message}`
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      errors.value.set(key, errorMessage)
      console.error(`Error fetching image for ${key}:`, err)
      return null
    } finally {
      loading.value.set(key, false)
    }
  }

  const getCachedImage = (breedName: string, subBreed?: string): string | null => {
    const key = getBreedKey(breedName, subBreed)
    const cachedImage = imageCache.value.get(key)

    if (cachedImage && isImageCacheValid(cachedImage)) {
      return cachedImage.url
    }

    return null
  }

  const isLoading = (breedName: string, subBreed?: string): boolean => {
    const key = getBreedKey(breedName, subBreed)
    return loading.value.get(key) || false
  }

  const getError = (breedName: string, subBreed?: string): string | null => {
    const key = getBreedKey(breedName, subBreed)
    return errors.value.get(key) || null
  }

  const clearCache = (): void => {
    imageCache.value.clear()
    loading.value.clear()
    errors.value.clear()
  }

  const removeFromCache = (breedName: string, subBreed?: string): void => {
    const key = getBreedKey(breedName, subBreed)
    imageCache.value.delete(key)
    loading.value.delete(key)
    errors.value.delete(key)
  }

  const getCacheStats = () => {
    const totalCached = imageCache.value.size
    const validCached = Array.from(imageCache.value.values()).filter(isImageCacheValid).length
    const expired = totalCached - validCached

    return {
      total: totalCached,
      valid: validCached,
      expired
    }
  }

  return {
    imageCache: imageCache.value,
    getRandomImage,
    getCachedImage,
    isLoading,
    getError,
    clearCache,
    removeFromCache,
    getCacheStats
  }
})
