<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    width="600px"
    :footer="false"
    @cancel="handleCancel"
  >
    <div class="chart-editor">
      <!-- Data Editor -->
      <div class="data-editor">
        <div class="editor-header">
          <h4>{{ $t('slide.visual.chart.data') || 'Chart Data' }}</h4>
          <a-button size="small" @click="loadSampleData">
            <icon-refresh :size="14" />
            {{ $t('slide.visual.chart.loadSample') || 'Load Sample' }}
          </a-button>
        </div>

        <!-- Simple table for data input -->
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>{{ currentChartType === 'pie' ? ($t('slide.visual.chart.category') || 'Category') : ($t('slide.visual.chart.label') || 'Label') }}</th>
                <th>{{ $t('slide.visual.chart.value') || 'Value' }}</th>
                <th width="60">{{ $t('slide.visual.chart.action') || 'Action' }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in dataRows" :key="index">
                <td>
                  <a-input 
                    v-model="row.label" 
                    placeholder="Label"
                    size="small"
                  />
                </td>
                <td>
                  <a-input-number 
                    v-model="row.value" 
                    placeholder="Value"
                    size="small"
                    :min="0"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <a-button 
                    type="text" 
                    status="danger"
                    size="mini"
                    @click="removeRow(index)"
                    :disabled="dataRows.length <= 2"
                  >
                    <icon-delete :size="14" />
                  </a-button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <a-button 
            type="dashed" 
            size="small"
            long
            @click="addRow"
            class="add-row-btn"
          >
            <icon-plus :size="14" />
            {{ $t('slide.visual.chart.addRow') || 'Add Row' }}
          </a-button>
        </div>
      </div>

      <!-- Actions -->
      <div class="chart-actions">
        <a-space>
          <a-button @click="handleCancel">{{ $t('common.cancel') || 'Cancel' }}</a-button>
          <a-button type="primary" @click="handleConfirm">
            {{ editMode ? ($t('slide.visual.chart.update') || 'Update') : ($t('slide.visual.chart.insert') || 'Insert') }}
          </a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { 
  IconRefresh,
  IconPlus,
  IconDelete
} from '@arco-design/web-vue/es/icon'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  chartType: {
    type: String,
    default: 'bar'
  },
  editMode: {
    type: Boolean,
    default: false
  },
  existingChart: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Use chartType from props directly (controlled by toolbar dropdown)
const currentChartType = computed(() => props.chartType)

const dataRows = ref([
  { label: 'Mon', value: 120 },
  { label: 'Tue', value: 200 },
  { label: 'Wed', value: 150 },
  { label: 'Thu', value: 80 },
  { label: 'Fri', value: 70 }
])

const title = computed(() => {
  const type = currentChartType.value
  const typeLabel = t(`slide.visual.chart.types.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)
  return props.editMode 
    ? t('slide.visual.chart.editData') || `Edit ${typeLabel} Data`
    : t('slide.visual.chart.editData') || `Edit ${typeLabel} Data`
})

// Add row
const addRow = () => {
  dataRows.value.push({ label: `Item ${dataRows.value.length + 1}`, value: 0 })
}

// Remove row
const removeRow = (index) => {
  if (dataRows.value.length > 2) {
    dataRows.value.splice(index, 1)
  }
}

// Load sample data
const loadSampleData = () => {
  if (currentChartType.value === 'bar' || currentChartType.value === 'line' || currentChartType.value === 'area') {
    dataRows.value = [
      { label: 'Mon', value: 120 },
      { label: 'Tue', value: 200 },
      { label: 'Wed', value: 150 },
      { label: 'Thu', value: 80 },
      { label: 'Fri', value: 70 },
      { label: 'Sat', value: 110 },
      { label: 'Sun', value: 130 }
    ]
  } else if (currentChartType.value === 'pie' || currentChartType.value === 'funnel') {
    dataRows.value = [
      { label: 'Product A', value: 335 },
      { label: 'Product B', value: 310 },
      { label: 'Product C', value: 234 },
      { label: 'Product D', value: 135 },
      { label: 'Product E', value: 148 }
    ]
  } else if (currentChartType.value === 'scatter') {
    dataRows.value = [
      { label: 'Point 1', value: 10 },
      { label: 'Point 2', value: 20 },
      { label: 'Point 3', value: 30 },
      { label: 'Point 4', value: 40 },
      { label: 'Point 5', value: 50 }
    ]
  } else if (currentChartType.value === 'radar') {
    dataRows.value = [
      { label: 'Sales', value: 85 },
      { label: 'Marketing', value: 70 },
      { label: 'Development', value: 90 },
      { label: 'Support', value: 75 },
      { label: 'Technology', value: 88 },
      { label: 'Administration', value: 65 }
    ]
  } else if (currentChartType.value === 'gauge') {
    dataRows.value = [
      { label: 'Progress', value: 75 }
    ]
  }
  Message.success(t('slide.visual.chart.sampleLoaded') || 'Sample data loaded')
}

// Generate ECharts option from data
const generateChartOption = () => {
  const labels = dataRows.value.map(row => row.label)
  const values = dataRows.value.map(row => row.value)

  if (currentChartType.value === 'bar') {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Value',
        type: 'bar',
        data: values,
        itemStyle: { color: '#4285f4' },
        barWidth: '60%'
      }]
    }
  } else if (currentChartType.value === 'line') {
    return {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        boundaryGap: false
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Value',
        type: 'line',
        data: values,
        smooth: true,
        itemStyle: { color: '#34a853' },
        areaStyle: { color: 'rgba(52, 168, 83, 0.2)' }
      }]
    }
  } else if (currentChartType.value === 'pie') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [{
        name: 'Conversion',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {d}%'
        },
        data: dataRows.value.map(row => ({
          name: row.label,
          value: row.value
        }))
      }]
    }
  } else if (currentChartType.value === 'scatter') {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}'
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '7%',
        containLabel: true
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: 'Data',
        type: 'scatter',
        symbolSize: 12,
        itemStyle: { color: '#34d399' },
        data: values.map((val, idx) => [idx + 1, val])
      }]
    }
  } else if (currentChartType.value === 'radar') {
    return {
      tooltip: {
        trigger: 'item'
      },
      radar: {
        indicator: labels.map(label => ({ name: label, max: 100 }))
      },
      series: [{
        name: 'Radar',
        type: 'radar',
        data: [{
          value: values,
          name: 'Metrics',
          areaStyle: {
            color: 'rgba(99, 102, 241, 0.3)'
          },
          itemStyle: { color: '#6366f1' },
          lineStyle: { width: 2 }
        }]
      }]
    }
  } else if (currentChartType.value === 'gauge') {
    return {
      tooltip: {
        formatter: '{b}: {c}%'
      },
      series: [{
        name: 'Gauge',
        type: 'gauge',
        progress: {
          show: true,
          width: 18
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 15,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 25,
          color: '#999',
          fontSize: 12
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 20,
          itemStyle: {
            borderWidth: 8,
            borderColor: '#4285f4'
          }
        },
        title: {
          show: true,
          offsetCenter: [0, '70%'],
          fontSize: 14
        },
        detail: {
          valueAnimation: true,
          fontSize: 28,
          offsetCenter: [0, '40%'],
          formatter: '{value}%',
          color: '#4285f4'
        },
        data: [{
          value: values[0] || 0,
          name: labels[0] || 'Progress'
        }]
      }]
    }
  }
  // Fallback for unknown types
  return {
    title: {
      text: 'Unsupported Chart Type',
      left: 'center',
      top: 'center'
    }
  }
}

// Watch for visibility and load existing data
watch(visible, (val) => {
  if (val && props.editMode && props.existingChart) {
    loadChartData(props.existingChart.option)
  }
})

// Load chart data from existing option
const loadChartData = (option) => {
  if (!option) return
  
  if (currentChartType.value === 'bar' || currentChartType.value === 'line' || currentChartType.value === 'area') {
    const xData = option.xAxis?.data || []
    const yData = option.series?.[0]?.data || []
    dataRows.value = xData.map((label, index) => ({
      label: label,
      value: yData[index] || 0
    }))
  } else if (currentChartType.value === 'pie' || currentChartType.value === 'funnel') {
    const pieData = option.series?.[0]?.data || []
    dataRows.value = pieData.map(item => ({
      label: item.name,
      value: item.value
    }))
  } else if (currentChartType.value === 'scatter') {
    const scatterData = option.series?.[0]?.data || []
    dataRows.value = scatterData.map((point, index) => ({
      label: `Point ${index + 1}`,
      value: Array.isArray(point) ? point[1] : point
    }))
  } else if (currentChartType.value === 'radar') {
    const radarIndicators = option.radar?.indicator || []
    const radarValues = option.series?.[0]?.data?.[0]?.value || []
    dataRows.value = radarIndicators.map((indicator, index) => ({
      label: indicator.name,
      value: radarValues[index] || 0
    }))
  } else if (currentChartType.value === 'gauge') {
    const gaugeData = option.series?.[0]?.data?.[0] || {}
    dataRows.value = [{
      label: gaugeData.name || 'Progress',
      value: gaugeData.value || 0
    }]
  }
}

// Handle confirm - emit data back
const handleConfirm = () => {
  const option = generateChartOption()
  emit('confirm', {
    type: currentChartType.value,
    option: option
  })
  visible.value = false
}

// Handle cancel
const handleCancel = () => {
  visible.value = false
}
</script>

<style scoped>
.chart-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.data-table {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
}

.data-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.add-row-btn {
  width: 100%;
  margin-top: 8px;
  border-top: 1px dashed #e5e7eb;
  border-radius: 0 0 6px 6px;
}

.chart-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}
</style>
