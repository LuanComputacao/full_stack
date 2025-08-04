<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Background overlay -->
      <div
        class="fixed inset-0 bg-gray-500 opacity-75 transition-opacity -z-10"
        @click="closeModal"
      ></div>

      <!-- Modal content -->
      <div
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-10"
      >
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg leading-6 font-medium text-neutral-950">
              {{ breedDisplayName }}
            </h3>
            <button
              @click="closeModal"
              class="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer rounded-full p-2 transition-colors duration-200"
            >
              <x-mark-icon class="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <!-- Images -->
          <div class="space-y-4">
            <!-- Error state -->
            <div v-if="error" class="text-center py-8">
              <div class="text-red-600 mb-4">
                <exclamation-triangle-icon class="w-12 h-12 mx-auto" />
              </div>
              <p class="text-red-600 mb-4">{{ error }}</p>
              <button
                @click="fetchImages"
                class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>

            <!-- Image Carousel -->
            <div v-else>
              <ImageCarousel
                :images="images"
                :loading="loading"
                :autoplay="true"
                :autoplay-interval="3000"
                @image-error="handleImageError"
              />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex flex-col items-center bg-gray-50 px-4 py-3 sm:px-6">
          <button
            @click="favoriteBreed"
            :disabled="favoriteLoading"
            class="text-center hover:cursor-pointer disabled:cursor-not-allowed transition-all duration-200"
            :class="{ 'opacity-50': favoriteLoading }"
          >
            <div class="relative">
              <heart-icon
                :class="[
                  'w-12 h-12 transition-colors duration-200',
                  isCurrentBreedFavorite ? 'text-red-600' : 'text-gray-400 hover:text-red-400',
                ]"
              />
              <!-- Loading spinner overlay -->
              <div v-if="favoriteLoading" class="absolute inset-0 flex items-center justify-center">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            </div>
            <p class="text-xs mt-1 text-gray-600">
              {{ isCurrentBreedFavorite ? 'Remove' : 'Add' }}
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon, ExclamationTriangleIcon, HeartIcon } from '@heroicons/vue/16/solid'
import { api } from '@/services/api'
import type { Breed } from '@/stores/breeds'
import { useFavoritesStore } from '@/stores/favorites'
import ImageCarousel from '@/components/common/ImageCarousel.vue'

interface Props {
  isOpen: boolean
  breed: Breed | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  favorite: [breed: Breed | null]
}>()

const favoritesStore = useFavoritesStore()
const images = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const favoriteLoading = ref(false)

const breedDisplayName = computed(() => {
  if (!props.breed) return ''

  const name = props.breed.name.charAt(0).toUpperCase() + props.breed.name.slice(1)
  if (props.breed.subBread) {
    const subBread = props.breed.subBread.charAt(0).toUpperCase() + props.breed.subBread.slice(1)
    return `${name} (${subBread})`
  }
  console.log('Breed name:', name)
  console.log('Sub-breed name:', props.breed.subBread)
  return name
})

const breedKey = computed(() => {
  if (!props.breed) return ''

  let key = props.breed.name.toLowerCase()
  if (props.breed.subBread) {
    key += `|${props.breed.subBread.toLowerCase()}`
  }
  return key
})

const isCurrentBreedFavorite = computed(() => {
  if (!props.breed) return false
  console.log('Checking favorite for breed:', breedKey.value)
  console.log('Favorites store:', favoritesStore.favorites)
  return favoritesStore.isFavorite(props.breed)
})

const fetchImages = async () => {
  if (!props.breed) return

  loading.value = true
  error.value = null
  images.value = []

  try {
    const fetchedImages = await api.fetchBreedImages(
      props.breed.name.toLowerCase(),
      props.breed.subBread?.toLowerCase()
    )

    images.value = fetchedImages.slice(0, 3)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to fetch breed images'
    console.error('Error fetching breed images:', err)
  } finally {
    loading.value = false
  }
}

const handleImageError = (index: number) => {
  images.value.splice(index, 1)
}

const closeModal = () => {
  emit('close')
}

const favoriteBreed = async () => {
  if (!props.breed) return

  try {
    favoriteLoading.value = true

    if (isCurrentBreedFavorite.value) {
      await favoritesStore.removeFavorite(props.breed)
      console.log(`Removed ${breedKey.value} from favorites`)
    } else {
      await favoritesStore.addFavorite(props.breed)
      console.log(`Added ${breedKey.value} to favorites`)
    }

    emit('favorite', props.breed)
  } catch (error) {
    console.error('Error updating favorite:', error)
  } finally {
    favoriteLoading.value = false
  }
}

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue && props.breed) {
      fetchImages()
    } else {
      images.value = []
      loading.value = false
      error.value = null
    }
  }
)
</script>
