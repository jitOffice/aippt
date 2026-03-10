import { ref, computed, type Ref } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'

export interface ParsedSlide {
  type: 'markdown' | 'chart'
  content?: string
  raw: string
  option?: any
}

export function useSlideOperations(
  markdownContent: Ref<string>,
  t: (key: string, params?: any) => string
) {
  const currentSlideIndex = ref(0)
  const isAddingSlide = ref(false)

  // Parse slides from markdown
  const parsedSlides = computed(() => {
    if (!markdownContent.value) return []
    
    const slides = markdownContent.value.split('---').filter(s => s.trim())
    const parsed = slides.map((slideContent, index) => {
      let trimmed = slideContent.trim()
      
      // Remove metadata lines (theme: xxx, layout: xxx, etc.)
      trimmed = trimmed.replace(/^(theme|layout|background|class):\s*.+$/gm, '').trim()
      
      // Check if this slide contains a chart marker
      const chartMarker = trimmed.match(/<!-- CHART:(\w+) -->/)   
      
      if (chartMarker) {
        // Extract JSON after the marker (can be on same line or next lines)
        const afterMarker = trimmed.substring(trimmed.indexOf(chartMarker[0]) + chartMarker[0].length).trim()
        
        try {
          // Try to parse as JSON
          const jsonMatch = afterMarker.match(/^\{[\s\S]*?\}(?=\n---|$)/)
          if (jsonMatch) {
            const chartOption = JSON.parse(jsonMatch[0])
            const result: ParsedSlide = {
              type: 'chart',
              option: chartOption,
              raw: trimmed
            }
            console.log(`[Slide ${index + 1}] Chart detected with option:`, chartOption)
            return result
          }
        } catch (e) {
          console.warn(`[Slide ${index + 1}] Failed to parse chart JSON:`, e)
        }
      }
      
      return {
        type: 'markdown',
        content: trimmed,
        raw: trimmed
      } as ParsedSlide
    })
    
    console.log('[useSlideOperations] Parsed slides:', parsed.length, 'slides')
    return parsed
  })

  const currentSlide = computed(() => parsedSlides.value[currentSlideIndex.value])

  const prevSlide = () => {
    if (currentSlideIndex.value > 0) {
      currentSlideIndex.value--
    }
  }

  const nextSlide = () => {
    if (currentSlideIndex.value < parsedSlides.value.length - 1) {
      currentSlideIndex.value++
    }
  }

  const addNewSlide = async () => {
    isAddingSlide.value = true
    try {
      // Simulate a brief delay to show loading state (optional)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      markdownContent.value += '\n\n---\n\n## New Slide\n\n- Add your content here'
      currentSlideIndex.value = parsedSlides.value.length - 1
    } finally {
      isAddingSlide.value = false
    }
  }

  // Handle slide reordering via drag & drop
  const handleSlideReorder = ({ from, to }: { from: number; to: number }) => {
    const slides = [...parsedSlides.value]
    const [movedSlide] = slides.splice(from, 1)
    slides.splice(to, 0, movedSlide)
    
    // Rebuild markdown from reordered slides
    const newMarkdown = slides.map((slide, idx) => {
      if (idx === 0) {
        // First slide (no separator before it)
        return slide.content || slide.raw
      } else {
        // Subsequent slides (add --- separator)
        return slide.content || slide.raw
      }
    }).join('\n\n---\n\n')
    
    markdownContent.value = newMarkdown
    
    // Update current index if needed
    if (currentSlideIndex.value === from) {
      currentSlideIndex.value = to
    } else if (from < currentSlideIndex.value && to >= currentSlideIndex.value) {
      currentSlideIndex.value--
    } else if (from > currentSlideIndex.value && to <= currentSlideIndex.value) {
      currentSlideIndex.value++
    }
  }

  // Handle slide copy from context menu
  const handleCopySlide = (index: number) => {
    console.log('[useSlideOperations] Copying slide at index', index)
    
    const slides = [...parsedSlides.value]
    const slideToCopy = slides[index]
    
    if (!slideToCopy) {
      console.warn('[useSlideOperations] Cannot copy slide: invalid index', index)
      Message.error('Cannot copy slide')
      return
    }
    
    // Create a copy of the slide
    const copiedSlide = {
      ...slideToCopy,
      content: slideToCopy.content,
      raw: slideToCopy.raw
    }
    
    // Insert after the original slide
    slides.splice(index + 1, 0, copiedSlide)
    
    // Update markdown content
    const newMarkdown = slides.map((slide, idx) => {
      if (idx === 0) {
        return slide.content || slide.raw
      } else {
        return slide.content || slide.raw
      }
    }).join('\n\n---\n\n')
    
    markdownContent.value = newMarkdown
    
    // Move to the copied slide
    currentSlideIndex.value = index + 1
    
    Message.success(t('slide.messages.slideCopied'))
  }

  // Handle slide deletion from context menu
  const handleDeleteSlide = (index: number) => {
    console.log('[useSlideOperations] Deleting slide at index', index)
    
    const slides = [...parsedSlides.value]
    
    if (slides.length <= 1) {
      Message.warning(t('slide.messages.cannotDeleteLastSlide'))
      return
    }
    
    if (index < 0 || index >= slides.length) {
      console.warn('[useSlideOperations] Cannot delete slide: invalid index', index)
      Message.error('Cannot delete slide')
      return
    }
    
    // Show confirmation dialog
    Modal.confirm({
      title: t('slide.messages.confirmDeleteSlide'),
      content: t('slide.messages.deleteSlideWarning'),
      okText: t('slide.messages.delete'),
      cancelText: t('slide.messages.cancel'),
      onOk: () => {
        // Remove the slide
        slides.splice(index, 1)
        
        // Update markdown content
        const newMarkdown = slides.map((slide, idx) => {
          if (idx === 0) {
            return slide.content || slide.raw
          } else {
            return slide.content || slide.raw
          }
        }).join('\n\n---\n\n')
        
        markdownContent.value = newMarkdown
        
        // Adjust current slide index
        if (currentSlideIndex.value > index) {
          currentSlideIndex.value--
        } else if (currentSlideIndex.value >= slides.length) {
          currentSlideIndex.value = slides.length - 1
        }
        
        Message.success(t('slide.messages.slideDeleted'))
      }
    })
  }

  const deleteCurrentSlide = () => {
    if (parsedSlides.value.length === 0) return
    
    const slides = markdownContent.value.split('---').filter(s => s.trim())
    
    if (slides.length <= 1) {
      Message.warning(t('slide.cannotDeleteLast'))
      return
    }
    
    // Show confirmation dialog
    Modal.confirm({
      title: t('slide.deleteConfirm.title'),
      content: t('slide.deleteConfirm.content', { index: currentSlideIndex.value + 1 }),
      okText: t('common.delete'),
      cancelText: t('common.cancel'),
      onOk: () => {
        // Remove the current slide
        slides.splice(currentSlideIndex.value, 1)
        
        // Rebuild markdown content
        markdownContent.value = slides.join('\n\n---\n\n')
        
        // Adjust current index if necessary
        if (currentSlideIndex.value >= slides.length) {
          currentSlideIndex.value = slides.length - 1
        }
        
        Message.success(t('slide.deleted'))
      }
    })
  }

  return {
    currentSlideIndex,
    parsedSlides,
    currentSlide,
    prevSlide,
    nextSlide,
    addNewSlide,
    isAddingSlide,
    handleSlideReorder,
    handleCopySlide,
    handleDeleteSlide,
    deleteCurrentSlide
  }
}
