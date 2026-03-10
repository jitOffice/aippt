<template>
  <svg 
    class="layout-preview-svg" 
    viewBox="0 0 160 80" 
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    <!-- Columns Preview -->
    <template v-if="layout.preview.type === 'columns'">
      <!-- 2 columns - short wide rectangles side by side -->
      <template v-if="layout.preview.columns === 2">
        <rect x="10" y="25" width="68" height="30" fill="#e8f0fe" stroke="#4285f4" stroke-width="1" rx="3" />
        <rect x="85" y="25" width="68" height="30" fill="#dcfce7" stroke="#34a853" stroke-width="1" rx="3" />
      </template>
      
      <!-- 3 columns - short wide rectangles side by side -->
      <template v-else-if="layout.preview.columns === 3">
        <rect x="5" y="25" width="48" height="30" fill="#e8f0fe" stroke="#4285f4" stroke-width="1" rx="3" />
        <rect x="60" y="25" width="48" height="30" fill="#fef3c7" stroke="#fbbf24" stroke-width="1" rx="3" />
        <rect x="115" y="25" width="48" height="30" fill="#dcfce7" stroke="#34a853" stroke-width="1" rx="3" />
      </template>
      
      <!-- 4 columns - short wide rectangles side by side -->
      <template v-else-if="layout.preview.columns === 4">
        <rect x="5" y="25" width="35" height="30" fill="#e8f0fe" stroke="#4285f4" stroke-width="1" rx="3" />
        <rect x="45" y="25" width="35" height="30" fill="#fef3c7" stroke="#fbbf24" stroke-width="1" rx="3" />
        <rect x="85" y="25" width="35" height="30" fill="#dcfce7" stroke="#34a853" stroke-width="1" rx="3" />
        <rect x="125" y="25" width="35" height="30" fill="#fee2e2" stroke="#f87171" stroke-width="1" rx="3" />
      </template>
      
      <!-- Fallback for other column counts -->
      <template v-else>
        <rect
          v-for="idx in layout.preview.columns"
          :key="idx"
          :x="(160 / layout.preview.columns) * (idx - 1) + 5"
          :y="10"
          :width="(160 / layout.preview.columns) - 10"
          :height="60"
          fill="#e8f0fe"
          stroke="#4285f4"
          stroke-width="1"
          rx="3"
        />
      </template>
    </template>

    <!-- Boxes Preview -->
    <template v-else-if="layout.preview.type === 'boxes'">
      <!-- 2 boxes stacked -->
      <template v-if="layout.preview.count === 2 && layout.preview.style !== 'joined'">
        <rect x="10" y="10" width="140" height="25" :fill="getBoxFill(layout.preview.style, 0)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="10" y="45" width="140" height="25" :fill="getBoxFill(layout.preview.style, 1)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
      </template>
      
      <!-- 3 boxes side-by-side -->
      <template v-else-if="layout.preview.count === 3">
        <rect x="5" y="15" width="45" height="50" :fill="getBoxFill(layout.preview.style, 0)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="57" y="15" width="45" height="50" :fill="getBoxFill(layout.preview.style, 1)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="109" y="15" width="45" height="50" :fill="getBoxFill(layout.preview.style, 2)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        
        <!-- Add accent lines for special styles -->
        <template v-if="layout.preview.style === 'side-line'">
          <line x1="5" y1="15" x2="5" y2="65" stroke="#4285f4" stroke-width="2" stroke-linecap="round" />
          <line x1="57" y1="15" x2="57" y2="65" stroke="#ea4335" stroke-width="2" stroke-linecap="round" />
          <line x1="109" y1="15" x2="109" y2="65" stroke="#34a853" stroke-width="2" stroke-linecap="round" />
        </template>
        <template v-if="layout.preview.style === 'top-line'">
          <line x1="5" y1="15" x2="50" y2="15" stroke="#4285f4" stroke-width="2" stroke-linecap="round" />
          <line x1="57" y1="15" x2="102" y2="15" stroke="#ea4335" stroke-width="2" stroke-linecap="round" />
          <line x1="109" y1="15" x2="154" y2="15" stroke="#34a853" stroke-width="2" stroke-linecap="round" />
        </template>
        <template v-if="layout.preview.style === 'circle-top'">
          <circle cx="27.5" cy="15" r="6" fill="#4285f4" />
          <circle cx="79.5" cy="15" r="6" fill="#ea4335" />
          <circle cx="131.5" cy="15" r="6" fill="#34a853" />
        </template>
      </template>
      
      <!-- 4 boxes in grid -->
      <template v-else-if="layout.preview.count === 4">
        <rect x="10" y="10" width="65" height="28" :fill="getBoxFill(layout.preview.style, 0)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="85" y="10" width="65" height="28" :fill="getBoxFill(layout.preview.style, 1)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="10" y="42" width="65" height="28" :fill="getBoxFill(layout.preview.style, 2)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
        <rect x="85" y="42" width="65" height="28" :fill="getBoxFill(layout.preview.style, 3)" :stroke="getBoxStroke(layout.preview.style)" stroke-width="1" rx="3" />
      </template>

      <!-- Joined boxes -->
      <template v-else-if="layout.preview.style === 'joined'">
        <rect x="10" y="10" width="140" height="20" fill="#e8f0fe" rx="3" />
        <rect x="10" y="32" width="140" height="38" fill="#ffffff" stroke="#e5e7eb" stroke-width="1" rx="3" />
      </template>
    </template>

    <!-- Bullets Preview -->
    <template v-else-if="layout.preview.type === 'bullets'">
      <!-- Single column bullets -->
      <template v-if="layout.preview.style !== 'two-column'">
        <g v-for="i in 4" :key="i">
          <circle 
            :cx="layout.preview.style === 'numbered' ? 15 : 12" 
            :cy="12 + (i - 1) * 16" 
            :r="layout.preview.style === 'numbered' ? 6 : 2" 
            :fill="layout.preview.style === 'checkmark' ? '#34a853' : '#4285f4'" 
            :stroke="layout.preview.style === 'numbered' ? '#4285f4' : 'none'"
            :stroke-width="layout.preview.style === 'numbered' ? 1 : 0"
          />
          <text 
            v-if="layout.preview.style === 'numbered'" 
            :x="15" 
            :y="12 + (i - 1) * 16 + 3" 
            text-anchor="middle" 
            font-size="6" 
            fill="#4285f4" 
            font-weight="600"
          >{{ i }}</text>
          <line :x1="layout.preview.style === 'numbered' ? 25 : 18" :y1="12 + (i - 1) * 16" :x2="150" :y2="12 + (i - 1) * 16" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
        </g>
      </template>

      <!-- Two column bullets -->
      <template v-else>
        <g v-for="i in 3" :key="`left-${i}`">
          <circle :cx="8" :cy="12 + (i - 1) * 20" r="2" fill="#4285f4" />
          <line :x1="14" :y1="12 + (i - 1) * 20" :x2="70" :y2="12 + (i - 1) * 20" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
        </g>
        <g v-for="i in 3" :key="`right-${i}`">
          <circle :cx="88" :cy="12 + (i - 1) * 20" r="2" fill="#ea4335" />
          <line :x1="94" :y1="12 + (i - 1) * 20" :x2="152" :y2="12 + (i - 1) * 20" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
        </g>
      </template>
    </template>
  </svg>
</template>

<script setup>
const props = defineProps({
  layout: {
    type: Object,
    required: true
  }
})

const getBoxFill = (style, index) => {
  if (style === 'outline') return 'transparent'
  if (style === 'alternating') {
    return (index % 2 === 0) ? '#e8f0fe' : '#ffffff'
  }
  if (style === 'side-line' || style === 'top-line' || style === 'circle-top') {
    return '#f8f9fa'
  }
  
  const colors = ['#e8f0fe', '#fef3c7', '#dcfce7', '#fee2e2']
  return colors[index % colors.length]
}

const getBoxStroke = (style) => {
  if (style === 'outline') return '#4285f4'
  if (style === 'alternating') return '#e5e7eb'
  if (style === 'side-line' || style === 'top-line' || style === 'circle-top') return '#e5e7eb'
  return 'none'
}
</script>

<style scoped>
.layout-preview-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
