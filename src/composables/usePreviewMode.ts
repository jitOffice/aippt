import { ref, nextTick, Ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { applySuggestions } from './useAISuggestionApplier'
import type {
  UsePreviewModeParams,
  UsePreviewModeReturn,
  PreviewChangeData,
  SlideVisualData,
  VisualSlideDataMap
} from './types'

/**
 * Composable for managing preview mode functionality
 * Handles preview state, data backup/restore, and confirmation/cancellation
 * 
 * @param params - Configuration parameters
 * @returns Preview mode state and methods
 */
export function usePreviewMode({
  visualSlideData,
  currentSlideIndex,
  generateMarkdownFromVisual
}: UsePreviewModeParams): UsePreviewModeReturn {
  // Preview mode state
  const isPreviewMode: Ref<boolean> = ref(false)
  const previewOriginalData: Ref<SlideVisualData | null> = ref(null)
  const previewModifiedData: Ref<SlideVisualData | null> = ref(null)

  /**
   * Enter preview mode by applying AI suggestions without persisting
   * @param data - Preview data containing slideIndex and content
   */
  const handlePreviewChanges = (data: PreviewChangeData): void => {
    console.log('[usePreviewMode] Entering preview mode', data)
    
    const targetSlideKey = `slide-${data.slideIndex}`
    const currentData = visualSlideData.value[targetSlideKey]
    
    if (!currentData) {
      console.warn('[usePreviewMode] No visual data for slide', data.slideIndex)
      Message.warning('当前幻灯片没有数据，无法预览')
      return
    }
    
    try {
      // Save original data for restoration (deep clone)
      previewOriginalData.value = JSON.parse(JSON.stringify(currentData)) as SlideVisualData
      
      // Apply AI suggestions to create modified preview data
      const modifiedData = JSON.parse(JSON.stringify(currentData)) as SlideVisualData
      applySuggestions(modifiedData, data.content)
      previewModifiedData.value = modifiedData
      
      // Update visual data directly without triggering markdown conversion
      // This allows preview without persistence
      visualSlideData.value[targetSlideKey] = modifiedData
      
      // Force Vue reactivity by creating new object reference
      visualSlideData.value = { ...visualSlideData.value }
      
      // Enter preview mode
      isPreviewMode.value = true
      
      console.log('[usePreviewMode] Preview mode activated successfully')
      Message.info('📋 预览模式已激活')
    } catch (error) {
      console.error('[usePreviewMode] Error entering preview mode:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      Message.error(`进入预览模式失败: ${errorMessage}`)
    }
  }

  /**
   * Confirm preview and persist changes
   * Converts visual data to markdown and saves to backend
   */
  const confirmPreview = async (): Promise<void> => {
    console.log('[usePreviewMode] Confirming preview changes')
    
    try {
      // Changes are already applied to visualSlideData
      // Now trigger markdown regeneration and save
      await generateMarkdownFromVisual()
      
      // Exit preview mode and clean up state
      exitPreviewMode()
      
      Message.success('✅ 已应用 AI 建议到幻灯片')
    } catch (error) {
      console.error('[usePreviewMode] Error confirming preview:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      Message.error(`应用修改失败: ${errorMessage}`)
    }
  }

  /**
   * Cancel preview and restore original state
   * Reverts all visual changes without persisting
   */
  const cancelPreview = (): void => {
    console.log('[usePreviewMode] Canceling preview, restoring original state')
    
    if (!previewOriginalData.value) {
      console.warn('[usePreviewMode] No original data to restore')
      exitPreviewMode()
      return
    }
    
    try {
      // Restore original data directly to visualSlideData
      // Do NOT use handleVisualDataUpdate to avoid triggering markdown conversion
      const slideKey = `slide-${currentSlideIndex.value}`
      visualSlideData.value[slideKey] = JSON.parse(
        JSON.stringify(previewOriginalData.value)
      ) as SlideVisualData
      
      console.log('[usePreviewMode] Original data restored to slide:', slideKey)
      
      // Force Vue reactivity by creating new object reference
      visualSlideData.value = { ...visualSlideData.value }
      
      // Exit preview mode and clean up
      exitPreviewMode()
      
      Message.info('已取消预览并恢复原始状态')
      
      // Force reactivity update in next tick
      nextTick(() => {
        console.log('[usePreviewMode] Reactivity update completed, isPreviewMode:', isPreviewMode.value)
      })
    } catch (error) {
      console.error('[usePreviewMode] Error canceling preview:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      Message.error(`取消预览失败: ${errorMessage}`)
    }
  }

  /**
   * Exit preview mode and clean up state
   * Internal helper function
   */
  const exitPreviewMode = (): void => {
    isPreviewMode.value = false
    previewOriginalData.value = null
    previewModifiedData.value = null
    console.log('[usePreviewMode] Preview mode exited, state cleaned up')
  }

  /**
   * Check if currently in preview mode
   * @returns True if in preview mode
   */
  const isInPreviewMode = (): boolean => isPreviewMode.value

  /**
   * Get preview original data (for debugging/inspection)
   * @returns Original slide data or null
   */
  const getPreviewOriginalData = (): SlideVisualData | null => previewOriginalData.value

  /**
   * Get preview modified data (for debugging/inspection)
   * @returns Modified slide data or null
   */
  const getPreviewModifiedData = (): SlideVisualData | null => previewModifiedData.value

  return {
    // State
    isPreviewMode,
    previewOriginalData,
    previewModifiedData,
    
    // Actions
    handlePreviewChanges,
    confirmPreview,
    cancelPreview,
    
    // Utilities
    isInPreviewMode,
    getPreviewOriginalData,
    getPreviewModifiedData
  }
}
