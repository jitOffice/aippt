import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { usePreviewMode } from '../usePreviewMode'
import { Message } from '@arco-design/web-vue'
import { applySuggestions } from '../useAISuggestionApplier'
import type { VisualSlideDataMap, SlideVisualData } from '../types'

// Mock dependencies
vi.mock('@arco-design/web-vue', () => ({
  Message: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn()
  }
}))

vi.mock('../useAISuggestionApplier', () => ({
  applySuggestions: vi.fn((data: SlideVisualData) => {
    // Simulate applying suggestions by modifying data
    if (data.texts) {
      data.texts.push({ 
        id: 'new-text', 
        type: 'text',
        content: 'AI Generated Text',
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        fontSize: 16
      })
    }
  })
}))

describe('usePreviewMode', () => {
  let visualSlideData: ReturnType<typeof ref<VisualSlideDataMap>>
  let currentSlideIndex: ReturnType<typeof ref<number>>
  let generateMarkdownFromVisual: ReturnType<typeof vi.fn>
  let previewMode: ReturnType<typeof usePreviewMode>

  beforeEach(() => {
    // Setup test data
    visualSlideData = ref<VisualSlideDataMap>({
      'slide-0': {
        texts: [
          { 
            id: 'text-1', 
            type: 'text',
            content: 'Original Title', 
            fontSize: 32,
            x: 0,
            y: 0,
            width: 200,
            height: 50
          },
          { 
            id: 'text-2', 
            type: 'text',
            content: 'Original Body', 
            fontSize: 16,
            x: 0,
            y: 60,
            width: 300,
            height: 100
          }
        ],
        images: [],
        rectangles: [],
        circles: [],
        charts: []
      }
    })

    currentSlideIndex = ref(0)
    generateMarkdownFromVisual = vi.fn().mockResolvedValue(undefined)

    // Initialize composable
    previewMode = usePreviewMode({
      visualSlideData,
      currentSlideIndex,
      generateMarkdownFromVisual
    })

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with preview mode disabled', () => {
      expect(previewMode.isPreviewMode.value).toBe(false)
    })

    it('should initialize with null preview data', () => {
      expect(previewMode.previewOriginalData.value).toBeNull()
      expect(previewMode.previewModifiedData.value).toBeNull()
    })
  })

  describe('handlePreviewChanges', () => {
    it('should enter preview mode successfully', async () => {
      const previewData = {
        slideIndex: 0,
        content: 'AI suggestion content'
      }

      previewMode.handlePreviewChanges(previewData)

      expect(previewMode.isPreviewMode.value).toBe(true)
      expect(previewMode.previewOriginalData.value).not.toBeNull()
      expect(previewMode.previewOriginalData.value?.texts).toHaveLength(2)
      expect(Message.info).toHaveBeenCalledWith('📋 预览模式已激活')
    })

    it('should backup original data before modifying', () => {
      const originalTexts = [...visualSlideData.value['slide-0'].texts]
      
      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      const backedUpTexts = previewMode.previewOriginalData.value?.texts
      expect(backedUpTexts).toEqual(originalTexts)
    })

    it('should apply AI suggestions to visual data', () => {
      const initialTextCount = visualSlideData.value['slide-0'].texts.length

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      expect(applySuggestions).toHaveBeenCalled()
      expect(visualSlideData.value['slide-0'].texts.length).toBeGreaterThan(initialTextCount)
    })

    it('should show warning when slide data not found', () => {
      previewMode.handlePreviewChanges({
        slideIndex: 999,
        content: 'AI suggestion'
      })

      expect(Message.warning).toHaveBeenCalledWith('当前幻灯片没有数据，无法预览')
      expect(previewMode.isPreviewMode.value).toBe(false)
    })

    it('should handle errors gracefully', () => {
      // Mock applySuggestions to throw error
      vi.mocked(applySuggestions).mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      expect(Message.error).toHaveBeenCalled()
      expect(previewMode.isPreviewMode.value).toBe(false)
    })
  })

  describe('confirmPreview', () => {
    beforeEach(() => {
      // Enter preview mode first
      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })
      vi.clearAllMocks()
    })

    it('should persist changes by calling generateMarkdownFromVisual', async () => {
      await previewMode.confirmPreview()

      expect(generateMarkdownFromVisual).toHaveBeenCalled()
      expect(Message.success).toHaveBeenCalledWith('✅ 已应用 AI 建议到幻灯片')
    })

    it('should exit preview mode after confirmation', async () => {
      await previewMode.confirmPreview()

      expect(previewMode.isPreviewMode.value).toBe(false)
      expect(previewMode.previewOriginalData.value).toBeNull()
      expect(previewMode.previewModifiedData.value).toBeNull()
    })

    it('should handle save errors gracefully', async () => {
      generateMarkdownFromVisual.mockRejectedValueOnce(new Error('Save failed'))

      await previewMode.confirmPreview()

      expect(Message.error).toHaveBeenCalled()
    })
  })

  describe('cancelPreview', () => {
    beforeEach(() => {
      // Enter preview mode first
      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })
      vi.clearAllMocks()
    })

    it('should restore original data', async () => {
      const originalTextCount = previewMode.previewOriginalData.value?.texts.length || 0
      const modifiedTextCount = visualSlideData.value['slide-0'].texts.length
      
      expect(modifiedTextCount).toBeGreaterThan(originalTextCount)

      previewMode.cancelPreview()
      await nextTick()

      expect(visualSlideData.value['slide-0'].texts.length).toBe(originalTextCount)
      expect(Message.info).toHaveBeenCalledWith('已取消预览并恢复原始状态')
    })

    it('should exit preview mode after cancellation', async () => {
      previewMode.cancelPreview()
      await nextTick()

      expect(previewMode.isPreviewMode.value).toBe(false)
      expect(previewMode.previewOriginalData.value).toBeNull()
      expect(previewMode.previewModifiedData.value).toBeNull()
    })

    it('should not call generateMarkdownFromVisual on cancel', () => {
      previewMode.cancelPreview()

      expect(generateMarkdownFromVisual).not.toHaveBeenCalled()
    })

    it('should handle missing original data gracefully', () => {
      previewMode.previewOriginalData.value = null

      previewMode.cancelPreview()

      expect(previewMode.isPreviewMode.value).toBe(false)
      // Should not crash
    })
  })

  describe('Utility Methods', () => {
    it('isInPreviewMode should return correct state', () => {
      expect(previewMode.isInPreviewMode()).toBe(false)

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      expect(previewMode.isInPreviewMode()).toBe(true)
    })

    it('getPreviewOriginalData should return backed up data', () => {
      expect(previewMode.getPreviewOriginalData()).toBeNull()

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      const originalData = previewMode.getPreviewOriginalData()
      expect(originalData).not.toBeNull()
      expect(originalData?.texts).toHaveLength(2)
    })

    it('getPreviewModifiedData should return modified data', () => {
      expect(previewMode.getPreviewModifiedData()).toBeNull()

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      const modifiedData = previewMode.getPreviewModifiedData()
      expect(modifiedData).not.toBeNull()
      expect(modifiedData?.texts.length).toBeGreaterThan(2)
    })
  })

  describe('Data Isolation', () => {
    it('should not mutate original data directly', () => {
      const originalDataCopy = JSON.parse(JSON.stringify(visualSlideData.value['slide-0']))

      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      const backedUpData = previewMode.previewOriginalData.value
      expect(backedUpData?.texts[0].id).toBe(originalDataCopy.texts[0].id)
      expect(backedUpData?.texts[0].content).toBe(originalDataCopy.texts[0].content)
    })

    it('should use deep cloning for data backup', () => {
      previewMode.handlePreviewChanges({
        slideIndex: 0,
        content: 'AI suggestion'
      })

      const originalData = previewMode.previewOriginalData.value
      const modifiedData = visualSlideData.value['slide-0']

      // Modify current data
      modifiedData.texts[0].content = 'Changed After Backup'

      // Original backup should not change
      expect(originalData?.texts[0].content).toBe('Original Title')
    })
  })
})
