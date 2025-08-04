import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import type { Breed } from './breeds'

export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isLoaded = ref(false)

  const fetchFavorites = async () => {
    if (isLoaded.value || loading.value) {
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await api.fetchFavorites()
      favorites.value = Array.isArray(data) ? data : []
      isLoaded.value = true
    } catch (err) {
      favorites.value = []
      error.value = err instanceof Error ? err.message : 'Failed to fetch favorites'
      console.error('Error fetching favorites:', err)
    } finally {
      loading.value = false
    }
  }

  const addFavorite = async (breed: Breed) => {
    loading.value = true
    error.value = null

    try {
      if (Array.isArray(favorites.value) && favorites.value.includes(breed.key)) {
        throw new Error('Breed is already a favorite')
      }
      await api.addFavorite(breed.key)
      if (!Array.isArray(favorites.value)) {
        favorites.value = []
      }
      favorites.value.push(breed.key)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add favorite'
      console.error('Error adding favorite:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeFavorite = async (breed: Breed) => {
    loading.value = true
    error.value = null

    try {
      await api.removeFavorite(breed.key)
      if (Array.isArray(favorites.value)) {
        const index = favorites.value.indexOf(breed.key)
        if (index > -1) {
          favorites.value.splice(index, 1)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to remove favorite'
      console.error('Error removing favorite:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const ensureFavoritesLoaded = async () => {
    if (!isLoaded.value && !loading.value) {
      await fetchFavorites()
    }
  }

  const isFavorite = (breed: Breed): boolean => {
    if (!Array.isArray(favorites.value)) {
      return false
    }
    return favorites.value.includes(breed.key)
  }

  return {
    favorites,
    loading,
    error,
    isLoaded,
    fetchFavorites,
    ensureFavoritesLoaded,
    addFavorite,
    removeFavorite,
    isFavorite
  }
})
