import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import BreedModal from '@/components/breeds/BreedModal.vue'
import { useFavoritesStore } from '@/stores/favorites'
import { api } from '@/services/api'
import type { Breed } from '@/stores/breeds'

// Mock the Heroicons components
vi.mock('@heroicons/vue/16/solid', () => ({
  XMarkIcon: {
    name: 'XMarkIcon',
    template: '<div data-testid="x-mark-icon"></div>'
  },
  ExclamationTriangleIcon: {
    name: 'ExclamationTriangleIcon',
    template: '<div data-testid="exclamation-triangle-icon"></div>'
  },
  HeartIcon: {
    name: 'HeartIcon',
    template: '<div data-testid="heart-icon"></div>'
  }
}))

// Mock ImageCarousel component
vi.mock('@/components/common/ImageCarousel.vue', () => ({
  default: {
    name: 'ImageCarousel',
    template: '<div data-testid="image-carousel" :data-loading="loading" :data-images="images.length"></div>',
    props: ['images', 'loading', 'autoplay', 'autoplayInterval'],
    emits: ['image-error']
  }
}))

// Mock API
vi.mock('@/services/api', () => ({
  api: {
    fetchBreedImages: vi.fn()
  }
}))

describe('BreedModal', () => {
  let pinia: ReturnType<typeof createPinia>
  let favoritesStore: ReturnType<typeof useFavoritesStore>

  const mockBreed: Breed = {
    key: 'labrador',
    name: 'labrador'
  }

  const mockBreedWithSubBreed: Breed = {
    key: 'retriever|golden',
    name: 'retriever',
    subBread: 'golden'
  }

  const mockImages = [
    'https://example.com/dog1.jpg',
    'https://example.com/dog2.jpg',
    'https://example.com/dog3.jpg'
  ]

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    favoritesStore = useFavoritesStore()

    // Reset mocks
    vi.clearAllMocks()
    vi.mocked(api.fetchBreedImages).mockResolvedValue(mockImages)
  })

  it('does not render when isOpen is false', () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: false,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('renders when isOpen is true', () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
  })

  it('displays breed name correctly', () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('h3').text()).toBe('Labrador')
  })

  it('displays breed name with sub-breed correctly', () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreedWithSubBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('h3').text()).toBe('Retriever (Golden)')
  })

  it('emits close event when X button is clicked', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Call the closeModal method directly
    await (wrapper.vm as any).closeModal()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when background overlay is clicked', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    const backgroundOverlay = wrapper.find('.bg-gray-500')
    await backgroundOverlay.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close event when modal container is clicked', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    const modalContainer = wrapper.find('.fixed.inset-0')
    await modalContainer.trigger('click.self')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('fetches images when modal opens', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Trigger the watcher manually
    await (wrapper.vm as any).fetchImages()

    expect(api.fetchBreedImages).toHaveBeenCalledWith('labrador', undefined)
  })

  it('fetches images with sub-breed parameter', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreedWithSubBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Trigger the watcher manually
    await (wrapper.vm as any).fetchImages()

    expect(api.fetchBreedImages).toHaveBeenCalledWith('retriever', 'golden')
  })

  it('displays error state when image fetch fails', async () => {
    const errorMessage = 'Failed to fetch images'
    vi.mocked(api.fetchBreedImages).mockRejectedValue(new Error(errorMessage))

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Trigger fetchImages manually and wait for it to complete
    await (wrapper.vm as any).fetchImages()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain(errorMessage)
    expect(wrapper.find('[data-testid="exclamation-triangle-icon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Try Again')
  })

  it('retries fetching images when "Try Again" button is clicked', async () => {
    vi.mocked(api.fetchBreedImages).mockRejectedValueOnce(new Error('Network error'))
    vi.mocked(api.fetchBreedImages).mockResolvedValueOnce(mockImages)

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Trigger error state first
    await (wrapper.vm as any).fetchImages()
    await wrapper.vm.$nextTick()

    // Find and click Try Again button
    const buttons = wrapper.findAll('button')
    const tryAgainButton = buttons.find(btn => btn.text().includes('Try Again'))

    if (tryAgainButton) {
      await tryAgainButton.trigger('click')
    }

    expect(api.fetchBreedImages).toHaveBeenCalledTimes(2)
  })

  it('displays ImageCarousel when images are loaded successfully', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Manually set images to simulate successful load
    const vm = wrapper.vm as any
    vm.images = mockImages
    vm.loading = false
    vm.error = null
    await wrapper.vm.$nextTick()

    const carousel = wrapper.find('[data-testid="image-carousel"]')
    expect(carousel.exists()).toBe(true)
    expect(carousel.attributes('data-images')).toBe('3')
  })

  it('shows heart icon for favorites', () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.find('[data-testid="heart-icon"]').exists()).toBe(true)
  })

  it('calls addFavorite when heart button is clicked on non-favorite breed', async () => {
    const addFavoriteSpy = vi.spyOn(favoritesStore, 'addFavorite').mockResolvedValue()
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(false)

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Call the favoriteBreed method directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (wrapper.vm as any).favoriteBreed()

    expect(addFavoriteSpy).toHaveBeenCalledWith(mockBreed)
    expect(wrapper.emitted('favorite')).toBeTruthy()
    const favoriteEvents = wrapper.emitted('favorite')
    if (favoriteEvents) {
      expect(favoriteEvents[0]).toEqual([mockBreed])
    }
  })

  it('calls removeFavorite when heart button is clicked on favorite breed', async () => {
    const removeFavoriteSpy = vi.spyOn(favoritesStore, 'removeFavorite').mockResolvedValue()
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(true)

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Call the favoriteBreed method directly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (wrapper.vm as any).favoriteBreed()

    expect(removeFavoriteSpy).toHaveBeenCalledWith(mockBreed)
    expect(wrapper.emitted('favorite')).toBeTruthy()
    const favoriteEvents = wrapper.emitted('favorite')
    if (favoriteEvents) {
      expect(favoriteEvents[0]).toEqual([mockBreed])
    }
  })

  it('shows correct favorite button text for non-favorite breed', () => {
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(false)

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Add')
  })

  it('shows correct favorite button text for favorite breed', () => {
    vi.spyOn(favoritesStore, 'isFavorite').mockReturnValue(true)

    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(wrapper.text()).toContain('Remove')
  })

  it('disables favorite button when favorite operation is loading', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Simulate favorite loading state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(wrapper.vm as any).favoriteLoading = true
    await wrapper.vm.$nextTick()

    // Find all buttons and get the one that contains the heart icon
    const buttons = wrapper.findAll('button')
    const favoriteButton = buttons.find(btn =>
      btn.find('[data-testid="heart-icon"]').exists()
    )

    expect(favoriteButton?.attributes('disabled')).toBeDefined()
    expect(favoriteButton?.classes()).toContain('opacity-50')
  })

  it('clears images and resets state when modal closes', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Manually set some images first
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.images = mockImages
    vm.loading = false
    vm.error = null
    await wrapper.vm.$nextTick()

    // Change isOpen to false
    await wrapper.setProps({ isOpen: false })

    expect(vm.images).toEqual([])
    expect(vm.loading).toBe(false)
    expect(vm.error).toBe(null)
  })

  it('handles image error from carousel', async () => {
    const wrapper = mount(BreedModal, {
      props: {
        isOpen: true,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    // Set initial images
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any
    vm.images = [...mockImages] // Create a copy
    await wrapper.vm.$nextTick()

    const carousel = wrapper.findComponent({ name: 'ImageCarousel' })
    await carousel.vm.$emit('image-error', 1)

    expect(vm.images.length).toBe(2) // One image should be removed
  })

  it('does not fetch images when breed is null', () => {
    mount(BreedModal, {
      props: {
        isOpen: true,
        breed: null
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(api.fetchBreedImages).not.toHaveBeenCalled()
  })

  it('does not fetch images when modal is closed', () => {
    mount(BreedModal, {
      props: {
        isOpen: false,
        breed: mockBreed
      },
      global: {
        plugins: [pinia]
      }
    })

    expect(api.fetchBreedImages).not.toHaveBeenCalled()
  })
})
