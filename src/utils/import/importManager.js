import { MarkdownImporter } from './markdownImporter.js'
import { JSONImporter } from './jsonImporter.js'
import { MammothImporter } from './mammothImporter.js'
// import { Docx4jsImporter } from './docx4jsImporter.js' // 未来升级方案：支持.doc和高精度.docx导入
import { progressManager } from '../export/progressManager.js'

/**
 * 导入管理器 - 统一处理各种格式的文件导入
 *
 * Word文档导入方案：
 * - 当前方案：MammothImporter (基于mammoth.js) - 稳定的过渡方案，支持基本的.docx导入
 * - 未来方案：Docx4jsImporter (基于docx4js) - 最终方案，支持.doc和高精度.docx导入
 */
export class ImportManager {
  constructor() {
    this.markdownImporter = new MarkdownImporter()
    this.jsonImporter = new JSONImporter()
    this.mammothImporter = new MammothImporter()
    // this.docx4jsImporter = new Docx4jsImporter() // 未来升级时启用
  }

  /**
   * 根据文件类型自动选择导入器
   * @param {File} file - 要导入的文件
   * @returns {Promise<Object>} TipTap JSON格式的文档内容
   */
  async importFile(file) {
    try {
      console.log('=== 开始文件导入 ===', file.name, file.type)
      
      // 显示进度条
      progressManager.show(100, '正在导入文件...')
      progressManager.updateProgress(10, '正在读取文件...')

      // 验证文件
      this.validateFile(file)

      // 读取文件内容（文本类格式：md / markdown / json / html / htm）
      const content = await this.readFileContent(file)
      
      progressManager.updateProgress(30, '正在解析文件内容...')

      // 根据文件类型选择导入器
      let result
      const fileExtension = this.getFileExtension(file.name).toLowerCase()
      
      switch (fileExtension) {
        case 'md':
        case 'markdown':
          result = await this.markdownImporter.import(content)
          break
        case 'json':
          result = await this.jsonImporter.import(content)
          break
        case 'docx':
          // 当前使用mammoth.js处理docx文件（过渡方案）
          result = await this.mammothImporter.import(file)
          // 未来升级方案：
          // result = await this.docx4jsImporter.import(file) // 支持更高精度的格式保留
          break
        case 'html':
        case 'htm':
          // 直接从HTML字符串导入
          result = this.mammothImporter.importHtml(content)
          break
        // case 'doc':
        //   // 未来支持.doc文件（需要docx4js）
        //   result = await this.docx4jsImporter.import(file)
        //   break
        default:
          throw new Error(`不支持的文件格式: ${fileExtension}`)
      }

      progressManager.updateProgress(90, '导入完成...')
      
      console.log('=== 文件导入成功 ===', result)
      
      // 显示成功状态
      progressManager.setSuccess()
      
      return result
    } catch (error) {
      console.error('=== 文件导入失败 ===', error)
      
      // 显示错误状态
      progressManager.setError(error.message)
      
      throw error
    }
  }

  /**
   * 验证文件是否符合要求
   * @param {File} file - 要验证的文件
   */
  validateFile(file) {
    if (!file) {
      throw new Error('请选择要导入的文件')
    }

    // 检查文件大小 (限制为10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
      throw new Error(`文件大小 ${sizeMB}MB 超过限制，最大支持 10MB`)
    }

    // 检查文件是否为空
    if (file.size === 0) {
      throw new Error('文件内容为空，请选择有效的文件')
    }

    // 检查文件类型
    const allowedExtensions = ['md', 'markdown', 'json', 'docx', 'html', 'htm']
    const fileExtension = this.getFileExtension(file.name).toLowerCase()

    if (!allowedExtensions.includes(fileExtension)) {
      throw new Error(`不支持的文件格式 "${fileExtension}"，仅支持: ${allowedExtensions.join(', ')}`)
    }

    // 检查文件名
    if (!file.name || file.name.trim() === '') {
      throw new Error('文件名无效')
    }
  }

  /**
   * 读取文件内容
   * @param {File} file - 要读取的文件
   * @returns {Promise<string>} 文件内容
   */
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'))
      }
      
      reader.readAsText(file, 'UTF-8')
    })
  }

  /**
   * 获取文件扩展名
   * @param {string} filename - 文件名
   * @returns {string} 文件扩展名
   */
  getFileExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.')
    if (lastDotIndex === -1) {
      return ''
    }
    return filename.substring(lastDotIndex + 1)
  }

  /**
   * 检查内容是否为空
   * @param {Object} content - TipTap JSON内容
   * @returns {boolean} 是否为空
   */
  isContentEmpty(content) {
    if (!content || !content.content || !Array.isArray(content.content)) {
      return true
    }
    
    // 检查是否只有空段落
    if (content.content.length === 1) {
      const node = content.content[0]
      if (node.type === 'paragraph' && (!node.content || node.content.length === 0)) {
        return true
      }
    }
    
    return content.content.length === 0
  }

  /**
   * 创建空文档
   * @returns {Object} 空的TipTap JSON文档
   */
  createEmptyDocument() {
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    }
  }

  /**
   * 验证TipTap JSON格式
   * @param {Object} json - 要验证的JSON对象
   * @returns {boolean} 是否为有效的TipTap JSON
   */
  validateTipTapJSON(json) {
    if (!json || typeof json !== 'object') {
      return false
    }
    
    if (json.type !== 'doc') {
      return false
    }
    
    if (!Array.isArray(json.content)) {
      return false
    }
    
    return true
  }
}
