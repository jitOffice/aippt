<template>
  <!-- Full-screen modal overlay (Gamma style) -->
  <div class="property-panel-modal" @click.self="$emit('close')">
    <div class="property-panel">
      <div class="panel-header">
        <h4>{{ t('slide.visual.properties') }}</h4>
        <a-button size="small" type="text" @click="$emit('close')">
          <icon-close :size="16" />
        </a-button>
      </div>

    <div class="panel-content">
      <!-- Text Properties -->
      <div v-if="selectedComponent.type === 'text'" class="property-section">
        <h5>{{ t('slide.visual.propertyPanel.text') }}</h5>
        
        <div class="property-item">
          <label>{{ t('slide.visual.propertyPanel.content') }}</label>
          <a-textarea
            v-model="selectedComponent.text"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            @change="emitUpdate"
          />
        </div>

        <div class="property-row">
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.fontSize') }}</label>
            <a-input-number
              v-model="selectedComponent.fontSize"
              :min="12"
              :max="96"
              :step="2"
              @change="emitUpdate"
            />
          </div>
          
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.fontWeight') }}</label>
            <a-select v-model="selectedComponent.fontWeight" @change="emitUpdate">
              <a-option value="normal">Normal</a-option>
              <a-option value="bold">Bold</a-option>
              <a-option value="lighter">Light</a-option>
            </a-select>
          </div>
        </div>

        <div class="property-item">
          <label>{{ t('slide.visual.propertyPanel.color') }}</label>
          <a-input v-model="selectedComponent.fill" @change="emitUpdate">
            <template #prepend>
              <div class="color-preview" :style="{ background: selectedComponent.fill }"></div>
            </template>
          </a-input>
        </div>
      </div>

      <!-- Image Properties -->
      <div v-else-if="selectedComponent.type === 'image'" class="property-section">
        <h5>{{ t('slide.visual.propertyPanel.image') }}</h5>
        
        <div class="property-row">
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.width') }}</label>
            <a-input-number
              v-model="selectedComponent.width"
              :min="50"
              :max="800"
              @change="emitUpdate"
            />
          </div>
          
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.height') }}</label>
            <a-input-number
              v-model="selectedComponent.height"
              :min="50"
              :max="600"
              @change="emitUpdate"
            />
          </div>
        </div>
      </div>

      <!-- Shape Properties -->
      <div v-else-if="selectedComponent.type === 'rect' || selectedComponent.type === 'circle'" class="property-section">
        <h5>{{ t('slide.visual.propertyPanel.shape') }}</h5>
        
        <div v-if="selectedComponent.type === 'rect'" class="property-row">
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.width') }}</label>
            <a-input-number
              v-model="selectedComponent.width"
              :min="20"
              :max="800"
              @change="emitUpdate"
            />
          </div>
          
          <div class="property-item">
            <label>{{ t('slide.visual.propertyPanel.height') }}</label>
            <a-input-number
              v-model="selectedComponent.height"
              :min="20"
              :max="600"
              @change="emitUpdate"
            />
          </div>
        </div>

        <div v-else class="property-item">
          <label>{{ t('slide.visual.propertyPanel.radius') }}</label>
          <a-input-number
            v-model="selectedComponent.radius"
            :min="10"
            :max="200"
            @change="emitUpdate"
          />
        </div>

        <div class="property-item">
          <label>{{ t('slide.visual.propertyPanel.fillColor') }}</label>
          <a-input v-model="selectedComponent.fill" @change="emitUpdate">
            <template #prepend>
              <div class="color-preview" :style="{ background: selectedComponent.fill }"></div>
            </template>
          </a-input>
        </div>

        <div class="property-item">
          <label>{{ t('slide.visual.propertyPanel.strokeColor') }}</label>
          <a-input v-model="selectedComponent.stroke" @change="emitUpdate">
            <template #prepend>
              <div class="color-preview" :style="{ background: selectedComponent.stroke }"></div>
            </template>
          </a-input>
        </div>

        <div class="property-item">
          <label>{{ t('slide.visual.propertyPanel.strokeWidth') }}</label>
          <a-input-number
            v-model="selectedComponent.strokeWidth"
            :min="0"
            :max="10"
            @change="emitUpdate"
          />
        </div>
      </div>

      <!-- Position Properties (All types) -->
      <div class="property-section">
        <h5>{{ t('slide.visual.propertyPanel.position') }}</h5>
        
        <div class="property-row">
          <div class="property-item">
            <label>X</label>
            <a-input-number
              v-model="selectedComponent.x"
              :min="0"
              :max="960"
              @change="emitUpdate"
            />
          </div>
          
          <div class="property-item">
            <label>Y</label>
            <a-input-number
              v-model="selectedComponent.y"
              :min="0"
              :max="540"
              @change="emitUpdate"
            />
          </div>
        </div>

        <div v-if="selectedComponent.rotation !== undefined" class="property-item">
          <label>{{ t('slide.visual.propertyPanel.rotation') }}</label>
          <a-slider
            v-model="selectedComponent.rotation"
            :min="-180"
            :max="180"
            :show-tooltip="true"
            @change="emitUpdate"
          />
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { IconClose } from '@arco-design/web-vue/es/icon'

const { t } = useI18n()
const emit = defineEmits(['update', 'close'])

const props = defineProps({
  selectedComponent: {
    type: Object,
    default: null
  }
})

const emitUpdate = () => {
  emit('update', props.selectedComponent)
}
</script>

<style scoped>
/* Full-screen modal overlay (Word style) */
.property-panel-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1001;
  display: flex;
  justify-content: flex-end;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.property-panel {
  width: 340px;
  height: 100%;
  background: #ffffff;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideInRight 0.2s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.panel-header :deep(.arco-btn) {
  color: #6b7280;
}

.panel-header :deep(.arco-btn:hover) {
  color: #1f2937;
  background: #f3f4f6;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.property-section {
  margin-bottom: 24px;
}

.property-section h5 {
  margin: 0 0 12px 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-item {
  margin-bottom: 12px;
}

.property-item label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.property-item :deep(.arco-input),
.property-item :deep(.arco-textarea),
.property-item :deep(.arco-select-view),
.property-item :deep(.arco-input-number) {
  background: #ffffff;
  border-color: #d1d5db;
  color: #1f2937;
}

.property-item :deep(.arco-input:focus),
.property-item :deep(.arco-textarea:focus),
.property-item :deep(.arco-select-view:hover),
.property-item :deep(.arco-input-number:focus) {
  background: #ffffff;
  border-color: #4f46e5;
}

.property-item :deep(.arco-slider) {
  margin: 12px 0;
}

.property-item :deep(.arco-slider-track) {
  background: #e5e7eb;
}

.property-item :deep(.arco-slider-bar) {
  background: #4f46e5;
}

.property-item :deep(.arco-slider-btn) {
  border-color: #4f46e5;
  background: #ffffff;
}

.property-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #d1d5db;
}
</style>
