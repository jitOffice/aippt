<template>
  <div class="top-left-toolbar-container" ref="toolbarRef" :style="toolbarStyle" @mouseenter="handleMouseEnter">
    <!-- Icon Buttons -->
    <div class="toolbar-icons" @mousedown="startDrag">
      <template v-for="panel in panelConfigurations" :key="panel.id">
        <!-- Wrapper for badges and locked features -->
        <div 
          v-if="panel.isNew || panel.isLocked" 
          class="icon-btn-wrapper"
        >
          <div 
            v-if="panel.isNew" 
            class="new-badge"
          >
            NEW
          </div>
          
          <div 
            class="icon-btn" 
            :class="[panel.isLocked ? 'locked disabled-feature' : '', { active: isActivePanel(panel.id) }]"
            @click.stop="panel.isLocked ? handleLockedClick(panel) : togglePanel(panel.id)"
            :title="panel.isLocked ? t('slide.visual.messages.comingSoon') : t(panel.title)"
          >
            <component :is="panel.icon" :size="20" />
            
            <div v-if="panel.isLocked" class="lock-overlay">
              <icon-lock :size="12" />
            </div>
            
            <div v-if="panel.isLocked" class="coming-soon-badge">
              {{ t('slide.visual.messages.comingSoon') }}
            </div>
          </div>
        </div>
        
        <!-- Regular icon button -->
        <div 
          v-else
          class="icon-btn" 
          :class="{ active: isActivePanel(panel.id) }"
          @click="togglePanel(panel.id)"
          :title="t(panel.title)"
        >
          <component :is="panel.icon" :size="20" />
        </div>
      </template>
      
      <!-- Separator -->
      <div class="toolbar-separator"></div>
      
      <!-- AI Assistant Button -->
      <div 
        class="icon-btn ai-assistant-btn" 
        :class="{ active: false }"
        @click="handleAIAssistant"
        title="AI助手"
      >
       <Icon name="toolbar-magic-wand" :size="18" />
      </div>
    </div>
    
    <!-- Dynamic Panel Rendering - Customized per panel type -->
    <transition :name="transitions.slideLeft">
      <div 
        v-if="isPanelOpen" 
        class="component-panel" 
        @click.self="closePanel"
      >
        <!-- Render customized panel based on type -->
        <component 
          :is="activePanelComponent"
          @add-component="handleAddComponent"
          @coming-soon="handleComingSoon"
          @open-search="handleOpenSearch"
          @apply-layout="handleApplyLayout"
          @close="closePanel"
        />
      </div>
    </transition>
    
    <!-- Image Search Panel -->
    <transition :name="transitions.slideLeft">
      <div 
        v-if="isSubPanelOpen" 
        class="image-search-panel" 
        @click.self="closeSubPanel"
      >
        <div class="panel-wrapper">
          <SearchHeader
            :title="subPanelTitle"
            :icon="subPanelIcon"
            :placeholder="searchPlaceholder"
            :dropdown-options="subPanelOptions"
            :selected-option="selectedSubPanelOption"
            @close="closeSubPanel"
            @search="handleSearch"
            @option-select="switchSubPanel"
          />
          
          <div class="modal-content" @scroll="handleScroll">
            <!-- Loading State -->
            <div v-if="isLoading && searchResults.length === 0" class="loading-container">
              <a-spin :size="32" />
              <p class="loading-text">{{ t('slide.visual.images.loading') || 'Loading images...' }}</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="hasError" class="error-container">
              <icon-close :size="48" style="color: #ef4444;" />
              <p class="error-message">{{ errorMessage }}</p>
            </div>
            
            <!-- Image Grid -->
            <div v-else-if="searchResults.length > 0" class="image-grid">
              <div
                v-for="image in searchResults"
                :key="image.id"
                class="image-item"
                @click="handleImageSelect(image)"
              >
                <div class="image-wrapper">
                  <img :src="image.preview" :alt="image.title || 'Image'" loading="lazy" />
                  <div class="image-overlay">
                    <div class="overlay-content">
                      <icon-plus :size="24" />
                      <span class="overlay-text">{{ t('slide.visual.images.addToSlide') || 'Add to slide' }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="image.photographer" class="image-info">
                  <span class="photographer-name">{{ image.photographer }}</span>
                </div>
              </div>
              
              <!-- Loading More -->
              <div v-if="isLoading && searchResults.length > 0" class="loading-more">
                <a-spin :size="20" />
                <span>{{ t('slide.visual.images.loadingMore') || 'Loading more...' }}</span>
              </div>
              
              <!-- No More Results -->
              <div v-else-if="!hasMore" class="no-more-results">
                <span>{{ t('slide.visual.images.noMoreResults') || 'No more results' }}</span>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="placeholder-message">
              <icon-search :size="48" style="color: #d1d5db;" />
              <p>{{ t('slide.visual.images.emptyState') || 'Search for images to get started' }}</p>
              <span class="placeholder-hint">{{ t('slide.visual.images.emptyHint') || 'Try searching for "nature", "business", or "technology"' }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Button as AButton, 
  Spin as ASpin 
} from '@arco-design/web-vue'
import { 
  IconClose, 
  IconLock, 
  IconSearch, 
  IconPlus,
  IconStarFill
} from '@arco-design/web-vue/es/icon'

// Import panel components dynamically
import TextPanel from './panels/TextPanel.vue'
import TablePanel from './panels/TablePanel.vue'
import ImagesPanel from './panels/ImagesPanel.vue'
import MediaPanel from './panels/MediaPanel.vue'
import ShapesPanel from './panels/ShapesPanel.vue'
import ChartsPanel from './panels/ChartsPanel.vue'
import SmartLayoutsPanel from './panels/SmartLayoutsPanel.vue'

// Import utility components
import SearchHeader from './SearchHeader.vue'

// Import composables
import { useDraggable } from '../../composables/useDraggable.js'
import { usePanelManager } from '../../composables/usePanelManager.js'
import { useComponentRegistry } from '../../composables/useComponentRegistry.js'
import { useImageSearch } from '../../composables/useImageSearch.js'
import { useComponentActions } from '../../composables/useComponentActions.js'

// Import configurations
import { panelConfig } from '../../views/slide-page/config/component-definitions.js'
import { panelSettings, transitions } from '../../views/slide-page/config/panel-config.js'

import IIcon from '@/utils/slide/icon.js'

// Use centralized icon system
const Icon = IIcon


const emit = defineEmits(['add-component', 'panel-change', 'mouseenter'])

const { t } = useI18n()

// Refs
const toolbarRef = ref(null)
const position = ref({ x: 0, y: 0 })

// Composables
const { isDragging, hasMoved, toolbarStyle, startDrag } = useDraggable(toolbarRef, position)
const { 
  activePanel, 
  activeSubPanel,
  isPanelOpen,
  isSubPanelOpen,
  togglePanel,
  closePanel,
  openSubPanel,
  closeSubPanel,
  switchSubPanel
} = usePanelManager()

const { getComponentById, getImagesComponents } = useComponentRegistry()
const { 
  searchResults,
  isLoading,
  hasError,
  errorMessage,
  hasMore,
  searchQuery,
  activeSource,
  searchImages,
  loadMoreResults,
  setActiveSource,
  setSearchQuery,
  cleanup
} = useImageSearch()

const { addComponent, handleImageSelect: handleImageSelection, handleComingSoon } = useComponentActions((event, payload) => {
  if (event === 'add-component') {
    emit('add-component', payload)
    closePanel()
  }
})

// Computed properties
const panelConfigurations = computed(() => {
  return Object.values(panelConfig).map(config => ({
    ...config,
    isLocked: config.id === 'search' || config.id === 'draw',
    isNew: config.isNew || false
  }))
})

const activePanelComponent = computed(() => {
  const componentMap = {
    text: TextPanel,
    table: TablePanel,
    images: ImagesPanel,
    media: MediaPanel,
    shapes: ShapesPanel,
    charts: ChartsPanel,
    layouts: SmartLayoutsPanel
  }
  return componentMap[activePanel.value] || null
})

const panelTitle = computed(() => {
  const activeConfig = panelConfig[activePanel.value]
  return activeConfig ? t(activeConfig.title) : ''
})

const subPanelTitle = computed(() => {
  const component = getComponentById(activeSubPanel.value)
  return component ? component.name : 'Images'
})

const subPanelIcon = computed(() => {
  const component = getComponentById(activeSubPanel.value)
  return component?.icon || 'IconImage'
})

const searchPlaceholder = computed(() => {
  return t('slide.visual.images.searchPlaceholder') || 'Search images...'
})

const subPanelOptions = computed(() => {
  return getImagesComponents().filter(c => 
    ['webSearch', 'aiImages', 'pexels', 'giphy', 'pictographic', 'galleryImages'].includes(c.id)
  )
})

const selectedSubPanelOption = computed(() => {
  return subPanelOptions.value.find(option => option.id === activeSubPanel.value) || null
})

const dragIcon = computed(() => icon['drag'] || { body: '⋮⋮' })

// Methods
const isActivePanel = (panelId) => {
  return activePanel.value === panelId
}

// Handle mouse enter to hide floating toolbars
const handleMouseEnter = () => {
  emit('mouseenter')
}

// Handle AI Assistant button click
const handleAIAssistant = () => {
  // Placeholder for AI Assistant functionality
  console.log('[RightToolbar] AI Assistant clicked')
  emit('ai-assistant')
  
}

const handleLockedClick = (panel) => {
  // Do nothing for locked panels
}

const handleAddComponent = (component) => {
  emit('add-component', component)
  closePanel()
}

const handleOpenSearch = (component) => {
  openSubPanel(component.id)
  setActiveSource(component.id)
  setSearchQuery('')
}

const handleSearch = (query) => {
  setSearchQuery(query)
}

const handleScroll = (event) => {
  const container = event.target
  const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
  
  if (scrollBottom < 100 && hasMore.value && !isLoading.value) {
    loadMoreResults()
  }
}

const handleImageSelect = (image) => {
  handleImageSelection(image)
  closeSubPanel()
  closePanel()
}

const handleApplyLayout = (layout) => {
  emit('add-component', {
    id: 'smart-layout',
    type: 'layout',
    layout: layout
  })
  closePanel()
}

// Cleanup
onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* Top-left toolbar matching prototype design - positioned in canvas area */
.top-left-toolbar-container {
  height: auto;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 100;
  transition: all 0.2s;
  border: 1px solid #f1f5f9;
}

.top-left-toolbar-container:hover {
  box-shadow: 0 12px 60px rgba(0, 0, 0, 0.12);
  cursor: move;
  cursor: grab;
}

.top-left-toolbar-container:active {
  cursor: grabbing;
}

.toolbar-icons {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
  gap: 8px;
  user-select: none;
}

.icon-btn-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.new-badge {
  position: absolute;
  top: 0px;
  right: 6px;
  background: #4ade80;
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 1px 3px;
  border-radius: 3px;
  z-index: 1;
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  pointer-events: auto;
}

.icon-btn:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.icon-btn.active {
  background: #2563eb;
  color: white;
  border-color: #1d4ed8;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Separator */
.toolbar-separator {
  width: 1px;
  height: 40px;
  background: #f1f5f9;
  margin: 0 4px;
}

/* AI Assistant Button - matching prototype exactly */
.ai-assistant-btn {
  background: #2563eb;
  color: white;
  border: 1px solid #1d4ed8;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5), 0 4px 6px -4px rgba(59, 130, 246, 0.5);
}

.ai-assistant-btn:hover {
  background: #1d4ed8;
   color: white;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.6), 0 4px 6px -4px rgba(59, 130, 246, 0.6);
  border-color: #1e40af;
}

.ai-assistant-btn.active {
  background: #1e40af;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.7), 0 4px 6px -4px rgba(59, 130, 246, 0.7);
}

/* Locked state for unimplemented features */
.icon-btn.locked {
  position: relative;
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: auto;
}

.icon-btn.locked:hover {
  background: transparent;
  color: #6b7280;
  opacity: 0.6;
  transform: none;
}

.disabled-feature {
  position: relative;
}

.coming-soon-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  font-size: 8px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lock-overlay {
  position: absolute;
  bottom: 2px;
  right: 2px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Panel styles - positioned below toolbar in canvas */
.component-panel {
  position: absolute;
  top: 58px;
  left: 24px;
  z-index: 99;
  display: flex;
  justify-content: flex-start;
  pointer-events: none;
}

.component-panel > * {
  pointer-events: auto;
  animation: slideInDown 0.2s ease-out;
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Image search panel - positioned below toolbar in canvas */
.image-search-panel {
  position: absolute;
  top: 72px;
  left: 24px;
  z-index: 100;
  display: flex;
  justify-content: flex-start;
  pointer-events: none;
}

.image-search-panel .panel-wrapper {
  width: 520px;
  max-width: calc(100vw - 100px);
  height: 75vh;
  max-height: 700px;
  background: #fafafa;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  pointer-events: auto;
  border: 1px solid #e2e8f0;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
  background: #fafafa;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.image-item {
  cursor: pointer;
  transition: transform 0.2s;
}

.image-item:hover {
  transform: translateY(-4px);
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.image-item:hover .image-wrapper img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(99, 102, 241, 0.9);
  opacity: 0;
  transition: opacity 0.25s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: white;
}

.overlay-text {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
}

.image-info {
  margin-top: 6px;
  padding: 0 4px;
}

.photographer-name {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

/* Loading & Error States */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
  color: #6b7280;
}

.loading-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.error-message {
  font-size: 14px;
  color: #ef4444;
  text-align: center;
  margin: 0;
  max-width: 280px;
}

.loading-more,
.no-more-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #9ca3af;
  font-size: 13px;
}

.loading-more span,
.no-more-results span {
  font-weight: 500;
}

.placeholder-message {
  text-align: center;
  color: #9ca3af;
  padding: 60px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder-message p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
}

.placeholder-message p:first-child {
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
}

.placeholder-hint {
  font-size: 13px;
  color: #9ca3af;
  font-style: normal;
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.05);
  border-radius: 6px;
  border: 1px dashed #d1d5db;
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.2s ease;
}

.slide-left-enter-from {
  opacity: 0;
}

.slide-left-leave-to {
  opacity: 0;
}
</style>