/**
 * Skill: AI 图片生成
 * 使用 MiniMax Image Generation API
 */

import type { Skill, SkillMetadata, SkillParams, SkillResult } from '../SkillRegistry'

export class ImageGenerationSkill implements Skill {
  metadata: SkillMetadata = {
    id: 'image-generation',
    name: 'AI 图片生成',
    description: '根据文字描述生成图片，支持各种风格：科技、商务、抽象、插画等',
    category: 'visual',
    provider: 'minimax',
    keywords: ['生成图片', '添加图片', '创建图片', '配图', '背景图', 'logo', '标志', '图标', '插图', '照片', '图像'],
    examples: [
      '生成一张科技感的背景图，蓝色调',
      '添加一个商务风格的插图',
      '创建抽象几何图案作为装饰',
      '生成一个JIT品牌logo'
    ]
  }

  private apiKey: string = ''
  private endpoint: string = 'https://api.minimaxi.com/v1/image_generation'

  constructor() {
    // 从环境变量读取配置
    this.apiKey = import.meta.env.VITE_MINIMAX_API_KEY || ''
  }

  async execute(params: SkillParams): Promise<SkillResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: '未配置 MiniMax API。请在 .env.local 中设置 VITE_MINIMAX_API_KEY'
      }
    }

    try {
      // 提取并优化图片描述
      const imagePrompt = this.extractImagePrompt(params.userInput)
      console.log('[ImageGenerationSkill] Generating with MiniMax:', imagePrompt)

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'image-01',
          prompt: imagePrompt,
          aspect_ratio: '16:9',
          response_format: 'url',
          n: 1,
          prompt_optimizer: true
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`MiniMax API 错误 (${response.status}): ${errorText}`)
      }

      const data = await response.json()
      
      if (!data.data || !data.data.image_urls || data.data.image_urls.length === 0) {
        throw new Error('MiniMax 未返回图片数据')
      }

      const imageUrl = data.data.image_urls[0]

      return {
        success: true,
        data: { imageUrl, prompt: imagePrompt },
        actions: [{
          type: 'add-image',
          payload: {
            src: imageUrl,
            x: 100,
            y: 100,
            width: 400,
            height: 300
          }
        }]
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * 从用户输入中提取图片描述
   */
  private extractImagePrompt(userInput: string): string {
    // 移除触发词，保留描述
    let prompt = userInput
      .replace(/生成|添加|创建|一张|一个|图片|背景图|插图/g, '')
      .trim()

    // 如果描述太短，添加默认风格
    if (prompt.length < 10) {
      prompt = `专业演示图形，${prompt}，高质量，简洁设计`
    } else {
      prompt = `${prompt}，专业，高质量，简洁`
    }

    return prompt
  }
}
