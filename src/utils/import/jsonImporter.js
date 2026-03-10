/**
 * JSON导入器 - 验证和处理符合文档数据结构的JSON文件
 */
export class JSONImporter {
  constructor() {
    this.supportedNodeTypes = [
      'paragraph', 'heading', 'blockquote', 'codeBlock',
      'bulletList', 'orderedList', 'listItem', 'taskList',
      'table', 'tableRow', 'tableCell', 'tableHeader',
      'image', 'divider', 'hardBreak', 'text',
      'chart', 'audio', 'video', 'mindMap'
    ]
    
    this.supportedMarkTypes = [
      'bold', 'italic', 'strike', 'code', 'link', 'underline',
      'textStyle', 'highlight', 'subscript', 'superscript'
    ]
  }

  /**
   * 导入JSON内容
   * @param {string} jsonText - JSON文本内容
   * @returns {Promise<Object>} TipTap JSON格式的文档内容
   */
  async import(jsonText) {
    try {
      console.log('=== 开始JSON导入 ===')
      
      if (!jsonText || typeof jsonText !== 'string') {
        throw new Error('JSON内容不能为空')
      }

      // 解析JSON
      let jsonData
      try {
        jsonData = JSON.parse(jsonText)
      } catch (parseError) {
        throw new Error(`JSON格式错误: ${parseError.message}`)
      }

      // 验证JSON结构
      const validatedData = this.validateAndNormalize(jsonData)
      
      console.log('=== JSON导入完成 ===', validatedData)
      return validatedData
    } catch (error) {
      console.error('=== JSON导入失败 ===', error)
      throw error
    }
  }

  /**
   * 验证和规范化JSON数据
   * @param {Object} data - 原始JSON数据
   * @returns {Object} 验证后的TipTap JSON数据
   */
  validateAndNormalize(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('JSON数据必须是一个对象')
    }

    // 检查是否为TipTap文档格式
    if (data.type === 'doc' && Array.isArray(data.content)) {
      return this.validateTipTapDocument(data)
    }

    // 检查是否为内容数组格式
    if (Array.isArray(data)) {
      return this.validateTipTapDocument({
        type: 'doc',
        content: data
      })
    }

    // 检查是否为单个节点
    if (data.type && typeof data.type === 'string') {
      return this.validateTipTapDocument({
        type: 'doc',
        content: [data]
      })
    }

    throw new Error('不支持的JSON格式，请确保是有效的TipTap文档格式')
  }

  /**
   * 验证TipTap文档
   * @param {Object} doc - TipTap文档对象
   * @returns {Object} 验证后的文档
   */
  validateTipTapDocument(doc) {
    if (doc.type !== 'doc') {
      throw new Error('文档根节点类型必须是 "doc"')
    }

    if (!Array.isArray(doc.content)) {
      throw new Error('文档内容必须是数组')
    }

    // 验证并清理内容
    const validatedContent = this.validateContent(doc.content)

    // 如果没有有效内容，添加一个空段落
    if (validatedContent.length === 0) {
      validatedContent.push({
        type: 'paragraph',
        content: []
      })
    }

    return {
      type: 'doc',
      content: validatedContent
    }
  }

  /**
   * 验证内容数组
   * @param {Array} content - 内容数组
   * @returns {Array} 验证后的内容数组
   */
  validateContent(content) {
    if (!Array.isArray(content)) {
      return []
    }

    const validatedContent = []

    for (const node of content) {
      try {
        const validatedNode = this.validateNode(node)
        if (validatedNode) {
          validatedContent.push(validatedNode)
        }
      } catch (error) {
        console.warn(`跳过无效节点:`, error.message, node)
        // 继续处理其他节点，不中断整个导入过程
      }
    }

    return validatedContent
  }

  /**
   * 验证单个节点
   * @param {Object} node - 节点对象
   * @returns {Object|null} 验证后的节点或null
   */
  validateNode(node) {
    if (!node || typeof node !== 'object') {
      throw new Error('节点必须是对象')
    }

    if (!node.type || typeof node.type !== 'string') {
      throw new Error('节点必须有type属性')
    }

    // 检查节点类型是否支持
    if (!this.supportedNodeTypes.includes(node.type)) {
      console.warn(`不支持的节点类型: ${node.type}，将跳过`)
      return null
    }

    const validatedNode = {
      type: node.type
    }

    // 验证属性
    if (node.attrs && typeof node.attrs === 'object') {
      validatedNode.attrs = this.validateAttributes(node.attrs, node.type)
    }

    // 验证内容
    if (node.content) {
      if (node.type === 'text') {
        // 文本节点不应该有content属性
        console.warn('文本节点不应该有content属性')
      } else {
        validatedNode.content = this.validateContent(node.content)
      }
    }

    // 验证文本内容（仅用于text节点）
    if (node.type === 'text') {
      if (typeof node.text === 'string') {
        validatedNode.text = node.text
      } else {
        throw new Error('文本节点必须有text属性')
      }
    }

    // 验证标记
    if (node.marks && Array.isArray(node.marks)) {
      validatedNode.marks = this.validateMarks(node.marks)
    }

    return validatedNode
  }

  /**
   * 验证节点属性
   * @param {Object} attrs - 属性对象
   * @param {string} nodeType - 节点类型
   * @returns {Object} 验证后的属性
   */
  validateAttributes(attrs, nodeType) {
    const validatedAttrs = {}

    // 根据节点类型验证特定属性
    switch (nodeType) {
      case 'heading':
        if (typeof attrs.level === 'number' && attrs.level >= 1 && attrs.level <= 6) {
          validatedAttrs.level = attrs.level
        } else {
          validatedAttrs.level = 1 // 默认为h1
        }
        break

      case 'image':
        if (typeof attrs.src === 'string') {
          validatedAttrs.src = attrs.src
        }
        if (typeof attrs.alt === 'string') {
          validatedAttrs.alt = attrs.alt
        }
        if (typeof attrs.title === 'string') {
          validatedAttrs.title = attrs.title
        }
        if (typeof attrs.width === 'number') {
          validatedAttrs.width = attrs.width
        }
        if (typeof attrs.height === 'number') {
          validatedAttrs.height = attrs.height
        }
        break

      case 'codeBlock':
        if (typeof attrs.language === 'string') {
          validatedAttrs.language = attrs.language
        }
        break

      case 'table':
        if (typeof attrs.colspan === 'number') {
          validatedAttrs.colspan = attrs.colspan
        }
        if (typeof attrs.rowspan === 'number') {
          validatedAttrs.rowspan = attrs.rowspan
        }
        break

      default:
        // 对于其他节点类型，保留所有属性但进行基本验证
        Object.keys(attrs).forEach(key => {
          if (attrs[key] !== undefined && attrs[key] !== null) {
            validatedAttrs[key] = attrs[key]
          }
        })
        break
    }

    return validatedAttrs
  }

  /**
   * 验证标记数组
   * @param {Array} marks - 标记数组
   * @returns {Array} 验证后的标记数组
   */
  validateMarks(marks) {
    const validatedMarks = []

    for (const mark of marks) {
      try {
        const validatedMark = this.validateMark(mark)
        if (validatedMark) {
          validatedMarks.push(validatedMark)
        }
      } catch (error) {
        console.warn(`跳过无效标记:`, error.message, mark)
      }
    }

    return validatedMarks
  }

  /**
   * 验证单个标记
   * @param {Object} mark - 标记对象
   * @returns {Object|null} 验证后的标记或null
   */
  validateMark(mark) {
    if (!mark || typeof mark !== 'object') {
      throw new Error('标记必须是对象')
    }

    if (!mark.type || typeof mark.type !== 'string') {
      throw new Error('标记必须有type属性')
    }

    if (!this.supportedMarkTypes.includes(mark.type)) {
      console.warn(`不支持的标记类型: ${mark.type}`)
      return null
    }

    const validatedMark = {
      type: mark.type
    }

    // 验证标记属性
    if (mark.attrs && typeof mark.attrs === 'object') {
      validatedMark.attrs = this.validateMarkAttributes(mark.attrs, mark.type)
    }

    return validatedMark
  }

  /**
   * 验证标记属性
   * @param {Object} attrs - 属性对象
   * @param {string} markType - 标记类型
   * @returns {Object} 验证后的属性
   */
  validateMarkAttributes(attrs, markType) {
    const validatedAttrs = {}

    switch (markType) {
      case 'link':
        if (typeof attrs.href === 'string') {
          validatedAttrs.href = attrs.href
        }
        if (typeof attrs.title === 'string') {
          validatedAttrs.title = attrs.title
        }
        if (typeof attrs.target === 'string') {
          validatedAttrs.target = attrs.target
        }
        break

      case 'textStyle':
        if (typeof attrs.color === 'string') {
          validatedAttrs.color = attrs.color
        }
        if (typeof attrs.fontSize === 'string') {
          validatedAttrs.fontSize = attrs.fontSize
        }
        if (typeof attrs.fontFamily === 'string') {
          validatedAttrs.fontFamily = attrs.fontFamily
        }
        break

      case 'highlight':
        if (typeof attrs.color === 'string') {
          validatedAttrs.color = attrs.color
        }
        break

      default:
        // 对于其他标记类型，保留所有属性
        Object.keys(attrs).forEach(key => {
          if (attrs[key] !== undefined && attrs[key] !== null) {
            validatedAttrs[key] = attrs[key]
          }
        })
        break
    }

    return validatedAttrs
  }

  /**
   * 获取支持的节点类型列表
   * @returns {Array} 支持的节点类型
   */
  getSupportedNodeTypes() {
    return [...this.supportedNodeTypes]
  }

  /**
   * 获取支持的标记类型列表
   * @returns {Array} 支持的标记类型
   */
  getSupportedMarkTypes() {
    return [...this.supportedMarkTypes]
  }
}
