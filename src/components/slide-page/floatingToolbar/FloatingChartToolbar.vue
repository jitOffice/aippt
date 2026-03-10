<template>
  <div 
    v-if="visible" 
    class="floating-chart-toolbar"
    :style="toolbarStyle"
  >
    <!-- Edit Data Button -->
    <a-button 
      size="small" 
      type="primary"
      @click="handleEditData"
    >
      <template #icon>
        <icon-edit />
      </template>
      {{ t('slide.visual.chart.editData') }}
    </a-button>

    <!-- Chart Type Dropdown -->
    <a-dropdown trigger="click" position="bl">
      <a-button size="small" :title="t('slide.visual.chart.changeType')">
        <icon-bar-chart :size="14" />
      </a-button>
      <template #content>
        <div class="chart-type-dropdown">
          <div class="dropdown-item" @click.stop="handleChangeType('bar')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="14" width="3" height="6" fill="currentColor" rx="1" />
              <rect x="10" y="8" width="3" height="12" fill="currentColor" rx="1" />
              <rect x="16" y="11" width="3" height="9" fill="currentColor" rx="1" />
            </svg>
            <span>{{ t('slide.visual.chart.types.bar') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('line')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4,18 8,12 12,14 16,8 20,10" />
              <circle cx="4" cy="18" r="1.5" fill="currentColor" />
              <circle cx="8" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="14" r="1.5" fill="currentColor" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" />
              <circle cx="20" cy="10" r="1.5" fill="currentColor" />
            </svg>
            <span>{{ t('slide.visual.chart.types.line') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('pie')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="8" fill="none" />
              <path d="M12 12 L12 4 A8 8 0 0 1 18.3 7.5 Z" fill="currentColor" opacity="0.6" />
              <path d="M12 12 L18.3 7.5 A8 8 0 0 1 19.9 13 Z" fill="currentColor" opacity="0.3" />
            </svg>
            <span>{{ t('slide.visual.chart.types.pie') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('area')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 18 L8 12 L12 14 L16 8 L20 10 L20 20 L4 20 Z" fill="currentColor" opacity="0.3" />
              <polyline points="4,18 8,12 12,14 16,8 20,10" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>
            <span>{{ t('slide.visual.chart.types.area') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('scatter')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="6" cy="16" r="1.8" />
              <circle cx="9" cy="11" r="1.8" />
              <circle cx="12" cy="14" r="1.8" />
              <circle cx="15" cy="9" r="1.8" />
              <circle cx="18" cy="12" r="1.8" />
            </svg>
            <span>{{ t('slide.visual.chart.types.scatter') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('radar')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="12,4 19,8 19,16 12,20 5,16 5,8" fill="none" />
              <polygon points="12,7 16,9 16,15 12,17 8,15 8,9" fill="currentColor" opacity="0.2" />
            </svg>
            <span>{{ t('slide.visual.chart.types.radar') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('funnel')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5 L18 5 L16 9 L8 9 Z" opacity="0.8" />
              <path d="M8 9 L16 9 L14.5 13 L9.5 13 Z" opacity="0.6" />
              <path d="M9.5 13 L14.5 13 L13 17 L11 17 Z" opacity="0.4" />
            </svg>
            <span>{{ t('slide.visual.chart.types.funnel') }}</span>
          </div>
          <div class="dropdown-item" @click.stop="handleChangeType('gauge')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 16 A8 8 0 0 1 20 16" fill="none" />
              <line x1="12" y1="16" x2="16" y2="10" stroke-width="2.5" />
              <circle cx="12" cy="16" r="1.5" fill="currentColor" />
            </svg>
            <span>{{ t('slide.visual.chart.types.gauge') }}</span>
          </div>
        </div>
      </template>
    </a-dropdown>

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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  IconEdit,
  IconBarChart,
  IconLayers,
  IconToTop,
  IconUp,
  IconDown,
  IconToBottom,
  IconDelete,
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
  selectedChart: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'edit-data',
  'change-type',
  'layer-top',
  'layer-up',
  'layer-down',
  'layer-bottom',
  'delete',
  'copy',
  'duplicate'
])

const toolbarStyle = computed(() => {
  return {
    position: 'fixed',
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    zIndex: 1000
  }
})

const handleEditData = () => {
  emit('edit-data')
}

const handleChangeType = (type) => {
  console.log('[FloatingChartToolbar] handleChangeType called:', type)
  if (props.selectedChart?.type !== type) {
    console.log('[FloatingChartToolbar] Emitting change-type:', type)
    emit('change-type', type)
  } else {
    console.log('[FloatingChartToolbar] Type unchanged:', type)
  }
}
</script>

<style scoped>
.floating-chart-toolbar {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.15s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;
  pointer-events: auto;
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

/* Chart type dropdown */
.chart-type-dropdown {
  background: white;
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;
  position: relative;
}

.chart-type-dropdown .dropdown-item {
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

.chart-type-dropdown .dropdown-item:hover {
 background: linear-gradient(135deg, hsl(235, 87%, 53%) 0%, #3454f5 100%);
  color: white;
}

.chart-type-dropdown .dropdown-item svg {
  flex-shrink: 0;
}

.chart-type-dropdown .dropdown-item span {
  flex: 1;
}
/* Global style for Arco Design dropdown to ensure proper z-index */
.arco-dropdown-popup,
.arco-trigger-popup {
  z-index: 9999 !important;
}
</style>
