import { progressManager } from './progressManager.js'
import { saveAs } from 'file-saver'
import { toSemanticDoc } from '../doc/semanticDoc.js'

/**
 * Markdown文档导出工具类
 * 负责将TipTap编辑器内容转换为Markdown文档
 */
export class MarkdownExporter {
  constructor() {
    this.output = []
    this.listDepth = 0
    this.tableRows = []
  }

  /**
   * 导出Markdown文档
   * @param {Object} content - TipTap JSON内容
   * @param {string} filename - 文件名
   * @param {Object} options - 导出选项
   */
  async exportToMarkdown(content, filename = 'document.md', options = {}) {
    try {
      const semanticDoc = toSemanticDoc(content)
      console.log('=== 开始Markdown文档导出 ===', content)

      // 显示进度条
      progressManager.show(100, '正在导出Markdown文档...')
      progressManager.updateProgress(10, '准备导出...')

      // 重置输出状态
      this.reset()

      progressManager.updateProgress(20, '正在解析文档内容...')

      // 解析内容并生成Markdown
      await this.parseContent(semanticDoc)

      progressManager.updateProgress(80, '内容解析完成，正在生成文件...')

      // 生成最终的Markdown内容
      const markdownContent = this.output.join('\n')

      progressManager.updateProgress(90, '正在下载文件...')

      // 创建并下载文件
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' })
      saveAs(blob, filename)

      console.log('=== Markdown文档导出完成 ===', filename)

      // 显示成功状态
      progressManager.setSuccess()

      return true
    } catch (error) {
      console.error('=== Markdown文档导出失败 ===', error)
      console.error('错误详情:', error.message)

      // 显示错误状态
      progressManager.setError(error.message)

      throw error
    }
  }

  /**
   * 重置导出状态
   */
  reset() {
    this.output = []
    this.listDepth = 0
    this.tableRows = []
  }

  /**
   * 解析文档内容
   * @param {Object} content - TipTap JSON内容
   */
  async parseContent(content) {
    if (!content || !content.content) {
      console.warn('文档内容为空')
      this.output.push('# 空文档\n\n文档内容为空。')
      return
    }

    console.log(`开始解析 ${content.content.length} 个节点`)

    for (let i = 0; i < content.content.length; i++) {
      const node = content.content[i]
      await this.processNode(node)
      
      // 更新进度
      const progress = 20 + (i / content.content.length) * 60
      progressManager.updateProgress(progress, `正在处理第 ${i + 1}/${content.content.length} 个节点...`)
    }
  }

  /**
   * 处理单个节点
   * @param {Object} node - 节点对象
   */
  async processNode(node) {
    if (!node || !node.type) {
      return
    }

    console.log(`处理节点类型: ${node.type}`)

    switch (node.type) {
      case 'paragraph':
        this.processParagraph(node)
        break
      case 'heading':
        this.processHeading(node)
        break
      case 'blockquote':
        this.processBlockquote(node)
        break
      case 'codeBlock':
        this.processCodeBlock(node)
        break
      case 'bulletList':
        this.processBulletList(node)
        break
      case 'orderedList':
        this.processOrderedList(node)
        break
      case 'listItem':
        this.processListItem(node)
        break
      case 'table':
        this.processTable(node)
        break
      case 'image':
        this.processImage(node)
        break
      case 'divider':
        this.processDivider(node)
        break
      case 'chart':
        this.processChart(node)
        break
      case 'audio':
        this.processAudio(node)
        break
      case 'video':
        this.processVideo(node)
        break
      default:
        console.warn(`未知节点类型: ${node.type}`)
        this.processUnknownNode(node)
        break
    }
  }

  /**
   * 处理段落节点
   */
  processParagraph(node) {
    const text = this.extractTextContent(node)
    if (text.trim()) {
      this.output.push(text)
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理标题节点
   */
  processHeading(node) {
    const level = node.attrs?.level || 1
    const text = this.extractTextContent(node)
    const prefix = '#'.repeat(level)
    this.output.push(`${prefix} ${text}`)
    this.output.push('') // 添加空行
  }

  /**
   * 处理引用块节点
   */
  processBlockquote(node) {
    if (node.content) {
      const lines = []
      for (const childNode of node.content) {
        const text = this.extractTextContent(childNode)
        if (text.trim()) {
          lines.push(`> ${text}`)
        }
      }
      this.output.push(...lines)
      this.output.push('') // 添加空行
    }
  }

  /**
   * 处理代码块节点
   */
  processCodeBlock(node) {
    const language = node.attrs?.language || ''
    const code = this.extractTextContent(node)
    this.output.push(`\`\`\`${language}`)
    this.output.push(code)
    this.output.push('```')
    this.output.push('') // 添加空行
  }

  /**
   * 处理无序列表节点
   */
  processBulletList(node) {
    if (node.content) {
      for (const item of node.content) {
        this.processListItem(item, '- ')
      }
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理有序列表节点
   */
  processOrderedList(node) {
    if (node.content) {
      for (let i = 0; i < node.content.length; i++) {
        this.processListItem(node.content[i], `${i + 1}. `)
      }
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理列表项节点
   */
  processListItem(node, prefix = '- ') {
    if (node.content) {
      for (const childNode of node.content) {
        const text = this.extractTextContent(childNode)
        if (text.trim()) {
          this.output.push(`${prefix}${text}`)
        }
      }
    }
  }

  /**
   * 处理表格节点
   */
  processTable(node) {
    if (!node.content) return

    const rows = []
    let isFirstRow = true

    for (const row of node.content) {
      if (row.type === 'tableRow' && row.content) {
        const cells = []
        for (const cell of row.content) {
          const cellText = this.extractTextContent(cell)
          cells.push(cellText || ' ')
        }
        rows.push(`| ${cells.join(' | ')} |`)

        // 为第一行添加分隔符
        if (isFirstRow) {
          const separator = cells.map(() => '---').join(' | ')
          rows.push(`| ${separator} |`)
          isFirstRow = false
        }
      }
    }

    this.output.push(...rows)
    this.output.push('') // 添加空行
  }

  /**
   * 处理图片节点
   */
  processImage(node) {
    const src = node.attrs?.src || ''
    const alt = node.attrs?.alt || '图片'
    const title = node.attrs?.title || ''
    
    if (title) {
      this.output.push(`![${alt}](${src} "${title}")`)
    } else {
      this.output.push(`![${alt}](${src})`)
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理分隔线节点
   */
  processDivider(node) {
    this.output.push('---')
    this.output.push('') // 添加空行
  }

  /**
   * 处理图表节点
   */
  processChart(node) {
    const title = node.attrs?.title || '图表'
    const type = node.attrs?.type || 'chart'
    this.output.push(`<!-- 图表: ${title} (类型: ${type}) -->`)
    this.output.push(`**[图表: ${title}]**`)
    this.output.push('') // 添加空行
  }

  /**
   * 处理音频节点
   */
  processAudio(node) {
    const src = node.attrs?.src || ''
    const title = node.attrs?.title || '音频'
    this.output.push(`**[音频: ${title}]**`)
    if (src) {
      this.output.push(`音频链接: ${src}`)
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理视频节点
   */
  processVideo(node) {
    const src = node.attrs?.src || ''
    const title = node.attrs?.title || '视频'
    this.output.push(`**[视频: ${title}]**`)
    if (src) {
      this.output.push(`视频链接: ${src}`)
    }
    this.output.push('') // 添加空行
  }

  /**
   * 处理未知节点类型
   */
  processUnknownNode(node) {
    const text = this.extractTextContent(node)
    if (text.trim()) {
      this.output.push(text)
      this.output.push('') // 添加空行
    }
  }

  /**
   * 提取节点的文本内容
   * @param {Object} node - 节点对象
   * @returns {string} 文本内容
   */
  extractTextContent(node) {
    if (!node) return ''

    if (node.type === 'text') {
      return this.formatTextWithMarks(node.text || '', node.marks || [])
    }

    if (node.type === 'mention') {
      const label = node.attrs?.label || ''
      return label ? `@${label}` : '@'
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(child => this.extractTextContent(child)).join('')
    }

    return ''
  }

  /**
   * 格式化带有标记的文本
   * @param {string} text - 原始文本
   * @param {Array} marks - 标记数组
   * @returns {string} 格式化后的文本
   */
  formatTextWithMarks(text, marks) {
    if (!marks || marks.length === 0) {
      return text
    }

    let formattedText = text

    // 处理各种文本标记
    for (const mark of marks) {
      switch (mark.type) {
        case 'bold':
          formattedText = `**${formattedText}**`
          break
        case 'italic':
          formattedText = `*${formattedText}*`
          break
        case 'strike':
          formattedText = `~~${formattedText}~~`
          break
        case 'code':
          formattedText = `\`${formattedText}\``
          break
        case 'link':
          const href = mark.attrs?.href || '#'
          const title = mark.attrs?.title
          if (title) {
            formattedText = `[${formattedText}](${href} "${title}")`
          } else {
            formattedText = `[${formattedText}](${href})`
          }
          break
        case 'underline':
          // Markdown没有原生的下划线支持，使用HTML标签
          formattedText = `<u>${formattedText}</u>`
          break
        default:
          console.warn(`未知的文本标记类型: ${mark.type}`)
          break
      }
    }

    return formattedText
  }
}
