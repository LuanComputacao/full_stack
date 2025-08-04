const API_BASE_URL = 'http://localhost:3001/api'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  async fetchBreeds(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/breeds`)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async fetchBreedRandomImage(breed: string, subBreed?: string): Promise<string> {
    let url = `https://dog.ceo/api/breed/${breed}`

    if (subBreed) {
      url += `/${subBreed}`
    }

    url += '/images/random'

    const response = await fetch(url)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.status !== 'success') {
      throw new Error('Failed to fetch breed image')
    }

    return data.message
  },

  async fetchBreedImages(breed: string, subBreed?: string): Promise<string[]> {
    let breedKey = breed
    if (subBreed) {
      breedKey += `%7C${subBreed}`
    }

    const response = await fetch(`${API_BASE_URL}/breeds/${breedKey}/images`)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    return response.json()
  },

  async fetchFavorites(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/favorites`)

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data.favorites) ? data.favorites : []
  },

  async addFavorite(breed: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ breed })
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
  },

  async removeFavorite(breed: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/favorites/${encodeURIComponent(breed)}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
  }
}
