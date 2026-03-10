import { type Ref } from 'vue'

export interface KeyboardShortcutsDeps {
  isPresentMode: Ref<boolean>
  visualEditorRef: Ref<any>
  handleManualSave: () => void
  nextSlide: () => void
  prevSlide: () => void
  exitPresentMode: () => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  deleteCurrentSlide: () => void
}

export function useKeyboardShortcuts(deps: KeyboardShortcutsDeps) {
  const {
    isPresentMode,
    visualEditorRef,
    handleManualSave,
    nextSlide,
    prevSlide,
    exitPresentMode,
    zoomIn,
    zoomOut,
    resetZoom,
    deleteCurrentSlide
  } = deps

  // Global keyboard handler - combines all keyboard shortcuts
  const handleKeydown = (e: KeyboardEvent) => {
    // PRIORITY 1: Handle Ctrl/Cmd+S (Save) - highest priority
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault()
      e.stopPropagation()
      handleManualSave()
      return
    }
    
    // PRIORITY 2: Handle present mode navigation
    if (isPresentMode.value) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        nextSlide()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        e.stopPropagation()
        prevSlide()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        exitPresentMode()
      }
      return
    }
    
    // PRIORITY 3: Handle zoom shortcuts (Ctrl/Cmd + Plus/Minus/0)
    if (e.ctrlKey || e.metaKey) {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault()
        e.stopPropagation()
        zoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        e.stopPropagation()
        zoomOut()
      } else if (e.key === '0') {
        e.preventDefault()
        e.stopPropagation()
        resetZoom()
      }
      return
    }
    
    // PRIORITY 4: Handle edit mode navigation (when not focused on input/textarea)
    if (e.target instanceof HTMLElement && 
        e.target.tagName !== 'INPUT' && 
        e.target.tagName !== 'TEXTAREA') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        e.stopPropagation()
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        nextSlide()
      }
    }
    
    // PRIORITY 5: Handle Delete key to remove current slide (only in edit mode)
    // DO NOT delete slide if user is interacting with canvas elements
    if (e.key === 'Delete' || e.key === 'Backspace') {
      // Skip if focused on input/textarea
      if (e.target instanceof HTMLElement && 
          (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return
      }
      
      // Skip if event originated from canvas (let VisualEditorProto handle it)
      const canvasWrapper = document.querySelector('.canvas-main')
      if (canvasWrapper && e.target instanceof Node && canvasWrapper.contains(e.target)) {
        // Element deletion is handled by VisualEditorProto
        return
      }
      
      // Only delete slide if Delete is pressed outside the canvas (e.g., on thumbnails)
      e.preventDefault()
      e.stopPropagation()
      deleteCurrentSlide()
    }
  }

  // Canvas-specific keyboard handler
  const handleCanvasKeydown = (e: KeyboardEvent) => {
    // Only handle events when canvas is focused
    if (!visualEditorRef.value) {
      return
    }
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const ctrlKey = isMac ? e.metaKey : e.ctrlKey
    
    // Ctrl+C - Copy is handled by VisualEditorProto's document-level listener
    // Don't handle it here to avoid conflicts
    
    // Ctrl+V - Let paste event bubble to document listener (for external clipboard support)
    // Don't preventDefault or stopPropagation here to allow handleSystemPaste in VisualEditorProto
    // Internal paste is handled by the global paste event listener
    
    // Ctrl+Z - Undo (always allowed)
    if (ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      e.stopPropagation()
      if (visualEditorRef.value.undo) {
        visualEditorRef.value.undo()
      }
      return
    }
    
    // Ctrl+Y or Ctrl+Shift+Z - Redo (always allowed)
    if ((ctrlKey && e.key === 'y') || (ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault()
      e.stopPropagation()
      if (visualEditorRef.value.redo) {
        visualEditorRef.value.redo()
      }
      return
    }
    
    // Delete key (only when something is selected)
    if ((e.key === 'Delete' || e.key === 'Backspace') && visualEditorRef.value.selectedId) {
      e.preventDefault()
      e.stopPropagation()
      if (visualEditorRef.value.deleteSelected) {
        visualEditorRef.value.deleteSelected()
      }
      return
    }
  }

  /**
   * Register keyboard event listeners
   * Should be called in parent component's onMounted
   */
  const registerListeners = () => {
    document.addEventListener('keydown', handleKeydown)
    console.log('[useKeyboardShortcuts] Global keyboard listener registered')
  }

  /**
   * Remove keyboard event listeners
   * Should be called in parent component's onBeforeUnmount
   */
  const removeListeners = () => {
    document.removeEventListener('keydown', handleKeydown)
    console.log('[useKeyboardShortcuts] Global keyboard listener removed')
  }

  return {
    handleCanvasKeydown,
    registerListeners,
    removeListeners
  }
}
