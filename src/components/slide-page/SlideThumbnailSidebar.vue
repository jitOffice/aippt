<template>
  <div class="slide-thumbnail-sidebar" @mouseenter="handleMouseEnter">
    <!-- Tab Switcher Header -->
    <div class="sidebar-tabs">
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'slides' }"
        @click="switchTab('slides')"
      >
        {{ t('slide.tabs.slides') }}
      </button>
      <button 
        class="tab-button" 
        :class="{ active: activeTab === 'ai' }"
        @click="switchTab('ai')"
      >
        {{ t('slide.tabs.aiCreation') }}
      </button>
    </div>

    <!-- Slides Tab Content -->
    <div v-if="activeTab === 'slides'" class="slides-tab-content">
    <!-- Header with View Toggle -->
    <div class="sidebar-header">
      <!-- View Mode Toggle -->
      <div class="view-mode-toggle">
        <button 
          class="view-mode-btn"
          :class="{ active: viewMode === 'filmstrip' }"
          @click="$emit('update:viewMode', 'filmstrip')"
          :title="t('slide.viewMode.filmstrip')"
        >
          <IIcon name="filmstrip" :size="18" />
          
        </button>
        <button 
          class="view-mode-btn"
          :class="{ active: viewMode === 'list' }"
          @click="$emit('update:viewMode', 'list')"
          :title="t('slide.viewMode.list')"
        >
          <IIcon name="filmlist" :size="18" />
        </button>
      </div>
      
      <button style="background-color: transparent" class="add-slide-icon-btn" @click="$emit('add-slide')" :title="t('slide.newSlide')">
    
        <IIcon  name="addslide" :size="18" />
      </button>
    </div>

    <!-- Thumbnails Container -->
    <div class="slides-thumbnails" :class="viewMode" ref="thumbnailsContainer">
      <!-- Filmstrip Mode: Thumbnail Previews -->
      <template v-if="viewMode === 'filmstrip'">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="thumbnail-card"
          :class="{ active: currentIndex === index }"
          @click="$emit('select-slide', index)"
          @contextmenu="handleContextMenu($event, index)"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
        >
          <div class="thumbnail-number">{{ index + 1 }}</div>
          <div class="thumbnail-preview" :style="themeStyle">
            <!-- Show visual preview from slot -->
            <slot name="slide-preview" :slide="slide" :index="index">
              <!-- Fallback to markdown rendering if no slot provided -->
              <div v-if="slide.type === 'markdown'" class="thumb-content" v-html="renderMarkdown(slide.content)"></div>
              <div v-else-if="slide.type === 'chart'" class="thumb-chart">
                <icon-bar-chart :size="32" />
                <span>Chart</span>
              </div>
            </slot>
          </div>
          <div class="thumbnail-footer">
            <span class="thumbnail-title">{{ getSlideTitle(slide, index + 1) }}</span>
            <div class="thumbnail-actions">
              <button class="action-btn" @click.stop="copySlide(index)" :title="t('slide.contextMenu.copy')">
              
                <IIcon name="copy-slide" :size="14" />
              </button>
              <button class="action-btn" @click.stop="deleteSlide(index)" :title="t('slide.contextMenu.delete')">
             
                <IIcon name="delete-slide" :size="14" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Add New Slide Button -->
        <button 
          class="add-slide-card"
          @click="$emit('add-slide')"
          :title="t('slide.newSlide')"
          :disabled="isAddingSlide"
          :class="{ 'is-loading': isAddingSlide }"
        >
          <icon-loading v-if="isAddingSlide" :size="32" class="loading-icon" />
          <IIcon v-else name="add" :size="32" />
          <span class="add-slide-text">
            {{ isAddingSlide ? t('common.loading') : t('slide.addNewSlide') }}
          </span>
        </button>
      </template>
      
      <!-- List Mode: Title List -->
      <template v-else-if="viewMode === 'list'">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="list-item"
          :class="{ active: currentIndex === index }"
          @click="$emit('select-slide', index)"
          @contextmenu="handleContextMenu($event, index)"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
        >
          <div class="list-number">{{ index + 1 }}</div>
          <div class="list-title">{{ getSlideTitle(slide, index + 1) }}</div>
        </div>
      </template>
    </div>
    
    <!-- Context Menu -->
    <div 
      v-if="contextMenu.visible" 
      class="context-menu" 
      :style="{
        left: contextMenu.x + 'px',
        top: contextMenu.y + 'px'
      }"
      @click.stop
    >
      <div class="context-menu-item" @click="copySlide(contextMenu.index)">
        <icon-copy :size="16" />
        <span>{{ t('slide.contextMenu.copy') }}</span>
      </div>
      <div class="context-menu-item" @click="deleteSlide(contextMenu.index)">
        <icon-delete :size="16" />
        <span>{{ t('slide.contextMenu.delete') }}</span>
      </div>
    </div>
    </div>

    <!-- AI Creation Tab Content -->
    <div v-else-if="activeTab === 'ai'" class="ai-tab-content">
      <slot name="ai-creation-content">
        <!-- Default AI creation content placeholder -->
        <div class="ai-placeholder">
          <p>{{ t('slide.aiCreation.placeholder') }}</p>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { IconList, IconPlus, IconBarChart, IconCopy, IconDelete, IconLoading } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import IIcon from '@/utils/slide/icon.js'


const { t } = useI18n()

// Props
const props = defineProps({
  slides: {
    type: Array,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  viewMode: {
    type: String,
    default: 'filmstrip',
    validator: (value) => ['filmstrip', 'list'].includes(value)
  },
  themeStyle: {
    type: Object,
    default: () => ({})
  },
  isAddingSlide: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits([
  'update:viewMode', 
  'select-slide', 
  'add-slide', 
  'reorder-slides',
  'copy-slide',
  'delete-slide',
  'mouseenter', // Add mouseenter event
  'tab-change' // Add tab change event
])

// Tab state
const activeTab = ref('slides') // 'slides' or 'ai'

// Tab switcher
const switchTab = (tab) => {
  activeTab.value = tab
  emit('tab-change', tab)
}

// Drag & Drop state
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

// Context menu state
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  index: -1
})

// Drag handlers
const handleDragStart = (event, index) => {
  draggedIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index.toString())
  // Add visual feedback
  event.target.style.opacity = '0.5'
}

const handleDragOver = (event, index) => {
  event.preventDefault()
  dragOverIndex.value = index
}

const handleDrop = (event, targetIndex) => {
  event.preventDefault()
  
  const sourceIndex = draggedIndex.value
  if (sourceIndex !== null && sourceIndex !== targetIndex) {
    // Emit reorder event to parent
    emit('reorder-slides', { from: sourceIndex, to: targetIndex })
  }
  
  dragOverIndex.value = null
}

const handleDragEnd = (event) => {
  event.target.style.opacity = ''
  draggedIndex.value = null
  dragOverIndex.value = null
}

// Helper: Render markdown
const renderMarkdown = (content) => {
  try {
    return marked.parse(content)
  } catch {
    return content
  }
}

// Helper: Get slide title for list view
const getSlideTitle = (slide, slideNumber) => {
  if (slide.type === 'chart') {
    return 'Chart Slide'
  }
  
  if (slide.type === 'markdown' && slide.content) {
    // Try to extract first heading
    const headingMatch = slide.content.match(/^#+ (.+)$/m)
    if (headingMatch) {
      return headingMatch[1].trim()
    }
    
    // If no heading, get first line of text
    const firstLine = slide.content.split('\n')[0].trim()
    if (firstLine && firstLine.length > 0) {
      return firstLine.substring(0, 50) + (firstLine.length > 50 ? '...' : '')
    }
  }
  
  return `Slide ${slideNumber}`
}

// Context menu handlers
const handleContextMenu = (event, index) => {
  event.preventDefault()
  event.stopPropagation()
  
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    index: index
  }
}

// Handle mouse enter to hide floating toolbars
const handleMouseEnter = () => {
  emit('mouseenter')
}

const copySlide = (index) => {
  contextMenu.value.visible = false
  emit('copy-slide', index)
}

const deleteSlide = (index) => {
  contextMenu.value.visible = false
  emit('delete-slide', index)
}

// Close context menu when clicking elsewhere
const handleClickOutside = () => {
  if (contextMenu.value.visible) {
    contextMenu.value.visible = false
  }
}

// Auto-scroll to active slide
const thumbnailsContainer = ref(null)

const scrollToActive = async () => {
  await nextTick()
  if (!thumbnailsContainer.value) return
  
  const activeEl = thumbnailsContainer.value.querySelector('.active')
  if (activeEl) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }
}

watch(() => props.currentIndex, scrollToActive)
watch(() => props.slides.length, scrollToActive)

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.slide-thumbnail-sidebar {
  width: 320px;
  height: 100%;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

/* Tab Switcher */
.sidebar-tabs {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  padding: 0;
}

.tab-button {
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #334155;
}

.tab-button.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

/* Tab Content Wrappers */
.slides-tab-content,
.ai-tab-content {
  flex: 1;
  min-height: 0; /* Critical: prevents content from expanding container */
  display: flex;
  flex-direction: column;
  /* No overflow here - let child (.slides-thumbnails) handle scrolling */
}

/* AI Tab Placeholder */
.ai-placeholder {
  padding: 24px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* Header */
.sidebar-header {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  gap: 8px;
}

/* View Mode Toggle */
.view-mode-toggle {
  display: flex;
  gap: 4px;
}

.view-mode-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}

.view-mode-btn :deep(svg) {
  transition: all 0.2s;
}

.view-mode-btn:hover {
  background: #e2e8f0;
}

.view-mode-btn.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.view-mode-btn.active :deep(svg) {
  transform: scale(1.05);
}

/* Add Slide Icon Button */
.add-slide-icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.add-slide-icon-btn:hover {
  background: #1d4ed8;
  transform: scale(1.05);
}

/* Thumbnails Container */
.slides-thumbnails {
  max-height: calc(100vh - 160px); /* Critical: allows flex to constrain height for overflow */
  overflow-y: auto;
  padding: 16px 12px;
  
  overflow: auto;


}

/* Filmstrip Mode: Thumbnail Cards */
.thumbnail-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: grab;
  transition: all 0.2s;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
}

.thumbnail-card:active {
  cursor: grabbing;
}

.thumbnail-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.thumbnail-card.active {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.thumbnail-number {
  position: absolute;
  top: 8px;
  left: 8px;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #475569;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
  z-index: 1;
}

.thumbnail-card.active .thumbnail-number {
  background: #2563eb;
}

.thumbnail-preview {
  width: 100%;
  height: 160px;
  position: relative;
  background: #f1f5f9;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Remove the pseudo-element - not needed with fixed height */

.thumb-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding: 12px;
  font-size: 9px;
  line-height: 1.4;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.thumb-content :deep(h1),
.thumb-content :deep(h2) {
  font-size: 11px;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.thumb-content :deep(p) {
  margin: 0;
  font-size: 8px;
  line-height: 1.3;
}

.thumb-chart {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: #64748b;
}

.thumb-chart span {
  font-size: 10px;
}

/* Thumbnail Footer */
.thumbnail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: white;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.thumbnail-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.thumbnail-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f1f5f9;
  color: #2563eb;
}

.action-btn:last-child:hover {
  color: #ef4444;
}

/* Add New Slide Card */
.add-slide-card {
  width: 100%;
  padding: 24px;
  background: transparent;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  margin-bottom: 12px;
}

.add-slide-card:hover:not(:disabled) {
  border-color: #60a5fa;
  background: #eff6ff;
  color: #2563eb;
}

.add-slide-card:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.add-slide-card.is-loading {
  pointer-events: none;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.add-slide-text {
  font-size: 13px;
  font-weight: 700;
}

/* List Mode: Title List */
.slides-thumbnails.list {
  padding: 16px 12px;
  gap: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.15s;
  background: white;
  border: 1px solid #e2e8f0;
}

.list-item:active {
  cursor: grabbing;
}

.list-item:hover {
  border-color: #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.list-item.active {
  background: #eff6ff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.list-number {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e293b;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.list-item.active .list-number {
  background: #2563eb;
}

.list-title {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-item.active .list-title {
  color: #1e40af;
  font-weight: 700;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  padding: 4px 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  transition: all 0.15s;
}

.context-menu-item:hover {
  background: #f8fafc;
}

.context-menu-item :deep(svg) {
  flex-shrink: 0;
  color: #64748b;
}

/* Scrollbar Styling */
.slides-thumbnails::-webkit-scrollbar {
  width: 6px;
}

.slides-thumbnails::-webkit-scrollbar-track {
  background: transparent;
}

.slides-thumbnails::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.slides-thumbnails::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
