import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, BorderStyle } from 'docx'
import { progressManager } from './progressManager.js'
import { saveAs } from 'file-saver'
import { latexExporter } from './latexExporter.js'
import { toSemanticDoc } from '../doc/semanticDoc.js'

// 修复浏览器环境中的nodebuffer问题
if (typeof window !== 'undefined') {
  // 确保JSZip使用正确的压缩方法
  const originalPacker = Packer.toBuffer
  if (originalPacker) {
    Packer.toBuffer = async function(doc) {
      try {
        return await originalPacker.call(this, doc)
      } catch (error) {
        if (error.message.includes('nodebuffer is not supported')) {
          // 使用blob方法作为替代
          const blob = await Packer.toBlob(doc)
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(new Uint8Array(reader.result))
            reader.onerror = reject
            reader.readAsArrayBuffer(blob)
          })
        }
        throw error
      }
    }
  }
}

/**
 * Word文档导出工具类
 * 负责将TipTap编辑器内容转换为Word文档
 */
export class WordExporter {
  constructor(options = {}) {
    this.document = null
    this.sections = []
    this.currentSection = []
    this.currentChartIndex = 0 // 图表索引计数器
    this.imageCounter = 1 // 图片计数器，用于生成图片名称
    this.hasFormulas = false // 标记文档是否包含数学公式

    // 视图模式: 'word' 或 'web'，影响导出时的默认间距值
    // - word视图: 符合Word标准的间距（段前0，段后8pt）
    // - web视图: 符合编辑器CSS的间距（段前1.2rem，段后0.5rem）
    this.viewMode = options.viewMode || 'web'

    // CSS变量到HEX颜色的映射表
    // 注意：编辑器使用的是 px-editor 前缀，不是 isle 前缀
    this.cssColorMap = {
      // px-editor 前缀的CSS变量（实际使用的）
      'var(--px-editor-color-base)': '#030305',  // 黑色
      'var(--px-editor-color-white)': '#fdfdfd',
      'var(--px-editor-color-black)': '#030305',
      'var(--px-editor-color-purple)': '#ae3ec9',
      'var(--px-editor-color-red)': '#f03e3e',
      'var(--px-editor-color-yellow)': '#f59f00',
      'var(--px-editor-color-blue)': '#3b82f6',
      'var(--px-editor-color-green)': '#37b24d',
      'var(--px-editor-color-orange)': '#f76707',
      'var(--px-editor-color-pink)': '#d6336c',
      'var(--px-editor-color-gray)': '#787774',
      'var(--px-editor-color-brown)': '#9f6b53',
      // 兼容旧的 isle 前缀（如果有的话）
      'var(--isle-color-red)': '#f03e3e',
      'var(--isle-color-orange)': '#f76707',
      'var(--isle-color-yellow)': '#f59f00',
      'var(--isle-color-green)': '#37b24d',
      'var(--isle-color-blue)': '#3b82f6',
      'var(--isle-color-purple)': '#ae3ec9',
      'var(--isle-color-pink)': '#d6336c',
      'var(--isle-color-gray)': '#787774',
      'var(--isle-color-brown)': '#9f6b53',
      'var(--isle-color-black)': '#000000',
      'var(--isle-color-white)': '#ffffff',
      'var(--isle-color-base)': '#000000'
    }
  }

  /**
   * 导出Word文档 - 完整版本支持所有元素和排版
   * @param {Object} content - TipTap JSON内容
   * @param {string} filename - 文件名
   * @param {Object} options - 导出选项
   */
  async exportToWord(content, filename = 'document.docx', options = {}) {
    try {
      const semanticDoc = toSemanticDoc(content)
      console.log('=== 开始完整Word文档导出 ===', content)

      // 显示进度条
      progressManager.show(100, '正在导出Word文档...')
      progressManager.updateProgress(5, '准备导出...')

      // 重置图表索引计数器
      this.currentChartIndex = 0

      // 重置文档状态
      this.reset()

      progressManager.updateProgress(10, '正在解析文档内容...')

      // 解析内容并生成Word元素
      await this.parseContent(semanticDoc)

      progressManager.updateProgress(70, '内容解析完成，正在生成Word文档...')

      // 验证文档内容
      if (!this.currentSection || this.currentSection.length === 0) {
        console.warn('文档内容为空，添加默认段落')
        this.currentSection = [new Paragraph({
          children: [new TextRun({ text: '文档内容为空' })]
        })]
      }

      console.log(`最终生成 ${this.currentSection.length} 个文档元素`)

      // 创建Word文档配置
      const documentConfig = {
        sections: [{
          properties: {
            page: {
              margin: {
                top: 1440,    // 1英寸 = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: this.currentSection
        }]
      }

      progressManager.updateProgress(80, '正在创建Word文档...')

      console.log('创建Document对象...')
      this.document = new Document(documentConfig)
      console.log('Document创建成功')

      progressManager.updateProgress(90, '正在生成文件...')

      // 生成并下载文件 - 使用toBlob避免nodebuffer问题
      console.log('开始生成文件...')
      let blob = await Packer.toBlob(this.document)
      console.log('文件生成成功')

      // 如果文档包含公式，进行后处理
      if (this.hasFormulas) {
        console.log('✅ 文档包含数学公式，开始后处理...')
        progressManager.updateProgress(92, '正在处理数学公式...')

        try {
          // 使用latexExporter后处理DOCX，替换OMML占位符
          blob = await latexExporter.postProcessDocxOMML(blob)
          console.log('✅ 数学公式后处理完成')
        } catch (error) {
          console.error('❌ 数学公式后处理失败:', error)
          // 继续使用原始blob，公式将显示为占位符文本
        }
      }

      progressManager.updateProgress(95, '正在下载文件...')

      saveAs(blob, filename)
      console.log('=== Word文档导出完成 ===', filename)

      // 显示成功状态
      progressManager.setSuccess()

      return true
    } catch (error) {
      console.error('=== Word文档导出失败 ===', error)
      console.error('错误详情:', error.message)
      console.error('错误堆栈:', error.stack)

      // 显示错误状态
      progressManager.setError(error.message)

      throw error
    }
  }

  /**
   * 重置导出器状态
   */
  reset() {
    this.document = null
    this.sections = []
    this.currentSection = []
    this.imageCounter = 1 // 重置图片计数器
    this.hasFormulas = false // 重置公式标志
  }

  /**
   * 将各种颜色格式转换为Word需要的HEX格式（不带#）
   * @param {string} color - 颜色值（可能是HEX、RGB、RGBA或CSS变量）
   * @returns {string|null} HEX颜色值（不带#），如果无法转换则返回null
   */
  convertColorToHex(color) {
    if (!color || typeof color !== 'string') {
      return null
    }

    const trimmedColor = color.trim()
    console.log('🎨 转换颜色:', trimmedColor)

    // 1. 处理CSS变量格式：var(--isle-color-red)
    if (trimmedColor.startsWith('var(')) {
      const mappedColor = this.cssColorMap[trimmedColor]
      if (mappedColor) {
        console.log('✅ CSS变量映射:', trimmedColor, '→', mappedColor)
        return mappedColor.replace('#', '').toUpperCase()
      }
      console.log('⚠️ 未找到CSS变量映射:', trimmedColor)
      return null
    }

    // 2. 处理HEX格式：#FF0000 或 #F00
    if (trimmedColor.startsWith('#')) {
      let hex = trimmedColor.substring(1)
      // 处理3位HEX：#F00 → FF0000
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('')
      }
      if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) {
        console.log('✅ HEX格式:', hex.toUpperCase())
        return hex.toUpperCase()
      }
      console.log('⚠️ 无效的HEX格式:', trimmedColor)
      return null
    }

    // 3. 处理RGB格式：rgb(255, 0, 0)
    const rgbMatch = trimmedColor.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1])
      const g = parseInt(rgbMatch[2])
      const b = parseInt(rgbMatch[3])
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()
        console.log('✅ RGB格式:', trimmedColor, '→', hex)
        return hex
      }
    }

    // 4. 处理RGBA格式：rgba(255, 0, 0, 1)
    const rgbaMatch = trimmedColor.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)$/)
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1])
      const g = parseInt(rgbaMatch[2])
      const b = parseInt(rgbaMatch[3])
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()
        console.log('✅ RGBA格式:', trimmedColor, '→', hex)
        return hex
      }
    }

    console.log('⚠️ 无法识别的颜色格式:', trimmedColor)
    return null
  }

	  /**
	   * 将 textIndent 属性转换为 Word 的首行缩进 twips 值
	   * textIndent 在编辑器中统一存储为 "Xem"，这里做一次安全转换
	   *
	   * @param {string|null} textIndent
	   * @returns {number|null} twips 值，null 表示不设置
	   */
	  getFirstLineIndentTwips(textIndent) {
	    if (!textIndent || typeof textIndent !== 'string') {
	      return null
	    }

	    const value = parseFloat(textIndent)
	    if (isNaN(value) || value === 0) {
	      return null
	    }

	    // 目前 textIndent 扩展会把 pt/px 统一转换成 em，这里按 em → twips 处理：
	    // 假设 1em ≈ 12pt，对应 12 * 20 = 240 twips
	    const unitMatch = textIndent.trim().match(/[a-zA-Z%]+$/)
	    const unit = unitMatch ? unitMatch[0].toLowerCase() : 'em'
	    let emValue = value

	    if (unit === 'pt') {
	      emValue = value / 12
	    } else if (unit === 'px') {
	      emValue = value / 16
	    } else if (unit === 'rem') {
	      // 在本项目里 1rem ≈ 1em
	      emValue = value
	    }

	    const twips = Math.round(emValue * 240)
	    return twips > 0 ? twips : null
	  }

  /**
   * 创建Paragraph对象
   * @param {Object} config - Paragraph配置
   * @returns {Paragraph} Paragraph对象
   */
  createSafeParagraph(config) {
    try {
      return new Paragraph(config)
    } catch (error) {
      console.error('Paragraph创建失败:', error)
      console.error('失败时的配置:', config)
      // 返回最简单的段落
      return new Paragraph({
        children: [new TextRun({ text: '[段落创建失败]' })]
      })
    }
  }

  /**
   * 创建TextRun对象
   * @param {Object} options - TextRun选项
   * @returns {TextRun} TextRun对象
   */
  createSafeTextRun(options) {
    try {
      return new TextRun(options)
    } catch (error) {
      console.error('TextRun创建失败:', error)
      console.error('失败时的选项:', options)
      // 返回最简单的文本运行
      return new TextRun({ text: options?.text || '[文本创建失败]' })
    }
  }

  /**
   * 创建ImageRun对象
   * @param {Object} options - ImageRun选项
   * @returns {ImageRun} ImageRun对象
   */
  createSafeImageRun(options) {
    try {
      return new ImageRun(options)
    } catch (error) {
      console.error('ImageRun创建失败:', error)
      console.error('失败时的选项:', options)
      // 返回文本占位符
      return new TextRun({ text: '[图片创建失败]' })
    }
  }

  /**
   * 解析TipTap内容
   * @param {Object} content - TipTap JSON内容
   */
  async parseContent(content) {
    console.log('=== 开始解析TipTap内容 ===')
    console.log('原始内容:', JSON.stringify(content, null, 2))

    if (!content) {
      console.warn('内容对象为空')
      this.currentSection.push(new Paragraph({
        children: [new TextRun('[文档内容为空]')]
      }))
      return
    }

    if (!content.content || !Array.isArray(content.content)) {
      console.warn('内容数组为空或无效')
      this.currentSection.push(new Paragraph({
        children: [new TextRun('[文档内容格式无效]')]
      }))
      return
    }

    console.log(`发现 ${content.content.length} 个顶级节点`)

    for (let i = 0; i < content.content.length; i++) {
      const node = content.content[i]
      console.log(`处理第 ${i + 1} 个节点:`, node?.type, node)

      if (node) {
        try {
          await this.parseNode(node)
          console.log(`节点 ${i + 1} 处理成功`)
        } catch (error) {
          console.error(`节点 ${i + 1} 处理失败:`, error)
          console.error('失败的节点:', node)
          // 添加错误占位符而不是中断整个过程
          this.currentSection.push(new Paragraph({
            children: [new TextRun(`[节点解析失败: ${node?.type || '未知类型'}]`)]
          }))
        }
      }
    }

    // 如果没有生成任何内容，添加空段落
    if (this.currentSection.length === 0) {
      console.warn('没有生成任何内容，添加空段落')
      this.currentSection.push(new Paragraph({
        children: [new TextRun(' ')] // 使用空格而不是空字符串，避免Word兼容性问题
      }))
    }

    console.log(`=== 内容解析完成，生成了 ${this.currentSection.length} 个段落 ===`)
  }

  /**
   * 解析单个节点
   * @param {Object} node - TipTap节点
   */
  async parseNode(node) {
    if (!node || !node.type) {
      console.warn('无效节点，跳过')
      return
    }

    console.log(`解析节点: ${node.type}`, node)

    try {
      switch (node.type) {
        case 'paragraph':
          await this.parseParagraph(node)
          break
        case 'heading':
          await this.parseHeading(node)
          break
        case 'bulletList':
        case 'orderedList':
          await this.parseList(node)
          break
        case 'taskList':
          await this.parseTaskList(node)
          break
        case 'table':
          await this.parseTable(node)
          break
        case 'codeBlock':
          await this.parseCodeBlock(node)
          break
        case 'blockquote':
          await this.parseBlockquote(node)
          break
        case 'image':
          await this.parseImage(node)
          break
        case 'chart':
        case 'echarts':
          await this.parseChart(node)
          break
	        case 'mindmap':
	          await this.parseMindmap(node)
	          break
        case 'audio':
          this.parseAudio(node)
          break
        case 'video':
          this.parseVideo(node)
          break
        case 'taskList':
          await this.parseTaskList(node)
          break
        case 'horizontalRule':
        case 'divider':
        case 'separator':
          this.parseHorizontalRule(node)
          break
        case 'displayMath':
          // 块级数学公式（如果将来支持的话）
          await this.parseDisplayMath(node)
          break
        case 'listItem':
          // listItem通常由父列表处理，这里添加兜底
          await this.parseListItem(node)
          break
        case 'tableRow':
        case 'tableCell':
        case 'tableHeader':
          // 这些通常由table处理，这里添加兜底
          console.warn(`${node.type} 应该由父表格处理`)
          break
        default:
          console.warn('未支持的节点类型:', node.type)
          // 尝试作为段落处理或解析子节点
          if (node.content && Array.isArray(node.content)) {
            console.log('尝试将未知节点作为段落处理')
            await this.parseParagraph(node)
          } else {
            // 添加占位符
            this.currentSection.push(new Paragraph({
              children: [new TextRun(`[不支持的节点类型: ${node.type}]`)]
            }))
          }
          break
      }
    } catch (error) {
      console.error(`解析节点 ${node.type} 时出错:`, error)
      console.error('错误节点详情:', node)

      // 添加错误占位符
      this.currentSection.push(new Paragraph({
        children: [new TextRun(`[节点解析错误: ${node.type} - ${error.message}]`)]
      }))
    }
  }

  /**
   * 解析段落
   * @param {Object} node - 段落节点
   */
   async parseParagraph(node) {
    console.log('=== 解析段落开始 ===', node)
    const textRuns = []
    const alignment = this.getAlignment(node.attrs?.textAlign)

    if (node.content && Array.isArray(node.content)) {
      console.log(`段落包含 ${node.content.length} 个子节点`)
      for (const childNode of node.content) {
        if (childNode) {
          console.log('处理子节点:', childNode.type, childNode)
          const runs = this.parseInlineNode(childNode)
          console.log('子节点生成的TextRuns:', runs)
          if (Array.isArray(runs)) {
            textRuns.push(...runs.filter(Boolean))
          }
        }
      }
    }

    // 如果没有内容，添加空段落
    if (textRuns.length === 0) {
      console.log('段落无内容，添加空TextRun')
      textRuns.push(new TextRun(' ')) // 使用空格而不是空字符串，避免Word兼容性问题
    }

    console.log(`段落最终包含 ${textRuns.length} 个TextRuns:`, textRuns)

    // 创建段落配置，确保所有属性都有效
    const paragraphConfig = {
      children: textRuns.filter(Boolean)
    }

    // 只有当alignment不是默认值时才添加
    if (alignment && alignment !== AlignmentType.LEFT) {
      paragraphConfig.alignment = alignment
    }

    // 处理行距
    if (node.attrs?.lineHeight) {
      const lineHeight = parseFloat(node.attrs.lineHeight)
      if (!isNaN(lineHeight) && lineHeight > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          line: Math.round(lineHeight * 240), // Word使用240为单倍行距
          lineRule: "atLeast" // 最小行距规则
        }
      }
    }

    // 处理段前距 - 视图感知导出
    // 根据当前视图模式，使用对应的默认值
    // - Word视图: 默认null (Word Normal样式为0pt)
    // - Web视图: 默认1.2rem (编辑器CSS默认值)
    const defaultSpacingBefore = this.viewMode === 'word' ? null : '1.2rem'
    const spacingBefore = node.attrs?.spacingBefore !== undefined &&
                          node.attrs?.spacingBefore !== null
      ? node.attrs.spacingBefore
      : defaultSpacingBefore

    if (spacingBefore) {
      const spacingBeforeValue = parseFloat(spacingBefore)
      if (!isNaN(spacingBeforeValue) && spacingBeforeValue > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          before: Math.round(spacingBeforeValue * 240)  // 1rem = 240 twips
        }
      }
    }

    // 处理段后距 - 视图感知导出
    // 根据当前视图模式，使用对应的默认值
    // - Word视图: 默认0.67rem (8pt, Word Normal样式)
    // - Web视图: 默认0.5rem (编辑器CSS默认值)
    const defaultSpacingAfter = this.viewMode === 'word' ? '0.67rem' : '0.5rem'
    const spacingAfter = node.attrs?.spacingAfter !== undefined &&
                         node.attrs?.spacingAfter !== null
      ? node.attrs.spacingAfter
      : defaultSpacingAfter

    if (spacingAfter) {
      const spacingAfterValue = parseFloat(spacingAfter)
      if (!isNaN(spacingAfterValue) && spacingAfterValue > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          after: Math.round(spacingAfterValue * 240)  // 1rem = 240 twips
        }
      }
    }

	    // 处理首行缩进（textIndent）
	    if (node.attrs?.textIndent) {
	      const firstLineTwips = this.getFirstLineIndentTwips(node.attrs.textIndent)
	      if (firstLineTwips) {
	        paragraphConfig.indent = {
	          ...(paragraphConfig.indent || {}),
	          firstLine: firstLineTwips
	        }
	      }
	    }

    console.log('段落配置:', paragraphConfig)

    const paragraph = this.createSafeParagraph(paragraphConfig)
    console.log('创建的段落对象:', paragraph)
    console.log('段落对象类型:', paragraph.constructor.name)

    this.currentSection.push(paragraph)
    console.log(`=== 段落解析完成，当前section包含 ${this.currentSection.length} 个元素 ===`)
  }

  /**
   * 解析标题
   * @param {Object} node - 标题节点
   */
  async parseHeading(node) {
    const level = Math.max(1, Math.min(6, node.attrs?.level || 1))
    const textRuns = []

    // 定义标题的默认字体大小（与编辑器CSS一致）
    // 编辑器CSS: h1: 1.875rem, h2: 1.5rem, h3: 1.25rem, h4: 1.125rem, h5: 1rem, h6: 0.875rem
    // 1rem = 16px = 12pt，转换为Word的半点单位（half-points）
    const headingFontSizes = {
      1: 52,  // 26pt = 52 half-points (与字号选择器保持一致)
      2: 36,  // 18pt = 36 half-points
      3: 32,  // 16pt = 32 half-points
      4: 28,  // 14pt = 28 half-points
      5: 24,  // 12pt = 24 half-points
      6: 21   // 10.5pt = 21 half-points
    }

    // 设置当前标题的默认字号，供 createTextRun 使用
    this.currentHeadingDefaultSize = headingFontSizes[level]
    // 设置标题默认为粗体
    this.currentHeadingDefaultBold = true

    if (node.content && Array.isArray(node.content)) {
      for (const childNode of node.content) {
        if (childNode) {
          const runs = this.parseInlineNode(childNode)
          if (Array.isArray(runs)) {
            textRuns.push(...runs.filter(Boolean))
          }
        }
      }
    }

    // 如果没有内容，添加空文本（带默认样式）
    if (textRuns.length === 0) {
      textRuns.push(new TextRun({
        text: ' ',
        size: headingFontSizes[level],
        bold: true,
        color: '000000'
      }))
    }

    const headingLevels = {
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4,
      5: HeadingLevel.HEADING_5,
      6: HeadingLevel.HEADING_6
    }

    const paragraphConfig = {
      children: textRuns.filter(Boolean),
      heading: headingLevels[level] || HeadingLevel.HEADING_1
    }

    // 处理标题文本对齐
    if (node.attrs?.textAlign) {
      const alignment = this.getAlignment(node.attrs.textAlign)
      if (alignment && alignment !== AlignmentType.LEFT) {
        paragraphConfig.alignment = alignment
      }
    }

    // 处理标题行距
    if (node.attrs?.lineHeight) {
      const lineHeight = parseFloat(node.attrs.lineHeight)
      if (!isNaN(lineHeight) && lineHeight > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          line: Math.round(lineHeight * 240), // Word使用240为单倍行距
          lineRule: "atLeast" // 最小行距规则
        }
      }
    } else {
      // 如果没有显式设置行距，使用编辑器CSS中的默认行距
      // h1: 2.25rem, h2: 2rem, h3: 1.75rem, h4: 1.75rem, h5: 1.5rem, h6: 1.25rem
      const headingLineHeights = {
        1: 2.25,
        2: 2.0,
        3: 1.75,
        4: 1.75,
        5: 1.5,
        6: 1.25
      }
      const defaultLineHeight = headingLineHeights[level]
      if (defaultLineHeight) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          line: Math.round(defaultLineHeight * 240),
          lineRule: "atLeast"
        }
      }
    }

    // 处理标题段前距 - 视图感知导出
    // 根据当前视图模式和标题级别，使用对应的默认值
    // Word视图: 符合Word Heading样式的段前距
    // Web视图: 符合编辑器CSS的段前距
    const headingDefaultsWord = {
      spacingBefore: { 1: '2.0rem', 2: '1.33rem', 3: '1.33rem', 4: '1.17rem', 5: '0.83rem', 6: '0.83rem' },
      spacingAfter: { 1: null, 2: null, 3: null, 4: null, 5: null, 6: null }
    }
    const headingDefaultsWeb = {
      spacingBefore: { 1: '2.5rem', 2: '2.5rem', 3: '2.5rem', 4: '2.0rem', 5: '2.0rem', 6: '2.0rem' },
      spacingAfter: { 1: '0.8rem', 2: '0.7rem', 3: '0.6rem', 4: '0.5rem', 5: '0.5rem', 6: '0.5rem' }
    }
    const headingDefaults = this.viewMode === 'word' ? headingDefaultsWord : headingDefaultsWeb

    const defaultHeadingSpacingBefore = headingDefaults.spacingBefore[level]
    const headingSpacingBefore = node.attrs?.spacingBefore !== undefined &&
                                  node.attrs?.spacingBefore !== null
      ? node.attrs.spacingBefore
      : defaultHeadingSpacingBefore

    if (headingSpacingBefore) {
      const spacingBeforeValue = parseFloat(headingSpacingBefore)
      if (!isNaN(spacingBeforeValue) && spacingBeforeValue > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          before: Math.round(spacingBeforeValue * 240)  // 1rem = 240 twips
        }
      }
    }

    // 处理标题段后距 - 视图感知导出
    const defaultHeadingSpacingAfter = headingDefaults.spacingAfter[level]
    const headingSpacingAfter = node.attrs?.spacingAfter !== undefined &&
                                node.attrs?.spacingAfter !== null
      ? node.attrs.spacingAfter
      : defaultHeadingSpacingAfter

    if (headingSpacingAfter) {
      const spacingAfterValue = parseFloat(headingSpacingAfter)
      if (!isNaN(spacingAfterValue) && spacingAfterValue > 0) {
        paragraphConfig.spacing = {
          ...paragraphConfig.spacing,
          after: Math.round(spacingAfterValue * 240)  // 1rem = 240 twips
        }
      }
    }

	    // 处理首行缩进（textIndent）
	    if (node.attrs?.textIndent) {
	      const firstLineTwips = this.getFirstLineIndentTwips(node.attrs.textIndent)
	      if (firstLineTwips) {
	        paragraphConfig.indent = {
	          ...(paragraphConfig.indent || {}),
	          firstLine: firstLineTwips
	        }
	      }
	    }

    const paragraph = this.createSafeParagraph(paragraphConfig)
    this.currentSection.push(paragraph)

    // 清除标题默认样式设置
    this.currentHeadingDefaultSize = null
    this.currentHeadingDefaultBold = null
  }

  /**
   * 解析内联节点 - 完整支持所有内联元素
   * @param {Object} node - 内联节点
   * @returns {Array<TextRun>} 文本运行数组
   */
  parseInlineNode(node) {
    if (!node) return []

    console.log('解析内联节点:', node.type, node)

    switch (node.type) {
      case 'text':
        // 文本节点 - 支持所有文本标记
        return [this.createTextRun(node.text, node.marks)]

      case 'hardBreak':
        // 硬换行 - 不要包含text属性，避免Word兼容性警告
        return [new TextRun({ break: 1 })]

      case 'link':
        // 链接节点
        return this.parseLink(node)

      case 'mention':
        // 提及节点
        const mentionText = `@${node.attrs?.label || node.attrs?.id || ''}`
        return [this.createTextRun(mentionText, [{ type: 'bold' }, { type: 'color', attrs: { color: '#0066CC' } }])]

      case 'emoji':
        // 表情符号
        return [this.createTextRun(node.attrs?.emoji || '😀')]

      case 'math':
        // 数学公式（简化处理）
        const mathText = node.attrs?.latex || node.attrs?.content || '[数学公式]'
        return [this.createTextRun(mathText, [{ type: 'italic' }])]

      case 'inlineMath':
        // LaTeX内联公式（@aarkue/tiptap-math-extension）
        const latexCode = node.attrs?.latex || '[LaTeX公式]'
        console.log('处理inlineMath节点:', latexCode)

        // 标记文档包含公式
        this.hasFormulas = true

        try {
          // 使用latexExporter转换LaTeX为OMML占位符
          const ommlPlaceholder = latexExporter.convertLatexToWordMath(latexCode, false)

          if (ommlPlaceholder && ommlPlaceholder._isOMMLPlaceholder) {
            console.log('✅ LaTeX转OMML占位符成功:', latexCode)
            // 返回包含占位符文本的TextRun
            return [new TextRun(ommlPlaceholder.text)]
          } else {
            throw new Error('OMML占位符生成失败')
          }

        } catch (error) {
          console.error('❌ 公式转换失败:', latexCode, error)

          // 降级策略：使用文本显示
          const displayText = `$${latexCode}$`
          return [this.createTextRun(displayText, [
            { type: 'italic' },
            { type: 'color', attrs: { color: '#FF0000' } }, // 红色表示转换失败
            { type: 'bold' }
          ])]
        }

      default:
        console.warn('未知的内联节点类型:', node.type)

        // 尝试解析子内容
        if (node.content && Array.isArray(node.content)) {
          const textRuns = []
          for (const childNode of node.content) {
            const runs = this.parseInlineNode(childNode)
            if (Array.isArray(runs)) {
              textRuns.push(...runs.filter(Boolean))
            }
          }
          return textRuns
        }

        // 如果有文本属性，直接使用
        if (node.text) {
          return [this.createTextRun(node.text, node.marks)]
        }

        // 如果有attrs.text，使用它
        if (node.attrs?.text) {
          return [this.createTextRun(node.attrs.text, node.marks)]
        }

        // 最后的后备方案
        return [this.createTextRun(`[${node.type}]`, [{ type: 'italic' }])]
    }
  }

  /**
   * 解析链接节点
   * @param {Object} node - 链接节点
   * @returns {Array} TextRun数组
   */
  parseLink(node) {
    const href = node.attrs?.href || ''
    const textRuns = []

    if (node.content) {
      for (const childNode of node.content) {
        const runs = this.parseInlineNode(childNode)
        // 为链接文本添加下划线和蓝色
        runs.forEach(run => {
          if (run.text) {
            run.underline = {}
            run.color = '0000FF'
          }
        })
        textRuns.push(...runs)
      }
    }

    // 如果没有显示文本，使用链接地址
    if (textRuns.length === 0) {
      textRuns.push(new TextRun({
        text: href,
        underline: {},
        color: '0000FF'
      }))
    }

    return textRuns
  }

  /**
   * 创建文本运行对象 - 完整支持所有文本格式
   * @param {string} text - 文本内容
   * @param {Array} marks - 文本标记（粗体、斜体等）
   * @returns {TextRun} 文本运行对象
   */
  createTextRun(text, marks = []) {
    console.log('🎨 创建TextRun:', { text, marks })

    // 确保text不为undefined或null
    const safeText = text || ''
    const options = { text: safeText }

    if (Array.isArray(marks) && marks.length > 0) {
      console.log('🎨 处理marks，数量:', marks.length)
      for (const mark of marks) {
        if (!mark || !mark.type) {
          console.log('⚠️ 跳过无效mark:', mark)
          continue
        }

        console.log('🎨 处理mark类型:', mark.type, '属性:', mark.attrs)

        switch (mark.type) {
          case 'bold':
            options.bold = true
            break
          case 'italic':
            options.italics = true
            break
          case 'underline':
            options.underline = {}
            break
          case 'strike':
            options.strike = true
            break
          case 'code':
            options.font = 'Courier New'
            options.shading = {
              fill: 'F5F5F5'
            }
            break
          case 'subscript':
            options.subScript = true
            break
          case 'superscript':
            options.superScript = true
            break
          case 'textStyle':
            // 处理文本样式：颜色、背景色、字体大小、字体家族
            console.log('🎨 处理textStyle，attrs:', mark.attrs)
            if (mark.attrs?.color) {
              console.log('🎨 发现颜色:', mark.attrs.color)
              const hexColor = this.convertColorToHex(mark.attrs.color)
              if (hexColor) {
                options.color = hexColor
                console.log('✅ 设置颜色为:', options.color)
              } else {
                console.log('⚠️ 颜色转换失败:', mark.attrs.color)
              }
            } else {
              console.log('⚠️ textStyle中没有color属性')
            }
            if (mark.attrs?.backgroundColor) {
              const hexBgColor = this.convertColorToHex(mark.attrs.backgroundColor)
              if (hexBgColor) {
                options.shading = {
                  fill: hexBgColor
                }
                console.log('✅ 设置背景色为:', hexBgColor)
              }
            }
            if (mark.attrs?.fontSize) {
              // 支持多种字体大小格式：12px, 12pt, 12
              let fontSize = mark.attrs.fontSize
              if (typeof fontSize === 'string') {
                fontSize = fontSize.replace(/px|pt/g, '')
              }
              fontSize = parseInt(fontSize)
              if (!isNaN(fontSize) && fontSize > 0) {
                options.size = fontSize * 2 // Word使用半点 (half-points)
              }
            }
            if (mark.attrs?.fontFamily) {
              // 清理字体家族名称
              const fontFamily = mark.attrs.fontFamily.replace(/['"]/g, '')
              if (fontFamily) {
                options.font = fontFamily
              }
            }
            // 字间距支持（统一使用pt单位）
            if (mark.attrs?.letterSpacing) {
              const letterSpacing = mark.attrs.letterSpacing
              if (letterSpacing !== 'normal' && letterSpacing !== '0pt' && letterSpacing !== '0px') {
                let ptValue = parseFloat(letterSpacing);
                // 向后兼容：如果是px单位，转换为pt
                if (letterSpacing.includes('px')) {
                  ptValue = ptValue * 0.75;
                }
                if (!isNaN(ptValue)) {
                  // Word中字间距以20分之一磅为单位
                  options.characterSpacing = Math.round(ptValue * 20)
                }
              }
            }
            break
          case 'color':
            // 独立的颜色标记
            if (mark.attrs?.color) {
              const hexColor = this.convertColorToHex(mark.attrs.color)
              if (hexColor) {
                options.color = hexColor
                console.log('✅ 独立颜色标记，设置颜色为:', hexColor)
              }
            }
            break
          case 'background':
            // 独立的背景色标记
            if (mark.attrs?.backgroundColor) {
              const hexBgColor = this.convertColorToHex(mark.attrs.backgroundColor)
              if (hexBgColor) {
                options.shading = {
                  fill: hexBgColor
                }
                console.log('✅ 独立背景色标记，设置背景色为:', hexBgColor)
              }
            }
            break
          case 'fontSize':
            // 独立的字体大小标记
            if (mark.attrs?.fontSize) {
              let fontSize = mark.attrs.fontSize
              if (typeof fontSize === 'string') {
                fontSize = fontSize.replace(/px|pt/g, '')
              }
              fontSize = parseInt(fontSize)
              if (!isNaN(fontSize) && fontSize > 0) {
                options.size = fontSize * 2
              }
            }
            break
          case 'fontFamily':
            // 独立的字体家族标记
            if (mark.attrs?.fontFamily) {
              const fontFamily = mark.attrs.fontFamily.replace(/['"]/g, '')
              if (fontFamily) {
                options.font = fontFamily
              }
            }
            break
          case 'highlight':
            // 高亮标记
            const highlightColorRaw = mark.attrs?.color || '#FFFF00' // 默认黄色
            const hexHighlight = this.convertColorToHex(highlightColorRaw)
            if (hexHighlight) {
              options.highlight = hexHighlight
              console.log('✅ 设置高亮颜色为:', hexHighlight)
            }
            break
          case 'link':
            // 链接样式
            options.color = '0000FF' // 蓝色
            options.underline = {}
            break
        }
      }
    }

    // 设置默认字体大小（如果没有指定）
    if (!options.size) {
      // 优先使用标题的默认字号，否则使用 12pt
      options.size = this.currentHeadingDefaultSize || 24
    }

    // 设置默认粗体（如果没有指定且在标题中）
    if (options.bold === undefined && this.currentHeadingDefaultBold) {
      options.bold = true
    }

    // 设置默认黑色（如果没有指定颜色）
    // 这确保导出的文本颜色与编辑器显示一致，避免使用Word的默认样式颜色
    if (!options.color) {
      options.color = '000000' // 黑色
      console.log('⚠️ 没有设置颜色，使用默认黑色')
    } else {
      console.log('✅ 已设置颜色:', options.color)
    }

    // 确保所有属性都不是undefined
    Object.keys(options).forEach(key => {
      if (options[key] === undefined) {
        delete options[key]
      }
    })

    console.log('🎨 最终TextRun选项:', options)

    // 设置默认字体为Arial（如果没有指定字体）
    if (!options.font) {
      options.font = 'Arial'
      console.log('✅ 设置默认字体为Arial')
    }

    try {
      const textRun = new TextRun(options)
      console.log('TextRun创建成功')
      return textRun
    } catch (error) {
      console.error('TextRun创建失败:', error)
      console.error('失败时的选项:', options)
      // 返回最简单的TextRun作为后备
      return new TextRun({ text: safeText, size: 24 })
    }
  }

  /**
   * 获取对齐方式
   * @param {string} align - 对齐方式
   * @returns {AlignmentType} Word对齐类型
   */
  getAlignment(align) {
    // 确保返回值不为undefined
    if (!align || typeof align !== 'string') {
      return AlignmentType.LEFT
    }

    switch (align.toLowerCase()) {
      case 'left':
        return AlignmentType.LEFT
      case 'center':
        return AlignmentType.CENTER
      case 'right':
        return AlignmentType.RIGHT
      case 'justify':
        return AlignmentType.JUSTIFIED
      default:
        return AlignmentType.LEFT
    }
  }

  /**
   * 解析任务列表
   * @param {Object} node - 任务列表节点
   */
  async parseTaskList(node) {
    console.log('解析任务列表:', node)

    if (!node.content || !Array.isArray(node.content)) {
      return
    }

    for (const listItem of node.content) {
      if (listItem.type === 'taskItem') {
        await this.parseTaskItem(listItem)
      }
    }
  }

  /**
   * 解析任务项
   * @param {Object} node - 任务项节点
   */
  async parseTaskItem(node) {
    const isChecked = node.attrs?.checked === true
    const checkbox = isChecked ? '☑' : '☐'

    const textRuns = [new TextRun(`${checkbox} `)]

    if (node.content && Array.isArray(node.content)) {
      for (const contentNode of node.content) {
        if (contentNode.type === 'paragraph' && contentNode.content) {
          for (const inlineNode of contentNode.content) {
            const runs = this.parseInlineNode(inlineNode)
            textRuns.push(...runs)
          }
        }
      }
    }

    // 如果任务已完成，添加删除线效果
    if (isChecked) {
      textRuns.forEach(run => {
        if (run.text && run.text !== `${checkbox} `) {
          run.strike = true
        }
      })
    }

	    // 任务项的基础缩进
	    const indentConfig = { left: 720 }
	    // 首行缩进：从任务项内部的段落上读取 textIndent（如果有）
	    if (node.content && Array.isArray(node.content)) {
	      for (const contentNode of node.content) {
	        if (contentNode.type === 'paragraph' && contentNode.attrs?.textIndent) {
	          const firstLineTwips = this.getFirstLineIndentTwips(contentNode.attrs.textIndent)
	          if (firstLineTwips) {
	            indentConfig.firstLine = firstLineTwips
	          }
	          break
	        }
	      }
	    }

	    this.currentSection.push(new Paragraph({
	      children: textRuns,
	      indent: indentConfig,
	      spacing: { after: 120 } // 段后间距
	    }))
  }

  /**
   * 解析列表
   * @param {Object} node - 列表节点
   */
  async parseList(node) {
    console.log('解析列表:', node)

    if (!node.content) return

    const isOrdered = node.type === 'orderedList'
    const listItems = []

    // 解析列表项
    for (const itemNode of node.content) {
      if (itemNode.type === 'listItem') {
        const itemParagraphs = await this.parseListItem(itemNode, isOrdered, listItems.length + 1)
        listItems.push(...itemParagraphs)
      }
    }

    // 添加到文档
    this.currentSection.push(...listItems)
  }

  /**
   * 解析列表项
   * @param {Object} itemNode - 列表项节点
   * @param {boolean} isOrdered - 是否有序列表
   * @param {number} index - 项目索引
   */
  async parseListItem(itemNode, isOrdered, index) {
    const paragraphs = []

    if (itemNode.content) {
      for (let i = 0; i < itemNode.content.length; i++) {
        const contentNode = itemNode.content[i]

	        if (contentNode.type === 'paragraph') {
	          const textRuns = []

	          // 添加列表标记
	          if (i === 0) {
	            const bullet = isOrdered ? `${index}. ` : '• '
	            textRuns.push(new TextRun(bullet))
	          } else {
	            textRuns.push(new TextRun('  ')) // 缩进
	          }

	          // 解析段落内容
	          if (contentNode.content) {
	            for (const inlineNode of contentNode.content) {
	              const runs = this.parseInlineNode(inlineNode)
	              textRuns.push(...runs)
	            }
	          }

	          // 基础缩进：列表本身的缩进
	          const indentConfig = { left: 720 }

	          // 列表项中的首行缩进：优先使用段落上的 textIndent
	          if (contentNode.attrs?.textIndent) {
	            const firstLineTwips = this.getFirstLineIndentTwips(contentNode.attrs.textIndent)
	            if (firstLineTwips) {
	              indentConfig.firstLine = firstLineTwips
	            }
	          }

	          paragraphs.push(new Paragraph({
	            children: textRuns,
	            indent: indentConfig
	          }))
	        }
      }
    }

    return paragraphs
  }

  /**
   * 解析表格
   * @param {Object} node - 表格节点
   */
  async parseTable(node) {
    console.log('解析表格:', node)

    try {
      const { tableProcessor } = await import('./tableProcessor.js')
      const table = await tableProcessor.processTable(node, {
        createImageRun: this.createImageRun.bind(this)
      })
      this.currentSection.push(table)
    } catch (error) {
      console.error('表格解析失败:', error)
      // 添加错误提示段落
      this.currentSection.push(new Paragraph({
        children: [new TextRun('[表格解析失败]')]
      }))
    }
  }

  /**
   * 解析代码块
   * @param {Object} node - 代码块节点
   */
  async parseCodeBlock(node) {
    console.log('解析代码块:', node)

    const language = node.attrs?.language || ''
    const code = node.content?.[0]?.text || ''

    // 添加语言标识（如果有）
    if (language) {
      this.currentSection.push(new Paragraph({
        children: [new TextRun({
          text: `[${language}]`,
          italics: true,
          color: '666666'
        })]
      }))
    }

    // 添加代码内容
    const codeLines = code.split('\n')
    codeLines.forEach(line => {
      this.currentSection.push(new Paragraph({
        children: [new TextRun({
          text: line || ' ', // 空行用空格代替
          font: 'Courier New',
          size: 20 // 10pt
        })],
        indent: { left: 360 }, // 缩进
        shading: {
          fill: 'F5F5F5' // 浅灰色背景
        }
      }))
    })
  }

  /**
   * 解析引用块
   * @param {Object} node - 引用块节点
   */
  async parseBlockquote(node) {
    console.log('解析引用块:', node)

	    if (node.content) {
	      for (const contentNode of node.content) {
	        if (contentNode.type === 'paragraph') {
	          const textRuns = []

	          if (contentNode.content) {
	            for (const inlineNode of contentNode.content) {
	              const runs = this.parseInlineNode(inlineNode)
	              textRuns.push(...runs)
	            }
	          }

	          // 引用块的基础缩进
	          const indentConfig = { left: 720 }
	          // 首行缩进：优先使用段落上的 textIndent，没有则使用引用块节点上的
	          const blockTextIndent = contentNode.attrs?.textIndent || node.attrs?.textIndent
	          if (blockTextIndent) {
	            const firstLineTwips = this.getFirstLineIndentTwips(blockTextIndent)
	            if (firstLineTwips) {
	              indentConfig.firstLine = firstLineTwips
	            }
	          }

	          this.currentSection.push(new Paragraph({
	            children: textRuns,
	            indent: indentConfig,
	            border: {
	              left: {
	                color: 'CCCCCC',
	                space: 1,
	                style: 'single',
	                size: 6
	              }
	            },
	            shading: {
	              fill: 'FAFAFA'
	            }
	          }))
	        }
	      }
	    }
  }

  /**
   * 下载外部图片并转换为base64
   * @param {string} url - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async downloadImageAsBase64(url) {
    console.log('开始智能图片下载:', url)

    // 方法1: 尝试直接CORS访问
    const directResult = await this.tryDirectImageAccess(url)
    if (directResult) {
      console.log('直接CORS访问成功')
      return directResult
    }

    // 方法2: 尝试代理访问
    console.log('直接访问失败，尝试代理方式')
    const proxyResult = await this.tryProxyImageAccess(url)
    if (proxyResult) {
      console.log('代理访问成功')
      return proxyResult
    }

    // 方法3: 尝试fetch方式
    console.log('代理访问失败，尝试fetch方式')
    const fetchResult = await this.tryFetchImageAccess(url)
    if (fetchResult) {
      console.log('fetch访问成功')
      return fetchResult
    }

    console.error('所有图片下载方式都失败了:', url)
    return null
  }

  /**
   * 尝试直接CORS访问图片
   * @param {string} url - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async tryDirectImageAccess(url) {
    try {
      return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = img.naturalWidth || img.width || 400
            canvas.height = img.naturalHeight || img.height || 300

            ctx.drawImage(img, 0, 0)

            // 尝试转换为base64，如果Canvas被污染会抛出异常
            const dataURL = canvas.toDataURL('image/png', 0.8)
            resolve(dataURL)
          } catch (canvasError) {
            console.log('Canvas转换失败（可能是跨域污染）:', canvasError.message)
            resolve(null)
          }
        }

        img.onerror = () => {
          console.log('直接图片加载失败')
          resolve(null)
        }

        // 设置超时
        setTimeout(() => {
          console.log('直接访问超时')
          resolve(null)
        }, 5000)

        img.src = url
      })
    } catch (error) {
      console.log('直接访问异常:', error.message)
      return null
    }
  }

  /**
   * 尝试通过代理访问图片
   * @param {string} url - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async tryProxyImageAccess(url) {
    try {
      // 构建代理URL - 使用当前域名和端口
      const currentOrigin = window.location.origin
      const proxyUrl = `${currentOrigin}/api/image-proxy?url=${encodeURIComponent(url)}`

      console.log('尝试代理URL:', proxyUrl)

      return new Promise((resolve) => {
        const img = new Image()
        // 代理访问不需要crossOrigin，因为是同域

        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            canvas.width = img.naturalWidth || img.width || 400
            canvas.height = img.naturalHeight || img.height || 300

            ctx.drawImage(img, 0, 0)

            const dataURL = canvas.toDataURL('image/png', 0.8)
            resolve(dataURL)
          } catch (canvasError) {
            console.log('代理Canvas转换失败:', canvasError.message)
            resolve(null)
          }
        }

        img.onerror = () => {
          console.log('代理图片加载失败')
          resolve(null)
        }

        setTimeout(() => {
          console.log('代理访问超时')
          resolve(null)
        }, 8000)

        img.src = proxyUrl
      })
    } catch (error) {
      console.log('代理访问异常:', error.message)
      return null
    }
  }

  /**
   * 尝试通过fetch访问图片
   * @param {string} url - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async tryFetchImageAccess(url) {
    try {
      console.log('尝试fetch方式下载图片')

      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'image/*'
        }
      })

      if (!response.ok) {
        console.log('fetch响应失败:', response.status)
        return null
      }

      const blob = await response.blob()

      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => {
          console.log('FileReader转换失败')
          resolve(null)
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.log('fetch访问异常:', error.message)
      return null
    }
  }

  getPngSize(bytes) {
    if (!bytes || bytes.length < 24) return null
    if (bytes[0] !== 0x89 || bytes[1] !== 0x50 || bytes[2] !== 0x4E || bytes[3] !== 0x47) return null
    const width =
      (bytes[16] << 24) |
      (bytes[17] << 16) |
      (bytes[18] << 8) |
      bytes[19]
    const height =
      (bytes[20] << 24) |
      (bytes[21] << 16) |
      (bytes[22] << 8) |
      bytes[23]
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null
    return { width, height }
  }

  getGifSize(bytes) {
    if (!bytes || bytes.length < 10) return null
    if (bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) return null
    const width = bytes[6] | (bytes[7] << 8)
    const height = bytes[8] | (bytes[9] << 8)
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null
    return { width, height }
  }

  getBmpSize(bytes) {
    if (!bytes || bytes.length < 26) return null
    if (bytes[0] !== 0x42 || bytes[1] !== 0x4D) return null
    const width = bytes[18] | (bytes[19] << 8) | (bytes[20] << 16) | (bytes[21] << 24)
    const height = bytes[22] | (bytes[23] << 8) | (bytes[24] << 16) | (bytes[25] << 24)
    const absHeight = Math.abs(height)
    if (!Number.isFinite(width) || !Number.isFinite(absHeight) || width <= 0 || absHeight <= 0) return null
    return { width, height: absHeight }
  }

  getJpegSize(bytes) {
    if (!bytes || bytes.length < 4) return null
    if (bytes[0] !== 0xFF || bytes[1] !== 0xD8) return null

    let offset = 2
    while (offset + 9 < bytes.length) {
      if (bytes[offset] !== 0xFF) {
        offset += 1
        continue
      }

      const marker = bytes[offset + 1]
      offset += 2

      if (marker === 0xD9 || marker === 0xDA) break

      if (offset + 1 >= bytes.length) break
      const segmentLength = (bytes[offset] << 8) | bytes[offset + 1]
      if (segmentLength < 2) break

      const isSofMarker =
        (marker >= 0xC0 && marker <= 0xC3) ||
        (marker >= 0xC5 && marker <= 0xC7) ||
        (marker >= 0xC9 && marker <= 0xCB) ||
        (marker >= 0xCD && marker <= 0xCF)

      if (isSofMarker) {
        if (offset + 7 >= bytes.length) break
        const height = (bytes[offset + 3] << 8) | bytes[offset + 4]
        const width = (bytes[offset + 5] << 8) | bytes[offset + 6]
        if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null
        return { width, height }
      }

      offset += segmentLength
    }

    return null
  }

  getImageIntrinsicSize(bytes, format) {
    switch (format) {
      case 'png':
        return this.getPngSize(bytes)
      case 'jpg':
        return this.getJpegSize(bytes)
      case 'gif':
        return this.getGifSize(bytes)
      case 'bmp':
        return this.getBmpSize(bytes)
      default:
        return null
    }
  }

  calculateImageSize(node, limits = {}, intrinsicSize = null) {
    const maxWidth = typeof limits.maxWidth === 'number' ? limits.maxWidth : 500
    const maxHeight = typeof limits.maxHeight === 'number' ? limits.maxHeight : 400
    const minWidth = typeof limits.minWidth === 'number' ? limits.minWidth : 50
    const minHeight = typeof limits.minHeight === 'number' ? limits.minHeight : 50
    const defaultWidth = typeof limits.defaultWidth === 'number' ? limits.defaultWidth : 400
    const defaultHeight = typeof limits.defaultHeight === 'number' ? limits.defaultHeight : 300

    let rawWidth = node?.attrs?.width
    let rawHeight = node?.attrs?.height

    if (typeof rawWidth === 'string') rawWidth = parseInt(rawWidth.replace(/px|%/g, ''))
    if (typeof rawHeight === 'string') rawHeight = parseInt(rawHeight.replace(/px|%/g, ''))

    const requestedWidth = Number.isFinite(rawWidth) ? rawWidth : null
    const requestedHeight = Number.isFinite(rawHeight) ? rawHeight : null

    const aspectRatio = intrinsicSize?.width > 0 && intrinsicSize?.height > 0
      ? intrinsicSize.height / intrinsicSize.width
      : null

    let width = requestedWidth ?? defaultWidth
    let height = requestedHeight ?? defaultHeight

    if (aspectRatio) {
      if (requestedWidth && requestedHeight) {
        width = requestedWidth
        height = requestedWidth * aspectRatio
      } else if (requestedWidth) {
        width = requestedWidth
        height = requestedWidth * aspectRatio
      } else if (requestedHeight) {
        height = requestedHeight
        width = requestedHeight / aspectRatio
      } else {
        width = defaultWidth
        height = defaultWidth * aspectRatio
      }
    }

    width = Number.isFinite(width) ? width : defaultWidth
    height = Number.isFinite(height) ? height : defaultHeight

    if (aspectRatio) {
      if (width > maxWidth) {
        width = maxWidth
        height = width * aspectRatio
      }
      if (height > maxHeight) {
        height = maxHeight
        width = height / aspectRatio
      }
    } else {
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
    }

    width = Math.max(width, minWidth)
    height = Math.max(height, minHeight)

    return { width: Math.round(width), height: Math.round(height) }
  }

  async createImageRun(node, limits = {}) {
    const src = node?.attrs?.src
    if (!src) return null

    const formatMap = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'webp': 'png',
      'svg+xml': 'png',
      'bmp': 'bmp'
    }

    let imageData = src
    if (src.startsWith('http://') || src.startsWith('https://')) {
      imageData = await this.downloadImageAsBase64(src)
      if (!imageData) return null
    }

    if (!imageData.startsWith('data:image/')) return null

    const mimeMatch = imageData.match(/data:image\/([^;]+)/)
    const detectedFormat = mimeMatch ? mimeMatch[1] : 'png'
    const finalFormat = formatMap[detectedFormat] || 'png'

    const base64Data = imageData.split(',')[1]
    if (!base64Data) return null

    const binaryString = atob(base64Data)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const intrinsicSize = this.getImageIntrinsicSize(bytes, finalFormat)
    const { width, height } = this.calculateImageSize(node, limits, intrinsicSize)

    return new ImageRun({
      type: finalFormat,
      data: bytes,
      transformation: { width, height },
      altText: {
        name: `图片 ${this.imageCounter++}`
      }
    })
  }

  /**
   * 解析图片
   * @param {Object} node - 图片节点
   */
  async parseImage(node) {
    console.log('解析图片:', node)

    try {
      const src = node.attrs?.src
      const alt = node.attrs?.alt || '图片'

      if (!src) {
        console.warn('图片源地址为空')
        this.currentSection.push(new Paragraph({
          children: [new TextRun('[图片源地址为空]')]
        }))
        return
      }

      const imageRun = await this.createImageRun(node)

      if (!imageRun) {
        if (src.startsWith('http://') || src.startsWith('https://')) {
          this.currentSection.push(new Paragraph({
            children: [new TextRun(`[外部图片: ${alt}]`)],
            alignment: this.getAlignment(node.attrs?.textAlign || 'center')
          }))
          return
        }

        if (src.startsWith('data:image/')) {
          this.currentSection.push(new Paragraph({
            children: [new TextRun('[图片数据无效]')],
            alignment: this.getAlignment(node.attrs?.textAlign || 'center')
          }))
          return
        }

        this.currentSection.push(new Paragraph({
          children: [new TextRun(`[图片: ${alt || src}]`)],
          alignment: this.getAlignment(node.attrs?.textAlign || 'center')
        }))
        return
      }

      this.currentSection.push(new Paragraph({
        children: [imageRun],
        alignment: this.getAlignment(node.attrs?.textAlign || 'center')
      }))
    } catch (error) {
      console.error('图片解析失败:', error)
      this.currentSection.push(new Paragraph({
        children: [new TextRun(`[图片解析失败: ${error.message}]`)]
      }))
    }
  }

	  /**
	   * 解析思维导图节点
	   * 将 MindElixir 思维导图渲染为图片后插入到 Word 文档中
	   * @param {Object} node - 思维导图节点
	   */
	  async parseMindmap(node) {
	    console.log('解析思维导图:', node)

	    try {
	      // 动态导入思维导图渲染器
	      const { mindmapRenderer } = await import('./mindmapRenderer.js')

	      // 根据节点属性在 DOM 中查找对应的思维导图容器
	      const mindmapId = node.attrs?.id || node.attrs?.mindmapId
	      let container = null

	      if (mindmapId) {
	        container = document.querySelector(`[data-mindmap-id="${mindmapId}"]`)
	        console.log(`通过ID查找思维导图容器 ${mindmapId}:`, container)
	      }

	      if (!container) {
	        // 兜底：查找编辑器中的所有思维导图容器
	        const allContainers = document.querySelectorAll('.px-editor__mindmap-container, [data-mindmap-id]')
	        if (allContainers.length > 0) {
	          const index = typeof node.attrs?.index === 'number' ? node.attrs.index : 0
	          container = allContainers[Math.min(index, allContainers.length - 1)]
	          console.log('使用索引匹配思维导图容器:', index, container)
	        }
	      }

	      if (!container) {
	        console.warn('未找到思维导图 DOM 容器，插入占位符')
	        this.currentSection.push(new Paragraph({
	          children: [new TextRun('[思维导图: 未找到对应DOM容器]')],
	          alignment: AlignmentType.CENTER
	        }))
	        return
	      }

	      // 优先使用容器内部的思维导图画布
	      const mindmapElement =
	        container.querySelector('.mindmap-canvas, .map-canvas') ||
	        container

	      const rect = mindmapElement.getBoundingClientRect()
	      let width = rect.width || node.attrs?.width || 600
	      let height = rect.height || node.attrs?.height || 400

	      // 数值化
	      if (typeof width === 'string') {
	        width = parseInt(width.replace(/px|%/g, ''))
	      }
	      if (typeof height === 'string') {
	        height = parseInt(height.replace(/px|%/g, ''))
	      }

	      // 限制尺寸，保持与图表类似的显示效果
	      const maxWidth = 600
	      const maxHeight = 400

	      let displayWidth = width
	      let displayHeight = height

	      if (displayWidth > maxWidth) {
	        displayHeight = (displayHeight * maxWidth) / displayWidth
	        displayWidth = maxWidth
	      }
	      if (displayHeight > maxHeight) {
	        displayWidth = (displayWidth * maxHeight) / displayHeight
	        displayHeight = maxHeight
	      }

	      displayWidth = Math.max(displayWidth, 200)
	      displayHeight = Math.max(displayHeight, 150)

	      // 使用专用渲染器将思维导图转为 base64 图片
	      // 注意：这里不要传入缩小后的 displayWidth/displayHeight，否则 html2canvas 会裁剪掉部分内容
	      // 传入 null 或原始尺寸，让 renderMindmapToImage 自动使用 DOM 的真实尺寸进行完整截图
	      const imageData = await mindmapRenderer.renderMindmapToImage(mindmapElement, {
	        width: rect.width, // 使用原始宽度，确保截取完整视图
	        height: rect.height, // 使用原始高度
	        backgroundColor: null, // 再次尝试透明背景，配合更严格的 CSS 覆盖
	        pixelRatio: 2
	      })

	      if (!imageData || !imageData.includes(',')) {
	        console.warn('思维导图渲染结果无效，插入占位符')
	        this.currentSection.push(new Paragraph({
	          children: [new TextRun('[思维导图: 渲染失败]')],
	          alignment: AlignmentType.CENTER
	        }))
	        return
	      }

	      // 复用图片解析逻辑，构造一个虚拟的图片节点
	      const imageNode = {
	        type: 'image',
	        attrs: {
	          src: imageData,
	          alt: node.attrs?.title || '思维导图',
	          width: displayWidth, // 在 Word 中显示的宽度
	          height: displayHeight, // 在 Word 中显示的高度
	          textAlign: 'center'
	        }
	      }

	      await this.parseImage(imageNode)
	    } catch (error) {
	      console.error('思维导图解析失败:', error)
	      this.currentSection.push(new Paragraph({
	        children: [new TextRun(`[思维导图解析失败: ${error.message}]`)],
	        alignment: AlignmentType.CENTER
	      }))
	    }
	  }

  /**
   * 查找匹配的图表元素
   * @param {Array} chartElements - 图表元素数组
   * @param {Object} node - 图表节点
   * @returns {HTMLElement|null} 匹配的图表元素
   */
  findMatchingChart(chartElements, node) {
    const nodeTitle = node.attrs?.title
    const nodeType = node.attrs?.type

    if (!nodeTitle && !nodeType) {
      return null
    }

    // 尝试通过标题匹配
    if (nodeTitle) {
      for (const element of chartElements) {
        const titleElement = element.querySelector('[class*="title"], .chart-title, h1, h2, h3, h4, h5, h6')
        if (titleElement && titleElement.textContent.includes(nodeTitle)) {
          return element
        }
      }
    }

    // 尝试通过类型匹配
    if (nodeType) {
      for (const element of chartElements) {
        if (element.dataset.chartType === nodeType ||
            element.className.includes(nodeType)) {
          return element
        }
      }
    }

    return null
  }

  /**
   * 解析图表
   * @param {Object} node - 图表节点
   */
  async parseChart(node) {
    console.log('解析图表:', node)

    try {
      // 动态导入图表渲染器
      const { chartRenderer } = await import('./chartRenderer.js')

      // 查找对应的图表DOM元素
      const chartId = node.attrs?.id || node.attrs?.chartId
      let chartElement = null

      if (chartId) {
        chartElement = document.getElementById(chartId)
        console.log(`通过ID查找图表元素 ${chartId}:`, chartElement)
      }

      // 如果没有找到指定ID的元素，尝试查找所有图表元素
      if (!chartElement) {
        const allCharts = chartRenderer.findAllChartElements()
        console.log(`找到 ${allCharts.length} 个图表元素`)

        if (allCharts.length > 0) {
          // 尝试根据节点属性匹配图表
          chartElement = this.findMatchingChart(allCharts, node)
          if (!chartElement) {
            // 使用图表索引来匹配，而不是总是使用第一个
            const chartIndex = this.currentChartIndex || 0
            chartElement = allCharts[chartIndex % allCharts.length]
            this.currentChartIndex = (this.currentChartIndex || 0) + 1
            console.log(`使用图表索引 ${chartIndex}，选择图表:`, chartElement)
          }
        }
      }

      // 尝试渲染图表
      let chartRendered = false

      if (chartElement) {
        try {
          console.log('找到图表元素，开始渲染...', chartElement)

          // 更新进度
          progressManager.updateProgress(
            20 + (this.currentChartIndex * 30 / Math.max(1, document.querySelectorAll('.px-editor__chart-content').length)),
            `正在渲染第 ${this.currentChartIndex + 1} 个图表...`
          )

          // 获取图表的实际显示尺寸
          const chartRect = chartElement.getBoundingClientRect()
          const actualWidth = chartRect.width
          const actualHeight = chartRect.height

          console.log('图表实际显示尺寸:', actualWidth, 'x', actualHeight)
          console.log('节点属性尺寸:', node.attrs?.width, 'x', node.attrs?.height)

          // 使用实际显示尺寸进行渲染，避免变形
          const renderWidth = actualWidth > 0 ? actualWidth : (node.attrs?.width || 600)
          const renderHeight = actualHeight > 0 ? actualHeight : (node.attrs?.height || 400)

          // 为了确保边界线条完整，在渲染时增加一些padding
          const paddingX = 20 // 左右各增加10px padding
          const paddingY = 20 // 上下各增加10px padding
          const renderWidthWithPadding = renderWidth + paddingX
          const renderHeightWithPadding = renderHeight + paddingY

          console.log('最终渲染尺寸:', renderWidth, 'x', renderHeight)
          console.log('带padding渲染尺寸:', renderWidthWithPadding, 'x', renderHeightWithPadding)

          // 直接尝试渲染，不依赖isValidChartElement检查
          const imageData = await chartRenderer.renderChartToImage(chartElement, {
            width: renderWidthWithPadding,
            height: renderHeightWithPadding,
            backgroundColor: '#ffffff',
            pixelRatio: 2 // 恢复高清晰度渲染
          })

          if (imageData && imageData.includes(',')) {
            // 转换base64为Buffer
            const base64Data = imageData.split(',')[1]
            if (base64Data && base64Data.length > 100) { // 确保有实际内容

              // 使用与渲染时相同的尺寸，确保一致性，避免变形
              let width = renderWidth
              let height = renderHeight

              // 限制最大尺寸，保持宽高比
              const maxWidth = 600
              const maxHeight = 400

              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }

              // 确保最小尺寸
              width = Math.max(width, 200)
              height = Math.max(height, 150)

              console.log('图表transformation尺寸:', width, 'x', height)

              // 在浏览器环境中使用Uint8Array替代Buffer
              const binaryString = atob(base64Data)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }

              // 为图表添加名称，避免Word兼容性警告
              // 注意：不设置description，避免生成空的descr属性
              const imageRun = new ImageRun({
                type: 'png',
                data: bytes,
                transformation: {
                  width: width,
                  height: height
                },
                altText: {
                  name: `图表 ${this.currentChartIndex + 1}`
                }
              })

              this.currentSection.push(new Paragraph({
                children: [imageRun],
                alignment: AlignmentType.CENTER
              }))

              console.log(`图表插入成功: ${width}x${height}`)
              chartRendered = true
            }
          }
        } catch (renderError) {
          console.error('图表渲染失败:', renderError)
        }
      }

      if (!chartRendered) {
        // 图表渲染失败，添加占位符
        console.warn('图表渲染失败，使用占位符')
        this.currentSection.push(new Paragraph({
          children: [new TextRun(`[图表: ${node.attrs?.title || node.attrs?.type || chartId || '未知图表'}]`)],
          alignment: AlignmentType.CENTER
        }))
      }
    } catch (error) {
      console.error('图表解析失败:', error)
      this.currentSection.push(this.createSafeParagraph({
        children: [this.createSafeTextRun({ text: `[图表解析失败: ${error.message}]` })]
      }))
    }
  }

  /**
   * 验证图表元素是否有效
   * @param {HTMLElement} element - 图表元素
   * @returns {boolean} 是否有效
   */
  isValidChartElement(element) {
    if (!element || !element.offsetWidth || !element.offsetHeight) {
      return false
    }

    // 检查是否包含图表内容
    const hasCanvas = element.querySelector('canvas')
    const hasSvg = element.querySelector('svg')

    return hasCanvas || hasSvg
  }

  /**
   * 解析音频节点
   * @param {Object} node - 音频节点
   */
  parseAudio(node) {
    console.log('解析音频:', node)
    const src = node.attrs?.src || ''
    const title = node.attrs?.title || '音频文件'

    this.currentSection.push(new Paragraph({
      children: [new TextRun(`[音频: ${title}${src ? ` - ${src}` : ''}]`)]
    }))
  }

  /**
   * 解析视频节点
   * @param {Object} node - 视频节点
   */
  parseVideo(node) {
    console.log('解析视频:', node)
    const src = node.attrs?.src || ''
    const title = node.attrs?.title || '视频文件'

    this.currentSection.push(new Paragraph({
      children: [new TextRun(`[视频: ${title}${src ? ` - ${src}` : ''}]`)]
    }))
  }

  /**
   * 解析水平分割线
   * @param {Object} node - 水平分割线节点
   */
  parseHorizontalRule(node) {
    console.log('解析水平分割线:', node)

    const attrs = node?.attrs || {}
    const borderColor = this.convertColorToHex(attrs.color) || '000000'
    const borderSize = this.getBorderSizeFromCssWidth(attrs.width)
    const borderStyle = this.getBorderStyleFromSeparatorType(attrs.type)

    // 使用Word的边框功能创建全宽分割线
    this.currentSection.push(new Paragraph({
      children: [new TextRun(' ')], // 使用空格而不是空字符串，避免Word兼容性问题
      spacing: {
        before: 240, // 段前间距
        after: 240   // 段后间距
      },
      border: {
        bottom: {
          color: borderColor,
          size: borderSize,
          style: borderStyle
        }
      }
    }))
  }

  /**
   * Convert a CSS width (e.g. "2px", "0.5px", "1.5pt") into Word border size (1/8 pt).
   * Falls back to 6 (0.75pt) to preserve previous divider appearance when no width is provided.
   */
  getBorderSizeFromCssWidth(width) {
    const defaultSize = 6 // 0.75pt

    if (width === undefined || width === null) return defaultSize

    // If a number sneaks in, treat it as px.
    if (typeof width === 'number' && Number.isFinite(width)) {
      return this.clampBorderSize(Math.round(width * 6))
    }

    if (typeof width !== 'string') return defaultSize

    const trimmed = width.trim()
    const value = parseFloat(trimmed)
    if (Number.isNaN(value)) return defaultSize

    if (trimmed.endsWith('pt')) {
      return this.clampBorderSize(Math.round(value * 8))
    }

    // Default to px (including unitless values). 1px ~= 0.75pt => 1px ~= 6 (1/8 pt).
    return this.clampBorderSize(Math.round(value * 6))
  }

  clampBorderSize(size) {
    if (!Number.isFinite(size)) return 6
    // Word border size is in 1/8 pt; keep it within a sensible range.
    return Math.min(Math.max(size, 2), 96)
  }

  /**
   * Map separator widget styles (CSS-like) to docx BorderStyle values.
   * Unsupported styles will gracefully degrade to a reasonable fallback.
   */
  getBorderStyleFromSeparatorType(type) {
    if (!type || typeof type !== 'string') return BorderStyle.SINGLE

    const t = type.trim()

    switch (t) {
      case 'solid':
        return BorderStyle.SINGLE
      case 'dotted':
        return BorderStyle.DOTTED
      case 'dashed':
        return BorderStyle.DASHED
      case 'double':
        return BorderStyle.DOUBLE
      case 'dash-dot':
        return BorderStyle.DOT_DASH
      case 'dash-dot-dot':
        return BorderStyle.DOT_DOT_DASH
      case 'wavy':
        return BorderStyle.WAVE
      case 'wavy-double':
        return BorderStyle.DOUBLE_WAVE
      case 'triple':
        return BorderStyle.TRIPLE
      case 'thick-thin':
        // 编辑器中 thick-thin 是上粗下细，Word 的 THIN_THICK_SMALL_GAP 在底部边框上渲染为上粗下细
        return BorderStyle.THIN_THICK_SMALL_GAP
      case 'thin-thick':
        // 编辑器中 thin-thick 是上细下粗，Word 的 THICK_THIN_SMALL_GAP 在底部边框上渲染为上细下粗
        return BorderStyle.THICK_THIN_SMALL_GAP
      case 'zigzag':
        // docx currently doesn't expose "zigZag"; degrade to dashed.
        return BorderStyle.DASHED
      default: {
        // Allow direct docx BorderStyle values to pass through.
        const supported = Object.values(BorderStyle)
        if (supported.includes(t)) return t
        return BorderStyle.SINGLE
      }
    }
  }

  /**
   * 解析块级数学公式
   * @param {Object} node - displayMath节点
   */
  async parseDisplayMath(node) {
    console.log('解析块级数学公式:', node)

    // 标记文档包含公式
    this.hasFormulas = true

    const latexCode = node.attrs?.latex || '[块级LaTeX公式]'

    try {
      // 使用latexExporter转换LaTeX为OMML占位符
      const ommlPlaceholder = latexExporter.convertLatexToWordMath(latexCode, true)

      if (ommlPlaceholder && ommlPlaceholder._isOMMLPlaceholder) {
        console.log('✅ 块级LaTeX转OMML占位符成功:', latexCode)

        // 块级公式单独成段，居中显示
        // 使用包含占位符文本的TextRun
        this.currentSection.push(new Paragraph({
          alignment: 'center',
          children: [new TextRun(ommlPlaceholder.text)]
        }))
      } else {
        throw new Error('OMML占位符生成失败')
      }

    } catch (error) {
      console.error('❌ 块级公式转换失败:', latexCode, error)

      // 降级策略：使用文本显示
      const displayText = `$$${latexCode}$$`
      this.currentSection.push(new Paragraph({
        alignment: 'center',
        children: [this.createTextRun(displayText, [
          { type: 'italic' },
          { type: 'color', attrs: { color: '#FF0000' } }, // 红色表示转换失败
          { type: 'bold' },
          { type: 'fontSize', attrs: { fontSize: '14' } }
        ])]
      }))
    }
  }






















}

// 导出单例
export const wordExporter = new WordExporter()
