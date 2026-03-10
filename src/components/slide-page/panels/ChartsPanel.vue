<template>
  <div class="charts-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ t('slide.visual.categories.charts') }}</h3>
      <div class="header-actions">
        <span class="ai-badge">{{ t('slide.visual.charts.aiSmart') || 'AI 智能' }}</span>
        <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
          <icon-close :size="16" />
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="panel-body">
      <!-- Basic Charts -->
      <div class="chart-section">
        <div class="section-title">{{ t('slide.visual.charts.basic') || '基础图表' }}</div>
        <div class="chart-grid">
          <button
            v-for="chart in basicCharts"
            :key="chart.id"
            class="chart-item"
            @click="handleChartClick(chart)"
          >
            <div class="chart-icon" :style="{ background: chart.color }">
              <component :is="chart.icon" :size="24" />
            </div>
            <div class="chart-info">
              <div class="chart-name">{{ t(chart.name) }}</div>
              <div class="chart-desc">{{ t(chart.desc) }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Advanced Charts -->
      <div class="chart-section">
        <div class="section-title">{{ t('slide.visual.charts.advanced') || '高级图表' }}</div>
        <div class="chart-grid">
          <button
            v-for="chart in advancedCharts"
            :key="chart.id"
            class="chart-item"
            @click="handleChartClick(chart)"
          >
            <div class="chart-icon" :style="{ background: chart.color }">
              <component :is="chart.icon" :size="24" />
            </div>
            <div class="chart-info">
              <div class="chart-name">{{ t(chart.name) }}</div>
              <div class="chart-desc">{{ t(chart.desc) }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- AI Recommend -->
      <div class="ai-section">
        <button class="ai-btn" @click="handleAIRecommend">
          <Icon name="toolbar-magic-wand" :size="16" />
          <span>{{ t('slide.visual.charts.aiRecommend') || 'AI 智能推荐图表' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose, IconBarChart } from '@arco-design/web-vue/es/icon'
import { useComponentRegistry } from '@/composables/useComponentRegistry.js'
import { useComponentActions } from '@/composables/useComponentActions.js'
import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon

const emit = defineEmits(['add-component', 'coming-soon', 'close'])

const { t } = useI18n()
const { chartComponents } = useComponentRegistry()
const { addComponent, handleComingSoon } = useComponentActions((event, payload) => {
  if (event === 'add-component') {
    emit('add-component', payload)
  } else {
    emit(event, payload)
  }
})

// Define chart types
const basicCharts = [
  { id: 'bar', name: 'slide.visual.charts.bar', desc: 'slide.visual.charts.barDesc', icon: IconBarChart, color: '#dbeafe' },
  { id: 'line', name: 'slide.visual.charts.line', desc: 'slide.visual.charts.lineDesc', icon: IconBarChart, color: '#d1fae5' },
  { id: 'pie', name: 'slide.visual.charts.pie', desc: 'slide.visual.charts.pieDesc', icon: IconBarChart, color: '#e9d5ff' },
  { id: 'area', name: 'slide.visual.charts.area', desc: 'slide.visual.charts.areaDesc', icon: IconBarChart, color: '#fed7aa' },
]

const advancedCharts = [
  { id: 'radar', name: 'slide.visual.charts.radar', desc: 'slide.visual.charts.radarDesc', icon: IconBarChart, color: '#cffafe' },
  { id: 'scatter', name: 'slide.visual.charts.scatter', desc: 'slide.visual.charts.scatterDesc', icon: IconBarChart, color: '#fecdd3' },
  { id: 'funnel', name: 'slide.visual.charts.funnel', desc: 'slide.visual.charts.funnelDesc', icon: IconBarChart, color: '#c7d2fe' },
  { id: 'gauge', name: 'slide.visual.charts.gauge', desc: 'slide.visual.charts.gaugeDesc', icon: IconBarChart, color: '#99f6e4' },
]

// Methods
const handleChartClick = (chart) => {
  addComponent({ id: chart.id, type: 'chart', name: chart.name })
}

const handleAIRecommend = () => {
  console.log('[ChartsPanel] AI Recommend clicked')
  emit('coming-soon', { name: 'AI Chart Recommendation' })
}
</script>

<style scoped>
.charts-panel {
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

.ai-badge {
  padding: 4px 8px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 10px;
  font-weight: 700;
  border-radius: 6px;
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

/* Chart Sections */
.chart-section {
  margin-bottom: 16px;
}

.chart-section:last-of-type {
  margin-bottom: 0;
}

.section-title {
  font-size: 10px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* Chart Grid */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.chart-item:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 99, 235, 0.1);
}

.chart-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.chart-icon :deep(.arco-icon) {
  color: #2563eb;
}

.chart-icon :deep(svg) {
  color: #2563eb;
}

.chart-info {
  flex: 1;
  min-width: 0;
}

.chart-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}

.chart-desc {
  font-size: 11px;
  color: #6b7280;
}

/* AI Section */
.ai-section {
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  margin-top: 12px;
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