/**
 * Skill Router - 使用LLM智能路由用户请求到合适的Skill
 * 替代简单的keyword匹配，提供更智能的意图识别
 */

import { streamGenerate } from '@/utils/ai/index'
import type { Skill } from './skills/SkillRegistry'

export interface SkillRouteResult {
  skillId: string
  confidence: number
  reasoning: string
}

export class SkillRouter {
  /**
   * 使用LLM路由用户请求到最合适的Skill
   * @param userInput 用户输入
   * @param availableSkills 可用的Skills列表
   * @param context 上下文信息
   */
  async route(
    userInput: string,
    availableSkills: Skill[],
    context: any
  ): Promise<SkillRouteResult | null> {
    // 构建Skills描述
    const skillsDescription = availableSkills.map(skill => ({
      id: skill.metadata.id,
      name: skill.metadata.name,
      description: skill.metadata.description,
      category: skill.metadata.category,
      examples: skill.metadata.examples
    }))

    // 构建路由prompt
    const routingPrompt = this.buildRoutingPrompt(userInput, skillsDescription, context)

    return new Promise((resolve) => {
      let fullResponse = ''

      streamGenerate({
        prompt: routingPrompt,
        onChunk: (chunk) => {
          fullResponse += chunk
        },
        onComplete: () => {
          try {
            // 解析LLM返回的JSON
            const result = this.parseRoutingResult(fullResponse)
            resolve(result)
          } catch (error) {
            console.error('[SkillRouter] Failed to parse routing result:', error)
            resolve(null)
          }
        },
        onError: (error) => {
          console.error('[SkillRouter] Routing error:', error)
          resolve(null)
        }
      })
    })
  }

  /**
   * 构建路由prompt
   */
  private buildRoutingPrompt(
    userInput: string,
    skills: any[],
    context: any
  ): string {
    return `你是一个智能助手路由器。用户正在使用幻灯片编辑工具，请根据用户的请求，判断应该使用哪个功能模块。

可用功能模块：
${JSON.stringify(skills, null, 2)}

用户请求：${userInput}

当前上下文：
- 幻灯片内容：${context.slideContent || '（空）'}
- 元素数量：${this.getElementCount(context.visualData)}

请分析用户的意图，选择最合适的功能模块，并以JSON格式返回：
{
  "skillId": "选择的skill的id",
  "confidence": 0.0-1.0之间的置信度,
  "reasoning": "选择理由"
}

要求：
1. 如果用户想要优化/改进/丰富文本内容 → 选择 text-optimization
2. 如果用户想要生成/添加图表 → 选择 chart-generation  
3. 如果用户想要生成/添加图片/logo → 选择 image-generation
4. 如果用户想要优化/调整布局 → 选择 layout-optimization
5. 如果无法确定，confidence设置为低值（<0.5）

只返回JSON，不要有其他内容。`
  }

  /**
   * 解析路由结果
   */
  private parseRoutingResult(response: string): SkillRouteResult | null {
    try {
      // 尝试提取JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return null
      }

      const result = JSON.parse(jsonMatch[0])
      
      // 验证结果
      if (!result.skillId || typeof result.confidence !== 'number') {
        return null
      }

      return {
        skillId: result.skillId,
        confidence: result.confidence,
        reasoning: result.reasoning || ''
      }
    } catch (error) {
      return null
    }
  }

  /**
   * 获取元素数量
   */
  private getElementCount(visualData: any): string {
    if (!visualData) return '0'
    
    const textCount = (visualData.texts || []).length
    const imageCount = (visualData.images || []).length
    const chartCount = (visualData.charts || []).length
    const total = textCount + imageCount + chartCount
    
    return `共${total}个（文本:${textCount}, 图片:${imageCount}, 图表:${chartCount}）`
  }
}
