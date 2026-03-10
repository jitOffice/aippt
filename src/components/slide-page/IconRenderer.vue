<template>
  <div class="icon-renderer" :style="containerStyles">
    <!-- Render Arco Design icon component -->
    <component 
      v-if="isArcoIcon" 
      :is="iconComponent" 
      :size="size"
      :style="iconStyles"
    />
    
    <!-- Render custom SVG icon -->
    <div 
      v-else-if="isCustomSvg"
      class="custom-svg-icon"
      v-html="customSvgContent"
      :style="svgStyles"
    />
    
    <!-- Fallback for unknown icons -->
    <div v-else class="fallback-icon" :style="fallbackStyles">
      ?
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isCustomIcon, getCustomIcon } from '../../views/slide-page/config/icon-mapping.js'

const props = defineProps({
  icon: {
    type: [String, Object],
    required: true
  },
  size: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})

// Computed properties
const isArcoIcon = computed(() => {
  return typeof props.icon === 'object' || 
         (typeof props.icon === 'string' && props.icon.startsWith('Icon'))
})

const isCustomSvg = computed(() => {
  return typeof props.icon === 'string' && isCustomIcon(props.icon)
})

const iconComponent = computed(() => {
  if (typeof props.icon === 'object') {
    return props.icon
  }
  // For string-based Arco icons, you'd need to import them dynamically
  // This is a simplified version - in practice you'd have a mapping
  return props.icon
})

const customSvgContent = computed(() => {
  if (isCustomSvg.value) {
    return getCustomIcon(props.icon)
  }
  return ''
})

const containerStyles = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: `${props.size}px`,
  height: `${props.size}px`
}))

const iconStyles = computed(() => ({
  color: props.color
}))

const svgStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  color: props.color
}))

const fallbackStyles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f3f4f6',
  borderRadius: '4px',
  fontSize: `${props.size * 0.6}px`,
  fontWeight: 'bold',
  color: '#9ca3af'
}))
</script>

<style scoped>
.icon-renderer {
  flex-shrink: 0;
}

.custom-svg-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.fallback-icon {
  font-family: monospace;
}
</style>