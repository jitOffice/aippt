<template>
  <div 
    v-if="visible" 
    class="floating-table-toolbar"
    :style="toolbarStyle"
  >
    <!-- Add Row Button -->
    <a-button 
      @click="$emit('add-row')"
      :title="t('slide.visual.table.addRow') || 'Add Row'"
    >
      <Icon name="table-row-add" />
    </a-button>

    <!-- Delete Row Button -->
    <a-button 
      @click="$emit('delete-row')"
      :title="t('slide.visual.table.deleteRow') || 'Delete Row'"
    >
      <Icon name="table-row-delete"  />
    </a-button>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Add Column Button -->
    <a-button 
      @click="$emit('add-column')"
      :title="t('slide.visual.table.addColumn') || 'Add Column'"
    >
      <template #icon>
        <Icon name="table-column-add"  />
        
      </template>
    </a-button>

    <!-- Delete Column Button -->
    <a-button 
      @click="$emit('delete-column')"
      :title="t('slide.visual.table.deleteColumn') || 'Delete Column'"
    >
      <template #icon>
        <Icon name="table-column-delete" />
      </template>
   
    </a-button>

    <a-divider direction="vertical" style="margin: 0 8px;" />

    <!-- Layer Controls Dropdown -->
    <a-dropdown trigger="click" position="bl">
      <a-button :title="t('slide.visual.layer.title')">
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
      @click="$emit('duplicate')"
      :title="t('slide.visual.messages.duplicated')"
    >
      <span v-html="icon['duplicate'].body"></span>
    </a-button>
            
    <a-divider direction="vertical" style="margin: 0 8px;" />
    
    <!-- Delete Button -->
    <a-button 
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
  IconPlus,
  IconMinus,
  IconLayers,
  IconToTop,
  IconUp,
  IconDown,
  IconToBottom,
  IconDelete,
} from '@arco-design/web-vue/es/icon'
import icon from '@/utils/icon'

import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon

const { t } = useI18n()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const emit = defineEmits([
  'add-row',
  'delete-row',
  'add-column',
  'delete-column',
  'layer-top',
  'layer-up',
  'layer-down',
  'layer-bottom',
  'delete',
  'duplicate'
])

const toolbarStyle = computed(() => {
  return {
    position: 'fixed',
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    zIndex: 1000  // Match chart toolbar z-index
  }
})
</script>

<style scoped>
.floating-table-toolbar {
  position: fixed;
  z-index: 1000;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 6px 8px;  /* Match text toolbar */
  display: flex;
  align-items: center;
  gap: 2px;  /* Match text toolbar */
  animation: fadeIn 0.15s ease-out;
  border: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;
  pointer-events: auto;
}

/* Button styling - match text toolbar */
.floating-table-toolbar :deep(.arco-btn) {
  min-width: 32px !important;
  height: 32px !important;
  padding: 0 8px !important;
  border: none;
  background: transparent;
  color: #1f2329;
  border-radius: 4px;
  transition: all 0.15s;
  cursor: pointer;
  font-size: 14px !important;
  line-height: 32px !important;
}

.floating-table-toolbar :deep(.arco-btn:hover) {
  background: rgba(0, 0, 0, 0.04);
  color: #1f2329;
}

.floating-table-toolbar :deep(.arco-btn-primary) {
  background: rgba(0, 102, 255, 0.1) !important;
  color: #0066ff !important;
}

.floating-table-toolbar :deep(.arco-btn-primary:hover) {
  background: rgba(0, 102, 255, 0.15) !important;
}

/* Danger button (Delete) */
.floating-table-toolbar :deep(.arco-btn-status-danger) {
  color: #f53f3f;
}

.floating-table-toolbar :deep(.arco-btn-status-danger:hover) {
  background: rgba(245, 63, 63, 0.1);
}

/* Divider styling - match text toolbar */
.floating-table-toolbar :deep(.arco-divider-vertical) {
  height: 20px;
  margin: 0 6px;
  border-color: rgba(0, 0, 0, 0.08);
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
</style>
