import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { parseMarkdownToVisual, convertVisualToMarkdown } from '../utils/slide/markdownVisualConverter'
import type { ParsedSlide } from './useSlideOperations'

export interface VisualData {
  texts: any[]
  images: any[]
  rectangles: any[]
  circles: any[]
  charts: any[]
  videos?: any[]
  tables?: any[]
  shapes?: any[]
}

export function useVisualDataManager(
  parsedSlides: ComputedRef<ParsedSlide[]>,
  currentSlideIndex: Ref<number>,
  markdownContent: Ref<string>,
  currentThemeStyle: ComputedRef<any>
) {
  const visualSlideData = ref<Record<string, VisualData>>({})

  // Get or create visual data for current slide
  const currentVisualData = computed(() => {
    const slideKey = `slide-${currentSlideIndex.value}`
    
    if (!visualSlideData.value[slideKey]) {
      // Parse markdown content to visual components
      const slide = parsedSlides.value[currentSlideIndex.value]
      
      if (slide && slide.raw) {
        // Pass theme color to converter
        const themeColor = currentThemeStyle.value?.color || '#333'
        const parsed = parseMarkdownToVisual(slide.raw, themeColor)
        visualSlideData.value[slideKey] = parsed
        console.log('[useVisualDataManager] Parsed slide', currentSlideIndex.value, ':', {
          slideKey,
          raw: slide.raw.substring(0, 100),
          parsed
        })
      } else {
        // Empty state for non-markdown slides
        visualSlideData.value[slideKey] = {
          texts: [],
          images: [],
          rectangles: [],
          circles: [],
          charts: [],
          videos: [],
          tables: []
        }
        console.warn('[useVisualDataManager] Empty visual data for slide', currentSlideIndex.value, 'slide:', slide)
      }
    }
    return visualSlideData.value[slideKey]
  })

  // Get visual data for a specific slide (for thumbnails)
  const getSlideVisualData = (index: number): VisualData => {
    const slideKey = `slide-${index}`
    
    // If visual data already exists, return it
    if (visualSlideData.value[slideKey]) {
      return visualSlideData.value[slideKey]
    }
    
    // Otherwise, parse the slide's markdown to create visual data
    const slide = parsedSlides.value[index]
    if (slide && slide.raw) {
      const themeColor = currentThemeStyle.value?.color || '#333'
      const parsed = parseMarkdownToVisual(slide.raw, themeColor)
      visualSlideData.value[slideKey] = parsed
      return parsed
    }
    
    // Empty fallback
    return {
      texts: [],
      images: [],
      rectangles: [],
      circles: [],
      charts: [],
      videos: [],
      tables: []
    }
  }

  // Handle visual editor data updates
  const handleVisualDataUpdate = (newData: VisualData) => {
    const slideKey = `slide-${currentSlideIndex.value}`
    
    // Mark that we're updating this slide
    isUpdatingSlide = true
    updatingSlideKey = slideKey
    
    visualSlideData.value[slideKey] = newData
    
    console.log('[Visual→Markdown] Converting visual data:', {
      texts: newData.texts?.length || 0,
      rectangles: newData.rectangles?.length || 0,
      circles: newData.circles?.length || 0,
      images: newData.images?.length || 0,
      charts: newData.charts?.length || 0,
      videos: newData.videos?.length || 0,
      tables: newData.tables?.length || 0
    })
    
    // Convert visual components back to markdown
    const markdownText = convertVisualToMarkdown(newData)
    
    // Debug: check table markers in generated markdown
    const tableMarkersInGenerated = (markdownText.match(/<!-- TABLE -->/g) || []).length
    console.log('[Visual→Markdown] Generated markdown for slide', currentSlideIndex.value, 'contains', tableMarkersInGenerated, 'TABLE markers')
    
    // Show where the TABLE markers are in the markdown
    if (tableMarkersInGenerated > 0) {
      const tableSection = markdownText.substring(markdownText.indexOf('<!-- TABLE'))
      console.log('[Visual→Markdown] TABLE section:', tableSection.substring(0, 500))
    }
    
    // Update the markdown content for current slide
    const slides = markdownContent.value.split('---').filter(s => s.trim())
    if (slides[currentSlideIndex.value]) {
      slides[currentSlideIndex.value] = markdownText
      
      const updatedMarkdown = slides.join('\n\n---\n\n')
      
      // Debug: check table markers in final markdown
      const tableMarkersInFinal = (updatedMarkdown.match(/<!-- TABLE -->/g) || []).length
      console.log('[Visual→Markdown] Final markdown contains', tableMarkersInFinal, 'TABLE markers')
      
      markdownContent.value = updatedMarkdown
      
      console.log('[Visual→Markdown] Updated slide', currentSlideIndex.value)
    }
    
    // Allow cache clear after a short delay
    setTimeout(() => {
      isUpdatingSlide = false
      updatingSlideKey = ''
    }, 100)
  }

  // Track which slide is being updated to prevent cache clear
  let isUpdatingSlide = false
  let updatingSlideKey = ''

  // Clear visual data cache when markdown content changes (e.g., after loading from server)
  watch(() => markdownContent.value, (newVal, oldVal) => {
    // Don't clear cache if we're in the middle of an update
    if (isUpdatingSlide) {
      console.log('[useVisualDataManager] Skipping cache clear - update in progress for', updatingSlideKey)
      return
    }
    
    console.log('[useVisualDataManager] Markdown content changed, clearing visual cache')
    console.log('[useVisualDataManager] Markdown change length:', oldVal?.length, '->', newVal?.length)
    visualSlideData.value = {}
  })

  // Clear all visual data cache
  const clearVisualCache = () => {
    visualSlideData.value = {}
  }

  return {
    visualSlideData,
    currentVisualData,
    getSlideVisualData,
    handleVisualDataUpdate,
    clearVisualCache
  }
}
