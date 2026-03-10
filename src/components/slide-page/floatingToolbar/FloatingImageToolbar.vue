<template>
  <!-- Floating toolbar for images -->
  <div 
    v-if="visible" 
    ref="toolbarRef"
    class="floating-image-toolbar" 
    :style="toolbarStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Replace Image -->
    <a-button 
      size="small" 
      @click="handleReplace"
      :title="t('slide.visual.image.replace')"
    >
      <icon-swap :size="16" />
      {{ t('slide.visual.image.replace') }}
    </a-button>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Crop (Coming Soon) -->
    <a-button 
      size="small" 
      @click="handleCrop"
      :title="t('slide.visual.image.crop')"
      disabled
    >
      <icon-scissor :size="16" />
      {{ t('slide.visual.image.crop') }}
    </a-button>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Filters -->
    <a-dropdown trigger="click">
      <a-button size="small" :title="t('slide.visual.image.filter')">
        <icon-image :size="16" />
        {{ t('slide.visual.image.filter') }}
      </a-button>
      <template #content>
        <a-doption @click="handleFilter('none')">
          <icon-check v-if="currentFilter === 'none'" :size="14" />
          {{ t('slide.visual.image.filterNormal') }}
        </a-doption>
        <a-doption @click="handleFilter('grayscale')">
          <icon-check v-if="currentFilter === 'grayscale'" :size="14" />
          {{ t('slide.visual.image.filterGrayscale') }}
        </a-doption>
        <a-doption @click="handleFilter('sepia')">
          <icon-check v-if="currentFilter === 'sepia'" :size="14" />
          {{ t('slide.visual.image.filterSepia') }}
        </a-doption>
        <a-doption @click="handleFilter('blur')">
          <icon-check v-if="currentFilter === 'blur'" :size="14" />
          {{ t('slide.visual.image.filterBlur') }}
        </a-doption>
        <a-doption @click="handleFilter('brightness')">
          <icon-check v-if="currentFilter === 'brightness'" :size="14" />
          {{ t('slide.visual.image.filterBrightness') }}
        </a-doption>
      </template>
    </a-dropdown>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Layer Controls Dropdown -->
    <a-dropdown trigger="click" position="bl">
      <a-button size="small" :title="t('slide.visual.layer.title')">
        <icon-layers :size="14" />
      </a-button>
      <template #content>
        <div class="layer-dropdown">
          <div class="dropdown-item" @click="$emit('layer-top')">
            <icon-to-top :size="16" />
            <span>{{ t('slide.visual.layer.front') }}</span>
          </div>
          <div class="dropdown-item" @click="$emit('layer-up')">
            <icon-up :size="16" />
            <span>{{ t('slide.visual.layer.forward') }}</span>
          </div>
          <div class="dropdown-item" @click="$emit('layer-down')">
            <icon-down :size="16" />
            <span>{{ t('slide.visual.layer.backward') }}</span>
          </div>
          <div class="dropdown-item" @click="$emit('layer-bottom')">
            <icon-to-bottom :size="16" />
            <span>{{ t('slide.visual.layer.back') }}</span>
          </div>
        </div>
      </template>
    </a-dropdown>

    <a-divider direction="vertical" style="margin: 0 8px;" />
        
        
    <!-- Duplicate Button -->
    <a-button 
      size="small"  
      @click="$emit('duplicate')"
      :title="t('slide.visual.messages.duplicated')"
    >
     <span v-html="icon['duplicate'].body"></span>
    </a-button>
        
    <a-divider direction="vertical" style="margin: 0 8px;" />
        
    <!-- Delete Button -->
    <a-button 
      size="small" 
      status="danger"
      @click="$emit('delete')"
      :title="t('slide.visual.delete')"
    >
      <icon-delete :size="14" />
    </a-button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  IconSwap,
  IconScissor,
  IconImage,
  IconCheck,
  IconLayers,
  IconUp,
  IconDown,
  IconToTop,
  IconToBottom,
  IconDelete
} from '@arco-design/web-vue/es/icon'
import icon from '@/utils/icon'

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  selectedImage: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'replace', 'crop', 'filter', 'delete', 'copy', 'duplicate',
  'layer-up', 'layer-down', 'layer-top', 'layer-bottom'
])

// Refs
const toolbarRef = ref(null)

// Current filter state
const currentFilter = ref('none')

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const toolbarPosition = ref({ x: 0, y: 0 })

// Toolbar position - use dragged position if available, otherwise auto-position
const toolbarStyle = computed(() => {
  if (isDragging.value || toolbarPosition.value.x !== 0) {
    return {
      left: `${toolbarPosition.value.x}px`,
      top: `${toolbarPosition.value.y}px`
    }
  }
  // Position above image
  return {
    left: `${props.position.x}px`,
    top: `${props.position.y}px`
  }
})

// Watch position changes to reset toolbar position
watch(() => props.position, (newPos) => {
  if (!isDragging.value) {
    toolbarPosition.value = { x: 0, y: 0 } // Reset to auto-position
  }
}, { deep: true })

// Watch selected image to update filter state
watch(() => props.selectedImage, (image) => {
  if (image && image.filterType) {
    currentFilter.value = image.filterType
  } else {
    currentFilter.value = 'none'
  }
}, { deep: true })

// Drag handlers
const handleMouseDown = (e) => {
  // Only drag if clicking on the toolbar background (not buttons)
  if (e.target !== toolbarRef.value && !e.target.classList.contains('floating-image-toolbar')) {
    return
  }
  
  isDragging.value = true
  const rect = toolbarRef.value.getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return
  
  toolbarPosition.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

// Cleanup on unmount
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

// Action handlers
const handleReplace = () => {
  emit('replace')
}

const handleCrop = () => {
  emit('crop')
}

const handleFilter = (filterType) => {
  currentFilter.value = filterType
  emit('filter', filterType)
}
</script>

<style scoped>
.floating-image-toolbar {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 2px;
  animation: fadeIn 0.15s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.06);
  cursor: move;
  user-select: none;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button styling */
.floating-image-toolbar :deep(.arco-btn) {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: none;
  background: transparent;
  color: #1f2329;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.15s;
  cursor: pointer;
}

.floating-image-toolbar :deep(.arco-btn:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2329;
}

.floating-image-toolbar :deep(.arco-btn:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Danger button (Delete) */
.floating-image-toolbar :deep(.arco-btn-status-danger) {
  color: #f53f3f;
}

.floating-image-toolbar :deep(.arco-btn-status-danger:hover) {
  background: rgba(245, 63, 63, 0.1);
}

/* Divider styling */
.floating-image-toolbar :deep(.arco-divider-vertical) {
  height: 20px;
  margin: 0 6px;
  border-color: rgba(0, 0, 0, 0.08);
}

/* Layer dropdown custom style */
.arco-dropdown-list{
    background:  white !important;
}
.layer-dropdown {
  background: white;
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  color: #1f2937;
  font-size: 14px;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, hsl(235, 87%, 53%) 0%, #3454f5 100%);
  color: white;
}

.dropdown-item svg {
  flex-shrink: 0;
}

.dropdown-item span {
  flex: 1;
}
</style>
