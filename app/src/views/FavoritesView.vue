<template>
  <div>
    <BreedsList
      @breed-detail="openBreedModal"
      :title="'Favorite Breeds'"
      :breeds="breedsFavorites"
      :favorites="favoritesStore.favorites"
      :loading="breedsStore.loading"
      :error="breedsStore.error"
    />

    <!-- Breeds Removed List -->

    <BreedsList
      class="mt-10"
      v-if="breedsRemoved.length > 0"
      @breed-detail="openBreedModal"
      :title="'Breeds to remove from favorites'"
      :breeds="breedsRemoved"
      :favorites="favoritesStore.favorites"
      :loading="false"
      :error="null"
    />

    <BreedModal :is-open="isModalOpen" :breed="selectedBreed" @close="closeBreedModal" />
  </div>
</template>

<script setup lang="ts">
import BreedModal from '@/components/breeds/BreedModal.vue'
import BreedsList from '@/components/breeds/BreedsList.vue'
import { useBreedsStore, type Breed } from '@/stores/breeds'
import { useFavoritesStore } from '@/stores/favorites'
import { computed, onMounted, ref } from 'vue'

onMounted(() => {})

const favoritesStore = useFavoritesStore()
const breedsStore = useBreedsStore()

const breeds = ref<Breed[]>([])

const isModalOpen = ref(false)
const selectedBreed = ref<Breed | null>(null)

onMounted(() => {
  favoritesStore
    .fetchFavorites()
    .then(() => {
      breedsStore.fetchBreeds().then(() => {
        breeds.value = breedsStore.breeds.filter((breed) => {
          return favoritesStore.isFavorite(breed)
        })
      })
    })
    .catch(console.error)
})

const breedsFavorites = computed(() => {
  return breeds.value.filter((breed) => {
    return favoritesStore.isFavorite(breed)
  })
})

const breedsRemoved = computed(() => {
  return breeds.value.filter((breed) => {
    return !favoritesStore.isFavorite(breed)
  })
})

const openBreedModal = (breed: Breed) => {
  console.log('Opening modal for breed:', breed)
  selectedBreed.value = breed
  isModalOpen.value = true
}

const closeBreedModal = () => {
  isModalOpen.value = false
  selectedBreed.value = null
}
</script>

