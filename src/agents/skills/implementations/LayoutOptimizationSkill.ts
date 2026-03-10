/**
 * Skill: 智能布局优化
 * 使用 MiniMax AI 分析内容并优化布局
 */

import { streamGenerate } from '@/utils/ai/index'
import type { Skill, SkillMetadata, SkillParams, SkillResult } from '../SkillRegistry'

export class LayoutOptimizationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'layout-optimization',
    name: '智能布局优化',
    description: '使用 AI 分析幻灯片内容，自动优化元素排列，使布局更专业、美观、易读',
    category: 'layout',
    provider: 'minimax',
    keywords: ['优化布局', '自动排版', '调整布局', '美化', '对齐'],
    examples: [
      '优化当前页面的布局',
      '自动调整元素位置',
      '让布局更专业'
    ]
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    try {
      const { visualData, slideSize } = params.context

      if (!visualData || !slideSize) {
        return {
          success: false,
          error: '缺少布局数据'
        }
      }

      // 提取所有元素
      const components = this.extractComponents(visualData)

      if (components.length === 0) {
        return {
          success: false,
          error: '当前页面没有可优化的元素'
        }
      }

      // 使用 MiniMax AI 分析并生成布局建议
      return new Promise((resolve) => {
        let fullResponse = ''

        // 构建当前布局描述
        const layoutDescription = this.describeCurrentLayout(components, slideSize)

        const systemPrompt = `你是专业的幻灯片布局设计专家。
当前幻灯片尺寸：${slideSize.width}x${slideSize.height}

当前元素：
${layoutDescription}

请分析并返回优化后的布局建议，以 JSON 格式返回：
{
  "strategy": "布局策略描述",
  "adjustments": [
    {"id": "元素ID", "x": 数值, "y": 数值, "width": 数值, "height": 数值, "reason": "调整原因"}
  ]
}

设计原则：
1. 标题居中顶部，留出上边距
2. 文本内容左对齐，边距 60px
3. 图片/图表右侧排列，不遮挡文本
4. 元素间距统一 40px
5. 避免元素重叠`

        streamGenerate(
          '请优化布局',
          systemPrompt,
          {
            onDelta: (chunk) => {
              fullResponse += chunk
            },
            onDone: () => {
              try {
                // 提取 JSON
                const jsonMatch = fullResponse.match(/\{[\s\S]*\}/)
                if (!jsonMatch) {
                  // 如果 AI 未返回 JSON，使用默认算法
                  console.warn('[LayoutOptimization] AI 未返回有效 JSON，使用默认算法')
                  const fallbackLayout = this.fallbackAutoLayout(components, slideSize)
                  resolve({
                    success: true,
                    data: { layout: fallbackLayout },
                    actions: [{
                      type: 'update-layout',
                      payload: { layout: fallbackLayout }
                    }]
                  })
                  return
                }

                const aiSuggestion = JSON.parse(jsonMatch[0])
                
                // 应用 AI 建议
                const optimizedLayout = this.applyAIAdjustments(components, aiSuggestion.adjustments || [])

                console.log('[LayoutOptimization] AI 策略:', aiSuggestion.strategy)

                resolve({
                  success: true,
                  data: { 
                    layout: optimizedLayout,
                    strategy: aiSuggestion.strategy
                  },
                  actions: [{
                    type: 'update-layout',
                    payload: { layout: optimizedLayout }
                  }]
                })
              } catch (error) {
                console.error('[LayoutOptimization] 解析错误，使用默认算法', error)
                const fallbackLayout = this.fallbackAutoLayout(components, slideSize)
                resolve({
                  success: true,
                  data: { layout: fallbackLayout },
                  actions: [{
                    type: 'update-layout',
                    payload: { layout: fallbackLayout }
                  }]
                })
              }
            },
            onError: (error) => {
              console.error('[LayoutOptimization] AI 调用失败，使用默认算法', error)
              const fallbackLayout = this.fallbackAutoLayout(components, slideSize)
              resolve({
                success: true,
                data: { layout: fallbackLayout },
                actions: [{
                  type: 'update-layout',
                  payload: { layout: fallbackLayout }
                }]
              })
            }
          },
          undefined,
          {
            provider: 'minimax',
            model: 'minimax-m2.1-lightning'
          }
        )
      })
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 提取所有组件
   */
  private extractComponents(visualData: any): any[] {
    const components: any[] = []

    // 文本元素
    if (visualData.texts) {
      visualData.texts.forEach((text: any) => {
        components.push({ ...text, type: 'text' })
      })
    }

    // 图片元素
    if (visualData.images) {
      visualData.images.forEach((img: any) => {
        components.push({ ...img, type: 'image' })
      })
    }

    // 图表元素
    if (visualData.charts) {
      visualData.charts.forEach((chart: any) => {
        components.push({ ...chart, type: 'chart' })
      })
    }

    return components
  }

  /**
   * 描述当前布局（给 AI 分析）
   */
  private describeCurrentLayout(components: any[], slideSize: any): string {
    return components.map((c, i) => {
      const typeLabel = c.type === 'text' ? '文本' : c.type === 'image' ? '图片' : '图表'
      const content = c.content || c.text || `${typeLabel}${i + 1}`
      return `${i + 1}. ${typeLabel} "${content.substring(0, 20)}" - 位置(${c.x},${c.y}) 尺寸${c.width}x${c.height}`
    }).join('\n')
  }

  /**
   * 应用 AI 调整建议
   */
  private applyAIAdjustments(components: any[], adjustments: any[]): any[] {
    const result = [...components]
    
    adjustments.forEach(adj => {
      const component = result.find(c => c.id === adj.id)
      if (component) {
        if (adj.x !== undefined) component.x = adj.x
        if (adj.y !== undefined) component.y = adj.y
        if (adj.width !== undefined) component.width = adj.width
        if (adj.height !== undefined) component.height = adj.height
      }
    })
    
    return result
  }

  /**
   * 默认布局算法（Fallback）
   */
  private fallbackAutoLayout(components: any[], slideSize: { width: number; height: number }) {
    const { width, height } = slideSize
    const padding = 60
    const spacing = 40

    // 分类组件
    const titles = components.filter(c => c.type === 'text' && (c.fontSize >= 40 || c.fontWeight === 'bold'))
    const texts = components.filter(c => c.type === 'text' && c.fontSize < 40 && c.fontWeight !== 'bold')
    const images = components.filter(c => c.type === 'image')
    const charts = components.filter(c => c.type === 'chart')

    const optimized: any[] = []
    let currentY = padding

    // 1. 标题居中顶部
    titles.forEach(title => {
      optimized.push({
        ...title,
        x: width / 2 - title.width / 2,
        y: currentY
      })
      currentY += (title.height || 60) + spacing
    })

    // 2. 计算内容区域
    const contentWidth = width - padding * 2
    const hasMedia = images.length > 0 || charts.length > 0

    let textX = padding
    let textMaxWidth = contentWidth

    // 如果有媒体元素，文本区域只占左侧
    if (hasMedia) {
      textMaxWidth = contentWidth * 0.5
    }

    // 3. 正文左对齐
    texts.forEach(text => {
      optimized.push({
        ...text,
        x: textX,
        y: currentY,
        width: Math.min(text.width || 300, textMaxWidth)
      })
      currentY += (text.height || 40) + spacing / 2
    })

    // 4. 媒体元素右侧排列
    if (hasMedia) {
      const mediaX = width - padding - 400
      let mediaY = padding + (titles.length > 0 ? (titles[0].height || 60) + spacing : 0)

      images.forEach(img => {
        optimized.push({
          ...img,
          x: mediaX,
          y: mediaY,
          width: 400,
          height: 300
        })
        mediaY += 300 + spacing
      })

      charts.forEach(chart => {
        optimized.push({
          ...chart,
          x: mediaX,
          y: mediaY,
          width: 400,
          height: 300
        })
        mediaY += 300 + spacing
      })
    }

    return optimized
  }
}
