/**
 * Intelligent Layout Skill
 * AI-powered layout recommendation and application based on slide content analysis
 */

import type { Skill, SkillMetadata, SkillParams, SkillResult } from '../SkillRegistry'
import { streamGenerate } from '@/utils/ai/index'

/**
 * Content Analysis Result
 */
interface ContentAnalysis {
  contentType: 'list' | 'comparison' | 'process' | 'feature-grid' | 'text-heavy' | 'mixed'
  itemCount: number
  hasTitle: boolean
  hasImages: boolean
  hasCharts: boolean
  structure: {
    sections: Array<{
      title: string
      items: string[]
    }>
  }
  recommendedLayout: {
    type: 'bullets' | 'boxes' | 'columns'
    variant: string
    reason: string
  }
}

export class IntelligentLayoutSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'intelligent-layout',
    name: 'Intelligent Layout',
    description: 'AI-powered layout recommendation and application based on content analysis',
    category: 'layout',
    provider: 'MiniMax',
    keywords: ['智能布局', '自动布局', '优化布局', '调整布局', '重新布局', 'layout', 'organize', 'arrange'],
    examples: [
      '帮我智能布局',
      '自动优化这个页面布局',
      '根据内容调整布局',
      '重新排版',
      'organize this slide intelligently'
    ]
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    try {
      const { visualData, slideContent } = params.context
      
      console.log('[IntelligentLayoutSkill] Analyzing content for intelligent layout...')
      
      // Step 1: Analyze slide content
      const analysis = await this.analyzeSlideContent(visualData, slideContent || '')
      
      console.log('[IntelligentLayoutSkill] Content analysis:', analysis)
      
      // Step 2: Generate optimized layout based on analysis
      const layoutActions = this.generateLayoutActions(analysis, visualData)
      
      return {
        success: true,
        data: {
          analysis,
          message: `Analyzed content: ${analysis.itemCount} items detected. Recommended: ${analysis.recommendedLayout.type} layout (${analysis.recommendedLayout.reason})`
        },
        actions: layoutActions
      }
    } catch (error) {
      console.error('[IntelligentLayoutSkill] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to apply intelligent layout'
      }
    }
  }

  /**
   * Analyze slide content using AI
   */
  private async analyzeSlideContent(
    visualData: any,
    slideContent: string
  ): Promise<ContentAnalysis> {
    // Extract all text from visual data
    const texts = visualData?.texts || []
    const textContents = texts.map((t: any) => t.text || t.content || '').filter((t: string) => t.trim())
    
    const hasImages = (visualData?.images || []).length > 0
    const hasCharts = (visualData?.charts || []).length > 0
    
    // Build analysis prompt
    const prompt = `Analyze this slide content and recommend the best layout:

**Current Content:**
${textContents.join('\n')}

**Visual Elements:**
- Images: ${hasImages ? 'Yes' : 'No'}
- Charts: ${hasCharts ? 'Yes' : 'No'}
- Text blocks: ${textContents.length}

**Task:**
Analyze the content structure and recommend the BEST layout type. Return ONLY a JSON object (no explanations):

{
  "contentType": "list|comparison|process|feature-grid|text-heavy|mixed",
  "itemCount": <number of main items>,
  "hasTitle": <true|false>,
  "structure": {
    "sections": [
      {
        "title": "<section title>",
        "items": ["<item 1>", "<item 2>"]
      }
    ]
  },
  "recommendedLayout": {
    "type": "bullets|boxes|columns",
    "variant": "<specific variant like 'bullets-standard', 'boxes-2', etc>",
    "reason": "<one sentence explaining why this layout fits best>"
  }
}

**Layout Decision Rules:**
- **bullets**: Use for lists, sequential steps, or single-flow information (3-6 items)
- **boxes**: Use for comparisons, features, or parallel concepts (2-4 items side by side)
- **columns**: Use for heavy text content that needs organization (2-3 columns)

Choose the layout that best matches the content structure and emphasis.`

    try {
      let aiResponse = ''
      
      // Use streaming API
      await new Promise<void>((resolve, reject) => {
        streamGenerate(
          prompt,
          'You are a presentation design expert. Analyze content and recommend optimal layouts.',
          {
            onDelta: (chunk: string) => {
              aiResponse += chunk
            },
            onDone: () => resolve(),
            onError: (err: Error) => reject(err)
          },
          undefined,
          {
            taskContext: {
              type: 'layout-analysis',
              slideCount: 1
            }
          }
        )
      })
      
      console.log('[IntelligentLayoutSkill] AI response:', aiResponse)
      
      // Parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Invalid AI response format')
      }
      
      const analysis: ContentAnalysis = JSON.parse(jsonMatch[0])
      
      // Validate and set defaults
      if (!analysis.recommendedLayout) {
        analysis.recommendedLayout = {
          type: 'bullets',
          variant: 'bullets-standard',
          reason: 'Default layout for general content'
        }
      }
      
      return analysis
    } catch (error) {
      console.error('[IntelligentLayoutSkill] AI analysis failed, using fallback:', error)
      
      // Fallback: Simple heuristic-based analysis
      return this.fallbackAnalysis(textContents, hasImages, hasCharts)
    }
  }

  /**
   * Fallback content analysis (heuristic-based, no AI)
   */
  private fallbackAnalysis(
    textContents: string[],
    hasImages: boolean,
    hasCharts: boolean
  ): ContentAnalysis {
    const itemCount = textContents.length
    
    // Simple heuristics
    let contentType: ContentAnalysis['contentType'] = 'mixed'
    let layoutType: 'bullets' | 'boxes' | 'columns' = 'bullets'
    let variant = 'bullets-standard'
    let reason = 'General content structure'
    
    if (itemCount >= 2 && itemCount <= 4) {
      contentType = 'feature-grid'
      layoutType = 'boxes'
      variant = `boxes-${itemCount}`
      reason = `${itemCount} items work well in a grid layout`
    } else if (itemCount >= 5 && itemCount <= 8) {
      contentType = 'list'
      layoutType = 'bullets'
      variant = 'bullets-standard'
      reason = 'Multiple items best shown as a list'
    } else if (itemCount > 8) {
      contentType = 'text-heavy'
      layoutType = 'columns'
      variant = 'columns-2'
      reason = 'Large amount of text needs column organization'
    }
    
    return {
      contentType,
      itemCount,
      hasTitle: itemCount > 0,
      hasImages,
      hasCharts,
      structure: {
        sections: textContents.map((text, idx) => ({
          title: `Section ${idx + 1}`,
          items: [text]
        }))
      },
      recommendedLayout: {
        type: layoutType,
        variant,
        reason
      }
    }
  }

  /**
   * Generate layout actions based on analysis
   */
  private generateLayoutActions(
    analysis: ContentAnalysis,
    visualData: any
  ): SkillResult['actions'] {
    const { recommendedLayout, structure } = analysis
    
    // Build layout payload
    const layoutPayload = {
      layoutType: recommendedLayout.type,
      variant: recommendedLayout.variant,
      sections: structure.sections,
      preserveImages: (visualData?.images || []).length > 0,
      preserveCharts: (visualData?.charts || []).length > 0
    }
    
    return [
      {
        type: 'update-layout',
        payload: layoutPayload
      }
    ]
  }
}
