<template>
  <div ref="chartRef" class="echarts-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  id: {
    type: String,
    default: () => `chart-${Date.now()}`
  },
  isThumbnail: {
    type: Boolean,
    default: false
  }
})

const chartRef = ref(null)
let chartInstance = null
let resizeObserver = null

function initChart() {
  if (!chartRef.value) return

  // Dispose existing instance
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }

  // Create new instance with optimized settings for thumbnails
  const chartOptions = {
    devicePixelRatio: props.isThumbnail ? 1 : window.devicePixelRatio || 2,
    useDirtyRect: false,
    renderer: 'canvas'
  }
  
  chartInstance = echarts.init(chartRef.value, null, chartOptions)
  
  // Set option
  if (props.option) {
    // For thumbnails, simplify the option to improve performance
    const simplifiedOption = props.isThumbnail ? simplifyOptionForThumbnail(props.option) : props.option
    chartInstance.setOption(simplifiedOption)
  }

  console.log('[EChartsChart] Chart initialized', { isThumbnail: props.isThumbnail })
}

function simplifyOptionForThumbnail(option) {
  // Create a simplified version of the option for thumbnail display
  const simplified = JSON.parse(JSON.stringify(option))
  
  // Reduce animation duration for thumbnails
  if (simplified.animationDuration) {
    simplified.animationDuration = Math.min(simplified.animationDuration, 200)
  }
  if (simplified.animationDurationUpdate) {
    simplified.animationDurationUpdate = Math.min(simplified.animationDurationUpdate, 200)
  }
  
  // Simplify series if needed
  if (simplified.series && Array.isArray(simplified.series)) {
    simplified.series = simplified.series.map(series => {
      const simplifiedSeries = { ...series }
      // Reduce data points for better performance in thumbnails
      if (simplifiedSeries.data && Array.isArray(simplifiedSeries.data) && simplifiedSeries.data.length > 20) {
        simplifiedSeries.data = simplifiedSeries.data.filter((_, index) => index % Math.ceil(simplifiedSeries.data.length / 20) === 0)
      }
      return simplifiedSeries
    })
  }
  
  return simplified
}

function updateChart() {
  if (!chartInstance || !props.option) return

  try {
    chartInstance.setOption(props.option, true) // true = replace all options
    console.log('[EChartsChart] Chart updated')
  } catch (e) {
    console.error('[EChartsChart] Update error:', e)
  }
}

function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// Watch for option changes
watch(() => props.option, () => {
  updateChart()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  initChart()

  // Setup resize observer
  if (chartRef.value) {
    resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserver.observe(chartRef.value)
  }

  // Also listen to window resize
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  
  window.removeEventListener('resize', handleResize)
  
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  min-height: 100px; /* Reduced minimum height for thumbnails */
}
</style>
