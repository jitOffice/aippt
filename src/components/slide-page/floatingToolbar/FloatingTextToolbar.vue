<template>
  <!-- Floating toolbar appears above selected text -->
  <div 
    v-if="visible" 
    ref="toolbarRef"
    class="floating-text-toolbar" 
    :style="toolbarStyle"
    @mousedown="handleMouseDown"
  >
    <a-button-group size="small">
      <!-- Bold -->
      <a-button 
        :type="isBold ? 'primary' : 'default'" 
        @click="toggleBold"
        title="Bold (Ctrl+B)"
      >
        <strong>B</strong>
      </a-button>

      <!-- Italic -->
      <a-button 
        :type="isItalic ? 'primary' : 'default'" 
        @click="toggleItalic"
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </a-button>

      <!-- Underline -->
      <a-button 
        :type="isUnderline ? 'primary' : 'default'" 
        @click="toggleUnderline"
        title="Underline (Ctrl+U)"
      >
        <u>U</u>
      </a-button>
    </a-button-group>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Font Size -->
    <a-select 
      v-model="fontSize" 
      @change="handleFontSizeChange"
      size="small"
      style="width: 80px;"
    >
      <a-option :value="12">12</a-option>
      <a-option :value="14">14</a-option>
      <a-option :value="16">16</a-option>
      <a-option :value="18">18</a-option>
      <a-option :value="24">24</a-option>
      <a-option :value="32">32</a-option>
      <a-option :value="48">48</a-option>
      <a-option :value="64">64</a-option>
    </a-select>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Text Color -->
    <a-popover 
      trigger="click" 
      position="bottom"
      :content-style="{ padding: 0, background: 'transparent', boxShadow: 'none' }"
    >
      <a-button size="small" title="Text Color" style="position: relative;">
        <icon-font-colors :size="16" />
        <div class="color-indicator" :style="{ background: textColor }"></div>
      </a-button>
      <template #content>
        <div class="color-picker-panel">
          <div class="color-grid">
            <div 
              v-for="color in colorPresets" 
              :key="color"
              class="color-option"
              :style="{ background: color }"
              @click="handleColorChange(color)"
            >
              <icon-check v-if="textColor === color" :size="12" style="color: white;" />
            </div>
          </div>
          
          <!-- Custom Color Input -->
          <div class="custom-color-section">
            <div class="divider-line"></div>
            <div class="custom-color-input">
              <input 
                type="color" 
                v-model="customColor"
                @change="handleCustomColorChange"
                class="color-input-native"
                title="Custom Color"
              />
              <span class="custom-color-label">Custom</span>
            </div>
          </div>
        </div>
      </template>
    </a-popover>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Text Align -->
    <a-button-group size="small">
      <a-button 
        :type="textAlign === 'left' ? 'primary' : 'default'"
        @click="handleAlignChange('left')"
        title="Align Left"
      >
        <span v-html="icon['alignleft'].body" ></span>
      </a-button>
      <a-button 
        :type="textAlign === 'center' ? 'primary' : 'default'"
        @click="handleAlignChange('center')"
        title="Align Center"
      >
        <span v-html="icon['alignright'].body"></span>
      </a-button>
      <a-button 
        :type="textAlign === 'right' ? 'primary' : 'default'"
        @click="handleAlignChange('right')"
        title="Align Right"
      >
        <span v-html="icon['aligncenter'].body"></span>
      </a-button>
    </a-button-group>

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
        
    <!-- Edit Link Button (only for links) -->
    <a-button 
      v-if="isLink"
      size="small" 
      @click="$emit('edit-link')"
      title="Edit Link URL"
    >
      <icon-link :size="14" />
      Edit Link
    </a-button>
        
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

import { 
  IconFontColors,
  IconCheck,
  IconLayers,
  IconUp,
  IconDown,
  IconToTop,
  IconToBottom,
  IconLink,
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
  selectedText: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update-style', 'delete', 'copy', 'duplicate', 'layer-up', 'layer-down', 'layer-top', 'layer-bottom', 'edit-link'])

// Refs
const toolbarRef = ref(null)

// Text style states
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
const fontSize = ref(24)
const textColor = ref('#000000')
const textAlign = ref('left')
const customColor = ref('#000000')

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const toolbarPosition = ref({ x: 0, y: 0 })

// Color presets
const colorPresets = [
  '#000000', '#ffffff', '#e53e3e', '#dd6b20', '#d69e2e', '#38a169',
  '#319795', '#3182ce', '#5a67d8', '#805ad5', '#d53f8c', '#718096'
]

// Check if selected text is a link
const isLink = computed(() => {
  return props.selectedText && props.selectedText.id && props.selectedText.id.startsWith('link-')
})

// Toolbar position - use dragged position if available, otherwise auto-position
const toolbarStyle = computed(() => {
  if (isDragging.value || toolbarPosition.value.x !== 0) {
    return {
      left: `${toolbarPosition.value.x}px`,
      top: `${toolbarPosition.value.y}px`
    }
  }
  // Position closer to text - only 10px above instead of 60px
  return {
    left: `${props.position.x}px`,
    top: `${props.position.y - 10}px`
  }
})

// Watch position changes to reset toolbar position
watch(() => props.position, (newPos) => {
  if (!isDragging.value) {
    toolbarPosition.value = { x: 0, y: 0 } // Reset to auto-position
  }
}, { deep: true })

// Watch selected text to update states
watch(() => props.selectedText, (text) => {
  if (text) {
    // Konva uses fontStyle for both bold and italic
    const fontStyle = text.fontStyle || 'normal'
    isBold.value = fontStyle.includes('bold')
    isItalic.value = fontStyle.includes('italic')
    isUnderline.value = text.textDecoration === 'underline'
    fontSize.value = text.fontSize || 24
    textColor.value = text.fill || '#000000'
    textAlign.value = text.align || 'left'
  }
}, { deep: true })

// Drag handlers
const handleMouseDown = (e) => {
  // Only drag if clicking on the toolbar background (not buttons)
  if (e.target !== toolbarRef.value && !e.target.classList.contains('floating-text-toolbar')) {
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

// Style toggle functions
const toggleBold = () => {
  isBold.value = !isBold.value
  // Konva uses fontStyle property for bold/italic, not fontWeight
  // We need to combine bold and italic states
  const newFontStyle = isBold.value 
    ? (isItalic.value ? 'bold italic' : 'bold')
    : (isItalic.value ? 'italic' : 'normal')
  emitUpdate({ fontStyle: newFontStyle })
}

const toggleItalic = () => {
  isItalic.value = !isItalic.value
  // Konva uses fontStyle property for bold/italic
  const newFontStyle = isBold.value
    ? (isItalic.value ? 'bold italic' : 'bold')
    : (isItalic.value ? 'italic' : 'normal')
  emitUpdate({ fontStyle: newFontStyle })
}

const toggleUnderline = () => {
  isUnderline.value = !isUnderline.value
  emitUpdate({ textDecoration: isUnderline.value ? 'underline' : 'none' })
}

const handleFontSizeChange = (value) => {
  emitUpdate({ fontSize: value })
}

const handleColorChange = (color) => {
  textColor.value = color
  customColor.value = color
  emitUpdate({ fill: color })
}

const handleCustomColorChange = () => {
  textColor.value = customColor.value
  emitUpdate({ fill: customColor.value })
}

const handleAlignChange = (align) => {
  textAlign.value = align
  emitUpdate({ align })
}

const emitUpdate = (styles) => {
  emit('update-style', styles)
}
</script>

<style scoped>
.floating-text-toolbar {
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

/* Button group styling */
.floating-text-toolbar :deep(.arco-btn-group) {
  background: transparent;
  border-radius: 4px;
  overflow: hidden;
}

/* Button styling - more compact and refined */
.floating-text-toolbar :deep(.arco-btn) {
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

.floating-text-toolbar :deep(.arco-btn:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2329;
}

.floating-text-toolbar :deep(.arco-btn-primary) {
  background: rgba(0, 102, 255, 0.1) !important;
  color: #0066ff !important;
}

.floating-text-toolbar :deep(.arco-btn-primary:hover) {
  background: rgba(0, 102, 255, 0.15) !important;
}

/* Danger button (Delete) */
.floating-text-toolbar :deep(.arco-btn-status-danger) {
  color: #f53f3f;
}

.floating-text-toolbar :deep(.arco-btn-status-danger:hover) {
  background: rgba(245, 63, 63, 0.1);
}

/* Divider styling */
.floating-text-toolbar :deep(.arco-divider-vertical) {
  height: 20px;
  margin: 0 6px;
  border-color: rgba(0, 0, 0, 0.08);
}

/* Select dropdown styling */
.floating-text-toolbar :deep(.arco-select) {
  border: none;
  background: transparent;
  cursor: pointer;
}

.floating-text-toolbar :deep(.arco-select:hover) {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.floating-text-toolbar :deep(.arco-select-view) {
  border: none;
  background: transparent;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  cursor: pointer;
}

/* Color indicator - underline style like Feishu */
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
.floating-text-toolbar :deep(.arco-popover-popup-content) {
  padding: 0 !important;
  background: transparent !important;
}

.floating-text-toolbar :deep(.arco-popover-content) {
  padding: 0 !important;
  background: transparent !important;
}

/* Override Arco Design dropdown scroll (for other dropdowns like font size) */
.floating-text-toolbar :deep(.arco-dropdown-list) {
  max-height: none !important;
  overflow: visible !important;
}

.floating-text-toolbar :deep(.arco-dropdown-list-wrapper) {
  max-height: none !important;
  overflow: visible !important;
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
