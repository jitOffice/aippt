/**
 * Skill 定义与注册表
 * 每个 Skill 代表一个独立的 AI 能力
 */

// Skill 元数据
export interface SkillMetadata {
  id: string                    // 唯一标识
  name: string                  // 显示名称
  description: string           // 能力描述（用于意图匹配）
  category: 'content' | 'visual' | 'data' | 'layout'
  provider: string              // 底层服务提供商
  keywords: string[]            // 触发关键词
  examples: string[]            // 使用示例
  requiredConfig?: string[]     // 所需配置（API Key 等）
}

// Skill 执行参数
export interface SkillParams {
  userInput: string
  context: {
    slideContent?: string
    visualData?: any
    slideSize?: { width: number; height: number }
    conversationHistory?: Array<{ role: string; content: string }>  // Conversation context
  }
  [key: string]: any
}

// Skill 执行结果
export interface SkillResult {
  success: boolean
  data?: any
  error?: string
  actions?: Array<{
    type: 'update-text' | 'replace-text' | 'add-image' | 'add-chart' | 'update-layout' | 'batch'
    payload: any
  }>
}

// Skill 接口
export interface Skill {
  metadata: SkillMetadata
  execute: (params: SkillParams) => Promise<SkillResult>
}

/**
 * Skill 注册表
 * 管理所有可用的 Skills
 */
export class SkillRegistry {
  private skills: Map<string, Skill> = new Map()

  /**
   * 注册 Skill
   */
  register(skill: Skill) {
    this.skills.set(skill.metadata.id, skill)
    console.log(`[SkillRegistry] Registered: ${skill.metadata.id}`)
  }

  /**
   * 获取 Skill
   */
  get(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  /**
   * 获取所有 Skills
   */
  getAll(): Skill[] {
    return Array.from(this.skills.values())
  }

  /**
   * 按分类获取
   */
  getByCategory(category: SkillMetadata['category']): Skill[] {
    return this.getAll().filter(s => s.metadata.category === category)
  }

  /**
   * 搜索匹配的 Skill（基于关键词）
   */
  search(query: string): Skill[] {
    const lowerQuery = query.toLowerCase()
    
    // Score each skill based on keyword matches
    const skillsWithScores = this.getAll().map(skill => {
      let score = 0
      let matchedKeywords = 0
      let longestMatch = 0
      
      // Check keywords
      skill.metadata.keywords.forEach(kw => {
        const lowerKw = kw.toLowerCase()
        if (lowerQuery.includes(lowerKw)) {
          matchedKeywords++
          // Longer keywords get higher scores (more specific)
          score += lowerKw.length
          longestMatch = Math.max(longestMatch, lowerKw.length)
        }
      })
      
      // Check description (lower priority)
      if (skill.metadata.description.toLowerCase().includes(lowerQuery)) {
        score += 1  // Small bonus for description match
      }
      
      return {
        skill,
        score,
        matchedKeywords,
        longestMatch
      }
    })
    
    // Filter out skills with no matches
    const matchedSkills = skillsWithScores.filter(s => s.score > 0)
    
    // Sort by score (descending), then by longest match (descending)
    matchedSkills.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.longestMatch - a.longestMatch
    })
    
    console.log('[SkillRegistry] Search results for:', lowerQuery)
    matchedSkills.forEach(s => {
      console.log(`  - ${s.skill.metadata.name}: score=${s.score}, matches=${s.matchedKeywords}, longest=${s.longestMatch}`)
    })
    
    return matchedSkills.map(s => s.skill)
  }

  /**
   * 获取 Skill 列表（用于 UI 展示）
   */
  toList() {
    return this.getAll().map(skill => ({
      id: skill.metadata.id,
      name: skill.metadata.name,
      description: skill.metadata.description,
      category: skill.metadata.category,
      examples: skill.metadata.examples
    }))
  }
}

// 全局单例
export const skillRegistry = new SkillRegistry()
