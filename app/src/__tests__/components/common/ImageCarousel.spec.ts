/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import ImageCarousel from '@/components/common/ImageCarousel.vue'

// Mock the Heroicons
vi.mock('@heroicons/vue/16/solid', () => ({
  ArrowLeftIcon: {
    name: 'ArrowLeftIcon',
    template: '<div data-testid="arrow-left-icon"></div>'
  },
  ArrowRightIcon: {
    name: 'ArrowRightIcon',
    template: '<div data-testid="arrow-right-icon"></div>'
  }
}))

describe('ImageCarousel', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ]

  let wrapper: VueWrapper<any>

  const createWrapper = (props = {}) => {
    return mount(ImageCarousel, {
      props: { images: mockImages, ...props }
    })
  }

  const getImageContainer = (wrapper: VueWrapper<any>) => wrapper.find('.flex')
  const getNavButtons = (wrapper: VueWrapper<any>) => wrapper.findAll('button').filter(btn =>
    btn.find('[data-testid="arrow-left-icon"]').exists() || btn.find('[data-testid="arrow-right-icon"]').exists()
  )
  const getDots = (wrapper: VueWrapper<any>) => wrapper.findAll('.w-3.h-3')
  const setCurrentIndex = async (wrapper: VueWrapper<any>, index: number) => {
    const vm = wrapper.vm as Record<string, any>
    vm.currentIndex = index
    await nextTick()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    wrapper?.unmount()
  })

  describe('Basic Rendering', () => {
    it('renders properly with images', () => {
      wrapper = createWrapper()
      expect(wrapper.find('img').exists()).toBe(true)
      expect(wrapper.findAll('img')).toHaveLength(3)
      expect(wrapper.find('img').attributes('src')).toBe(mockImages[0])
    })

    it('renders loading state correctly', () => {
      wrapper = createWrapper({ loading: true })
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('renders empty state when no images provided', () => {
      wrapper = createWrapper({ images: [] })
      expect(wrapper.text()).toContain('No images available')
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(false)
    })
  })

  describe('Navigation Controls', () => {
    it('shows navigation arrows when there are multiple images', () => {
      wrapper = createWrapper()
      const buttons = getNavButtons(wrapper)
      expect(buttons).toHaveLength(2)
      expect(buttons[0].find('[data-testid="arrow-left-icon"]').exists()).toBe(true)
      expect(buttons[1].find('[data-testid="arrow-right-icon"]').exists()).toBe(true)
    })

    it('hides navigation arrows when there is only one image', () => {
      wrapper = createWrapper({ images: ['https://example.com/single.jpg'] })
      expect(getNavButtons(wrapper)).toHaveLength(0)
    })

    it('disables previous button when at first image and next button when at last image', async () => {
      wrapper = createWrapper()
      const buttons = getNavButtons(wrapper)

      // First image - previous disabled
      expect(buttons[0].attributes('disabled')).toBeDefined()
      expect(buttons[0].classes()).toContain('opacity-50')

      // Last image - next disabled
      await setCurrentIndex(wrapper, 2)
      expect(buttons[1].attributes('disabled')).toBeDefined()
      expect(buttons[1].classes()).toContain('opacity-50')
    })
  })

  describe('Navigation Functionality', () => {
    it('moves to next and previous images correctly', async () => {
      wrapper = createWrapper()
      const buttons = getNavButtons(wrapper)
      const imageContainer = getImageContainer(wrapper)

      // Move to next image
      await buttons[1].trigger('click')
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-100%)')

      // Move to previous image
      await buttons[0].trigger('click')
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-0%)')
    })

    it('does not move beyond boundaries', async () => {
      wrapper = createWrapper()
      const buttons = getNavButtons(wrapper)
      const imageContainer = getImageContainer(wrapper)

      // Try to go before first image
      await buttons[0].trigger('click')
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-0%)')

      // Go to last image and try to go beyond
      await setCurrentIndex(wrapper, 2)
      await buttons[1].trigger('click')
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-200%)')
    })
  })

  describe('Dots Indicator', () => {
    it('shows dots indicator with correct highlighting and navigation', async () => {
      wrapper = createWrapper()
      const dots = getDots(wrapper)

      expect(dots).toHaveLength(3)
      expect(dots[0].classes()).toContain('bg-blue-600')

      // Change image and check dot highlighting
      await setCurrentIndex(wrapper, 1)
      expect(dots[0].classes()).toContain('bg-gray-300')
      expect(dots[1].classes()).toContain('bg-blue-600')

      // Click dot to navigate
      await dots[2].trigger('click')
      const imageContainer = getImageContainer(wrapper)
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-200%)')
    })
  })

  describe('Image Counter', () => {
    it('shows correct image counter and updates when image changes', async () => {
      wrapper = createWrapper()
      expect(wrapper.text()).toContain('1 of 3')

      await setCurrentIndex(wrapper, 2)
      expect(wrapper.text()).toContain('3 of 3')
    })

    it('hides counter when there is only one image', () => {
      wrapper = createWrapper({ images: ['https://example.com/single.jpg'] })
      expect(wrapper.text()).not.toContain('of')
    })
  })

  describe('Keyboard Navigation', () => {
    it('moves to next and previous images with arrow keys', async () => {
      wrapper = createWrapper()
      const imageContainer = getImageContainer(wrapper)

      // Right arrow key
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await nextTick()
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-100%)')

      // Left arrow key
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
      await nextTick()
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-0%)')
    })

    it('ignores keyboard navigation when there is only one image', async () => {
      wrapper = createWrapper({ images: ['https://example.com/single.jpg'] })
      const imageContainer = getImageContainer(wrapper)

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
      await nextTick()
      expect(imageContainer.attributes('style')).toContain('transform: translateX(-0%)')
    })
  })

  describe('Autoplay Functionality', () => {
    it('starts autoplay when enabled and advances through images', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wrapper = createWrapper({ autoplay: true, autoplayInterval: 1000 })
      expect(consoleSpy).toHaveBeenCalledWith('Starting autoplay with', 3, 'images, interval:', 1000)

      // Advance through images
      vi.advanceTimersByTime(1000)
      await nextTick()
      expect(getImageContainer(wrapper).attributes('style')).toContain('transform: translateX(-100%)')

      // Loop back to first after reaching end
      vi.advanceTimersByTime(2000)
      await nextTick()
      expect(getImageContainer(wrapper).attributes('style')).toContain('transform: translateX(-0%)')

      consoleSpy.mockRestore()
    })

    it('stops autoplay when component is unmounted', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wrapper = createWrapper({ autoplay: true })
      wrapper.unmount()

      expect(consoleSpy).toHaveBeenCalledWith('Stopping autoplay')
      consoleSpy.mockRestore()
    })

    it('restarts autoplay when images change and does not start with single image', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wrapper = createWrapper({ autoplay: true })
      consoleSpy.mockClear()

      // Change images
      await wrapper.setProps({ images: ['https://example.com/new1.jpg', 'https://example.com/new2.jpg'] })
      expect(consoleSpy).toHaveBeenCalledWith('Stopping autoplay')
      expect(consoleSpy).toHaveBeenCalledWith('Starting autoplay with', 2, 'images, interval:', 5000)

      // Single image should not start autoplay
      consoleSpy.mockClear()
      wrapper.unmount()
      wrapper = createWrapper({ images: ['https://example.com/single.jpg'], autoplay: true })
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('Starting autoplay'))

      consoleSpy.mockRestore()
    })

    it('starts/stops autoplay when autoplay prop changes', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wrapper = createWrapper({ autoplay: false })
      consoleSpy.mockClear()

      await wrapper.setProps({ autoplay: true })
      expect(consoleSpy).toHaveBeenCalledWith('Starting autoplay with', 3, 'images, interval:', 5000)

      consoleSpy.mockClear()
      await wrapper.setProps({ autoplay: false })
      expect(consoleSpy).toHaveBeenCalledWith('Stopping autoplay')

      consoleSpy.mockRestore()
    })
  })

  describe('Image Error Handling', () => {
    it('emits imageError event when image fails to load', async () => {
      wrapper = createWrapper()

      const firstImage = wrapper.find('img')
      await firstImage.trigger('error')
      expect(wrapper.emitted('imageError')).toBeTruthy()
      expect(wrapper.emitted('imageError')?.[0]).toEqual([0])

      // Test different image index
      const images = wrapper.findAll('img')
      await images[1].trigger('error')
      expect(wrapper.emitted('imageError')?.[1]).toEqual([1])
    })
  })

  describe('Props and Reactivity', () => {
    it('resets to first image when images prop changes and uses custom autoplay interval', async () => {
      wrapper = createWrapper()
      await setCurrentIndex(wrapper, 2)

      await wrapper.setProps({ images: ['https://example.com/new1.jpg', 'https://example.com/new2.jpg'] })
      const vm = wrapper.vm as Record<string, any>
      expect(vm.currentIndex).toBe(0)

      // Test custom autoplay interval
      wrapper.unmount()
      wrapper = createWrapper({ autoplay: true, autoplayInterval: 2000 })

      vi.advanceTimersByTime(1500)
      await nextTick()
      expect(getImageContainer(wrapper).attributes('style')).toContain('transform: translateX(-0%)')

      vi.advanceTimersByTime(500)
      await nextTick()
      expect(getImageContainer(wrapper).attributes('style')).toContain('transform: translateX(-100%)')
    })
  })

  describe('Accessibility', () => {
    it('has proper aria-labels for dot buttons and alt text for images', () => {
      wrapper = createWrapper()

      // Check aria-labels for dots
      const dots = getDots(wrapper)
      expect(dots[0].attributes('aria-label')).toBe('Go to image 1')
      expect(dots[1].attributes('aria-label')).toBe('Go to image 2')
      expect(dots[2].attributes('aria-label')).toBe('Go to image 3')

      // Check alt text for images
      const images = wrapper.findAll('img')
      expect(images[0].attributes('alt')).toBe('Image 1')
      expect(images[1].attributes('alt')).toBe('Image 2')
      expect(images[2].attributes('alt')).toBe('Image 3')
    })

    it('has focus rings on interactive elements', () => {
      wrapper = createWrapper()

      const allButtons = wrapper.findAll('button')
      allButtons.forEach(button => {
        expect(button.classes()).toContain('focus:outline-none')
        expect(button.classes()).toContain('focus:ring-2')
      })
    })
  })
})
