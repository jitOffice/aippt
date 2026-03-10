<template>
  <div class="text-panel">
    <!-- Header -->
    <div class="panel-header">
      <div class="header-content">
        <h3 class="panel-title">{{ t('slide.visual.categories.text') }}</h3>
        <span class="keyboard-hint">{{ t('slide.visual.text.shortcut') || '快捷键 T' }}</span>
      </div>
      <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
        <icon-close :size="16" />
      </button>
    </div>

    <!-- Text Options -->
    <div class="text-options">
      <button
        v-for="component in textComponents"
        :key="component.id"
        class="text-option"
        @click="handleComponentClick(component)"
      >
        <div class="option-icon" :class="getIconColorClass(component.id)">
          <component :is="component.icon" :size="20" />
        </div>
        <div class="option-info">
          <div class="option-name">{{ t(component.name) }}</div>
          <div class="option-desc">{{ component.sublabel }}</div>
        </div>
      </button>
    </div>

    <!-- AI Generate Section -->
    <div class="ai-section">
      <button class="ai-btn" @click="handleAIGenerate">
        <Icon name="toolbar-magic-wand" :size="16" />
        <span>{{ t('slide.visual.text.aiGenerate') || 'AI 智能生成文案' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'
import { useComponentRegistry } from '@/composables/useComponentRegistry.js'
import { useComponentActions } from '@/composables/useComponentActions.js'
import IIcon from '@/utils/slide/icon.js'

const Icon = IIcon

const emit = defineEmits(['add-component', 'coming-soon', 'close'])

const { t } = useI18n()
const { textComponents } = useComponentRegistry()
const { addComponent, handleComingSoon } = useComponentActions(emit)

// Methods
const handleComponentClick = (component) => {
  addComponent(component)
}

const getIconColorClass = (id) => {
  const colorMap = {
    'heading1': 'icon-blue',
    'heading2': 'icon-slate',
    'heading3': 'icon-slate',
    'paragraph': 'icon-slate',
    'bulletList': 'icon-green',
    'numberedList': 'icon-green'
  }
  return colorMap[id] || 'icon-slate'
}

const handleAIGenerate = () => {
  // Placeholder for AI generation
  console.log('[TextPanel] AI Generate clicked')
  emit('coming-soon', { name: 'AI Text Generation' })
}
</script>

<style scoped>
.text-panel {
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

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.panel-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
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

/* Text Options */
.text-options {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.text-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
}

.text-option:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  transform: translateY(-1px);
}

.option-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  flex-shrink: 0;
}

.icon-blue {
  background: #2563eb;
  color: #ffffff;
}

.icon-slate {
  background: #64748b;
  color: #ffffff;
}

.icon-green {
  background: #10b981;
  color: #ffffff;
}

.option-info {
  flex: 1;
  min-width: 0;
}

.option-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2px;
}

.option-desc {
  font-size: 12px;
  color: #6b7280;
}

/* AI Section */
.ai-section {
  padding: 12px;
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