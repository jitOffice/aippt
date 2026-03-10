import { ref, computed } from 'vue'

/**
 * Composable for handling draggable toolbar functionality
 * @param {Object} toolbarRef - Reference to the toolbar DOM element
 * @param {Object} position - Reactive position object { x, y }
 * @returns {Object} Draggable functionality methods and state
 */
export function useDraggable(toolbarRef, position) {
  const isDragging = ref(false)
  const hasMoved = ref(false)
  
  // Computed style for toolbar positioning
  const toolbarStyle = computed(() => {
    if (!hasMoved.value) return {}
    return {
      top: `${position.value.y}px`,
      left: `${position.value.x}px`,
      right: 'auto',
      transform: 'none'
    }
  })
  
  /**
   * Start drag operation
   * @param {Event} e - Mouse event
   */
  const startDrag = (e) => {
    if (!toolbarRef.value) return
    
    // Don't prevent default yet - let clicks through
    isDragging.value = true
    
    // Get initial toolbar position
    const rect = toolbarRef.value.getBoundingClientRect()
    const initialToolbarX = hasMoved.value ? position.value.x : rect.left
    const initialToolbarY = hasMoved.value ? position.value.y : rect.top
    
    const startX = e.clientX
    const startY = e.clientY
    let hasActuallyMoved = false
    const dragThreshold = 5 // Minimum pixels to move before considering it a drag
    
    /**
     * Handle mouse move during drag
     * @param {Event} e - Mouse move event
     */
    const onMouseMove = (e) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      
      // Check if mouse has moved beyond threshold
      if (!hasActuallyMoved && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
        hasActuallyMoved = true
        hasMoved.value = true
        e.preventDefault() // Now prevent default behavior
      }
      
      // Only update position if we've actually started dragging
      if (hasActuallyMoved) {
        position.value = {
          x: initialToolbarX + dx,
          y: initialToolbarY + dy
        }
      }
    }
    
    /**
     * Handle mouse up to end drag
     */
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      isDragging.value = false
    }
    
    // Add event listeners
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }
  
  /**
   * Reset drag state
   */
  const resetDrag = () => {
    hasMoved.value = false
    isDragging.value = false
  }
  
  return {
    // State
    isDragging,
    hasMoved,
    
    // Computed
    toolbarStyle,
    
    // Methods
    startDrag,
    resetDrag
  }
}