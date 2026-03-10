/**
 * Coze Workflow API Integration
 * 扣子工作流集成 - AI PPT 生成
 */

import { request } from '@/utils/req'

// Coze API Configuration
const COZE_CONFIG = {
  // Use relative URL to leverage Vite proxy in development
  // In production, this will use the BASE_API_URL defined in vite.config.js
  proxyURL: '/api/coze'
}

/**
 * Stage 1: 调用 Coze 工作流仅生成 PPT 大纲（不生成完整 PPT）
 * @param {Object} params - 生成参数
 * @param {string} params.keyword - 主题关键词
 * @param {string} params.model - AI 模型（DeepSeek V3, GPT-4, etc.）
 * @param {string} params.pageCount - 页数范围
 * @param {string} params.textAmount - 文字量（简洁/详细/非常详细）
 * @param {string} params.language - 语言
 * @param {string} params.style - 风格
 * @returns {Promise<Object>} 大纲生成结果
 */
export async function generateOutlineOnly(params) {
  const {
    keyword,
    model = 'DeepSeek V3',
    pageCount = '15 - 20页',
    textAmount = '详细',
    language = '简体中文',
    style = '大众'
  } = params

  try {
    console.log('[Coze] Stage 1: 生成大纲:', params)

    // 调用大纲生成 API（通过后端代理）
    const response = await request.post(`${COZE_CONFIG.proxyURL}/generate-outline-only`, {
      keyword,
      model,
      pageCount,
      textAmount,
      language,
      style
    })

    console.log('[Coze] 大纲生成成功:', response)

    const { data } = response
    
    return {
      success: true,
      outline: data.outline, // 大纲文本（可编辑）
      title: data.title, // PPT 标题
      logId: data.log_id,
      message: data.message
    }
  } catch (error) {
    console.error('[Coze] 大纲生成失败:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || '生成失败，请重试'
    }
  }
}

/**
 * Stage 2: 根据确认的大纲生成完整 PPT 结构
 * @param {Object} params - 生成参数
 * @param {string} params.outline - 确认的大纲文本
 * @param {string} params.title - PPT 标题
 * @param {string} params.keyword - 原始主题关键词（可选）
 * @param {string} params.style - 风格（可选）
 * @returns {Promise<Object>} PPT 生成结果
 */
export async function generatePPTFromOutline(params) {
  const {
    outline,
    title,
    keyword = '',
    style = '大众'
  } = params

  try {
    console.log('[Coze] Stage 2: 根据大纲生成 PPT:', { title, outlineLength: outline?.length })

    // 调用 PPT 生成 API
    const response = await request.post(`${COZE_CONFIG.proxyURL}/generate-ppt`, {
      outline,
      title,
      keyword,
      style
    })

    console.log('[Coze] PPT 生成成功:', response)

    const { data } = response
    
    return {
      success: true,
      formattedMarkdown: data.formatted_markdown,
      title: data.title,
      message: '生成成功'
    }
  } catch (error) {
    console.error('[Coze] PPT 生成失败:', error)
    return {
      success: false,
      error: error.response?.data?.message || error.message || '生成失败，请重试'
    }
  }
}

/**
 * (Legacy) 一步生成 PPT 大纲和详细内容
 * 保留用于向后兼容，建议使用两阶段流程
 * @deprecated Use generateOutlineOnly + generatePPTFromOutline instead
 */
export async function generatePPTOutline(params) {
  const {
    keyword,
    model = 'DeepSeek V3',
    pageCount = '15 - 20页',
    textAmount = '详细',
    language = '简体中文',
    style = '大众'
  } = params

  try {
    console.log('[Coze] 调用工作流生成 PPT 大纲:', params)

    // 方案1: 直接调用 Coze API（需要配置 CORS 或使用后端代理）
    // const response = await fetch(`${COZE_CONFIG.baseURL}/workflows/${COZE_CONFIG.workflowId}/run`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${COZE_CONFIG.apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     workflow_id: COZE_CONFIG.workflowId,
    //     parameters: {
    //       keyword,
    //       model,
    //       page_count: pageCount,
    //       text_amount: textAmount,
    //       language,
    //       style
    //     }
    //   })
    // })

    // Legacy API: 一次性生成完整内容
    const response = await request.post(`${COZE_CONFIG.proxyURL}/generate-outline`, {
      keyword,
      model,
      pageCount,
      textAmount,
      language,
      style
    })

    console.log('[Coze] 工作流执行成功:', response)

    // 解析返回结果
    // 根据你的 Coze 工作流输出格式调整
    const { data } = response
    
    return {
      success: true,
      outline: data.outline, // 大纲文本
      formattedMarkdown: data.formatted_markdown, // 格式化的 Markdown
      title: data.title, // PPT 标题
      logId: data.log_id, // Coze 日志 ID
      code: data.code, // 生成的代码片段（如果有）
      message: data.message
    }
  } catch (error) {
    console.error('[Coze] 工作流调用失败:', error)
    throw {
      success: false,
      error: error.message || '生成失败，请重试'
    }
  }
}

/**
 * 轮询检查工作流执行状态（如果是异步工作流）
 * @param {string} logId - Coze 工作流日志 ID
 * @returns {Promise<Object>} 执行结果
 */
export async function pollWorkflowStatus(logId, maxAttempts = 30, interval = 2000) {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    try {
      const response = await request.get(`${COZE_CONFIG.proxyURL}/workflow-status/${logId}`)
      
      const { status, data } = response
      
      if (status === 'completed') {
        return {
          success: true,
          data
        }
      } else if (status === 'failed') {
        throw new Error(data.error || '工作流执行失败')
      }
      
      // 继续轮询
      await new Promise(resolve => setTimeout(resolve, interval))
      attempts++
    } catch (error) {
      console.error('[Coze] 状态轮询失败:', error)
      throw error
    }
  }
  
  throw new Error('工作流执行超时')
}

/**
 * 解析 Coze 返回的 Markdown 为 PPT 结构
 * @param {string} markdown - 格式化的 Markdown 文本
 * @returns {Array<Object>} PPT 页面数组
 */
export function parseMarkdownToSlides(markdown) {
  const slides = []
  
  // 按一级标题分割（每个一级标题代表一页）
  const sections = markdown.split(/^# /gm).filter(Boolean)
  
  sections.forEach((section, index) => {
    const lines = section.trim().split('\n')
    const title = lines[0].trim()
    
    // 解析内容
    const content = []
    let currentLevel = null
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      // 二级标题
      if (line.startsWith('## ')) {
        content.push({
          type: 'subtitle',
          text: line.replace('## ', '').trim()
        })
        currentLevel = 'subtitle'
      }
      // 列表项
      else if (line.match(/^[-*]\s/)) {
        content.push({
          type: 'bullet',
          text: line.replace(/^[-*]\s/, '').trim(),
          level: currentLevel === 'subtitle' ? 2 : 1
        })
      }
      // 普通文本
      else if (!line.startsWith('#')) {
        content.push({
          type: 'text',
          text: line
        })
      }
    }
    
    slides.push({
      id: `slide-${index + 1}`,
      title,
      content,
      layout: determineLayout(content)
    })
  })
  
  return slides
}

/**
 * 根据内容确定页面布局
 * @param {Array} content - 页面内容
 * @returns {string} 布局类型
 */
function determineLayout(content) {
  if (content.length === 0) return 'title'
  
  const hasBullets = content.some(item => item.type === 'bullet')
  const hasSubtitle = content.some(item => item.type === 'subtitle')
  
  if (hasBullets && content.length > 5) return 'bullet-list'
  if (hasSubtitle) return 'section'
  
  return 'content'
}

/**
 * 将 Coze 生成的结构转换为 PPT 数据格式
 * @param {Object} cozeResult - Coze 工作流返回结果
 * @returns {Object} PPT 数据对象
 */
export function convertCozeToPPTData(cozeResult) {
  const { formattedMarkdown, title } = cozeResult
  
  const slides = parseMarkdownToSlides(formattedMarkdown)
  
  return {
    title: title || slides[0]?.title || 'Untitled Presentation',
    slides,
    metadata: {
      generatedAt: new Date().toISOString(),
      source: 'coze-workflow',
      model: cozeResult.model || 'DeepSeek V3'
    }
  }
}

/**
 * Stage 1 (Streaming): 调用 Coze 工作流流式生成 PPT 大纲
 * @param {Object} params - 生成参数
 * @param {Function} onMessage - 接收消息回调 (type, data) => void
 * @returns {Promise<void>}
 */
export async function generateOutlineStream(params, onMessage) {
  const {
    keyword,
    model = 'DeepSeek V3',
    pageCount = '15 - 20页',
    textAmount = '详细',
    language = '简体中文',
    style = '大众'
  } = params

  try {
    console.log('[Coze Stream] Starting outline generation:', params)

    // Build query parameters
    const queryParams = new URLSearchParams({
      keyword,
      model,
      pageCount,
      textAmount,
      language,
      style
    })

    // Create EventSource for SSE
    const url = `${COZE_CONFIG.proxyURL}/generate-outline-stream?${queryParams}`
    const eventSource = new EventSource(url)

    // Handle messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log('[Coze Stream] Message:', data.type, data)
        
        if (onMessage) {
          onMessage(data.type, data)
        }

        // Close connection on complete or error
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close()
        }
      } catch (error) {
        console.error('[Coze Stream] Parse error:', error)
      }
    }

    eventSource.onerror = (error) => {
      console.error('[Coze Stream] Connection error:', error)
      eventSource.close()
      if (onMessage) {
        onMessage('error', { message: '连接中断' })
      }
    }

  } catch (error) {
    console.error('[Coze Stream] Failed:', error)
    if (onMessage) {
      onMessage('error', { message: error.message })
    }
  }
}

export default {
  generatePPTOutline,
  pollWorkflowStatus,
  parseMarkdownToSlides,
  convertCozeToPPTData,
  generateOutlineStream
}
