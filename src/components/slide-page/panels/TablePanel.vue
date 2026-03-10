<template>
  <div class="table-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ t('slide.visual.categories.table') }}</h3>
      <div class="header-actions">
        <span class="keyboard-hint">{{ t('slide.visual.table.shortcut') }}</span>
        <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
          <icon-close :size="16" />
        </button>
      </div>
    </div>

    <!-- Table Grid Selector -->
    <div class="panel-body">
      <div class="selector-label">{{ t('slide.visual.table.selectSize') }}</div>
      
      <div class="table-grid-selector">
        <div
          v-for="(cell, index) in 64"
          :key="index"
          class="grid-cell"
          :class="{ active: isCellActive(index) }"
          :data-row="Math.floor(index / 8) + 1"
          :data-col="(index % 8) + 1"
          @mouseenter="handleCellHover(index)"
          @click="handleCellClick"
        ></div>
      </div>

      <div class="size-display">
        <span class="size-text">{{ selectedRows }} x {{ selectedCols }}</span>
        <span class="size-label">{{ t('slide.visual.table.table') }}</span>
      </div>

      <!-- Actions -->
      <div class="action-section">
        <button class="insert-btn" @click="handleInsertTable">
          <icon-plus :size="16" />
          <span>{{ t('slide.visual.table.insertTable') }}</span>
        </button>
        <button class="ai-btn-small" @click="handleAIGenerate">
          <Icon name="toolbar-magic-wand" :size="14" />
          <span>{{ t('slide.visual.table.aiGenerate') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose, IconPlus } from '@arco-design/web-vue/es/icon'
import { useComponentActions } from '@/composables/useComponentActions.js'
import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon

const emit = defineEmits(['add-component', 'coming-soon', 'close'])

const { t } = useI18n()
const { addComponent } = useComponentActions(emit)

const selectedRows = ref(1)
const selectedCols = ref(1)

// Methods
const isCellActive = (index) => {
  const row = Math.floor(index / 8) + 1
  const col = (index % 8) + 1
  return row <= selectedRows.value && col <= selectedCols.value
}

const handleCellHover = (index) => {
  selectedRows.value = Math.floor(index / 8) + 1
  selectedCols.value = (index % 8) + 1
}

const handleCellClick = () => {
  handleInsertTable()
}

const handleInsertTable = () => {
  addComponent({
    id: 'table',
    type: 'table',
    name: 'Table',
    props: {
      rows: selectedRows.value,
      cols: selectedCols.value
    }
  })
}

const handleAIGenerate = () => {
  console.log('[TablePanel] AI Generate clicked')
  emit('coming-soon', { name: 'AI Table Generation' })
}
</script>

<style scoped>
.table-panel {
  width: 320px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.keyboard-hint {
  padding: 2px 6px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
}

.close-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Body */
.panel-body {
  padding: 16px;
}

.selector-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 12px;
}

/* Table Grid Selector */
.table-grid-selector {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 12px;
}

.grid-cell {
  aspect-ratio: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.grid-cell:hover {
  background: #dbeafe;
  border-color: #2563eb;
}

.grid-cell.active {
  background: #dbeafe;
  border-color: #2563eb;
}

/* Size Display */
.size-display {
  text-align: center;
  margin-bottom: 16px;
}

.size-text {
  font-size: 14px;
  font-weight: 700;
  color: #64748b;
  margin-right: 4px;
}

.size-label {
  font-size: 14px;
  color: #64748b;
}

/* Actions */
.action-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.insert-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
}

.insert-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.ai-btn-small {
  width: 100%;
  padding: 8px;
  background: #f8fafc;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.ai-btn-small:hover {
  background: #e5e7eb;
  color: #374151;
}
</style>
