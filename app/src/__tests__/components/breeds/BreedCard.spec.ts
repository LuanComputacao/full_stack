import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BreedCard from '@/components/breeds/BreedCard.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { useBreedImagesStore } from '@/stores/breedImages'
import type { Breed } from '@/stores/breeds'

// Mock the HeartIcon component
vi.mock('@heroicons/vue/16/solid', () => ({
  HeartIcon: {
    name: 'HeartIcon',
    template: '<div data-testid="heart-icon"></div>'
  }
}))

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})
window.IntersectionObserver = mockIntersectionObserver

describe('BreedCard', () => {
  let pinia: ReturnType<typeof createPinia>
  let favoritesStore: ReturnType<typeof useFavoritesStore>
  let breedImagesStore: ReturnType<typeof useBreedImagesStore>

  const mockBreed: Breed = {
    key: 'labrador',
    name: 'labrador'
  }

  const mockBreedWithSubBreed: Breed = {
    key: 'retriever|golden',
    name: 'retriever',
    subBread: 'golden'
  }

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    favoritesStore = useFavoritesStore()
    breedImagesStore = useBreedImagesStore()

    // Reset mocks
    vi.clearAllMocks()
    mockIntersectionObserver.mockClear()
  })

  it('renders properly with breed name', () => {
    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('[data-testid="heart-icon"]').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('Labrador')
    expect(wrapper.text()).toContain('View Details')
  })

  it('displays breed name with sub-breed correctly', () => {
    const wrapper = mount(BreedCard, {
      props: { breed: mockBreedWithSubBreed },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('h3').text()).toBe('Retriever (Golden)')
  })


  it('emits detail event when "View Details" button is clicked', async () => {
    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    const detailButton = wrapper.find('button:last-child')
    await detailButton.trigger('click')

    expect(wrapper.emitted('detail')).toBeTruthy()
    expect(wrapper.emitted('detail')?.[0]).toEqual([mockBreed])
  })

  it('calls toggleFavorite when heart button is clicked', async () => {
    const addFavoriteSpy = vi.spyOn(favoritesStore, 'addFavorite').mockResolvedValue()
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(false)

    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    const heartButton = wrapper.find('.heart-icon')
    await heartButton.trigger('click')

    expect(addFavoriteSpy).toHaveBeenCalledWith(mockBreed)
  })

  it('calls removeFavorite when heart button is clicked on favorited breed', async () => {
    const removeFavoriteSpy = vi.spyOn(favoritesStore, 'removeFavorite').mockResolvedValue()
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(true)

    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    const heartButton = wrapper.find('.heart-icon')
    await heartButton.trigger('click')

    expect(removeFavoriteSpy).toHaveBeenCalledWith(mockBreed)
  })

  it('shows loading text when image is loading', async () => {
    vi.spyOn(breedImagesStore, 'getCachedImage').mockReturnValue(null)
    vi.spyOn(breedImagesStore, 'isLoading').mockReturnValue(true)

    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    // Simulate intersection observer triggering and loading state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.isVisible = true
    vm.imageLoading = true
    vm.imageError = false
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Loading image...')
  })

  it('shows error message when image fails to load', async () => {
    vi.spyOn(breedImagesStore, 'getCachedImage').mockReturnValue(null)
    vi.spyOn(breedImagesStore, 'isLoading').mockReturnValue(false)
    vi.spyOn(breedImagesStore, 'getError').mockReturnValue('Error loading image')

    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    // Simulate intersection observer triggering and error state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.isVisible = true
    vm.imageLoading = false
    vm.imageError = true
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Image not available')
  })

  it('displays cached image when available', async () => {
    const mockImageUrl = 'https://example.com/dog.jpg'
    vi.spyOn(breedImagesStore, 'getCachedImage').mockReturnValue(mockImageUrl)

    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    // Simulate intersection observer triggering and set component state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.isVisible = true
    vm.breedRamdomImage = mockImageUrl
    vm.imageLoading = false
    vm.imageError = false
    await wrapper.vm.$nextTick()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockImageUrl)
    expect(img.attributes('alt')).toBe('Labrador Image')
  })

  it('shows placeholder when not visible (lazy loading)', () => {
    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Scroll to load image')
  })

  it('sets up intersection observer on mount', () => {
    mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )
  })

  it('disables heart button when favorite is loading', async () => {
    const wrapper = mount(BreedCard, {
      props: { breed: mockBreed },
      global: {
        plugins: [pinia]
      }
    })

    // Simulate favorite loading state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(wrapper.vm as any).favoriteLoading = true
    await wrapper.vm.$nextTick()

    const heartButton = wrapper.find('.heart-icon')
    expect(heartButton.attributes('disabled')).toBeDefined()
    expect(heartButton.classes()).toContain('opacity-50')
  })
})
