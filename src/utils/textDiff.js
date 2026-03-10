import { diffWords, diffLines } from 'diff'

/**
 * 文本对比工具类
 * 用于生成带有高亮和删除线效果的文本对比结果
 */
export class TextDiffUtil {
  /**
   * 将TipTap JSON内容转换为纯文本
   * @param {Object} content - TipTap JSON内容
   * @returns {string} 纯文本内容
   */
  static jsonToText(content) {
    if (!content || !content.content) return ''
    
    const extractText = (node) => {
      let text = ''
      
      if (node.text) {
        text += node.text
      }
      
      if (node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
          text += extractText(child)
        }
      }
      
      // 为段落和其他块级元素添加换行
      if (node.type === 'paragraph' || node.type === 'heading') {
        text += '\n'
      }
      
      return text
    }
    
    return extractText(content).trim()
  }

  /**
   * 对比两个文本并生成带样式的HTML
   * @param {string} oldText - 旧文本
   * @param {string} newText - 新文本
   * @param {Object} options - 配置选项
   * @returns {Object} 包含左右两侧HTML的对象
   */
  static compareTexts(oldText, newText, options = {}) {
    const {
      mode = 'words', // 'words' 或 'lines'
      ignoreWhitespace = false
    } = options

    const diffFunction = mode === 'lines' ? diffLines : diffWords
    const diffs = diffFunction(oldText, newText, { ignoreWhitespace })

    let leftHtml = ''
    let rightHtml = ''

    diffs.forEach(part => {
      const value = this.escapeHtml(part.value)
      
      if (part.removed) {
        // 在左侧显示删除的内容（红色背景 + 删除线）
        leftHtml += `<span class="diff-removed">${value}</span>`
      } else if (part.added) {
        // 在右侧显示新增的内容（绿色背景）
        rightHtml += `<span class="diff-added">${value}</span>`
      } else {
        // 未改变的内容在两侧都显示
        leftHtml += `<span class="diff-unchanged">${value}</span>`
        rightHtml += `<span class="diff-unchanged">${value}</span>`
      }
    })

    return {
      leftHtml,
      rightHtml,
      hasChanges: diffs.some(part => part.added || part.removed)
    }
  }

  /**
   * 对比两个TipTap JSON内容
   * @param {Object} leftContent - 左侧内容
   * @param {Object} rightContent - 右侧内容
   * @param {Object} options - 配置选项
   * @returns {Object} 对比结果
   */
  static compareJsonContents(leftContent, rightContent, options = {}) {
    const leftText = this.jsonToText(leftContent)
    const rightText = this.jsonToText(rightContent)
    
    return this.compareTexts(leftText, rightText, options)
  }

  /**
   * 转义HTML特殊字符
   * @param {string} text - 要转义的文本
   * @returns {string} 转义后的文本
   */
  static escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  /**
   * 生成对比统计信息
   * @param {string} oldText - 旧文本
   * @param {string} newText - 新文本
   * @returns {Object} 统计信息
   */
  static getCompareStats(oldText, newText) {
    const diffs = diffWords(oldText, newText)
    
    let added = 0
    let removed = 0
    let unchanged = 0
    
    diffs.forEach(part => {
      const wordCount = part.value.trim().split(/\s+/).length
      
      if (part.added) {
        added += wordCount
      } else if (part.removed) {
        removed += wordCount
      } else {
        unchanged += wordCount
      }
    })
    
    const total = added + removed + unchanged
    
    return {
      added,
      removed,
      unchanged,
      total,
      changePercentage: total > 0 ? Math.round(((added + removed) / total) * 100) : 0
    }
  }
}

/**
 * 生成对比样式的CSS
 * @returns {string} CSS样式字符串
 */
export function getDiffStyles() {
  return `
    .diff-container {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .diff-added {
      background-color: #d4edda;
      color: #155724;
      padding: 2px 4px;
      border-radius: 3px;
      margin: 0 1px;
    }
    
    .diff-removed {
      background-color: #f8d7da;
      color: #721c24;
      text-decoration: line-through;
      padding: 2px 4px;
      border-radius: 3px;
      margin: 0 1px;
    }
    
    .diff-unchanged {
      color: #333;
    }
    
    .diff-stats {
      display: flex;
      gap: 16px;
      padding: 8px 12px;
      background: #f8f9fa;
      border-radius: 6px;
      font-size: 12px;
      margin-bottom: 16px;
    }
    
    .diff-stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .diff-stat-added {
      color: #28a745;
    }
    
    .diff-stat-removed {
      color: #dc3545;
    }
    
    .diff-stat-unchanged {
      color: #6c757d;
    }
    
    .diff-highlight-line {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding-left: 8px;
      margin: 2px 0;
    }
  `
}
