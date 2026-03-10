<template>
  <!-- Floating toolbar for shapes (rectangles, circles) -->
  <div 
    v-if="visible" 
    ref="toolbarRef"
    class="floating-shape-toolbar" 
    :style="toolbarStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Fill Color -->
    <a-popover 
      trigger="click" 
      position="bottom"
      :content-style="{ padding: 0, background: 'transparent', boxShadow: 'none' }"
    >
      <a-button size="small" title="Fill Color" style="position: relative;">
        <icon-bg-colors :size="16" />
        <div class="color-indicator" :style="{ background: fillColor }"></div>
      </a-button>
      <template #content>
        <div class="color-picker-panel">
          <div class="color-grid">
            <div 
              v-for="color in colorPresets" 
              :key="color"
              class="color-option"
              :style="{ background: color }"
              @click="handleFillColorChange(color)"
            >
              <icon-check v-if="fillColor === color" :size="12" style="color: white;" />
            </div>
          </div>
          
          <!-- Custom Color Input -->
          <div class="custom-color-section">
            <div class="divider-line"></div>
            <div class="custom-color-input">
              <input 
                type="color" 
                v-model="customFillColor"
                @change="handleCustomFillColorChange"
                class="color-input-native"
                title="Custom Fill Color"
              />
              <span class="custom-color-label">Custom</span>
            </div>
          </div>
        </div>
      </template>
    </a-popover>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Stroke Color -->
    <a-popover 
      trigger="click" 
      position="bottom"
      :content-style="{ padding: 0, background: 'transparent', boxShadow: 'none' }"
    >
      <a-button size="small" title="Stroke Color" style="position: relative;">
        <icon-palette :size="16" />
        <div class="color-indicator" :style="{ background: strokeColor }"></div>
      </a-button>
      <template #content>
        <div class="color-picker-panel">
          <div class="color-grid">
            <div 
              v-for="color in colorPresets" 
              :key="color"
              class="color-option"
              :style="{ background: color }"
              @click="handleStrokeColorChange(color)"
            >
              <icon-check v-if="strokeColor === color" :size="12" style="color: white;" />
            </div>
          </div>
          
          <!-- Custom Color Input -->
          <div class="custom-color-section">
            <div class="divider-line"></div>
            <div class="custom-color-input">
              <input 
                type="color" 
                v-model="customStrokeColor"
                @change="handleCustomStrokeColorChange"
                class="color-input-native"
                title="Custom Stroke Color"
              />
              <span class="custom-color-label">Custom</span>
            </div>
          </div>
        </div>
      </template>
    </a-popover>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Stroke Width -->
    <a-select 
      v-model="strokeWidth" 
      @change="handleStrokeWidthChange"
      size="small"
      style="width: 80px;"
      placeholder="Width"
    >
      <a-option :value="1">1 px</a-option>
      <a-option :value="2">2 px</a-option>
      <a-option :value="3">3 px</a-option>
      <a-option :value="4">4 px</a-option>
      <a-option :value="5">5 px</a-option>
      <a-option :value="8">8 px</a-option>
      <a-option :value="10">10 px</a-option>
    </a-select>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Layer Controls Dropdown -->
    <a-dropdown trigger="click" position="bl">
        <a-button size="small">
          <template #icon>
            <icon-layers />
          </template>
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
      title="Delete (Del)"
    >
      <icon-delete :size="14" />
    </a-button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  IconBgColors,
  IconPalette,
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
  selectedShape: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update-style', 'delete', 'copy', 'duplicate', 'layer-up', 'layer-down', 'layer-top', 'layer-bottom'])

// Refs
const toolbarRef = ref(null)

// Shape style states
const fillColor = ref('#3182ce')
const strokeColor = ref('#000000')
const strokeWidth = ref(2)
const customFillColor = ref('#3182ce')
const customStrokeColor = ref('#000000')

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const toolbarPosition = ref({ x: 0, y: 0 })

// Color presets
const colorPresets = [
  '#000000', '#ffffff', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169',
  '#319795', '#3182ce', '#5a67d8', '#805ad5', '#d53f8c', '#718096'
]

// Toolbar position - use dragged position if available, otherwise auto-position
const toolbarStyle = computed(() => {
  if (isDragging.value || toolbarPosition.value.x !== 0) {
    return {
      left: `${toolbarPosition.value.x}px`,
      top: `${toolbarPosition.value.y}px`
    }
  }
  // Position closer to shape - align with top
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

// Watch selected shape to update states
watch(() => props.selectedShape, (shape) => {
  if (shape) {
    fillColor.value = shape.fill || '#3182ce'
    strokeColor.value = shape.stroke || '#000000'
    strokeWidth.value = shape.strokeWidth || 2
    customFillColor.value = shape.fill || '#3182ce'
    customStrokeColor.value = shape.stroke || '#000000'
  }
}, { deep: true })

// Drag handlers
const handleMouseDown = (e) => {
  // Only drag if clicking on the toolbar background (not buttons)
  if (e.target !== toolbarRef.value && !e.target.classList.contains('floating-shape-toolbar')) {
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

// Style update functions
const handleFillColorChange = (color) => {
  fillColor.value = color
  customFillColor.value = color
  emitUpdate({ fill: color })
}

const handleCustomFillColorChange = () => {
  fillColor.value = customFillColor.value
  emitUpdate({ fill: customFillColor.value })
}

const handleStrokeColorChange = (color) => {
  strokeColor.value = color
  customStrokeColor.value = color
  emitUpdate({ stroke: color })
}

const handleCustomStrokeColorChange = () => {
  strokeColor.value = customStrokeColor.value
  emitUpdate({ stroke: customStrokeColor.value })
}

const handleStrokeWidthChange = (value) => {
  emitUpdate({ strokeWidth: value })
}

const emitUpdate = (styles) => {
  emit('update-style', styles)
}
</script>

<style scoped>
.floating-shape-toolbar {
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
.floating-shape-toolbar :deep(.arco-btn) {
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

.floating-shape-toolbar :deep(.arco-btn:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2329;
}

/* Danger button (Delete) */
.floating-shape-toolbar :deep(.arco-btn-status-danger) {
  color: #f53f3f;
}

.floating-shape-toolbar :deep(.arco-btn-status-danger:hover) {
  background: rgba(245, 63, 63, 0.1);
}

/* Divider styling */
.floating-shape-toolbar :deep(.arco-divider-vertical) {
  height: 20px;
  margin: 0 6px;
  border-color: rgba(0, 0, 0, 0.08);
}

/* Select dropdown styling */
.floating-shape-toolbar :deep(.arco-select) {
  border: none;
  background: transparent;
  cursor: pointer;
}

.floating-shape-toolbar :deep(.arco-select:hover) {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.floating-shape-toolbar :deep(.arco-select-view) {
  border: none;
  background: transparent;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  cursor: pointer;
}

/* Color indicator - underline style */
.color-indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  border-radius: 1.5px;
}

/* Color picker panel */
.color-picker-panel {
  padding: 10px;
  background: white;
  border-radius: 6px;
  max-height: none;
  overflow: visible;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

/* Override Arco Popover default styles */
.floating-shape-toolbar :deep(.arco-popover-popup-content) {
  padding: 0 !important;
  background: transparent !important;
}

.floating-shape-toolbar :deep(.arco-popover-content) {
  padding: 0 !important;
  background: transparent !important;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  width: fit-content;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  position: relative;
}

.color-option:hover {
  border-color: rgba(0, 102, 255, 0.4);
  transform: scale(1.05);
}

.color-option::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Custom Color Section */
.custom-color-section {
  margin-top: 4px;
}

/* Custom divider line */
.divider-line {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 8px 0;
}

.custom-color-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.color-input-native {
  width: 32px;
  height: 24px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.color-input-native:hover {
  border-color: rgba(0, 102, 255, 0.4);
}

.color-input-native::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.color-input-native::-webkit-color-swatch {
  border: none;
  border-radius: 3px;
}

.custom-color-label {
  font-size: 13px;
  color: #4e5969;
  user-select: none;
}

/* Layer dropdown custom style */
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
