<template>
  <div class="shapes-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ t('slide.visual.categories.shapes') }}</h3>
      <div class="header-actions">
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="t('slide.visual.shapes.searchPlaceholder') || '搜索形状...'"
          class="search-input"
        />
        <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
          <icon-close :size="16" />
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="panel-body">
      <!-- Basic Shapes -->
      <div class="shape-section">
        <div class="section-title">{{ t('slide.visual.shapes.basic') || '基础形状' }}</div>
        <div class="shape-grid">
          <button
            v-for="shape in basicShapes"
            :key="shape.id"
            class="shape-item"
            @click="handleShapeClick(shape)"
            :title="t(shape.name)"
          >
            <div class="shape-preview" v-html="shape.preview"></div>
          </button>
        </div>
      </div>

      <!-- Arrows -->
      <div class="shape-section">
        <div class="section-title">{{ t('slide.visual.shapes.arrows') || '箭头符号' }}</div>
        <div class="shape-grid">
          <button
            v-for="shape in arrowShapes"
            :key="shape.id"
            class="shape-item"
            @click="handleShapeClick(shape)"
            :title="t(shape.name)"
          >
            <div class="shape-preview" v-html="shape.preview"></div>
          </button>
        </div>
      </div>

      <!-- Flowchart -->
      <div class="shape-section">
        <div class="section-title">{{ t('slide.visual.shapes.flowchart') || '流程图' }}</div>
        <div class="shape-grid">
          <button
            v-for="shape in flowchartShapes"
            :key="shape.id"
            class="shape-item"
            @click="handleShapeClick(shape)"
            :title="t(shape.name)"
          >
            <div class="shape-preview" v-html="shape.preview"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'
import { useComponentRegistry } from '@/composables/useComponentRegistry.js'
import { useComponentActions } from '@/composables/useComponentActions.js'

const emit = defineEmits(['add-component', 'coming-soon', 'close'])

const { t } = useI18n()
const { shapeComponents } = useComponentRegistry()
const { addComponent, handleComingSoon } = useComponentActions((event, payload) => {
  emit(event, payload)
})

const searchQuery = ref('')

// Define shape categories with SVG previews
const basicShapes = [
  { id: 'rectangle', name: 'slide.visual.shapes.rectangle', preview: '<div class="w-8 h-8 bg-blue-600 rounded"></div>' },
  { id: 'circle', name: 'slide.visual.shapes.circle', preview: '<div class="w-8 h-8 bg-blue-600 rounded-full"></div>' },
  { id: 'triangle', name: 'slide.visual.shapes.triangle', preview: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path d="M12 3L21 19.5H3L12 3z" fill="#2563eb"/></svg>' },
  { id: 'hexagon', name: 'slide.visual.shapes.hexagon', preview: '<div class="w-10 h-6 bg-blue-600" style="clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"></div>' },
  { id: 'diamond', name: 'slide.visual.shapes.diamond', preview: '<div class="w-8 h-8 bg-blue-600 rotate-45"></div>' },
  { id: 'pentagon', name: 'slide.visual.shapes.pentagon', preview: '<div class="w-8 h-6 bg-blue-600" style="clip-path: polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)"></div>' },
  { id: 'ring', name: 'slide.visual.shapes.ring', preview: '<svg class="w-8 h-8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#2563eb" stroke-width="3.5"/></svg>' },
  { id: 'star', name: 'slide.visual.shapes.star', preview: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
]

const arrowShapes = [
  { id: 'arrow-right', name: 'slide.visual.shapes.arrowRight', preview: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path fill="#2563eb" d="M5 12h14m-7-7l7 7-7 7" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' },
  { id: 'arrow-up', name: 'slide.visual.shapes.arrowUp', preview: '<svg class="w-8 h-8" viewBox="0 0 24 24"><path fill="#2563eb" d="M12 19V5m-7 7l7-7 7 7" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>' },
  { id: 'arrow-restart', name: 'slide.visual.shapes.arrowRestart', preview: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="solar:restart-bold" class="iconify text-blue-600 text-2xl iconify--solar"><path fill="currentColor" d="M18.258 3.508a.75.75 0 0 1 .463.693v4.243a.75.75 0 0 1-.75.75h-4.243a.75.75 0 0 1-.53-1.28L14.8 6.31a7.25 7.25 0 1 0 4.393 5.783a.75.75 0 0 1 1.488-.187A8.75 8.75 0 1 1 15.93 5.18l1.51-1.51a.75.75 0 0 1 .817-.162"></path></svg>' },
  { id: 'arrow-double-right', name: 'slide.visual.shapes.arrowDoubleRight', preview: '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" data-icon="solar:round-double-alt-arrow-right-bold" class="iconify text-blue-600 text-2xl iconify--solar"><path fill="currentColor" fill-rule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10m-8.97-3.53a.75.75 0 1 0-1.06 1.06L14.44 12l-2.47 2.47a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06zm-5.06 0a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 0 1-1.06-1.06L10.44 12L7.97 9.53a.75.75 0 0 1 0-1.06" clip-rule="evenodd"></path></svg>' },
]

const flowchartShapes = [
  { id: 'oval', name: 'slide.visual.shapes.oval', preview: '<div class="w-8 h-6 bg-blue-600 rounded-full"></div>' },
  { id: 'hexagon-flow', name: 'slide.visual.shapes.hexagonFlow', preview: '<div class="w-8 h-6 bg-blue-600" style="clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)"></div>' },
  { id: 'diamond-flow', name: 'slide.visual.shapes.diamondFlow', preview: '<div class="w-6 h-6 bg-blue-600 rotate-45"></div>' },
  { id: 'trapezoid', name: 'slide.visual.shapes.trapezoid', preview: '<div class="w-8 h-6 bg-blue-600" style="clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)"></div>' },
  { id: 'parallelogram', name: 'slide.visual.shapes.parallelogram', preview: '<div class="w-8 h-6 bg-blue-600" style="clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)"></div>' },
]

// Methods
const handleShapeClick = (shape) => {
  addComponent({ 
    id: shape.id, 
    type: 'shape', 
    name: shape.name,
    props: {
      // Store original shape ID for routing to correct add function
      originalShape: shape.id
    }
  })
}
</script>

<style scoped>
.shapes-panel {
  width: 384px;
  max-height: 500px;
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

.search-input {
  width: 140px;
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
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
  flex-shrink: 0;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Scrollable Body */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
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

/* Shape Sections */
.shape-section {
  margin-bottom: 16px;
}

.shape-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

/* Shape Grid */
.shape-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.shape-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px;
}

.shape-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.1);
}

.shape-item:active {
  transform: translateY(0);
}

.shape-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.shape-preview :deep(div),
.shape-preview :deep(svg) {
  pointer-events: none;
}
</style>