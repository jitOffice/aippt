<template>
  <div class="images-panel">
    <!-- Header -->
    <div class="panel-header">
      <h3 class="panel-title">{{ t('slide.visual.categories.images') }}</h3>
      <div class="header-actions">
        <button class="close-btn" @click="$emit('close')" :title="t('common.close')">
          <icon-close :size="16" />
        </button>
      </div>
    </div>

    <!-- Scrollable Content -->
    <div class="panel-body">
      <div class="component-grid component-grid-3col">
        <ComponentCard v-for="component in imagesComponents" :key="component.id" :component="component"
          @click="handleComponentClick" @coming-soon="handleComingSoonEvent" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'
import ComponentCard from '../ComponentCard.vue'
import { useComponentRegistry } from '@/composables/useComponentRegistry.js'
import { useComponentActions } from '@/composables/useComponentActions.js'

const emit = defineEmits(['add-component', 'coming-soon', 'open-search', 'close'])

const { t } = useI18n()
const { getImagesComponents, isSearchableComponent } = useComponentRegistry()
const { addComponent, handleComingSoon } = useComponentActions((event, payload) => {
  if (event === 'add-component') {
    emit('add-component', payload)
  } else {
    emit(event, payload)
  }
})

// Computed
const imagesComponents = computed(() => getImagesComponents())
const description = computed(() => {
  return t('slide.visual.images.description') || 'Add images to your slides.'
})

// Methods
const handleComponentClick = (component) => {
  if (isSearchableComponent(component.id)) {
    // For searchable components, emit event to open search panel
    emit('open-search', component)
  } else {
    // For direct components, add immediately
    addComponent(component)
  }
}

const handleComingSoonEvent = (component) => {
  handleComingSoon(component)
  emit('coming-soon', component)
}
</script>

<style scoped>
.images-panel {
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

/* Component Grid */
.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.component-grid-3col {
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
</style>