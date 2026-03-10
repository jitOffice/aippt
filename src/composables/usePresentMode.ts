import { ref, nextTick, type Ref, type ComputedRef } from 'vue'
import { Message } from '@arco-design/web-vue'
import type { ParsedSlide } from './useSlideOperations'

export function usePresentMode(
  parsedSlides: ComputedRef<ParsedSlide[]>,
  currentSlideIndex: Ref<number>
) {
  const isPresentMode = ref(false)
  const showPresentControls = ref(false)
  const presentScale = ref(1)
  let hideControlsTimeout: number | null = null

  const calculatePresentScale = () => {
    const CANVAS_WIDTH = 960
    const CANVAS_HEIGHT = 540
    
    // Get available screen space (90% to leave some margin)
    const availableWidth = window.innerWidth * 0.9
    const availableHeight = window.innerHeight * 0.9
    
    // Calculate scale based on both width and height, use the smaller one
    const scaleX = availableWidth / CANVAS_WIDTH
    const scaleY = availableHeight / CANVAS_HEIGHT
    const scale = Math.min(scaleX, scaleY)
    
    presentScale.value = scale
    console.log('[Present Scale] Calculated:', {
      screenSize: { width: window.innerWidth, height: window.innerHeight },
      canvasSize: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
      scale
    })
  }

  const enterPresentMode = () => {
    if (parsedSlides.value.length === 0) {
      Message.warning('No slides to present. Generate a presentation first!')
      return
    }
    
    isPresentMode.value = true
    currentSlideIndex.value = 0
    showPresentControls.value = false
    
    // Calculate optimal scale for present mode
    nextTick(() => {
      calculatePresentScale()
      
      // Request fullscreen after scale is calculated
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
          console.warn('Fullscreen request failed:', err)
        })
      }
    })
  }

  const exitPresentMode = () => {
    isPresentMode.value = false
    showPresentControls.value = false
    
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.warn('Exit fullscreen failed:', err)
      })
    }
  }

  const handlePresentClick = () => {
    if (isPresentMode.value && currentSlideIndex.value < parsedSlides.value.length - 1) {
      currentSlideIndex.value++
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isPresentMode.value) return
    
    const { clientY } = e
    const windowHeight = window.innerHeight
    
    // Show controls when mouse is near top (100px) or bottom (100px)
    if (clientY < 100 || clientY > windowHeight - 100) {
      showPresentControls.value = true
      
      // Auto-hide after 3 seconds
      if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
      hideControlsTimeout = setTimeout(() => {
        showPresentControls.value = false
      }, 3000)
    } else {
      showPresentControls.value = false
    }
  }

  // Handle fullscreen change events (user exits fullscreen via browser controls)
  const handleFullscreenChange = () => {
    // If we're in present mode but fullscreen was exited, exit present mode too
    if (isPresentMode.value && !document.fullscreenElement) {
      console.log('[Fullscreen] User exited fullscreen, exiting present mode')
      isPresentMode.value = false
      showPresentControls.value = false
    }
    // Recalculate scale on fullscreen change
    if (isPresentMode.value) {
      calculatePresentScale()
    }
  }

  // Register fullscreen change listener on mount
  /**
   * Register fullscreen event listeners
   * Should be called in parent component's onMounted
   */
  const registerListeners = () => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    console.log('[usePresentMode] Fullscreen change listener registered')
  }

  /**
   * Remove fullscreen event listeners
   * Should be called in parent component's onBeforeUnmount
   */
  const removeListeners = () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
    console.log('[usePresentMode] Fullscreen change listener removed')
  }

  return {
    isPresentMode,
    showPresentControls,
    presentScale,
    enterPresentMode,
    exitPresentMode,
    calculatePresentScale,
    handlePresentClick,
    handleMouseMove,
    registerListeners,
    removeListeners
  }
}
