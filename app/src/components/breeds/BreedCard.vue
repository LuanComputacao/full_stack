<template>
  <div class="breed-card" ref="cardElement">
    <div class="bg-white shadow rounded-lg p-4 relative">
      <!-- Heart icon in top right corner -->
      <button
        @click.stop="toggleFavorite"
        :disabled="favoriteLoading"
        class="heart-icon hover:cursor-pointer absolute z-10 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all duration-200 disabled:cursor-not-allowed"
        :class="{ 'opacity-50': favoriteLoading }"
      >
        <HeartIcon
          :class="[
            'w-6 h-6 transition-colors duration-200',
            isFavorite ? 'text-red-600' : 'text-gray-400 hover:text-red-400',
          ]"
        />
        <!-- Loading spinner overlay -->
        <div v-if="favoriteLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
        </div>
      </button>

      <div class="w-full h-48 rounded mb-4 bg-gray-200 flex items-center justify-center">
        <img
          v-if="!imageLoading && !imageError && breedRamdomImage"
          :src="breedRamdomImage"
          :alt="`${breedName} Image`"
          class="w-full h-48 object-cover rounded"
        />
        <div v-else-if="imageLoading && isVisible" class="text-gray-500 text-sm">
          Loading image...
        </div>
        <div v-else-if="imageError" class="text-gray-500 text-sm text-center">
          <svg
            class="w-12 h-12 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          Image not available
        </div>
        <div
          v-else-if="!isVisible"
          class="text-gray-400 text-sm flex flex-col items-center justify-center"
        >
          <div class="w-16 h-16 mb-2 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              class="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <span class="text-xs">Scroll to load image</span>
        </div>
      </div>
      <div class="text-center">
        <h3 class="text-xl font-semibold mb-2">{{ breedName }}</h3>
        <button
          class="hover:cursor-pointer mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          @click="emit('detail', breed)"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Breed } from '@/stores/breeds'
import { defineProps, computed, onMounted, onUnmounted, ref } from 'vue'
import { HeartIcon } from '@heroicons/vue/16/solid'
import { useFavoritesStore } from '@/stores/favorites'
import { useBreedImagesStore } from '@/stores/breedImages'

const props = defineProps<{
  breed: Breed
}>()

const emit = defineEmits<{
  detail: [breed: Breed]
}>()

const favoritesStore = useFavoritesStore()
const breedImagesStore = useBreedImagesStore()
const cardElement = ref<HTMLElement>()
const breedRamdomImage = ref<string>('')
const imageLoading = ref<boolean>(false)
const imageError = ref<boolean>(false)
const isVisible = ref<boolean>(false)
const observer = ref<IntersectionObserver | null>(null)
const favoriteLoading = ref<boolean>(false)

const breedName = computed(() => {
  const name = props.breed.name.charAt(0).toUpperCase() + props.breed.name.slice(1)
  if (props.breed.subBread) {
    const subBread = props.breed.subBread.charAt(0).toUpperCase() + props.breed.subBread.slice(1)
    return `${name} (${subBread})`
  }
  return name
})

const isFavorite = computed(() => {
  return favoritesStore.isFavorite(props.breed)
})

const fetchBreedImage = async () => {
  const breedName = props.breed.name.toLowerCase()
  const subBreed = props.breed.subBread?.toLowerCase()

  const cachedImage = breedImagesStore.getCachedImage(breedName, subBreed)
  if (cachedImage) {
    breedRamdomImage.value = cachedImage
    imageLoading.value = false
    imageError.value = false
    return
  }

  if (breedImagesStore.isLoading(breedName, subBreed)) {
    imageLoading.value = true
    imageError.value = false
    return
  }

  const existingError = breedImagesStore.getError(breedName, subBreed)
  if (existingError) {
    imageError.value = true
    imageLoading.value = false
    return
  }

  try {
    imageLoading.value = true
    imageError.value = false

    const imageUrl = await breedImagesStore.getRandomImage(breedName, subBreed)

    if (imageUrl) {
      breedRamdomImage.value = imageUrl
    } else {
      imageError.value = true
    }
  } catch (error) {
    console.error('Failed to fetch breed image:', error)
    imageError.value = true
  } finally {
    imageLoading.value = false
  }
}

const toggleFavorite = async () => {
  try {
    favoriteLoading.value = true

    if (isFavorite.value) {
      await favoritesStore.removeFavorite(props.breed)
    } else {
      await favoritesStore.addFavorite(props.breed)
    }
  } catch (error) {
    console.error('Error updating favorite:', error)
  } finally {
    favoriteLoading.value = false
  }
}

const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isVisible.value) {
          isVisible.value = true
          fetchBreedImage()
          observer.value?.disconnect()
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
    }
  )

  if (cardElement.value) {
    observer.value.observe(cardElement.value)
  }
}

onMounted(() => {
  setupIntersectionObserver()
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.heart-icon {
  top: 1.3rem;
  right: 1.3rem;
}
</style>
