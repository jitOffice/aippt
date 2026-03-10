/**
 * Agent 编排器 - 基于 Skills 的调度层
 * 职责：
 * 1. 管理所有 Skills
 * 2. 智能路由到最匹配的 Skill
 * 3. 执行 Skill 并返回结果
 */

import { skillRegistry } from '../skills/SkillRegistry'
import { TextOptimizationSkill } from '../skills/implementations/TextOptimizationSkill'
import { ImageGenerationSkill } from '../skills/implementations/ImageGenerationSkill'
import { ChartGenerationSkill } from '../skills/implementations/ChartGenerationSkill'
import { LayoutOptimizationSkill } from '../skills/implementations/LayoutOptimizationSkill'
import { IntelligentLayoutSkill } from '../skills/implementations/IntelligentLayoutSkill'
import type { Skill, SkillResult, SkillParams } from '../skills/SkillRegistry'

/**
 * Agent 编排器
 */
export class AgentOrchestrator {
  constructor() {
    this.registerSkills()
  }

  /**
   * 注册所有 Skills
   */
  private registerSkills() {
    skillRegistry.register(new TextOptimizationSkill())
    skillRegistry.register(new ImageGenerationSkill())
    skillRegistry.register(new ChartGenerationSkill())
    skillRegistry.register(new LayoutOptimizationSkill())
    skillRegistry.register(new IntelligentLayoutSkill())

    console.log('[AgentOrchestrator] Registered', skillRegistry.getAll().length, 'skills')
  }

  /**
   * 主入口：处理用户请求
   */
  async handleUserRequest(
    userInput: string,
    context: {
      slideContent?: string
      visualData?: any
      slideSize?: { width: number; height: number }
      conversationHistory?: Array<{ role: string; content: string }>  // NEW: Conversation context
    }
  ): Promise<SkillResult> {
    try {
      console.log('[AgentOrchestrator] Processing:', userInput)
      console.log('[AgentOrchestrator] Context has conversation history:', !!context.conversationHistory)

      // Step 1: 搜索匹配的 Skills
      const matchedSkills = skillRegistry.search(userInput)
      
      // NEW: 如果没有匹配，但有对话上下文，尝试从上下文推断意图
      if (matchedSkills.length === 0 && context.conversationHistory && context.conversationHistory.length > 0) {
        console.log('[AgentOrchestrator] No direct match, analyzing conversation history...')
        const inferredSkill = this.inferSkillFromContext(userInput, context.conversationHistory)
        if (inferredSkill) {
          console.log('[AgentOrchestrator] Inferred skill from context:', inferredSkill.metadata.name)
          matchedSkills.push(inferredSkill)
        }
      }
      
      if (matchedSkills.length === 0) {
        return {
          success: false,
          error: '无法识别您的需求，请尝试更具体的描述'
        }
      }

      // Step 2: 使用第一个匹配的 Skill（最佳匹配）
      const skill = matchedSkills[0]
      console.log('[AgentOrchestrator] Using skill:', skill.metadata.name)

      // Step 3: 优化用户输入，添加对话上下文
      const optimizedInput = this.optimizeUserInput(userInput, skill, context)
      console.log('[AgentOrchestrator] Optimized input length:', optimizedInput.length)

      // Step 4: 执行 Skill with conversation context
      const params: SkillParams = {
        userInput: optimizedInput,  // 使用优化后的输入
        context: {
          ...context,
          // Ensure conversation history is available to skills
          conversationHistory: context.conversationHistory || []
        }
      }

      return await skill.execute(params)
    } catch (error) {
      console.error('[AgentOrchestrator] Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * NEW: 从对话上下文推断 Skill
   * 当用户说模糊的话（如"帮我扩展"）时，根据上下文推断意图
   */
  private inferSkillFromContext(
    userInput: string,
    conversationHistory: Array<{ role: string; content: string }>
  ): Skill | null {
    const lowerInput = userInput.toLowerCase()
    
    // 常见的模糊指令关键词
    const vagueCommandPatterns = [
      '帮我', '帮忙', '可以', '能不能', '再', '继续', '这个', '那个',
      '扩展', '补充', '增加', '修改', '调整', '改一下', '再来',
      '更', '更好', '更多', '更详细', '详细一点'
    ]
    
    const isVagueCommand = vagueCommandPatterns.some(pattern => lowerInput.includes(pattern))
    if (!isVagueCommand) {
      return null  // 不是模糊指令，无法推断
    }
    
    // 查看最近的 AI 回复，推断上下文
    const recentAIMessages = conversationHistory
      .filter(msg => msg.role === 'assistant')
      .slice(-2)  // Last 2 AI messages
    
    if (recentAIMessages.length === 0) {
      return null
    }
    
    // 分析最近的 AI 回复内容，推断 skill 类型
    const recentContent = recentAIMessages.map(m => m.content.toLowerCase()).join(' ')
    
    // 如果最近在讨论文本优化，默认继续使用文本优化 skill
    if (recentContent.includes('优化') || recentContent.includes('文案') || 
        recentContent.includes('布局') || recentContent.includes('应用')) {
      console.log('[AgentOrchestrator] Inferred: Text Optimization (from recent context)')
      return skillRegistry.get('text-optimization') || null
    }
    
    // 如果最近在讨论图表，默认继续使用图表 skill
    if (recentContent.includes('图表') || recentContent.includes('chart') || recentContent.includes('数据')) {
      console.log('[AgentOrchestrator] Inferred: Chart Generation (from recent context)')
      return skillRegistry.get('chart-generation') || null
    }
    
    // 默认回退到文本优化（最常用）
    console.log('[AgentOrchestrator] Inferred: Text Optimization (default fallback)')
    return skillRegistry.get('text-optimization') || null
  }

  /**
   * 优化用户输入，将模糊的自然语言转换为更明确的AI指令
   */
  private optimizeUserInput(
    userInput: string,
    skill: Skill,
    context: any
  ): string {
    // 根据不同skill类型优化输入
    switch (skill.metadata.id) {
      case 'text-optimization':
        return this.optimizeTextOptimizationInput(userInput, context)
      
      case 'chart-generation':
        return this.optimizeChartGenerationInput(userInput, context)
      
      case 'image-generation':
        return this.optimizeImageGenerationInput(userInput, context)
      
      case 'layout-optimization':
        return this.optimizeLayoutOptimizationInput(userInput, context)
      
      default:
        return userInput
    }
  }

  /**
   * 优化文本优化类输入
   */
  private optimizeTextOptimizationInput(userInput: string, context: any): string {
    // 提取纯文本内容（移除markdown标记）
    const slideContent = context.slideContent || ''
    const visualData = context.visualData || {}
    const conversationHistory = context.conversationHistory || []
      
    // 从 visualData 提取纯文本
    const texts = visualData.texts || []
    const textContents = texts.map(t => t.content || t.text || '').filter(t => t.trim())
    const pureText = textContents.join('\n\n')
      
    // 构建更明确的prompt
    let optimizedPrompt = userInput
      
    // NEW: 如果有对话历史，添加上下文
    let contextPrefix = ''
    if (conversationHistory.length > 0) {
      const recentContext = conversationHistory
        .slice(-2) // Last exchange
        .map(msg => `${msg.role === 'user' ? '用户' : 'AI'}: ${msg.content}`)
        .join('\n')
      contextPrefix = `之前的对话：\n${recentContext}\n\n`
    }
      
    // NEW: 更广泛的关键词匹配 - 添加"扩展"、"补充"等
    const enrichmentKeywords = ['丰富', '扩充', '完善', '扩展', '补充', '增加', '充实', '详细', '多写']
    const optimizationKeywords = ['优化', '改进', '润色', '提升', '美化']
      
    const hasEnrichment = enrichmentKeywords.some(kw => userInput.includes(kw))
    const hasOptimization = optimizationKeywords.some(kw => userInput.includes(kw))
      
    // 如果用户说"丰富内容"、"扩充内容"、"扩展内容"，添加更具体的指导
    if (hasEnrichment) {
      optimizedPrompt = `${contextPrefix}当前幻灯片文本内容：\n${pureText || '空白页面'}\n\n请根据上述内容，${userInput}。请直接返回扩充后的内容，不要解释和分析。`
    }
    // 如果用户说"优化"、"改进"，添加上下文
    else if (hasOptimization) {
      optimizedPrompt = `${contextPrefix}当前幻灯片文本内容：\n${pureText || '空白页面'}\n\n请${userInput}，使其更专业、清晰、吸引人。直接返回优化后的文本，不要解释。`
    }
    else if (conversationHistory.length > 0) {
      // 如果是后续对话，但没有明确的关键词，依然添加上下文
      optimizedPrompt = `${contextPrefix}当前幻灯片文本内容：\n${pureText || '空白页面'}\n\n${userInput}`
    }
      
    return optimizedPrompt
  }

  /**
   * 优化图表生成类输入
   */
  private optimizeChartGenerationInput(userInput: string, context: any): string {
    const slideContent = context.slideContent || ''
    
    return `当前幻灯片内容：
${slideContent}

用户需求：${userInput}

请根据幻灯片内容生成合适的专业图表。`
  }

  /**
   * 优化图片生成类输入
   */
  private optimizeImageGenerationInput(userInput: string, context: any): string {
    // 图片生成不需要幻灯片内容，保持原样
    return userInput
  }

  /**
   * 优化布局优化类输入
   */
  private optimizeLayoutOptimizationInput(userInput: string, context: any): string {
    const visualData = context.visualData || {}
    const elementCount = [
      (visualData.texts || []).length,
      (visualData.images || []).length,
      (visualData.charts || []).length
    ].reduce((a, b) => a + b, 0)
    
    return `当前幻灯片有${elementCount}个元素。${userInput}。请提供专业的布局优化建议。`
  }

  /**
   * 获取所有可用 Skills（用于 UI 展示）
   */
  getAvailableSkills() {
    return skillRegistry.toList()
  }

  /**
   * 按分类获取 Skills
   */
  getSkillsByCategory(category: 'content' | 'visual' | 'data' | 'layout') {
    return skillRegistry.getByCategory(category)
  }
}

// 导出单例
export const agentOrchestrator = new AgentOrchestrator()
