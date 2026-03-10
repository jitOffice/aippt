import { Message } from '@arco-design/web-vue'
import type { ComputedRef, Ref } from 'vue'
import type { VisualData } from './useVisualDataManager'
import { applySuggestions } from './useAISuggestionApplier'

export function useChatIntegration(
  currentVisualData: ComputedRef<VisualData>,
  currentThemeStyle: ComputedRef<any>,
  currentSlideIndex: Ref<number>,
  visualSlideData: Ref<Record<string, VisualData>>,
  handleVisualDataUpdate: (data: VisualData) => void,
  selectTheme: (theme: string) => void,
  applyTextWithSmartLineBreaking: (text: string, visualData: VisualData) => void,
  t: (key: string, params?: any) => string
) {

  const handleChatSendMessage = (data: any) => {
    console.log('[handleChatSendMessage] Received data:', data)
    
    switch (data.action) {
      // ========== NEW AGENT SKILLS ACTIONS ==========
      case 'add-image':
        if (data.payload && data.payload.src) {
          addImageToSlide(data.payload)
        } else if (data.description) {
          addImageBasedOnDescription(data.description)
        }
        break
        
      case 'replace-text':
        if (data.payload) {
          const applyLayout = data.applyLayout || false
          replaceSlideText(data.payload, applyLayout)
        }
        break
        
      case 'add-chart':
        if (data.payload && data.payload.echartOption) {
          addChartFromEChartOption(data.payload)
        } else if (data.payload && data.payload.chartXml) {
          addChartToSlide(data.payload)
        } else if (data.chartData) {
          addChartFromAI(data.chartData, data.slideIndex)
        }
        break
        
      case 'update-layout':
        if (data.payload && data.payload.layout) {
          updateSlideLayout(data.payload.layout)
        } else if (data.payload && data.payload.layoutType) {
          applyIntelligentLayout(data.payload)
        }
        break
      
      // ========== LEGACY ACTIONS ==========
      case 'apply-theme':
        selectTheme(data.theme)
        break
      case 'center-content':
        centerSlideContent()
        break
      case 'add-title':
        addTitleAtTop()
        break
      case 'move-title':
        moveTitleUp()
        break
      case 'adjust-text-size':
        if (data.adjustment === 'increase') {
          increaseTextSize()
        } else if (data.adjustment === 'decrease') {
          decreaseTextSize()
        }
        break
      case 'highlight-text':
        highlightImportantText()
        break
      case 'create-chart':
        createChartFromData(data.numbers)
        break
      case 'navigate-slide':
        if (data.direction === 'next') {
          goToNextSlide()
        } else if (data.direction === 'previous') {
          goToPrevSlide()
        } else if (data.targetIndex !== undefined) {
          currentSlideIndex.value = data.targetIndex
        }
        break
      case 'apply-suggestion':
        applySuggestionToSlide(data.content, data.slideIndex)
        break
      default:
        console.log('Unknown action:', data.action)
    }
  }

  // ========== LEGACY HELPER FUNCTIONS ==========
  
  const centerSlideContent = () => {
    const currentData = currentVisualData.value
    
    if (currentData.texts) {
      currentData.texts.forEach(text => {
        text.x = (960 - text.width) / 2
      })
    }
    
    handleVisualDataUpdate(currentData)
  }

  const addTitleAtTop = () => {
    const currentData = currentVisualData.value
    if (!currentData.texts) currentData.texts = []
    
    const newTitle = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 50,
      y: 50,
      width: 860,
      height: 60,
      content: 'New Title',
      fontSize: 36,
      fontWeight: 'bold',
      fill: currentThemeStyle.value?.color || '#333',
      textAlign: 'center'
    }
    
    currentData.texts.push(newTitle)
    handleVisualDataUpdate(currentData)
  }

  const moveTitleUp = () => {
    const currentData = currentVisualData.value
    
    if (currentData.texts) {
      currentData.texts.forEach(text => {
        if (text.fontSize > 24 || text.content?.toLowerCase().includes('title')) {
          text.y = Math.max(20, text.y - 30)
        }
      })
      
      handleVisualDataUpdate(currentData)
    }
  }

  const increaseTextSize = () => {
    const currentData = currentVisualData.value
    
    if (currentData.texts) {
      currentData.texts.forEach(text => {
        text.fontSize = (text.fontSize || 16) + 4
      })
      
      handleVisualDataUpdate(currentData)
    }
  }

  const decreaseTextSize = () => {
    const currentData = currentVisualData.value
    
    if (currentData.texts) {
      currentData.texts.forEach(text => {
        text.fontSize = Math.max(12, (text.fontSize || 16) - 4)
      })
      
      handleVisualDataUpdate(currentData)
    }
  }

  const highlightImportantText = () => {
    const currentData = currentVisualData.value
    
    if (currentData.texts) {
      currentData.texts.forEach(text => {
        if (text.fontWeight === 'bold' || text.fontSize > 20 || 
            /important|key|critical|essential|main|primary/.test(text.content?.toLowerCase() || '')) {
          text.fill = '#FF6B6B'
          text.backgroundColor = 'rgba(255, 215, 0, 0.3)'
        }
      })
      
      handleVisualDataUpdate(currentData)
    }
  }

  const createChartFromData = (numbers: number[]) => {
    if (numbers && numbers.length >= 2) {
      const newChart = {
        id: `chart-${Date.now()}`,
        type: 'bar',
        x: 100,
        y: 150,
        width: 760,
        height: 300,
        data: {
          labels: numbers.map((_, i) => `Item ${i+1}`),
          datasets: [{
            label: 'Data from slide',
            data: numbers.map(n => parseFloat(n.toString()))
          }]
        }
      }
      
      const currentData = currentVisualData.value
      if (!currentData.charts) currentData.charts = []
      currentData.charts.push(newChart)
      
      handleVisualDataUpdate(currentData)
    }
  }

  const goToNextSlide = () => {
    // This should be handled by parent
    console.log('[useChatIntegration] Navigate next slide')
  }

  const goToPrevSlide = () => {
    // This should be handled by parent
    console.log('[useChatIntegration] Navigate prev slide')
  }

  // ========== NEW AGENT SKILLS HANDLERS ==========

  const addImageToSlide = (payload: any) => {
    console.log('[addImageToSlide] Adding image:', payload)
    
    const imageObj = new window.Image()
    
    imageObj.onload = () => {
      console.log('[addImageToSlide] Image loaded successfully')
      
      let width = payload.width || 400
      let height = payload.height || 300
      
      if (imageObj.naturalWidth && imageObj.naturalHeight) {
        const aspectRatio = imageObj.naturalWidth / imageObj.naturalHeight
        const requestedRatio = width / height
        
        if (Math.abs(aspectRatio - requestedRatio) > 0.1) {
          if (aspectRatio > requestedRatio) {
            height = width / aspectRatio
          } else {
            width = height * aspectRatio
          }
        }
      }
      
      const newImage = {
        id: `img-${Date.now()}`,
        type: 'image',
        x: payload.x || 100,
        y: payload.y || 100,
        width: width,
        height: height,
        image: imageObj,
        src: payload.src,
        draggable: true,
        name: `image-${Date.now()}`,
        __zIndex: 100
      }
      
      const currentData = currentVisualData.value
      if (!currentData.images) currentData.images = []
      currentData.images.push(newImage)
      
      console.log('[addImageToSlide] Updated visual data:', {
        totalImages: currentData.images.length,
        newImage: {
          id: newImage.id,
          x: newImage.x,
          y: newImage.y,
          width: newImage.width,
          height: newImage.height,
          hasImageObject: !!newImage.image
        }
      })
      
      handleVisualDataUpdate(currentData)
      Message.success(t('slide.imageAdded') || 'Image added successfully!')
    }
    
    imageObj.onerror = (error) => {
      console.error('[addImageToSlide] Image load error:', error)
      console.error('[addImageToSlide] Failed URL:', payload.src)
      
      Message.error(
        t('slide.imageLoadFailed') || 
        'Failed to load image. The image URL may be blocked by CORS policy.'
      )
    }
    
    imageObj.src = payload.src
  }

  const addImageBasedOnDescription = (description: string) => {
    const newImage = {
      id: `img-${Date.now()}`,
      type: 'image',
      x: 330,
      y: 170,
      width: 300,
      height: 200,
      src: '/placeholder-image.jpg',
      alt: description
    }
    
    const currentData = currentVisualData.value
    if (!currentData.images) currentData.images = []
    currentData.images.push(newImage)
    
    handleVisualDataUpdate(currentData)
  }

  const addChartFromEChartOption = (payload: any) => {
    console.log('[addChartFromEChartOption] Adding chart:', payload)
    
    try {
      const newChart = {
        id: `chart-${Date.now()}`,
        type: 'echarts',
        x: payload.x || 100,
        y: payload.y || 150,
        width: payload.width || 600,
        height: payload.height || 400,
        option: payload.echartOption,
        draggable: true,
        __zIndex: 100
      }
      
      const currentData = currentVisualData.value
      if (!currentData.charts) currentData.charts = []
      currentData.charts.push(newChart)
      
      console.log('[addChartFromEChartOption] Updated visual data:', {
        totalCharts: currentData.charts.length,
        newChart: {
          id: newChart.id,
          x: newChart.x,
          y: newChart.y,
          width: newChart.width,
          height: newChart.height
        }
      })
      
      handleVisualDataUpdate(currentData)
      Message.success(t('slide.chartAdded') || 'Chart added successfully!')
    } catch (error) {
      console.error('[addChartFromEChartOption] Failed to add chart:', error)
      Message.error(t('slide.chartError') || 'Failed to add chart')
    }
  }

  const addChartToSlide = (payload: any) => {
    console.log('[addChartToSlide] Adding chart:', payload)
    
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(payload.chartXml, 'text/xml')
      
      const chartElement = xmlDoc.querySelector('chart')
      if (!chartElement) {
        throw new Error('Invalid chart XML: missing <chart> element')
      }
      
      const chartType = chartElement.getAttribute('type') || 'bar'
      const title = chartElement.querySelector('title')?.textContent || ''
      
      const series = Array.from(xmlDoc.querySelectorAll('series')).map(s => ({
        name: s.getAttribute('name') || '',
        data: s.textContent.split(',').map(v => parseFloat(v.trim()))
      }))
      
      const categories = xmlDoc.querySelector('xAxis categories')?.textContent.split(',').map(c => c.trim()) || []
      
      const newChart = {
        id: `chart-${Date.now()}`,
        type: 'echarts',
        x: 100,
        y: 150,
        width: 760,
        height: 400,
        config: {
          title: { text: title },
          tooltip: {},
          xAxis: { data: categories },
          yAxis: {},
          series: series.map(s => ({
            name: s.name,
            type: chartType,
            data: s.data
          }))
        }
      }
      
      const currentData = currentVisualData.value
      if (!currentData.charts) currentData.charts = []
      currentData.charts.push(newChart)
      
      handleVisualDataUpdate(currentData)
      Message.success(t('slide.chartAdded') || 'Chart added successfully!')
    } catch (error) {
      console.error('[addChartToSlide] Error:', error)
      Message.error(t('slide.chartError') || 'Failed to add chart')
    }
  }

  const addChartFromAI = (chartDataXML: string, slideIndex: number) => {
    console.log('[addChartFromAI] Adding chart to slide', slideIndex)
    console.log('[addChartFromAI] Chart XML:', chartDataXML)
    
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(chartDataXML, 'text/xml')
      
      const parseError = xmlDoc.getElementsByTagName('parsererror')
      if (parseError.length > 0) {
        console.error('[addChartFromAI] XML parsing error:', parseError[0].textContent)
        return
      }
      
      const chartElement = xmlDoc.getElementsByTagName('chart')[0]
      if (!chartElement) {
        console.error('[addChartFromAI] No <chart> element found in XML')
        return
      }
      
      const title = chartElement.getAttribute('title') || 'AI Generated Chart'
      const xLabelsStr = chartElement.getAttribute('x_labels') || ''
      const valuesStr = chartElement.getAttribute('values') || ''
      const colorsStr = chartElement.getAttribute('colors') || ''
      
      const xLabels = xLabelsStr.split(',').map(s => s.trim())
      const values = valuesStr.split(',').map(s => parseFloat(s.trim()))
      const colors = colorsStr.split(',').map(s => s.trim())
      
      console.log('[addChartFromAI] Parsed chart data:', { title, xLabels, values, colors })
      
      const newChart = {
        id: `chart-${Date.now()}`,
        type: 'bar',
        title: title,
        x: 100,
        y: 150,
        width: 760,
        height: 400,
        data: {
          labels: xLabels,
          datasets: [{
            label: title,
            data: values,
            backgroundColor: colors.length > 0 ? colors : ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: title
            }
          }
        }
      }
      
      const targetSlideKey = `slide-${slideIndex}`
      if (!visualSlideData.value[targetSlideKey]) {
        visualSlideData.value[targetSlideKey] = {
          texts: [],
          images: [],
          rectangles: [],
          circles: [],
          charts: []
        }
      }
      
      visualSlideData.value[targetSlideKey].charts.push(newChart)
      
      console.log('[addChartFromAI] Chart added successfully:', newChart)
      
      handleVisualDataUpdate(visualSlideData.value[targetSlideKey])
      
    } catch (error) {
      console.error('[addChartFromAI] Error adding chart:', error)
    }
  }

  const stripMarkdown = (text: string): string => {
    if (!text) return ''
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/(?<!^|\s)\*([^*]+)\*(?!\s|$)/g, '$1')
      .replace(/(?<!^|\s)_([^_]+)_(?!\s|$)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^#{1,6}\s+(.+)$/gm, '$1')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }

  const replaceSlideText = (payload: any, applyLayout: boolean = false) => {
    console.log('[replaceSlideText] Replacing text:', { payload, applyLayout })
    
    const currentData = currentVisualData.value
    
    if (!currentData.texts || currentData.texts.length === 0) {
      console.warn('[replaceSlideText] No text elements found on slide')
      Message.warning('当前幻灯片没有文本元素')
      return
    }
    
    const newText = payload.newText || ''
    const cleanedText = stripMarkdown(newText)
    
    if (applyLayout && payload.recommendedLayout) {
      console.log('[replaceSlideText] Applying layout:', payload.recommendedLayout)
      // applySmartLayoutWithText would be called here if available
    } else {
      console.log('[replaceSlideText] Applying text without layout (smart line breaking)')
      applyTextWithSmartLineBreaking(cleanedText, currentData)
    }
    
    handleVisualDataUpdate(currentData)
    Message.success(t('slide.textUpdated') || 'Text updated successfully!')
  }

  const updateSlideLayout = (layout: any[]) => {
    console.log('[updateSlideLayout] Updating layout:', layout)
    
    const currentData = currentVisualData.value
    
    layout.forEach(adjustment => {
      if (currentData.texts) {
        const textElement = currentData.texts.find(t => t.id === adjustment.id)
        if (textElement) {
          if (adjustment.x !== undefined) textElement.x = adjustment.x
          if (adjustment.y !== undefined) textElement.y = adjustment.y
          if (adjustment.width !== undefined) textElement.width = adjustment.width
          if (adjustment.height !== undefined) textElement.height = adjustment.height
          return
        }
      }
      
      if (currentData.images) {
        const imageElement = currentData.images.find((img: any) => img.id === adjustment.id)
        if (imageElement) {
          if (adjustment.x !== undefined) imageElement.x = adjustment.x
          if (adjustment.y !== undefined) imageElement.y = adjustment.y
          if (adjustment.width !== undefined) imageElement.width = adjustment.width
          if (adjustment.height !== undefined) imageElement.height = adjustment.height
          return
        }
      }
      
      if (currentData.charts) {
        const chartElement = currentData.charts.find((c: any) => c.id === adjustment.id)
        if (chartElement) {
          if (adjustment.x !== undefined) chartElement.x = adjustment.x
          if (adjustment.y !== undefined) chartElement.y = adjustment.y
          if (adjustment.width !== undefined) chartElement.width = adjustment.width
          if (adjustment.height !== undefined) chartElement.height = adjustment.height
          return
        }
      }
      
      if (currentData.rectangles) {
        const rectElement = currentData.rectangles.find((r: any) => r.id === adjustment.id)
        if (rectElement) {
          if (adjustment.x !== undefined) rectElement.x = adjustment.x
          if (adjustment.y !== undefined) rectElement.y = adjustment.y
          if (adjustment.width !== undefined) rectElement.width = adjustment.width
          if (adjustment.height !== undefined) rectElement.height = adjustment.height
        }
      }
    })
    
    handleVisualDataUpdate(currentData)
    Message.success(t('slide.layoutUpdated') || 'Layout optimized successfully!')
  }

  const applyIntelligentLayout = (payload: any) => {
    console.log('[applyIntelligentLayout] Applying intelligent layout:', payload)
    
    Message.info('Intelligent layout application - to be implemented')
  }

  const applySuggestionToSlide = (suggestionContent: string, slideIndex: number) => {
    console.log('[applySuggestionToSlide] Applying suggestion to slide', slideIndex)
    console.log('[applySuggestionToSlide] Content:', suggestionContent)
    
    const targetSlideKey = `slide-${slideIndex}`
    const currentData = visualSlideData.value[targetSlideKey]
    
    if (!currentData) {
      console.warn('[applySuggestionToSlide] No visual data for slide', slideIndex)
      return
    }
    
    try {
      const updatedData = applySuggestions(currentData, suggestionContent)
      handleVisualDataUpdate(updatedData)
      console.log('[applySuggestionToSlide] Suggestions applied successfully')
    } catch (error) {
      console.error('[applySuggestionToSlide] Error applying suggestions:', error)
    }
  }

  return {
    handleChatSendMessage
  }
}
