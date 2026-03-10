<template>
  <div class="bottom-thumbnail-strip" v-if="slides.length > 0"  @mouseenter="handleMouseEnter">
    <div class="thumbnail-container">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="bottom-thumbnail"
        :class="{ 'active': currentIndex === index }"
        @click="$emit('select-slide', index)"
        @contextmenu="handleContextMenu($event, index)"
      >
        <div class="thumbnail-preview">
          <div v-if="getSlideVisualData(index)" class="thumb-visual-preview">
            <VisualEditorProto
              :slide-data="getSlideVisualData(index)"
              :theme-style="themeStyle"
              :readonly="true"
            />
          </div>
          <div v-else class="thumbnail-placeholder">
            P{{ String(index + 1).padStart(2, '0') }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add slide button - fixed position -->
    <div class="bottom-thumbnail add-thumb" @click="$emit('add-slide')">
      <IconPlusCircle :size="24" />
    </div>
  </div>
  
  <!-- Context Menu for Bottom Thumbnails -->
  <div 
    v-if="contextMenu.visible" 
    class="thumbnail-context-menu" 
    :style="{
      left: contextMenu.x + 'px',
      top: contextMenu.y + 'px'
    }"
    @click.stop
  >
    <div class="context-menu-item" @click="handleCopySlide">
      <IconCopy :size="16" />
      <span>{{ t('slide.contextMenu.copy') }}</span>
    </div>
    <div class="context-menu-item" @click="handleDeleteSlide">
      <IconDelete :size="16" />
      <span>{{ t('slide.contextMenu.delete') }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { IconPlusCircle, IconCopy, IconDelete } from '@arco-design/web-vue/es/icon'
import { useI18n } from 'vue-i18n'
import VisualEditorProto from './VisualEditorProto.vue'

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
  themeStyle: {
    type: Object,
    default: () => ({})
  },
  getSlideVisualData: {
    type: Function,
    required: true
  }
})

// Emits
const emit = defineEmits([
  'select-slide',
  'add-slide',
  'copy-slide',
  'delete-slide',
   'mouseenter' // Add mouseenter event
])

// Context menu state
const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  index: -1
})

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


const handleCopySlide = () => {
  const index = contextMenu.value.index
  contextMenu.value.visible = false
  if (index >= 0) {
    emit('copy-slide', index)
  }
}

const handleDeleteSlide = () => {
  const index = contextMenu.value.index
  contextMenu.value.visible = false
  if (index >= 0) {
    emit('delete-slide', index)
  }
}

// Close context menu when clicking elsewhere
const handleClickOutside = () => {
  if (contextMenu.value.visible) {
    contextMenu.value.visible = false
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Bottom Thumbnail Strip (Prototype-inspired design) */
.bottom-thumbnail-strip {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 16px 32px;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  margin-right: 185px;
  margin-left: 166px;
}

.bottom-thumbnail-strip::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 180px;
  width: 60px;
  pointer-events: none;
  z-index: 1;
}

/* Scrollable inner container - Prototype style */
.thumbnail-container {
  display: flex;
  gap: 16px;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  padding-right: 16px;
  scroll-behavior: smooth;
  
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.thumbnail-container::-webkit-scrollbar {
  display: none;
}

.bottom-thumbnail {
  width: 140px;
  height: 100px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 8px;
  border: 3px solid transparent;
  background: white;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  position: relative;
}

.bottom-thumbnail:hover {
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.bottom-thumbnail.active {
  border-color: #5b8ef4;
  box-shadow: 0 4px 16px rgba(91, 142, 244, 0.35);
  background: white;
  transform: translateY(-2px);
}

.bottom-thumbnail.add-thumb {
  background: white;
  border: 3px dashed #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  box-shadow: none;
  right: 12px;
  z-index: 2;
  flex-direction: row;
}

.bottom-thumbnail.add-thumb:hover {
  border-color: #5b8ef4;
  color: #5b8ef4;
  background: #f0f5ff;
  box-shadow: 0 2px 8px rgba(91, 142, 244, 0.15);
  transform: translateY(-2px);
}

.bottom-thumbnail .thumbnail-preview {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: white;
  position: relative;
}

.bottom-thumbnail .thumbnail-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-weight: 600;
  color: #cbd5e1;
  background: linear-gradient(135deg, #fafbfc 0%, #f1f5f9 100%);
}

/* Thumbnail preview styling */
.thumb-visual-preview {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.thumb-visual-preview :deep(.visual-editor-proto) {
  transform: scale(0.145); /* Scale to fit: 140px container / 960px slide = 0.145 */
  transform-origin: center center;
  pointer-events: none;
  width: 960px;
  height: 540px;
}

.thumb-visual-preview :deep(.canvas-wrapper) {
  width: 100%;
  height: 100%;
}

/* Context Menu for Bottom Thumbnails */
.thumbnail-context-menu {
  position: fixed;
  background: white;
  border: 1px solid #dadce0;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
  padding: 4px 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #202124;
  transition: all 0.15s;
}

.context-menu-item:hover {
  background: #f3f4f6;
}

.context-menu-item :deep(svg) {
  flex-shrink: 0;
  color: #5f6368;
}
</style>
