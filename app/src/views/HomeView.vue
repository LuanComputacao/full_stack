<template>
  <main>
    <BreedsList
      @breed-detail="openBreedModal"
      @try-reload="handleTryReload"
      :breeds="breedsStore.breeds"
      :favorites="favoritesStore.favorites"
      :loading="breedsStore.loading"
      :error="breedsStore.error"
      title="Dog Breeds"
    />

    <!-- Breed Modal -->
    <BreedModal :is-open="isModalOpen" :breed="selectedBreed" @close="closeBreedModal" />
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BreedsList from '@/components/breeds/BreedsList.vue'
import BreedModal from '@/components/breeds/BreedModal.vue'
import { useBreedsStore, type Breed } from '@/stores/breeds'
import { useFavoritesStore } from '@/stores/favorites'

const isModalOpen = ref(false)
const selectedBreed = ref<Breed | null>(null)

const openBreedModal = (breed: Breed) => {
  console.log('Opening modal for breed:', breed)
  selectedBreed.value = breed
  isModalOpen.value = true
}

const closeBreedModal = () => {
  isModalOpen.value = false
  selectedBreed.value = null
}

const handleTryReload = () => {
  breedsStore.fetchBreeds()
}

const breedsStore = useBreedsStore()
const favoritesStore = useFavoritesStore()

onMounted(() => {
  breedsStore.fetchBreeds()
  favoritesStore.fetchFavorites().catch(console.error)
})
</script>

<style scoped>
</style>
