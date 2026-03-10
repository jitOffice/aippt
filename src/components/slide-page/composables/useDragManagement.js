import { ref, computed } from 'vue'

/**
 * Unified drag management composable for all canvas elements
 * Provides consistent drag behavior and state management
 */
export function useDragManagement() {
  // Drag state flags - shared across all element types
  const isDraggingTable = ref(false)
  const isDraggingChart = ref(false)
  const isDraggingImage = ref(false)
  const isDraggingKonvaElement = ref(false)
  
  // Dragging element IDs - track which element is being dragged
  const draggingTableId = ref(null)
  const draggingChartId = ref(null)
  const draggingImageId = ref(null)
  
  // Drag position tracking
  const dragStartPositions = ref({
    table: { x: 0, y: 0 },
    chart: { x: 0, y: 0 },
    image: { x: 0, y: 0 }
  })
  
  const initialElementPositions = ref({
    table: { x: 0, y: 0 },
    chart: { x: 0, y: 0 },
    image: { x: 0, y: 0 }
  })
  
  // Computed: check if ANY drag operation is in progress
  const isDraggingAny = computed(() => {
    return isDraggingTable.value || 
           isDraggingChart.value || 
           isDraggingImage.value || 
           isDraggingKonvaElement.value ||
           draggingTableId.value !== null || 
           draggingChartId.value !== null || 
           draggingImageId.value !== null
  })
  
  /**
   * Start dragging a table
   */
  const startTableDrag = (tableId, mouseX, mouseY, tableX, tableY) => {
    console.log('[DragManagement] Starting table drag:', tableId)
    draggingTableId.value = tableId
    dragStartPositions.value.table = { x: mouseX, y: mouseY }
    initialElementPositions.value.table = { x: tableX, y: tableY }
    isDraggingTable.value = false // Will be set to true when moved > threshold
  }
  
  /**
   * Update table drag state (called during mousemove)
   */
  const updateTableDrag = (mouseX, mouseY, threshold = 3) => {
    if (!draggingTableId.value) return null
    
    const dx = mouseX - dragStartPositions.value.table.x
    const dy = mouseY - dragStartPositions.value.table.y
    
    // Check if exceeded threshold
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      if (!isDraggingTable.value) {
        console.log('[DragManagement] Table drag threshold exceeded')
        isDraggingTable.value = true
      }
      
      return {
        dx,
        dy,
        newX: initialElementPositions.value.table.x + dx,
        newY: initialElementPositions.value.table.y + dy
      }
    }
    
    return null
  }
  
  /**
   * End table drag
   */
  const endTableDrag = () => {
    console.log('[DragManagement] Ending table drag, was dragging:', isDraggingTable.value)
    const wasDragging = isDraggingTable.value
    draggingTableId.value = null
    isDraggingTable.value = false
    return wasDragging
  }
  
  /**
   * Start dragging a chart
   */
  const startChartDrag = (chartId, mouseX, mouseY, chartX, chartY) => {
    console.log('[DragManagement] Starting chart drag:', chartId)
    draggingChartId.value = chartId
    dragStartPositions.value.chart = { x: mouseX, y: mouseY }
    initialElementPositions.value.chart = { x: chartX, y: chartY }
    isDraggingChart.value = false
  }
  
  /**
   * Update chart drag state
   */
  const updateChartDrag = (mouseX, mouseY, threshold = 5) => {
    if (!draggingChartId.value) return null
    
    const dx = mouseX - dragStartPositions.value.chart.x
    const dy = mouseY - dragStartPositions.value.chart.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > threshold) {
      isDraggingChart.value = true
      
      return {
        dx,
        dy,
        newX: initialElementPositions.value.chart.x + dx,
        newY: initialElementPositions.value.chart.y + dy
      }
    }
    
    return null
  }
  
  /**
   * End chart drag
   */
  const endChartDrag = () => {
    console.log('[DragManagement] Ending chart drag')
    const wasDragging = isDraggingChart.value
    draggingChartId.value = null
    isDraggingChart.value = false
    return wasDragging
  }
  
  /**
   * Start dragging an image
   */
  const startImageDrag = (imageId, mouseX, mouseY, imageX, imageY) => {
    console.log('[DragManagement] Starting image drag:', imageId)
    draggingImageId.value = imageId
    dragStartPositions.value.image = { x: mouseX, y: mouseY }
    initialElementPositions.value.image = { x: imageX, y: imageY }
    isDraggingImage.value = false
  }
  
  /**
   * Update image drag state
   */
  const updateImageDrag = (mouseX, mouseY, threshold = 5) => {
    if (!draggingImageId.value) return null
    
    const dx = mouseX - dragStartPositions.value.image.x
    const dy = mouseY - dragStartPositions.value.image.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > threshold) {
      isDraggingImage.value = true
      
      return {
        dx,
        dy,
        newX: initialElementPositions.value.image.x + dx,
        newY: initialElementPositions.value.image.y + dy
      }
    }
    
    return null
  }
  
  /**
   * End image drag
   */
  const endImageDrag = () => {
    console.log('[DragManagement] Ending image drag')
    const wasDragging = isDraggingImage.value
    draggingImageId.value = null
    isDraggingImage.value = false
    return wasDragging
  }
  
  /**
   * Start dragging Konva element (shapes, texts, etc.)
   */
  const startKonvaDrag = () => {
    console.log('[DragManagement] Starting Konva element drag')
    isDraggingKonvaElement.value = true
  }
  
  /**
   * End Konva element drag
   */
  const endKonvaDrag = () => {
    console.log('[DragManagement] Ending Konva element drag')
    isDraggingKonvaElement.value = false
  }
  
  /**
   * Reset all drag states (emergency cleanup)
   */
  const resetAllDragStates = () => {
    console.log('[DragManagement] Resetting all drag states')
    isDraggingTable.value = false
    isDraggingChart.value = false
    isDraggingImage.value = false
    isDraggingKonvaElement.value = false
    draggingTableId.value = null
    draggingChartId.value = null
    draggingImageId.value = null
  }
  
  /**
   * Get current drag state (for debugging)
   */
  const getDragState = () => {
    return {
      isDraggingAny: isDraggingAny.value,
      table: {
        isDragging: isDraggingTable.value,
        draggingId: draggingTableId.value
      },
      chart: {
        isDragging: isDraggingChart.value,
        draggingId: draggingChartId.value
      },
      image: {
        isDragging: isDraggingImage.value,
        draggingId: draggingImageId.value
      },
      konva: {
        isDragging: isDraggingKonvaElement.value
      }
    }
  }
  
  return {
    // State flags
    isDraggingTable,
    isDraggingChart,
    isDraggingImage,
    isDraggingKonvaElement,
    isDraggingAny,
    
    // Element IDs
    draggingTableId,
    draggingChartId,
    draggingImageId,
    
    // Table drag methods
    startTableDrag,
    updateTableDrag,
    endTableDrag,
    
    // Chart drag methods
    startChartDrag,
    updateChartDrag,
    endChartDrag,
    
    // Image drag methods
    startImageDrag,
    updateImageDrag,
    endImageDrag,
    
    // Konva drag methods
    startKonvaDrag,
    endKonvaDrag,
    
    // Utility methods
    resetAllDragStates,
    getDragState
  }
}
