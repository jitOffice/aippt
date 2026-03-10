import { ref, computed } from 'vue'

export interface ZoomPreset {
  value: number
  label: string
}

export function useZoomControls() {
  const zoomLevel = ref(100)
  const containerSize = ref({ width: 0, height: 0 })

  const zoomPresets = [25, 50, 75, 100, 150, 200]

  const canvasZoomStyle = computed(() => {
    const scale = zoomLevel.value / 100
    return {
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease-out'
    }
  })

  const slideScale = computed(() => {
    // Base scale from zoom control
    const baseScale = zoomLevel.value / 100
    
    // Auto-fit calculation for large canvas
    if (containerSize.value.width > 0) {
      const containerWidth = containerSize.value.width - 80 // padding
      const containerHeight = containerSize.value.height - 80
      
      const scaleX = containerWidth / 1920
      const scaleY = containerHeight / 1080
      const autoFitScale = Math.min(scaleX, scaleY, 1) // Don't scale up beyond 100%
      
      const finalScale = autoFitScale * baseScale
      
      return finalScale
    }
    
    return baseScale * 0.5 // Fallback to 50% if container not measured
  })

  const zoomIn = () => {
    const currentIndex = zoomPresets.findIndex(z => z === zoomLevel.value)
    if (currentIndex < zoomPresets.length - 1) {
      zoomLevel.value = zoomPresets[currentIndex + 1]
    } else if (zoomLevel.value < 200) {
      zoomLevel.value = Math.min(200, zoomLevel.value + 25)
    }
  }

  const zoomOut = () => {
    const currentIndex = zoomPresets.findIndex(z => z === zoomLevel.value)
    if (currentIndex > 0) {
      zoomLevel.value = zoomPresets[currentIndex - 1]
    } else if (zoomLevel.value > 25) {
      zoomLevel.value = Math.max(25, zoomLevel.value - 25)
    }
  }

  const resetZoom = () => {
    zoomLevel.value = 100
  }

  const setZoom = (level: number) => {
    zoomLevel.value = level
  }

  const fitToWindow = () => {
    // Calculate optimal zoom to fit slide in viewport
    const container = document.querySelector('.canvas-main')
    if (!container) return
    
    const containerWidth = container.clientWidth - 80 // padding (40px * 2)
    const containerHeight = container.clientHeight - 80
    const slideWidth = 1920 // Standard HD width
    const slideHeight = 1080 // Standard HD height
    
    const widthRatio = (containerWidth / slideWidth) * 100
    const heightRatio = (containerHeight / slideHeight) * 100
    
    // Use the smaller ratio to ensure it fits both dimensions
    const optimalZoom = Math.floor(Math.min(widthRatio, heightRatio, 100))
    
    // Snap to nearest preset if close enough (within 5%)
    const nearestPreset = zoomPresets.find(preset => Math.abs(preset - optimalZoom) <= 5)
    zoomLevel.value = nearestPreset || Math.max(25, optimalZoom)
    
    console.log('[fitToWindow] Zoom set to:', zoomLevel.value, 'optimal:', optimalZoom)
  }

  const updateContainerSize = () => {
    const container = document.querySelector('.canvas-main')
    if (container) {
      containerSize.value = {
        width: container.clientWidth,
        height: container.clientHeight
      }
      console.log('[Zoom] Container size updated:', containerSize.value)
    }
  }

  return {
    zoomLevel,
    zoomPresets,
    containerSize,
    canvasZoomStyle,
    slideScale,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    fitToWindow,
    updateContainerSize
  }
}
