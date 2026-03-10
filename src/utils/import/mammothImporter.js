/**
 * Mammoth导入器 - 使用mammoth.js解析docx文件并转换为TipTap JSON格式
 */

export class MammothImporter {
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
  }

  /**
   * 导入docx内容
   * @param {File} file - docx文件
   * @returns {Promise<Object>} TipTap JSON格式的文档内容
   */
  async import(file) {
    try {
      if (!file) {
        throw new Error('文件不能为空')
      }

      // 动态导入mammoth
      const mammoth = await import('mammoth')

      // 将File对象转换为ArrayBuffer（mammoth需要这种格式）
      const arrayBuffer = await file.arrayBuffer()

      // 配置mammoth选项 - 使用改进的图片处理方法
      const options = {
        styleMap: this.createStyleMap(),
        // 使用自定义图片处理器，将图片上传到服务器而不是使用base64
        convertImage: mammoth.images.imgElement(async (image) => {
          try {
            console.log('处理图片:', image.contentType, '大小:', image.read ? 'available' : 'unavailable')

            // 读取图片的base64数据
            const imageBuffer = await image.read('base64')

            // 验证图片数据
            if (!imageBuffer || imageBuffer.length === 0) {
              console.warn('图片数据为空，跳过处理:', image)
              return { src: '' }
            }

            // 将base64转换为Blob并上传到服务器
            const uploadedUrl = await this.uploadBase64Image(image.contentType, imageBuffer)

            if (uploadedUrl) {
              console.log('图片上传成功:', image.contentType, '服务器URL:', uploadedUrl)
              return { src: uploadedUrl }
            } else {
              // 上传失败，降级使用base64
              console.warn('图片上传失败，使用base64降级方案')
              const base64img = `data:${image.contentType};base64,${imageBuffer}`
              return { src: base64img }
            }

          } catch (error) {
            console.error('图片处理失败:', error, '图片信息:', image)
            return { src: '' }
          }
        }),
        // 包含原始文档信息
        includeDefaultStyleMap: true,
        // 转换未知元素
        ignoreEmptyParagraphs: false
      }

      // 使用mammoth转换为HTML，传入包含arrayBuffer的选项对象
      const result = await mammoth.convertToHtml({arrayBuffer: arrayBuffer}, options)

      if (result.messages && result.messages.length > 0) {
        console.warn('Mammoth转换警告:', result.messages)
      }

      // 将HTML转换为TipTap JSON
      const tipTapDoc = this.htmlToTipTap(result.value)

      return tipTapDoc
    } catch (error) {
      console.error('=== Mammoth导入失败 ===', error)
      throw error
    }
  }

  /**
   * 直接从HTML字符串导入内容
   * @param {string} htmlString - 完整HTML字符串
   * @returns {Object} TipTap JSON格式的文档内容
   */
  importHtml(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') {
      throw new Error('HTML内容不能为空')
    }

    return this.htmlToTipTap(htmlString)
  }

  /**
   * 创建样式映射
   * @returns {Array} 样式映射数组
   */
  createStyleMap() {
    return [
      // 标题映射 - 支持中英文样式名
      "p[style-name='Heading 1'] => h1",
      "p[style-name='Heading 2'] => h2",
      "p[style-name='Heading 3'] => h3",
      "p[style-name='Heading 4'] => h4",
      "p[style-name='Heading 5'] => h5",
      "p[style-name='Heading 6'] => h6",
      "p[style-name='标题 1'] => h1",
      "p[style-name='标题 2'] => h2",
      "p[style-name='标题 3'] => h3",
      "p[style-name='标题 4'] => h4",
      "p[style-name='标题 5'] => h5",
      "p[style-name='标题 6'] => h6",

      // 段落样式
      "p[style-name='Normal'] => p",
      "p[style-name='正文'] => p",
      "p[style-name='Quote'] => blockquote",
      "p[style-name='引用'] => blockquote",

      // 列表样式
      "p[style-name='List Paragraph'] => p",
      "p[style-name='列表段落'] => p",

      // 代码样式
      "p[style-name='Code'] => pre",
      "p[style-name='代码'] => pre",
      "r[style-name='Code Char'] => code",
      "r[style-name='代码字符'] => code",

      // 表格样式
      "p[style-name='Table Paragraph'] => p",
      "p[style-name='表格段落'] => p",

      // 其他常见样式
      "p[style-name='Caption'] => p",
      "p[style-name='标题'] => p",
      "p[style-name='Subtitle'] => p",
      "p[style-name='副标题'] => p"
    ]
  }

  /**
   * 将HTML转换为TipTap JSON
   * @param {string} html - HTML字符串
   * @returns {Object} TipTap JSON文档
   */
  htmlToTipTap(html) {
    try {
      // 创建DOM解析器
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      
      const tipTapDoc = {
        type: 'doc',
        content: []
      }

      // 解析body中的内容
      const body = doc.body

      if (body && body.children) {
        for (let i = 0; i < body.children.length; i++) {
          const element = body.children[i]

          const node = this.convertHtmlElement(element)
          if (node) {
            if (Array.isArray(node)) {
              // 如果返回的是数组，展开添加
              tipTapDoc.content.push(...node)
            } else {
              tipTapDoc.content.push(node)
            }
          }
        }
      }

      // 如果没有内容，添加空段落
      if (tipTapDoc.content.length === 0) {
        tipTapDoc.content.push(this.createEmptyParagraph())
      }

      return tipTapDoc
    } catch (error) {
      console.error('HTML转TipTap失败:', error)
      return this.createEmptyDocument()
    }
  }

  /**
   * 转换HTML元素为TipTap节点
   * @param {Element} element - HTML元素
   * @returns {Object|null} TipTap节点
   */
  convertHtmlElement(element) {
    if (!element || !element.tagName) {
      return null
    }

    const tagName = element.tagName.toLowerCase()

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return this.convertHeading(element)
      case 'p':
        return this.convertParagraph(element)
      case 'div':
        // div元素可能包含多个子元素，递归处理
        return this.convertDiv(element)
      case 'blockquote':
        return this.convertBlockquote(element)
      case 'ul':
        return this.convertBulletList(element)
      case 'ol':
        return this.convertOrderedList(element)
      case 'table':
        return this.convertTable(element)
      case 'pre':
        return this.convertCodeBlock(element)
      case 'code':
        // 内联代码，转换为段落
        return this.convertParagraph(element)
      case 'hr':
        return this.convertDivider()
      case 'img':
        return this.convertImage(element)
      case 'br':
        return this.convertHardBreak()
      case 'strong':
      case 'b':
      case 'em':
      case 'i':
      case 'u':
      case 's':
      case 'a':
        // 这些是内联元素，转换为段落
        if (element.textContent && element.textContent.trim()) {
          return this.convertParagraph(element)
        }
        return null
      default:
        // 对于不识别的元素，尝试处理其子元素
        if (element.children && element.children.length > 0) {
          const childNodes = []
          for (const child of element.children) {
            const converted = this.convertHtmlElement(child)
            if (converted) {
              if (Array.isArray(converted)) {
                childNodes.push(...converted)
              } else {
                childNodes.push(converted)
              }
            }
          }
          return childNodes.length > 0 ? childNodes : null
        } else if (element.textContent && element.textContent.trim()) {
          // 如果有文本内容，转换为段落
          return this.convertParagraph(element)
        }
        return null
    }
  }

  /**
   * 转换标题
   * @param {Element} element - 标题元素
   * @returns {Object} TipTap标题节点
   */
  convertHeading(element) {
	    const level = parseInt(element.tagName.charAt(1))
	    // 复用段落属性提取逻辑，保证标题也能还原对齐、缩进、段前后距、行距等排版参数
	    const attrs = this.extractParagraphAttrs(element) || {}
	    attrs.level = level
	    return {
	      type: 'heading',
	      attrs,
	      content: this.convertInlineContent(element)
	    }
  }

  /**
   * 转换段落
   * @param {Element} element - 段落元素
   * @returns {Object|Array} TipTap段落节点或节点数组
   */
  convertParagraph(element) {
    // 检查段落中是否包含图片
    const images = element.querySelectorAll('img')

    if (images.length > 0) {
      return this.convertParagraphWithImages(element, images)
    }

    // 普通段落处理
    const node = {
      type: 'paragraph',
      attrs: this.extractParagraphAttrs(element),
      content: this.convertInlineContent(element)
    }

    return node
  }

  /**
   * 转换包含图片的段落
   * @param {Element} element - 段落元素
   * @param {NodeList} images - 图片元素列表
   * @returns {Array} TipTap节点数组
   */
  convertParagraphWithImages(element, images) {
    const nodes = []

    // 如果段落只包含图片（没有其他有意义的文本内容）
    const textContent = element.textContent.trim()
    const hasOnlyImages = !textContent || textContent.length === 0

    if (hasOnlyImages && images.length === 1) {
      // 单独的图片，直接转换为图片节点
      const imageNode = this.convertImage(images[0])
      if (imageNode) { // 只有在图片节点有效时才添加
        nodes.push(imageNode)
      }
    } else {
      // 复杂情况：段落包含图片和文本，或多个图片

      // 先添加图片前的文本（如果有）
      const beforeImageText = this.getTextBeforeElement(element, images[0])
      if (beforeImageText.trim()) {
        nodes.push({
          type: 'paragraph',
          attrs: this.extractParagraphAttrs(element),
          content: [{ type: 'text', text: beforeImageText }]
        })
      }

      // 添加所有图片作为独立节点
      images.forEach(img => {
        const imageNode = this.convertImage(img)
        if (imageNode) { // 只有在图片节点有效时才添加
          nodes.push(imageNode)
        }
      })

      // 添加图片后的文本（如果有）
      const afterImageText = this.getTextAfterElement(element, images[images.length - 1])
      if (afterImageText.trim()) {
        nodes.push({
          type: 'paragraph',
          attrs: this.extractParagraphAttrs(element),
          content: [{ type: 'text', text: afterImageText }]
        })
      }
    }

    return nodes
  }

  /**
   * 提取段落属性
   * @param {Element} element - 段落元素
   * @returns {Object} 段落属性
   */
  extractParagraphAttrs(element) {
    const attrs = {}

    if (!element || !element.style) {
      return attrs
    }

    const style = element.style

    // 对齐方式
    if (style.textAlign) {
      attrs.textAlign = style.textAlign
    }

    // 首行缩进 textIndent (em)
    if (style.textIndent) {
      const textIndent = this._convertTextIndent(style.textIndent, element)
      if (textIndent) {
        attrs.textIndent = textIndent
      }
    }

    // 段前/段后距 spacingBefore / spacingAfter (rem)
    if (style.marginTop) {
      const spacingBefore = this._convertSpacingToRem(style.marginTop)
      if (spacingBefore) {
        attrs.spacingBefore = spacingBefore
      }
    }

    if (style.marginBottom) {
      const spacingAfter = this._convertSpacingToRem(style.marginBottom)
      if (spacingAfter) {
        attrs.spacingAfter = spacingAfter
      }
    }

    // 行距 lineHeight (倍数字符串)
    if (style.lineHeight) {
      const lineHeight = this._convertLineHeight(style.lineHeight, element)
      if (lineHeight) {
        attrs.lineHeight = lineHeight
      }
    }

    return attrs
  }

  /**
   * 获取元素字体大小（px）
   * @param {Element} element
   * @returns {number}
   */
  _getFontSizePx(element) {
    if (!element || !element.style) {
      return 16
    }

    const style = element.style
    let fontSize = style.fontSize

    if (!fontSize && element.firstElementChild && element.firstElementChild.style) {
      fontSize = element.firstElementChild.style.fontSize
    }

    if (!fontSize) {
      return 16
    }

    fontSize = fontSize.trim().toLowerCase()

    if (fontSize.endsWith('px')) {
      const v = parseFloat(fontSize)
      return isNaN(v) ? 16 : v
    }

    if (fontSize.endsWith('pt')) {
      const v = parseFloat(fontSize)
      if (isNaN(v)) return 16
      return v * 1.333333
    }

    const num = parseFloat(fontSize)
    return isNaN(num) ? 16 : num
  }

  /**
   * 将 text-indent 转换为 em 单位
   * @param {string} raw
   * @param {Element} element
   * @returns {string|null}
   */
  _convertTextIndent(raw, element) {
    if (!raw) return null

    const value = String(raw).trim().toLowerCase()
    if (!value || value === '0' || value === '0px' || value === '0pt' || value === '0em') {
      return null
    }

    // 纯数字，视为 em
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const num = parseFloat(value)
      if (isNaN(num)) return null
      return `${num.toFixed(2)}em`
    }

    if (value.endsWith('em')) {
      return value
    }

    const fontSizePx = this._getFontSizePx(element)

    if (value.endsWith('px')) {
      const px = parseFloat(value)
      if (isNaN(px)) return null
      const em = px / fontSizePx
      return `${em.toFixed(2)}em`
    }

	    if (value.endsWith('pt')) {
	      const pt = parseFloat(value)
	      if (isNaN(pt)) return null
	      const px = pt * 1.333333
	      const em = px / fontSizePx
	      return `${em.toFixed(2)}em`
	    }

	    if (value.endsWith('cm') || value.endsWith('mm') || value.endsWith('in')) {
	      let px = NaN
	      if (value.endsWith('cm')) {
	        const cm = parseFloat(value)
	        if (!isNaN(cm)) {
	          px = cm * (96 / 2.54)
	        }
	      } else if (value.endsWith('mm')) {
	        const mm = parseFloat(value)
	        if (!isNaN(mm)) {
	          px = mm * (96 / 25.4)
	        }
	      } else if (value.endsWith('in')) {
	        const inch = parseFloat(value)
	        if (!isNaN(inch)) {
	          px = inch * 96
	        }
	      }

	      if (isNaN(px)) return null
	      const em = px / fontSizePx
	      return `${em.toFixed(2)}em`
	    }

    return null
  }

  /**
   * 将 margin 值转换为 rem
   * @param {string} raw
   * @returns {string|null}
   */
  _convertSpacingToRem(raw) {
    if (!raw) return null

    const value = String(raw).trim().toLowerCase()
    if (!value || value === '0' || value === '0px' || value === '0pt' || value === '0rem') {
      return null
    }

    if (value.endsWith('rem')) {
      return value
    }

    if (value.endsWith('px')) {
      const px = parseFloat(value)
      if (isNaN(px)) return null
      const rem = px / 16
      return `${rem.toFixed(2)}rem`
    }

	    if (value.endsWith('pt')) {
	      const pt = parseFloat(value)
	      if (isNaN(pt)) return null
	      const rem = pt / 12
	      return `${rem.toFixed(2)}rem`
	    }

	    if (value.endsWith('cm') || value.endsWith('mm') || value.endsWith('in')) {
	      let px = NaN
	      if (value.endsWith('cm')) {
	        const cm = parseFloat(value)
	        if (!isNaN(cm)) {
	          px = cm * (96 / 2.54)
	        }
	      } else if (value.endsWith('mm')) {
	        const mm = parseFloat(value)
	        if (!isNaN(mm)) {
	          px = mm * (96 / 25.4)
	        }
	      } else if (value.endsWith('in')) {
	        const inch = parseFloat(value)
	        if (!isNaN(inch)) {
	          px = inch * 96
	        }
	      }

	      if (isNaN(px)) return null
	      const rem = px / 16
	      return `${rem.toFixed(2)}rem`
	    }

    return null
  }

  /**
   * 将 line-height 转换为倍数字符串
   * @param {string} raw
   * @param {Element} element
   * @returns {string|null}
   */
  _convertLineHeight(raw, element) {
    if (!raw) return null

    const value = String(raw).trim().toLowerCase()
    if (!value || value === 'normal') {
      return null
    }

    const fontSizePx = this._getFontSizePx(element)

    if (value.endsWith('px')) {
      const px = parseFloat(value)
      if (isNaN(px)) return null
      const ratio = px / fontSizePx
      return ratio.toFixed(3)
    }

    if (value.endsWith('pt')) {
      const pt = parseFloat(value)
      if (isNaN(pt)) return null
      const px = pt * 1.333333
      const ratio = px / fontSizePx
      return ratio.toFixed(3)
    }

    if (value.endsWith('%')) {
      const p = parseFloat(value)
      if (isNaN(p)) return null
      const ratio = p / 100
      return ratio.toFixed(3)
    }

    // 纯数字，视为倍数
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      const num = parseFloat(value)
      if (isNaN(num)) return null
      return num.toString()
    }

    return null
  }

  /**
   * 转换内联内容
   * @param {Element} element - 包含内联内容的元素
   * @returns {Array} TipTap内联节点数组
   */
  convertInlineContent(element) {
    const content = []
    
    for (const child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        // 文本节点
        const text = child.textContent
        if (text) {
          content.push({
            type: 'text',
            text: text
          })
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // 元素节点
        const inlineNode = this.convertInlineElement(child)
        if (inlineNode) {
          if (Array.isArray(inlineNode)) {
            content.push(...inlineNode)
          } else {
            content.push(inlineNode)
          }
        }
      }
    }

    return content
  }

  /**
   * 转换内联元素
   * @param {Element} element - 内联元素
   * @returns {Object|Array|null} TipTap内联节点
   */
  convertInlineElement(element) {
    const tagName = element.tagName.toLowerCase()
    const text = element.textContent

    // 特殊处理图片元素
    if (tagName === 'img') {
      return this.convertImage(element)
    }

    // 其他内联元素需要有文本内容
    if (!text) return null

    // 提取文本标记
    const marks = this.extractMarksFromElement(element)

    const textNode = {
      type: 'text',
      text: text
    }

    if (marks.length > 0) {
      textNode.marks = marks
    }

    return textNode
  }

  /**
   * 从元素中提取标记
   * @param {Element} element - HTML元素
   * @returns {Array} 标记数组
   */
  extractMarksFromElement(element) {
    const marks = []
	    const tagName = element.tagName.toLowerCase()
	    const style = element.style || {}

    // 基于标签的标记
    switch (tagName) {
      case 'strong':
      case 'b':
        marks.push({ type: 'bold' })
        break
      case 'em':
      case 'i':
        marks.push({ type: 'italic' })
        break
      case 'u':
        marks.push({ type: 'underline' })
        break
      case 's':
      case 'strike':
        marks.push({ type: 'strike' })
        break
	      case 'sup':
	        marks.push({ type: 'superscript' })
	        break
	      case 'sub':
	        marks.push({ type: 'subscript' })
	        break
      case 'code':
        marks.push({ type: 'code' })
        break
      case 'a':
        if (element.href) {
          marks.push({
            type: 'link',
            attrs: { href: element.href }
          })
        }
        break
    }

	    // 基于样式的装饰（下划线 / 删除线 / 上下标）
	    const textDecoration = (style.textDecoration || style.textDecorationLine || '').toLowerCase()
	    if (textDecoration) {
	      if (textDecoration.includes('underline') && !marks.some(m => m.type === 'underline')) {
	        marks.push({ type: 'underline' })
	      }
	      if ((textDecoration.includes('line-through') || textDecoration.includes('strikethrough'))
	        && !marks.some(m => m.type === 'strike')) {
	        marks.push({ type: 'strike' })
	      }
	    }

	    const verticalAlign = (style.verticalAlign || '').toLowerCase()
	    if (verticalAlign === 'super' && !marks.some(m => m.type === 'superscript')) {
	      marks.push({ type: 'superscript' })
	    }
	    if (verticalAlign === 'sub' && !marks.some(m => m.type === 'subscript')) {
	      marks.push({ type: 'subscript' })
	    }

	    // 通过字体样式补充粗体/斜体（兼容不使用<b>/<i>标签的情况）
	    if (style.fontWeight) {
	      const weight = String(style.fontWeight).toLowerCase()
	      const numeric = parseInt(weight, 10)
	      if (((!isNaN(numeric) && numeric >= 600) || weight === 'bold')
	        && !marks.some(m => m.type === 'bold')) {
	        marks.push({ type: 'bold' })
	      }
	    }
	    if (style.fontStyle && style.fontStyle.toLowerCase().includes('italic')
	      && !marks.some(m => m.type === 'italic')) {
	      marks.push({ type: 'italic' })
	    }

    // 基于样式的标记
    const textStyleAttrs = {}
    
    if (style.color && style.color !== 'rgb(0, 0, 0)') {
      textStyleAttrs.color = this.convertColor(style.color)
    }
    
    if (style.fontSize) {
      textStyleAttrs.fontSize = style.fontSize
    }
    
    if (style.fontFamily) {
      textStyleAttrs.fontFamily = style.fontFamily
    }

	    // 字间距：对齐 letter-spacing 扩展的 pt 语义
	    if (style.letterSpacing && style.letterSpacing !== 'normal') {
	      let ls = String(style.letterSpacing).trim()
	      if (ls.endsWith('px')) {
	        const px = parseFloat(ls)
	        if (!isNaN(px)) {
	          const pt = (px * 0.75).toFixed(2) // 1px ≈ 0.75pt
	          ls = `${pt}pt`
	        }
	      } else if (!ls.includes('pt') && !isNaN(parseFloat(ls))) {
	        // 无单位时按 pt 处理，保持与字间距扩展的语义一致
	        ls = `${ls}pt`
	      }
	      textStyleAttrs.letterSpacing = ls
	    }

    if (Object.keys(textStyleAttrs).length > 0) {
      marks.push({
        type: 'textStyle',
        attrs: textStyleAttrs
      })
    }

	    // 背景高亮：映射到 highlight 标记
	    if (style.backgroundColor && style.backgroundColor !== 'transparent') {
	      const highlightColor = this.convertColor(style.backgroundColor)
	      marks.push({
	        type: 'highlight',
	        attrs: { color: highlightColor }
	      })
	    }

    return marks
  }

  /**
   * 转换颜色值
   * @param {string} color - CSS颜色值
   * @returns {string} 标准颜色值
   */
  convertColor(color) {
    // 简单的颜色转换，可以根据需要扩展
    if (color.startsWith('rgb(')) {
      // 将rgb转换为十六进制
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0')
        const g = parseInt(match[2]).toString(16).padStart(2, '0')
        const b = parseInt(match[3]).toString(16).padStart(2, '0')
        return `#${r}${g}${b}`
      }
    }
    return color
  }

  /**
   * 转换引用块（占位实现）
   * @param {Element} element - 引用块元素
   * @returns {Object} TipTap引用块节点
   */
  convertBlockquote(element) {
    return {
      type: 'blockquote',
      content: [this.convertParagraph(element)]
    }
  }

  /**
   * 转换无序列表
   * @param {Element} element - 列表元素
   * @returns {Object} TipTap列表节点
   */
  convertBulletList(element) {
    const listItems = []

    for (const li of element.children) {
      if (li.tagName.toLowerCase() === 'li') {
        const listItem = {
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: this.convertInlineContent(li)
          }]
        }
        listItems.push(listItem)
      }
    }

    return {
      type: 'bulletList',
      content: listItems
    }
  }

  /**
   * 转换有序列表
   * @param {Element} element - 列表元素
   * @returns {Object} TipTap列表节点
   */
  convertOrderedList(element) {
    const listItems = []

    for (const li of element.children) {
      if (li.tagName.toLowerCase() === 'li') {
        const listItem = {
          type: 'listItem',
          content: [{
            type: 'paragraph',
            content: this.convertInlineContent(li)
          }]
        }
        listItems.push(listItem)
      }
    }

    return {
      type: 'orderedList',
      content: listItems
    }
  }

  /**
   * 转换表格
   * @param {Element} element - 表格元素
   * @returns {Object} TipTap表格节点
   */
  convertTable(element) {
    const rows = []

    // 处理表格行
    const tableRows = element.querySelectorAll('tr')
    for (const tr of tableRows) {
      const cells = []
      const tableCells = tr.querySelectorAll('td, th')

      for (const cell of tableCells) {
        const isHeader = cell.tagName.toLowerCase() === 'th'
        const cellAttrs = {}

        // 处理colspan和rowspan
        if (cell.colspan && cell.colspan > 1) {
          cellAttrs.colspan = cell.colspan
        }
        if (cell.rowspan && cell.rowspan > 1) {
          cellAttrs.rowspan = cell.rowspan
        }

        const cellNode = {
          type: isHeader ? 'tableHeader' : 'tableCell',
          content: [{
            type: 'paragraph',
            content: this.convertInlineContent(cell)
          }]
        }

        if (Object.keys(cellAttrs).length > 0) {
          cellNode.attrs = cellAttrs
        }

        cells.push(cellNode)
      }

      if (cells.length > 0) {
        rows.push({
          type: 'tableRow',
          content: cells
        })
      }
    }

    return {
      type: 'table',
      content: rows
    }
  }

  /**
   * 转换代码块（占位实现）
   * @param {Element} element - 代码块元素
   * @returns {Object} TipTap代码块节点
   */
  convertCodeBlock(element) {
    return {
      type: 'codeBlock',
      content: [{
        type: 'text',
        text: element.textContent || ''
      }]
    }
  }

  /**
   * 转换分割线
   * @returns {Object} TipTap分割线节点
   */
  convertDivider() {
    return {
      type: 'divider'
    }
  }

  /**
   * 转换div元素
   * @param {Element} element - div元素
   * @returns {Array|Object|null} TipTap节点数组或单个节点
   */
  convertDiv(element) {
    const nodes = []

    // 处理div的子元素
    for (const child of element.children) {
      const converted = this.convertHtmlElement(child)
      if (converted) {
        if (Array.isArray(converted)) {
          nodes.push(...converted)
        } else {
          nodes.push(converted)
        }
      }
    }

    // 如果div只包含文本，转换为段落
    if (nodes.length === 0 && element.textContent && element.textContent.trim()) {
      return this.convertParagraph(element)
    }

    return nodes.length > 0 ? nodes : null
  }

  /**
   * 转换硬换行
   * @returns {Object} TipTap硬换行节点
   */
  convertHardBreak() {
    return {
      type: 'hardBreak'
    }
  }

  /**
   * 转换图片
   * @param {Element} element - 图片元素
   * @returns {Object|null} TipTap图片节点或null（如果图片无效）
   */
  convertImage(element) {
    const src = element.src || ''

    // 验证图片源是否有效
    if (!src || src.trim() === '') {
      console.warn('图片源为空，跳过图片节点创建:', element)
      return null // 返回null，调用方会跳过这个节点
    }

    // 验证data URI格式（如果是base64图片）
    if (src.startsWith('data:image/')) {
      const base64Part = src.split(',')[1]
      if (!base64Part || base64Part.length === 0) {
        console.warn('无效的base64图片数据，跳过图片节点创建:', src.substring(0, 50) + '...')
        return null
      }
    }

    const attrs = {
      src: src
    }

    // 添加alt属性，即使为空也要包含
    attrs.alt = element.alt || ''

    // 添加title属性，即使为空也要包含
    attrs.title = element.title || ''

    // 处理图片尺寸 - 确保是数字类型
    if (element.width && !isNaN(element.width)) {
      attrs.width = parseInt(element.width)
    }

    if (element.height && !isNaN(element.height)) {
      attrs.height = parseInt(element.height)
    }

    console.log('成功创建图片节点:', attrs.src.substring(0, 50) + '...', '尺寸:', attrs.width, 'x', attrs.height)

    // 确保图片节点格式完全符合TipTap要求
    return {
      type: 'image',
      attrs: attrs
    }
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
   * 获取元素前的文本内容
   * @param {Element} container - 容器元素
   * @param {Element} targetElement - 目标元素
   * @returns {string} 文本内容
   */
  getTextBeforeElement(container, targetElement) {
    let text = ''
    for (const child of container.childNodes) {
      if (child === targetElement) break
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() !== 'img') {
        text += child.textContent
      }
    }
    return text
  }

  /**
   * 获取元素后的文本内容
   * @param {Element} container - 容器元素
   * @param {Element} targetElement - 目标元素
   * @returns {string} 文本内容
   */
  getTextAfterElement(container, targetElement) {
    let text = ''
    let foundTarget = false
    for (const child of container.childNodes) {
      if (child === targetElement) {
        foundTarget = true
        continue
      }
      if (foundTarget) {
        if (child.nodeType === Node.TEXT_NODE) {
          text += child.textContent
        } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() !== 'img') {
          text += child.textContent
        }
      }
    }
    return text
  }

  /**
   * 将base64图片上传到服务器
   * @param {string} contentType - 图片MIME类型
   * @param {string} base64Data - base64数据（不包含data:前缀）
   * @returns {Promise<string|null>} 上传成功返回服务器URL，失败返回null
   */
  async uploadBase64Image(contentType, base64Data) {
    try {
      // 将base64转换为Blob
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: contentType })

      // 生成文件名
      const extension = contentType.split('/')[1] || 'png'
      const filename = `imported_image_${Date.now()}.${extension}`
      const file = new File([blob], filename, { type: contentType })

      console.log('准备上传图片:', filename, '大小:', file.size, '类型:', contentType)

      // 动态导入uploadFn
      const { uploadFn } = await import('../upload.ts')

      // 使用Promise包装uploadFn的回调
      return new Promise((resolve) => {
        uploadFn(file, (result) => {
          if (typeof result === 'string') {
            // 上传成功，result是URL
            console.log('图片上传成功:', result)
            resolve(result)
          } else {
            // 上传失败
            console.error('图片上传失败:', result)
            resolve(null)
          }
        })
      })

    } catch (error) {
      console.error('图片上传过程中发生错误:', error)
      return null
    }
  }
}
