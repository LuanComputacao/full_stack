import { ref } from 'vue'
import { defineStore } from 'pinia'
import { api, ApiError } from '../services/api'

export interface Breed {
  key: string,
  name: string,
  subBread?: string
}

export const useBreedsStore = defineStore('breeds', () => {
  const breeds = ref<Breed[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchTime = ref<number>(0)
  const FETCH_COOLDOWN = 5000

  const fetchBreeds = async () => {
    const now = Date.now()
    const timeSinceLastFetch = now - lastFetchTime.value

    if (timeSinceLastFetch < FETCH_COOLDOWN && breeds.value.length > 0) {
      return
    }

    loading.value = true
    error.value = null
    lastFetchTime.value = now

    try {
      const data = await api.fetchBreeds()

      breeds.value = []

      for (const breed of data) {
        const [name, subBread] = breed.split('|').map((s: string) => s.trim())
        breeds.value.push({
          key: breed.toLowerCase(),
          name,
          ...(subBread && { subBread })
        })
      }
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = `API Error: ${err.message}`
      } else {
        error.value = err instanceof Error ? err.message : 'Failed to fetch breeds'
      }
      console.error('Error fetching breeds:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    breeds,
    loading,
    error,
    fetchBreeds
  }
})
