<template>
  <div class="relative w-full">
    <!-- Main image container -->
    <div class="relative h-64 overflow-hidden rounded-lg bg-gray-200">
      <div
        class="flex transition-transform duration-300 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full h-full flex-shrink-0 flex items-center justify-center"
        >
          <img
            :src="image"
            :alt="`Image ${index + 1}`"
            class="h-full object-cover"
            @error="handleImageError(index)"
          />
        </div>
      </div>

      <!-- Loading overlay -->
      <div v-if="loading" class="absolute inset-0 bg-gray-200 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!loading && images.length === 0"
        class="absolute inset-0 flex items-center justify-center text-gray-500"
      >
        <div class="text-center">
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
          <p class="text-sm">No images available</p>
        </div>
      </div>

      <!-- Navigation arrows -->
      <template v-if="!loading && images.length > 1">
        <!-- Previous button -->
        <button
          @click="previousImage"
          class="hover:cursor-pointer absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          :disabled="currentIndex === 0"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === 0 }"
        >
          <arrow-left-icon class="w-5 h-5" />
        </button>

        <!-- Next button -->
        <button
          @click="nextImage"
          class="hover:cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          :disabled="currentIndex === images.length - 1"
          :class="{ 'opacity-50 cursor-not-allowed': currentIndex === images.length - 1 }"
        >
          <arrow-right-icon class="w-5 h-5" />
        </button>
      </template>
    </div>

    <!-- Dots indicator -->
    <div v-if="!loading && images.length > 1" class="flex justify-center mt-4 space-x-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="goToImage(index)"
        class="w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        :class="[currentIndex === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400']"
        :aria-label="`Go to image ${index + 1}`"
      ></button>
    </div>

    <!-- Image counter -->
    <div v-if="!loading && images.length > 1" class="text-center mt-2 text-sm text-gray-600">
      {{ currentIndex + 1 }} of {{ images.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/16/solid'

interface Props {
  images: string[]
  loading?: boolean
  autoplay?: boolean
  autoplayInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  autoplay: false,
  autoplayInterval: 5000,
})

const emit = defineEmits<{
  imageError: [index: number]
}>()

const currentIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToImage = (index: number) => {
  currentIndex.value = index
}

const handleImageError = (index: number) => {
  emit('imageError', index)
}

const startAutoplay = () => {
  stopAutoplay()
  if (props.autoplay && props.images.length > 1) {
    console.log(
      'Starting autoplay with',
      props.images.length,
      'images, interval:',
      props.autoplayInterval
    )
    autoplayTimer = setInterval(() => {
      if (currentIndex.value < props.images.length - 1) {
        nextImage()
      } else {
        currentIndex.value = 0
      }
    }, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    console.log('Stopping autoplay')
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

watch(
  () => props.images,
  (newImages) => {
    currentIndex.value = 0
    stopAutoplay()
    if (newImages.length > 0) {
      startAutoplay()
    }
  },
  { immediate: true }
)

watch(
  () => props.autoplay,
  (newAutoplay) => {
    if (newAutoplay) {
      startAutoplay()
    } else {
      stopAutoplay()
    }
  }
)

const handleKeydown = (event: KeyboardEvent) => {
  if (props.images.length <= 1) return

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      previousImage()
      break
    case 'ArrowRight':
      event.preventDefault()
      nextImage()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  startAutoplay()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  stopAutoplay()
})
</script>
