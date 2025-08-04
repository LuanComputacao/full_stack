<template>
  <div>
    <div class="breeds-list">
      <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>

      <!-- Loading state -->
      <div v-if="props.loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">Loading breeds...</span>
      </div>

      <!-- Error state -->
      <div
        v-else-if="props.error"
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
      >
        <p>Error: {{ props.error }}</p>
        <button
          @click="emit('try-reload', null)"
          class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>

      <!-- Breeds list -->
      <div
        v-else-if="props.breeds.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <BreedCard
          :breed="breed"
          v-for="breed in breeds"
          :key="`${breed.name}-${breed.subBread || 'main'}`"
          class="mb-2"
          @detail="$emit('breed-detail', $event)"
        />
      </div>

      <!-- No breeds found -->
      <div v-else class="text-center py-8 text-gray-500">No breeds found.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, defineProps } from 'vue'
import type { Breed } from '@/stores/breeds'
import BreedCard from './BreedCard.vue'

const props = defineProps<{
  title: string
  breeds: Breed[]
  favorites: string[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'breed-detail': [breed: Breed]
  'try-reload': [value: null]
}>()
</script>

