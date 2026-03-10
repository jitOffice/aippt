// Export all new architecture components

// Main container
export { default as RightToolbarContainer } from './RightToolbarContainer.vue'

// Panel components
export { default as TextPanel } from './panels/TextPanel.vue'
export { default as ImagesPanel } from './panels/ImagesPanel.vue'
export { default as MediaPanel } from './panels/MediaPanel.vue'
export { default as ShapesPanel } from './panels/ShapesPanel.vue'
export { default as ChartsPanel } from './panels/ChartsPanel.vue'

// Utility components
export { default as ComponentCard } from './ComponentCard.vue'
export { default as IconRenderer } from './IconRenderer.vue'
export { default as ComingSoonOverlay } from './ComingSoonOverlay.vue'
export { default as SearchHeader } from './SearchHeader.vue'

// Composables
export { usePanelManager } from '../../composables/usePanelManager.js'
export { useComponentRegistry } from '../../composables/useComponentRegistry.js'
export { useImageSearch } from '../../composables/useImageSearch.js'
export { useComponentActions } from '../../composables/useComponentActions.js'
export { useDraggable } from '../../composables/useDraggable.js'

// Configuration
export { 
  textComponents, 
  shapeComponents, 
  chartComponents,
  panelConfig,
  searchableSubPanels
} from '../../views/slide-page/config/component-definitions.js'

export { customIcons, getCustomIcon, isCustomIcon } from '../../views/slide-page/config/icon-mapping.js'

export { panelSettings, animations, transitions, classNames } from '../../views/slide-page/config/panel-config.js'