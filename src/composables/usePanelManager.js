import { ref, computed } from 'vue'

/**
 * Composable for managing panel state and transitions
 * @param {Object} options - Configuration options
 * @returns {Object} Panel management methods and state
 */
export function usePanelManager(options = {}) {
  const activePanel = ref(null)
  const activeSubPanel = ref(null)
  const isPanelOpen = computed(() => !!activePanel.value)
  const isSubPanelOpen = computed(() => !!activeSubPanel.value)
  
  // Panel operations
  const openPanel = (panelName) => {
    activePanel.value = panelName
  }
  
  const closePanel = () => {
    activePanel.value = null
    closeSubPanel()
  }
  
  const togglePanel = (panelName) => {
    if (activePanel.value === panelName) {
      closePanel()
    } else {
      openPanel(panelName)
    }
  }
  
  // Sub-panel operations
  const openSubPanel = (subPanelName) => {
    activeSubPanel.value = subPanelName
  }
  
  const closeSubPanel = () => {
    activeSubPanel.value = null
  }
  
  const switchSubPanel = (subPanelName) => {
    activeSubPanel.value = subPanelName
  }
  
  // Panel validation
  const isValidPanel = (panelName) => {
    return typeof panelName === 'string' && panelName.length > 0
  }
  
  const isValidSubPanel = (subPanelName) => {
    return typeof subPanelName === 'string' && subPanelName.length > 0
  }
  
  // Reset all panel state
  const resetPanels = () => {
    activePanel.value = null
    activeSubPanel.value = null
  }
  
  return {
    // State
    activePanel,
    activeSubPanel,
    isPanelOpen,
    isSubPanelOpen,
    
    // Methods
    openPanel,
    closePanel,
    togglePanel,
    openSubPanel,
    closeSubPanel,
    switchSubPanel,
    resetPanels,
    
    // Validation
    isValidPanel,
    isValidSubPanel
  }
}