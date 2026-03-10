<template>
  <div 
    class="component-card" 
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="card-icon" :style="iconStyles">
      <slot name="icon">
        <IconRenderer 
          :icon="component.icon" 
          :size="28"
          :color="component.color"
        />
      </slot>
      

    </div>
          <!-- Coming soon overlay -->
      <ComingSoonOverlay v-if="component.comingSoon" />
    <div class="card-content">
      <div class="card-label">{{ component.name }}</div>
      <div 
        class="card-sublabel" 
        :class="{ 'multi-line': isMultiLineSublabel }"
        v-if="component.sublabel"
      >
        <slot name="sublabel">
          <template v-if="component.id === 'bulletList'">
            • Item 1<br>
            • Item 2<br>
            • Item 3
          </template>
          <template v-else-if="component.id === 'numberedList'">
            1. Item 1<br>
            2. Item 2<br>
            3. Item 3
          </template>
          <template v-else>{{ component.sublabel }}</template>
        </slot>
      </div>
      
      <!-- Coming soon badge -->
      <div v-if="component.comingSoon" class="coming-soon-badge-card">
        {{ comingSoonText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconRenderer from './IconRenderer.vue'
import ComingSoonOverlay from './ComingSoonOverlay.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const { t } = useI18n()

// Computed properties
const cardClasses = computed(() => ({
  'coming-soon-card': props.component.comingSoon,
  'disabled': props.disabled
}))

const iconStyles = computed(() => ({
  color: props.component.color || '#6366f1'
}))

const isMultiLineSublabel = computed(() => {
  return ['bulletList', 'numberedList'].includes(props.component.id)
})

const comingSoonText = computed(() => {
  return t('slide.visual.messages.comingSoon')
})

// Methods
const handleClick = () => {
  if (!props.disabled && !props.component.comingSoon) {
    emit('click', props.component)
  } else if (props.component.comingSoon) {
    emit('coming-soon', props.component)
  }
}
</script>

<style scoped>
.component-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.component-card:hover:not(.disabled):not(.coming-soon-card) {
  background: #ffffff;
  border-color: #6366f1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15), 0 2px 4px rgba(99, 102, 241, 0.1);
}

.component-card:hover .card-icon {
  transform: scale(1.08);
}

.component-card:hover .card-label {
  color: #6366f1;
}

.component-card:hover .card-sublabel {
  color: #6b7280;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #6366f1;
  transition: transform 0.2s;
  position: relative;
  width: 28px;
  height: 28px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  width: 100%;
}

.card-label {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.01em;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.card-sublabel {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

.card-sublabel.multi-line {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.6;
}

/* Coming soon card styles */
.coming-soon-card {
  position: relative;
  opacity: 0.7;
  cursor: not-allowed;
}

.coming-soon-card:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15), 0 2px 4px rgba(99, 102, 241, 0.1);
  background: #ffffff;
  border-color: #e5e7eb;
}

/* Disabled state */
.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.coming-soon-badge-card {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: linear-gradient(135deg, #f59e0b, #f97316);
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>