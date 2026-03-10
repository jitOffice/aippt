/**
 * Skill: 文本优化
 * 使用 MiniMax 优化文案、标题、内容
 */

import { streamGenerate } from '@/utils/ai/index'
import type { Skill, SkillMetadata, SkillParams, SkillResult } from '../SkillRegistry'

export class TextOptimizationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'text-optimization',
    name: '文本优化',
    description: '优化文案、标题、内容表达，使其更清晰、专业、吸引人',
    category: 'content',
    provider: 'minimax',
    keywords: [
      '优化', '改进', '润色', '优化文案', '改进文案', '优化文字', '改进内容', '优化标题',
      '丰富内容', '丰富', '扩充内容', '扩充', '完善内容', '完善',
      '扩展内容', '扩展', '补充内容', '补充', '增加内容', '增加',
      '充实内容', '充实', '详细', '详细一点', '更详细',
      '写得更多', '多写一点', '再多一些'
    ],
    examples: [
    '优化这个标题，让它更吸引人',
      '改进当前内容的表达',
      '润色这段文字',
      '丰富一下当前ppt内容',
      '帮我扩展内容',
      '补充更多细节'
    ]
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    return new Promise((resolve) => {
      let fullResponse = ''

      const systemPrompt = `You are a professional copywriting expert.

Requirements:
1. Maintain professionalism and accuracy
2. Use concise and powerful language
3. Match business presentation style
4. Return ONLY the optimized text content directly
5. NO <think> tags, NO thinking process, NO explanations
6. If enriching content, add relevant key points with details
7. Keep clear paragraph structure
8. Output format: Plain text with simple markdown (bold, bullets)
9. DO NOT add section headers or restructure - just enhance the existing text`

      streamGenerate(
        params.userInput,
        systemPrompt,
        {
          onDelta: (chunk) => {
            fullResponse += chunk
          },
          onDone: () => {
            // 清理响应：移除<think>标签和思考过程
            const cleanedText = this.cleanResponse(fullResponse)
            
            if (!cleanedText || cleanedText.trim().length === 0) {
              resolve({
                success: false,
                error: 'AI返回的内容为空或格式不正确'
              })
              return
            }
            
            // 分析内容结构，推荐合适的布局
            const contentStructure = this.analyzeContentStructure(cleanedText)
            const recommendedLayout = this.recommendLayout(contentStructure)
            
            console.log('[TextOptimizationSkill] Content structure:', {
              sections: contentStructure.sectionCount,
              bullets: contentStructure.bulletCount,
              paragraphs: contentStructure.paragraphCount,
              contentType: contentStructure.contentType,
              bulletsPerSection: contentStructure.sectionCount > 0 
                ? (contentStructure.bulletCount / contentStructure.sectionCount).toFixed(1) 
                : 'N/A'
            })
            console.log('[TextOptimizationSkill] Recommended layout:', recommendedLayout)
            
            resolve({
              success: true,
              data: { 
                text: cleanedText,
                structure: contentStructure,
                recommendedLayout: recommendedLayout
              },
              actions: [{
                type: 'replace-text',
                payload: { 
                  newText: cleanedText,
                  oldText: params.context.slideContent || '',
                  structure: contentStructure,
                  recommendedLayout: recommendedLayout
                }
              }]
            })
          },
          onError: (error) => {
            resolve({
              success: false,
              error: String(error)
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
  }

  /**
   * 清理AI响应，移除思考过程和无关内容
   */
  private cleanResponse(response: string): string {
    let cleaned = response
      
    // 1. 移除<think>...</think>标签及其内容
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '')
      
    // 2. 移除前导的解释性文字（如“用户提供了...”、“基于...”）
    // 查找第一个实质性内容开始的位置
    const patterns = [
      /^[^\n]*?用户[^\n]*?\n+/i,  // “用户提供...”
      /^[^\n]*?基于[^\n]*?\n+/i,  // “基于当前...”
      /^[^\n]*?让我[^\n]*?\n+/i,  // “让我来...”
    ]
      
    for (const pattern of patterns) {
      cleaned = cleaned.replace(pattern, '')
    }
      
    // 3. 移除多余的空行（超过两个换行）
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n')
      
    // 4. 移除首尾空白
    cleaned = cleaned.trim()
      
    return cleaned
  }

  /**
   * 分析内容结构
   */
  private analyzeContentStructure(text: string): any {
    const lines = text.split('\n').filter(l => l.trim())
    
    let hasTitle = false
    let sections = 0  // NEW: 计算实际分组数
    let hasBullets = 0
    let paragraphs = 0
    let inSection = false
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      
      // 跳过分隔符
      if (trimmed === '---' || trimmed === '___' || trimmed.match(/^-{3,}$/)) {
        return
      }
      
      // 检测主标题 (## 或 **粗体独立行**)
      if (trimmed.startsWith('##') || (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50)) {
        if (!hasTitle) {
          hasTitle = true
        } else {
          sections++  // 每个小标题都算一个分组
          inSection = true
        }
      }
      // 检测列表项 (• 或 -)
      else if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.match(/^\d+\./)) {
        hasBullets++
        if (!inSection) {
          sections++
          inSection = true
        }
      }
      // 普通段落
      else if (trimmed.length > 20) {
        paragraphs++
        if (!inSection && !hasTitle) {
          sections++
          inSection = true
        }
      }
    })
    
    // 如果没有检测到分组，但有多个段落，估算分组数
    if (sections === 0 && paragraphs >= 2) {
      sections = Math.min(paragraphs, 4)
    }
    
    return {
      totalLines: lines.length,
      hasTitle,
      sectionCount: sections,  // NEW: 实际分组数
      hasSubtitles: sections,  // 保持兼容性
      bulletCount: hasBullets,
      paragraphCount: paragraphs,
      contentType: this.determineContentType(hasTitle, sections, hasBullets, paragraphs)
    }
  }

  /**
   * 判断内容类型
   */
  private determineContentType(hasTitle: boolean, sections: number, bullets: number, paragraphs: number): string {
    // NEW: 更智能的分类逻辑 - 考虑内容分布
    
    // 如果有明确的分组结构（每组有标题）
    if (sections >= 2) {
      const bulletsPerSection = sections > 0 ? bullets / sections : bullets
      
      // 关键改进：如果每个分组的内容量适中（平均每组 ≤ 5 个 bullet），使用 boxes
      if (bulletsPerSection <= 5 && bullets <= 15) {
        // 内容分布均衡，适合 boxes 布局
        if (bullets >= 2) {
          return 'sectioned-bullets'  // 有分组+项目符号
        }
        return 'multi-section'  // 有分组但少项目符号
      }
      
      // 每组内容过多，使用单列
      if (bulletsPerSection > 5 || bullets > 15) {
        return 'bullet-list'
      }
    }
    
    // 没有明确分组，但有很多项目符号
    if (bullets > 8) {
      return 'bullet-list'
    }
    
    // 少量项目符号，但没有分组
    if (bullets >= 3 && sections < 2) {
      return 'bullet-list'
    }
    
    // 多个段落文本
    if (paragraphs >= 3) {
      return 'multi-paragraph'
    }
    
    return 'simple'
  }

  /**
   * 根据内容结构推荐布局
   */
  private recommendLayout(structure: any): string | null {
    const { contentType, bulletCount, hasSubtitles, totalLines } = structure
    
    // NEW: 更智能的布局匹配逻辑
    switch (contentType) {
      case 'bullet-list':
        return 'bullets-single'  // 单列项目列表
      
      case 'multi-section':
        // NEW: 根据分组数量选择合适的 boxes 布局
        if (hasSubtitles >= 3) {
          return 'boxes-4'  // 4个或更多分组使用4栏
        } else if (hasSubtitles >= 2) {
          return 'boxes-3'  // 3个分组使用3栏
        } else {
          return 'boxes-2'  // 2个分组使用2栏
        }
      
      case 'sectioned-bullets':
        // NEW: 有分组+项目符号的内容，根据数量选择
        if (hasSubtitles >= 2) {
          return 'boxes-3'
        } else {
          return 'bullets-single'  // 分组太少，使用单列
        }
      
      case 'multi-paragraph':
        return null  // 不需要特殊布局
      
      default:
        return null
    }
  }
}
