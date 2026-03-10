/**
 * Docx4js导入器 - 使用docx4js解析docx文件并转换为TipTap JSON格式
 * 基于docx4js官方API: docx4js.load().then(docx => docx.render(createElement))
 *
 * 🚀 未来升级方案 - 高精度Word文档导入
 *
 * 特性：
 * - 支持.doc和.docx格式
 * - 极高的格式保留精度
 * - 完整的Word功能支持（脚注、页眉页脚、目录等）
 * - 直接转换为TipTap JSON，无需HTML中间层
 *
 * 当前状态：已实现基础功能，待集成到ImportManager
 * 替代方案：当前使用MammothImporter作为过渡方案
 *
 * 使用方式：
 * 1. 在ImportManager中启用docx4jsImporter
 * 2. 安装docx4js依赖：npm install docx4js
 * 3. 更新文件类型支持：添加.doc格式
 */

export class Docx4jsImporter {
  constructor() {
    this.supportedNodeTypes = [
      'paragraph', 'heading', 'blockquote', 'codeBlock',
      'bulletList', 'orderedList', 'listItem', 'taskList',
      'table', 'tableRow', 'tableCell', 'tableHeader',
      'image', 'divider', 'hardBreak', 'text'
    ]

    this.supportedMarkTypes = [
      'bold', 'italic', 'strike', 'code', 'link', 'underline',
      'textStyle', 'highlight', 'subscript', 'superscript'
    ]

    // 存储转换过程中的状态
    this.currentDocument = null
    this.tipTapContent = []
  }

  /**
   * 导入docx内容
   * @param {ArrayBuffer|File} input - docx文件内容
   * @returns {Promise<Object>} TipTap JSON格式的文档内容
   */
  async import(file) {
    try {
      console.log('=== 开始Docx4js导入 ===')
      console.log('文件信息:', file.name, file.size, file.type)

      if (!file) {
        throw new Error('文件不能为空')
      }

      // 动态导入docx4js
      const docx4js = await import('docx4js')
      console.log('docx4js模块加载成功:', Object.keys(docx4js))

      // 重置状态
      this.tipTapContent = []

      // 使用docx4js.load()加载文档
      console.log('开始加载docx文档...')
      const doc = await docx4js.default.load(file)
      console.log('文档加载成功:', doc)

      // 使用render方法转换文档
      console.log('开始渲染文档...')
      const renderResult = doc.render((type, props, children) => {
        console.log('render回调:', type, props, children)
        return this.createElement(type, props, children)
      })

      console.log('文档渲染完成:', renderResult)

      // 构建TipTap JSON格式
      const tipTapDoc = this.buildTipTapDocument(renderResult)

      console.log('=== Docx4js导入完成 ===', tipTapDoc)
      return tipTapDoc

    } catch (error) {
      console.error('=== Docx4js导入失败 ===', error)
      throw error
    }
  }

  /**
   * createElement函数 - 用于docx4js的render方法
   * 这是docx4js.render()回调函数，用于将docx元素转换为我们需要的格式
   * @param {string} type - docx元素类型
   * @param {Object} props - 元素属性
   * @param {Array} children - 子元素数组
   * @returns {Object} 转换后的元素对象
   */
  createElement(type, props, children) {
    console.log(`createElement: ${type}`, props, children)

    // 将docx4js的元素转换为中间格式，稍后转换为TipTap JSON
    return {
      docxType: type,
      props: props || {},
      children: children || []
    }
  }

  /**
   * 构建TipTap文档格式
   * @param {Object} renderResult - docx4js render的结果
   * @returns {Object} TipTap JSON格式的文档
   */
  buildTipTapDocument(renderResult) {
    console.log('构建TipTap文档:', renderResult)

    // 初始化TipTap文档结构
    const tipTapDoc = {
      type: 'doc',
      content: []
    }

    // 转换渲染结果为TipTap内容
    if (renderResult) {
      const content = this.convertToTipTap(renderResult)
      if (content && content.length > 0) {
        tipTapDoc.content = content
      } else {
        // 如果没有内容，添加一个空段落
        tipTapDoc.content = [{
          type: 'paragraph',
          content: []
        }]
      }
    } else {
      // 如果没有渲染结果，添加一个空段落
      tipTapDoc.content = [{
        type: 'paragraph',
        content: []
      }]
    }

    return tipTapDoc
  }

  /**
   * 将docx4js渲染结果转换为TipTap JSON格式
   * @param {Object} element - docx4js元素
   * @returns {Array} TipTap内容数组
   */
  convertToTipTap(element) {
    if (!element) return []

    console.log('转换元素:', element.docxType, element)

    const content = []

    // 根据docx元素类型转换为TipTap格式
    switch (element.docxType) {
      case 'document':
        // 文档根节点，处理子元素
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            const converted = this.convertToTipTap(child)
            content.push(...converted)
          })
        }
        break

      case 'section':
        // 章节，处理子元素
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            const converted = this.convertToTipTap(child)
            content.push(...converted)
          })
        }
        break

      case 'paragraph':
      case 'p':
        // 段落
        const paragraph = {
          type: 'paragraph',
          content: []
        }

        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            const converted = this.convertToTipTap(child)
            paragraph.content.push(...converted)
          })
        }

        content.push(paragraph)
        break

      case 'text':
      case 't':
        // 文本节点
        if (element.props && element.props.text) {
          content.push({
            type: 'text',
            text: element.props.text
          })
        } else if (typeof element.children === 'string') {
          content.push({
            type: 'text',
            text: element.children
          })
        }
        break

      case 'run':
      case 'r':
        // 文本运行，处理子元素
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            const converted = this.convertToTipTap(child)
            content.push(...converted)
          })
        }
        break

      default:
        // 未知元素类型，尝试处理子元素
        console.log('未知元素类型:', element.docxType)
        if (element.children && element.children.length > 0) {
          element.children.forEach(child => {
            const converted = this.convertToTipTap(child)
            content.push(...converted)
          })
        }
        break
    }

    return content
  }

  /**
   * createElement函数 - 用于docx4js的render方法
   * @param {string} type - 元素类型
   * @param {Object} props - 元素属性
   * @param {Array} children - 子元素
   * @returns {Object} 元素对象
   */
  createElement(type, props, children) {
    // 返回一个包含所有信息的对象，供后续处理
    return {
      type,
      props,
      children: Array.isArray(children) ? children : (children ? [children] : [])
    }
  }

  /**
   * 构建TipTap文档
   * @param {Object} renderResult - render方法的结果
   * @returns {Object} TipTap JSON文档
   */
  buildTipTapDocument(renderResult) {
    const tipTapDoc = {
      type: 'doc',
      content: []
    }

    if (renderResult && renderResult.type === 'document') {
      // 处理文档内容
      const content = this.processDocumentContent(renderResult)
      tipTapDoc.content = content
    }

    // 如果没有内容，添加一个空段落
    if (tipTapDoc.content.length === 0) {
      tipTapDoc.content.push(this.createEmptyParagraph())
    }

    return tipTapDoc
  }

  /**
   * 处理文档内容
   * @param {Object} documentElement - 文档元素
   * @returns {Array} TipTap内容数组
   */
  processDocumentContent(documentElement) {
    const content = []

    if (documentElement.children) {
      for (const child of documentElement.children) {
        if (child.type === 'section') {
          // 处理section中的内容
          const sectionContent = this.processSectionContent(child)
          content.push(...sectionContent)
        }
      }
    }

    return content
  }

  /**
   * 处理section内容
   * @param {Object} sectionElement - section元素
   * @returns {Array} TipTap内容数组
   */
  processSectionContent(sectionElement) {
    const content = []

    if (sectionElement.children) {
      for (const child of sectionElement.children) {
        if (child.type === 'p') {
          // 处理段落
          const paragraph = this.processParagraph(child)
          if (paragraph) {
            content.push(paragraph)
          }
        }
      }
    }

    return content
  }

  /**
   * 处理段落
   * @param {Object} paragraphElement - 段落元素
   * @returns {Object|null} TipTap段落节点
   */
  processParagraph(paragraphElement) {
    const paragraph = {
      type: 'paragraph',
      content: []
    }

    // 检查是否是标题
    const headingLevel = this.getHeadingLevel(paragraphElement)
    if (headingLevel) {
      paragraph.type = 'heading'
      paragraph.attrs = { level: headingLevel }
    }

    // 处理段落内容
    if (paragraphElement.children) {
      for (const child of paragraphElement.children) {
        if (child.type === 'r') {
          // 处理文本运行
          const textNodes = this.processTextRun(child)
          paragraph.content.push(...textNodes)
        }
      }
    }

    // 如果段落为空，添加空文本节点
    if (paragraph.content.length === 0) {
      paragraph.content.push({
        type: 'text',
        text: ''
      })
    }

    return paragraph
  }

  /**
   * 获取标题级别
   * @param {Object} paragraphElement - 段落元素
   * @returns {number|null} 标题级别或null
   */
  getHeadingLevel(paragraphElement) {
    // 检查段落属性中的样式信息
    if (paragraphElement.props && paragraphElement.props.pr) {
      const pPr = paragraphElement.props.pr
      // 这里需要根据实际的样式信息来判断是否是标题
      // 暂时返回null，后续可以根据需要完善
    }
    return null
  }

  /**
   * 处理文本运行
   * @param {Object} runElement - 文本运行元素
   * @returns {Array} TipTap文本节点数组
   */
  processTextRun(runElement) {
    const textNodes = []

    if (runElement.children) {
      for (const child of runElement.children) {
        if (child.type === 't') {
          // 处理文本节点
          const textNode = this.processTextNode(child, runElement)
          if (textNode) {
            textNodes.push(textNode)
          }
        }
      }
    }

    return textNodes
  }

  /**
   * 处理文本节点
   * @param {Object} textElement - 文本元素
   * @param {Object} runElement - 父级文本运行元素
   * @returns {Object|null} TipTap文本节点
   */
  processTextNode(textElement, runElement) {
    // 获取文本内容
    const text = this.getTextContent(textElement)
    if (!text) {
      return null
    }

    const textNode = {
      type: 'text',
      text: text
    }

    // 提取格式标记
    const marks = this.extractMarksFromRun(runElement)
    if (marks.length > 0) {
      textNode.marks = marks
    }



    return textNode
  }

  /**
   * 获取文本内容
   * @param {Object} textElement - 文本元素
   * @returns {string} 文本内容
   */
  getTextContent(textElement) {
    if (textElement.children && textElement.children.length > 0) {
      return textElement.children.join('')
    }
    return ''
  }

  /**
   * 从文本运行中提取格式标记
   * @param {Object} runElement - 文本运行元素
   * @returns {Array} 标记数组
   */
  extractMarksFromRun(runElement) {
    const marks = []

    if (runElement.props && runElement.props.pr) {
      const rPr = runElement.props.pr

      // 检查rPr的子元素来确定格式
      if (rPr.children) {
        for (const child of rPr.children) {
          // child是DOM节点，需要检查其name属性
          const tagName = child.name

          switch (tagName) {
            case 'w:b':
              marks.push({ type: 'bold' })
              break
            case 'w:i':
              marks.push({ type: 'italic' })
              break
            case 'w:u':
              marks.push({ type: 'underline' })
              break
            case 'w:strike':
              marks.push({ type: 'strike' })
              break
            case 'w:color':
              if (child.attribs && child.attribs['w:val']) {
                const color = '#' + child.attribs['w:val']
                marks.push({
                  type: 'textStyle',
                  attrs: { color }
                })
              }
              break
            case 'w:sz':
              if (child.attribs && child.attribs['w:val']) {
                const fontSize = Math.round(parseInt(child.attribs['w:val']) / 2) + 'pt'
                marks.push({
                  type: 'textStyle',
                  attrs: { fontSize }
                })
              }
              break
            case 'w:spacing':
              // Word字间距导入支持
              if (child.attribs && child.attribs['w:val']) {
                // Word的spacing单位是20分之一磅
                const spacingValue = parseInt(child.attribs['w:val'])
                if (!isNaN(spacingValue) && spacingValue !== 0) {
                  const ptValue = (spacingValue / 20).toFixed(1)
                  marks.push({
                    type: 'textStyle',
                    attrs: { letterSpacing: `${ptValue}pt` }
                  })
                }
              }
              break
          }
        }
      }
    }

    return marks
  }

  /**
   * 创建空段落
   * @returns {Object} 空段落节点
   */
  createEmptyParagraph() {
    return {
      type: 'paragraph',
      content: [{
        type: 'text',
        text: ''
      }]
    }
  }

  /**
   * 转换文档为TipTap JSON格式（保留原有方法作为备用）
   * @param {Object} doc - docx4js文档对象
   * @returns {Promise<Object>} TipTap JSON文档
   */
  async convertDocument(doc) {
    const tipTapDoc = {
      type: 'doc',
      content: []
    }

    try {
      // 获取文档主体
      const body = doc.officeDocument?.body
      if (!body) {
        console.warn('文档主体为空')
        return this.createEmptyDocument()
      }

      // 遍历文档元素
      if (body.children && Array.isArray(body.children)) {
        for (const element of body.children) {
          const convertedNode = await this.convertElement(element)
          if (convertedNode) {
            tipTapDoc.content.push(convertedNode)
          }
        }
      }

      // 如果没有内容，添加空段落
      if (tipTapDoc.content.length === 0) {
        tipTapDoc.content.push(this.createEmptyParagraph())
      }

      return tipTapDoc
    } catch (error) {
      console.error('文档转换失败:', error)
      return this.createEmptyDocument()
    }
  }

  /**
   * 转换单个元素
   * @param {Object} element - docx4js元素对象
   * @returns {Promise<Object|null>} TipTap节点或null
   */
  async convertElement(element) {
    if (!element || !element.type) {
      return null
    }

    console.log(`转换元素类型: ${element.type}`, element)

    try {
      switch (element.type) {
        case 'paragraph':
          return this.convertParagraph(element)
        case 'table':
          return this.convertTable(element)
        case 'list':
          return this.convertList(element)
        default:
          console.warn(`不支持的元素类型: ${element.type}`)
          return null
      }
    } catch (error) {
      console.error(`转换元素失败 (${element.type}):`, error)
      return null
    }
  }

  /**
   * 转换段落
   * @param {Object} para - 段落对象
   * @returns {Object} TipTap段落节点
   */
  convertParagraph(para) {
    const node = {
      type: 'paragraph',
      attrs: this.extractParagraphAttrs(para),
      content: []
    }

    // 转换段落内容
    if (para.children && Array.isArray(para.children)) {
      for (const child of para.children) {
        const inlineNode = this.convertInlineElement(child)
        if (inlineNode) {
          node.content.push(inlineNode)
        }
      }
    }

    // 如果段落为空，确保有空内容
    if (node.content.length === 0) {
      // 空段落不需要content数组
    }

    return node
  }

  /**
   * 提取段落属性
   * @param {Object} para - 段落对象
   * @returns {Object} 段落属性
   */
  extractParagraphAttrs(para) {
    const attrs = {}
    
    // 获取段落样式
    const style = para.style || {}
    
    // 对齐方式
    if (style.alignment) {
      attrs.textAlign = this.mapAlignment(style.alignment)
    }
    
    // 缩进
    if (style.indent) {
      attrs.indent = this.convertIndent(style.indent)
    }

    return attrs
  }

  /**
   * 转换内联元素
   * @param {Object} element - 内联元素
   * @returns {Object|null} TipTap内联节点
   */
  convertInlineElement(element) {
    if (!element) return null

    switch (element.type) {
      case 'text':
      case 'run':
        return this.convertTextRun(element)
      case 'hyperlink':
        return this.convertHyperlink(element)
      default:
        console.warn(`不支持的内联元素类型: ${element.type}`)
        return null
    }
  }

  /**
   * 转换文本运行
   * @param {Object} run - 文本运行对象
   * @returns {Object} TipTap文本节点
   */
  convertTextRun(run) {
    const text = this.extractText(run)
    if (!text) return null

    const node = {
      type: 'text',
      text: text
    }

    // 提取文本格式
    const marks = this.extractTextMarks(run)
    if (marks.length > 0) {
      node.marks = marks
    }

    return node
  }

  /**
   * 提取文本内容
   * @param {Object} run - 文本运行对象
   * @returns {string} 文本内容
   */
  extractText(run) {
    if (run.text) return run.text
    if (run.children) {
      return run.children
        .map(child => child.text || '')
        .join('')
    }
    return ''
  }

  /**
   * 提取文本标记
   * @param {Object} run - 文本运行对象
   * @returns {Array} 标记数组
   */
  extractTextMarks(run) {
    const marks = []
    const style = run.style || {}

    // 粗体
    if (style.bold) {
      marks.push({ type: 'bold' })
    }

    // 斜体
    if (style.italic) {
      marks.push({ type: 'italic' })
    }

    // 下划线
    if (style.underline) {
      marks.push({ type: 'underline' })
    }

    // 删除线
    if (style.strike) {
      marks.push({ type: 'strike' })
    }

    // 文本样式（颜色、字体大小等）
    const textStyleAttrs = this.extractTextStyleAttrs(style)
    if (Object.keys(textStyleAttrs).length > 0) {
      marks.push({
        type: 'textStyle',
        attrs: textStyleAttrs
      })
    }

    return marks
  }

  /**
   * 提取文本样式属性
   * @param {Object} style - 样式对象
   * @returns {Object} 文本样式属性
   */
  extractTextStyleAttrs(style) {
    const attrs = {}

    // 字体颜色
    if (style.color) {
      attrs.color = this.convertColor(style.color)
    }

    // 字体大小
    if (style.fontSize) {
      attrs.fontSize = this.convertFontSize(style.fontSize)
    }

    // 字体名称
    if (style.fontFamily) {
      attrs.fontFamily = style.fontFamily
    }

    return attrs
  }

  /**
   * 映射对齐方式
   * @param {string} alignment - Word对齐方式
   * @returns {string} TipTap对齐方式
   */
  mapAlignment(alignment) {
    const alignmentMap = {
      'left': 'left',
      'center': 'center',
      'right': 'right',
      'justify': 'justify',
      'both': 'justify'
    }
    return alignmentMap[alignment] || 'left'
  }

  /**
   * 转换缩进
   * @param {number|string} indent - 缩进值
   * @returns {number} 缩进级别
   */
  convertIndent(indent) {
    if (typeof indent === 'number') {
      return Math.max(0, Math.floor(indent / 720)) // 720 twips = 1 level
    }
    return 0
  }

  /**
   * 转换颜色
   * @param {string} color - 颜色值
   * @returns {string} 标准颜色值
   */
  convertColor(color) {
    if (!color) return null
    
    // 如果已经是十六进制格式
    if (color.startsWith('#')) {
      return color
    }
    
    // 如果是RGB格式，转换为十六进制
    if (color.startsWith('rgb')) {
      // 简单处理，实际可能需要更复杂的转换
      return color
    }
    
    // 添加#前缀
    return `#${color}`
  }

  /**
   * 转换字体大小
   * @param {string|number} fontSize - 字体大小
   * @returns {string} 标准字体大小
   */
  convertFontSize(fontSize) {
    if (!fontSize) return null
    
    // 如果已经有单位
    if (typeof fontSize === 'string' && (fontSize.includes('pt') || fontSize.includes('px'))) {
      return fontSize
    }
    
    // 假设输入是pt值
    return `${fontSize}pt`
  }

  /**
   * 创建空文档
   * @returns {Object} 空的TipTap文档
   */
  createEmptyDocument() {
    return {
      type: 'doc',
      content: [this.createEmptyParagraph()]
    }
  }

  /**
   * 创建空段落
   * @returns {Object} 空段落节点
   */
  createEmptyParagraph() {
    return {
      type: 'paragraph',
      content: []
    }
  }

  /**
   * 转换表格（占位实现）
   * @param {Object} table - 表格对象
   * @returns {Object|null} TipTap表格节点
   */
  convertTable(table) {
    console.log('表格转换暂未实现:', table)
    return null
  }

  /**
   * 转换列表（占位实现）
   * @param {Object} list - 列表对象
   * @returns {Object|null} TipTap列表节点
   */
  convertList(list) {
    console.log('列表转换暂未实现:', list)
    return null
  }

  /**
   * 转换超链接（占位实现）
   * @param {Object} hyperlink - 超链接对象
   * @returns {Object|null} TipTap链接节点
   */
  convertHyperlink(hyperlink) {
    console.log('超链接转换暂未实现:', hyperlink)
    return null
  }
}
