<template>
  <!-- Floating toolbar for videos -->
  <div 
    v-if="visible" 
    ref="toolbarRef"
    class="floating-video-toolbar" 
    :style="toolbarStyle"
    @mousedown="handleMouseDown"
  >
    <!-- Replace Video/File -->
    <a-button 
      size="small" 
      @click="handleReplaceUrl"
      :title="t('slide.visual.video.replace')"
    >
      <icon-swap :size="16" />
      {{ t('slide.visual.video.replace') }}
    </a-button>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Video Info -->
    <a-dropdown trigger="click">
      <a-button size="small" :title="t('slide.visual.video.info')">
        <icon-info-circle :size="16" />
        {{ t('slide.visual.video.info') }}
      </a-button>
      <template #content>
        <div class="video-info-dropdown">
          <div class="info-item">
            <span class="info-label">{{ t('slide.visual.video.provider') }}:</span>
            <span class="info-value">{{ providerName }}</span>
          </div>
          <div class="info-item" v-if="selectedVideo?.isLocal">
            <span class="info-label">{{ t('slide.visual.video.fileName') }}:</span>
            <span class="info-value">{{ selectedVideo.fileName }}</span>
          </div>
          <div class="info-item" v-if="selectedVideo?.isAudio">
            <span class="info-label">{{ t('slide.visual.video.type') }}:</span>
            <span class="info-value">{{ t('slide.visual.video.audio') }}</span>
          </div>
          <div class="info-item" v-else>
            <span class="info-label">{{ t('slide.visual.video.type') }}:</span>
            <span class="info-value">{{ t('slide.visual.video.video') }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ t('slide.visual.video.size') }}:</span>
            <span class="info-value">{{ videoSize }}</span>
          </div>
        </div>
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
  IconInfoCircle,
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
  selectedVideo: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'replace-url', 'delete', 'copy', 'duplicate',
  'layer-up', 'layer-down', 'layer-top', 'layer-bottom'
])

// Refs
const toolbarRef = ref(null)

// Drag state
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const toolbarPosition = ref({ x: 0, y: 0 })

// Computed properties
const providerName = computed(() => {
  if (!props.selectedVideo) return 'Unknown'
  
  const provider = props.selectedVideo.provider || 'custom'
  const providerMap = {
    'bilibili': t('slide.visual.media.bilibili'),
    'tencent': t('slide.visual.media.tencentVideo'),
    'iqiyi': t('slide.visual.media.iqiyi'),
    'youku': t('slide.visual.media.youku'),
    'youtube': 'YouTube',
    'vimeo': 'Vimeo',
    'dailymotion': 'Dailymotion',
    'loom': 'Loom',
    'local': t('slide.visual.video.localFile'),
    'custom': t('slide.visual.video.customUrl')
  }
  
  return providerMap[provider] || provider.toUpperCase()
})

const videoSize = computed(() => {
  if (!props.selectedVideo) return '0 x 0'
  const width = props.selectedVideo.width || 480
  const height = props.selectedVideo.height || 270
  return `${Math.round(width)} × ${Math.round(height)}`
})

// Toolbar position - use dragged position if available, otherwise auto-position
const toolbarStyle = computed(() => {
  if (isDragging.value || toolbarPosition.value.x !== 0) {
    return {
      left: `${toolbarPosition.value.x}px`,
      top: `${toolbarPosition.value.y}px`
    }
  }
  // Position above video
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

// Drag handlers
const handleMouseDown = (e) => {
  // Only drag if clicking on the toolbar background (not buttons)
  if (e.target !== toolbarRef.value && !e.target.classList.contains('floating-video-toolbar')) {
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
const handleReplaceUrl = () => {
  emit('replace-url')
}
</script>

<style scoped>
.floating-video-toolbar {
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
.floating-video-toolbar :deep(.arco-btn) {
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

.floating-video-toolbar :deep(.arco-btn:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2329;
}

.floating-video-toolbar :deep(.arco-btn:disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Danger button (Delete) */
.floating-video-toolbar :deep(.arco-btn-status-danger) {
  color: #f53f3f;
}

.floating-video-toolbar :deep(.arco-btn-status-danger:hover) {
  background: rgba(245, 63, 63, 0.1);
}

/* Divider styling */
.floating-video-toolbar :deep(.arco-divider-vertical) {
  height: 20px;
  margin: 0 6px;
  border-color: rgba(0, 0, 0, 0.08);
}

/* Layer dropdown custom style */
.arco-dropdown-list {
  background: white !important;
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

/* Video info dropdown */
.video-info-dropdown {
  background: white;
  border-radius: 8px;
  padding: 12px;
  min-width: 280px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 16px;
}

.info-value {
  color: #1f2329;
  font-weight: 600;
  text-align: right;
  word-break: break-word;
  max-width: 180px;
}
</style>
