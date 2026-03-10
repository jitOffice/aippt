<template>
  <div class="layouts-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ t('slide.visual.categories.layouts') }}</h3>
      <div class="header-actions">
        <div class="filter-tabs">
          <button 
            v-for="filter in filters"
            :key="filter.id"
            class="filter-tab"
            :class="{ active: activeFilter === filter.id }"
            @click="activeFilter = filter.id"
          >
            {{ t(filter.label) }}
          </button>
        </div>
        <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
          <icon-close :size="16" />
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="panel-body">
      <!-- Layout Grid -->
      <div class="layouts-grid">
        <button
          v-for="layout in filteredLayouts"
          :key="layout.id"
          class="layout-card"
          :class="{ hot: layout.isHot }"
          @click="handleLayoutClick(layout)"
          :title="t(layout.name)"
        >
          <!-- Preview -->
          <div class="layout-preview">
            <LayoutPreview :layout="layout" />
          </div>
          <!-- Label -->
          <span class="layout-label">{{ t(layout.name) }}</span>
          <!-- Hot Badge -->
          <span v-if="layout.isHot" class="hot-badge">HOT</span>
        </button>
      </div>

      <!-- AI Recommend -->
      <div class="ai-section">
        <button class="ai-btn" @click="handleAIMatch">
          <Icon name="toolbar-magic-wand" :size="16" />
          <span>{{ t('slide.visual.layouts.aiMatch') || 'AI 智能匹配布局' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'
import { SMART_LAYOUT_TEMPLATES, LAYOUT_CATEGORIES, getLayoutsByCategory } from '@/utils/slide/smartLayoutTemplates.js'
import LayoutPreview from '../LayoutPreview.vue'
import { useComponentActions } from '@/composables/useComponentActions.js'
import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon

const emit = defineEmits(['apply-layout', 'coming-soon', 'close'])

const { t } = useI18n()
const { addComponent, handleComingSoon } = useComponentActions(emit)

// Filters
const filters = [
  { id: 'common', label: 'slide.visual.layouts.common' },
  { id: 'all', label: 'slide.visual.layouts.all' },
]

const activeFilter = ref('common')

const filteredLayouts = computed(() => {
  // For now, return all layouts from boxes and bullets categories
  const boxLayouts = getLayoutsByCategory(LAYOUT_CATEGORIES.BOXES)
  const bulletLayouts = getLayoutsByCategory(LAYOUT_CATEGORIES.BULLETS)
  const allLayouts = [...boxLayouts, ...bulletLayouts]
  
  // Mark some as hot
  allLayouts[2] = { ...allLayouts[2], isHot: true }
  
  return activeFilter.value === 'common' ? allLayouts.slice(0, 6) : allLayouts
})

const handleLayoutClick = (layout) => {
  console.log('[SmartLayoutsPanel] Emitting apply-layout event:', layout.id)
  emit('apply-layout', layout)
}

const handleAIMatch = () => {
  console.log('[SmartLayoutsPanel] AI Match clicked')
  emit('coming-soon', { name: 'AI Layout Matching' })
}
</script>

<style scoped>
.layouts-panel {
  width: 500px;
  max-height: 550px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
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

.filter-tabs {
  display: flex;
  gap: 4px;
}

.filter-tab {
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background: #f3f4f6;
}

.filter-tab.active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
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

/* Scrollable Body */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.panel-body::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Layout Grid */
.layouts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.layout-card {
  position: relative;
  aspect-ratio: 16/10;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px;
  overflow: hidden;
}

.layout-card:hover {
  border-color: #2563eb;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.layout-card.hot {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.layout-preview {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.layout-label {
  position: absolute;
  bottom: 4px;
  left: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #6b7280;
  pointer-events: none;
}

.layout-card:hover .layout-label {
  color: #2563eb;
}

.hot-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 6px;
  background: #2563eb;
  color: #ffffff;
  font-size: 8px;
  font-weight: 700;
  border-radius: 4px;
}

/* AI Section */
.ai-section {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.ai-btn {
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

.ai-btn:hover {
  background: #1d4ed8;
  box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.ai-btn:active {
  transform: translateY(0);
}
</style>
