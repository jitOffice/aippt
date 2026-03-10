import { Table, TableRow, TableCell, Paragraph, TextRun, WidthType, BorderStyle, AlignmentType, VerticalAlign } from 'docx'

/**
 * 表格处理工具类
 * 负责将TipTap表格转换为Word表格
 */
export class TableProcessor {
  constructor() {
    this.defaultBorderStyle = {
      style: BorderStyle.SINGLE,
      size: 1,
      color: '000000'
    }
  }

  /**
   * 处理表格节点
   * @param {Object} tableNode - TipTap表格节点
   * @returns {Table} Word表格对象
   */
  async processTable(tableNode, context = {}) {
    if (!tableNode || tableNode.type !== 'table') {
      throw new Error('无效的表格节点')
    }

    console.log('处理表格:', tableNode)

    try {
      // 验证表格结构
      if (!this.validateTableStructure(tableNode)) {
        throw new Error('表格结构无效')
      }

      // 解析表格结构
      const tableData = await this.parseTableStructure(tableNode, context)

      if (!tableData || !tableData.rows || tableData.rows.length === 0) {
        throw new Error('表格数据为空')
      }

      // 创建表格行
      const rows = this.createTableRows(tableData)

      if (!rows || rows.length === 0) {
        throw new Error('无法创建表格行')
      }

      // 创建Word表格
      const table = new Table({
        rows: rows.filter(Boolean), // 过滤掉undefined行
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        },
        borders: this.getTableBorders(tableNode.attrs || {})
      })

      console.log('表格处理完成，行数:', rows.length)
      return table

    } catch (error) {
      console.error('表格处理失败:', error)
      throw new Error(`表格处理失败: ${error.message}`)
    }
  }

  /**
   * 解析表格结构
   * @param {Object} tableNode - 表格节点
   * @returns {Object} 表格数据结构
   */
  async parseTableStructure(tableNode, context = {}) {
    const tableData = {
      rows: [],
      maxCols: 0,
      hasHeader: false
    }

    if (!tableNode.content) {
      return tableData
    }

    for (let rowIndex = 0; rowIndex < tableNode.content.length; rowIndex++) {
      const rowNode = tableNode.content[rowIndex]
      if (rowNode?.type !== 'tableRow') continue

      const rowData = await this.parseTableRow(rowNode, rowIndex, context)
      tableData.rows.push(rowData)
      tableData.maxCols = Math.max(tableData.maxCols, rowData.cells.length)

      if (rowIndex === 0 && rowData.cells.some(cell => cell.isHeader)) {
        tableData.hasHeader = true
      }
    }

    return tableData
  }

  /**
   * 解析表格行
   * @param {Object} rowNode - 表格行节点
   * @param {number} rowIndex - 行索引
   * @returns {Object} 行数据
   */
  async parseTableRow(rowNode, rowIndex, context = {}) {
    const rowData = {
      index: rowIndex,
      cells: [],
      isHeader: false
    }

    if (!rowNode.content) {
      return rowData
    }

    for (let cellIndex = 0; cellIndex < rowNode.content.length; cellIndex++) {
      const cellNode = rowNode.content[cellIndex]
      if (cellNode?.type !== 'tableCell' && cellNode?.type !== 'tableHeader') continue

      const cellData = await this.parseTableCell(cellNode, cellIndex, context)
      rowData.cells.push(cellData)

      if (cellNode.type === 'tableHeader') {
        rowData.isHeader = true
      }
    }

    return rowData
  }

  /**
   * 解析表格单元格
   * @param {Object} cellNode - 单元格节点
   * @param {number} cellIndex - 单元格索引
   * @returns {Object} 单元格数据
   */
  async parseTableCell(cellNode, cellIndex, context = {}) {
    const cellData = {
      index: cellIndex,
      content: [],
      isHeader: cellNode.type === 'tableHeader',
      colspan: cellNode.attrs?.colspan || 1,
      rowspan: cellNode.attrs?.rowspan || 1,
      backgroundColor: cellNode.attrs?.backgroundColor,
      textAlign: cellNode.attrs?.textAlign || 'left',
      verticalAlign: cellNode.attrs?.verticalAlign || 'top'
    }

    // 解析单元格内容
    if (cellNode.content) {
      for (const contentNode of cellNode.content) {
        const parsedContent = await this.parseCellContent(contentNode, context, cellData)
        cellData.content.push(...parsedContent)
      }
    }

    // 如果没有内容，添加空段落
    if (cellData.content.length === 0) {
      cellData.content.push(new Paragraph({ children: [new TextRun('')] }))
    }

    return cellData
  }

  /**
   * 解析单元格内容
   * @param {Object} contentNode - 内容节点
   * @returns {Array} 段落数组
   */
  async parseCellContent(contentNode, context = {}, cellData = {}) {
    const paragraphs = []

    switch (contentNode.type) {
      case 'paragraph': {
        const textRuns = []
        
        if (contentNode.content) {
          for (const inlineNode of contentNode.content) {
            if (inlineNode.type === 'text') {
              textRuns.push(this.createTextRun(inlineNode.text, inlineNode.marks))
              continue
            }

            if (inlineNode.type === 'image') {
              if (typeof context.createImageRun === 'function') {
                const imageRun = await context.createImageRun(inlineNode, { maxWidth: 300, maxHeight: 250 })
                if (imageRun) {
                  textRuns.push(imageRun)
                } else {
                  textRuns.push(this.createTextRun('[图片]', [{ type: 'italic' }]))
                }
              } else {
                textRuns.push(this.createTextRun('[图片]', [{ type: 'italic' }]))
              }
            }
          }
        }

        if (textRuns.length === 0) {
          textRuns.push(new TextRun(''))
        }

        paragraphs.push(new Paragraph({
          children: textRuns,
          alignment: this.getAlignment(contentNode.attrs?.textAlign)
        }))
        break
      }
      case 'image': {
        if (typeof context.createImageRun === 'function') {
          const imageRun = await context.createImageRun(contentNode, { maxWidth: 300, maxHeight: 250 })
          if (imageRun) {
            paragraphs.push(new Paragraph({
              children: [imageRun],
              alignment: this.getAlignment(contentNode.attrs?.textAlign || cellData.textAlign || 'center')
            }))
            break
          }
        }
        paragraphs.push(new Paragraph({
          children: [new TextRun('[图片]')],
          alignment: this.getAlignment(contentNode.attrs?.textAlign || cellData.textAlign || 'center')
        }))
        break
      }

      default:
        // 其他类型的内容暂时转为文本
        paragraphs.push(new Paragraph({
          children: [new TextRun(this.extractText(contentNode))]
        }))
    }

    return paragraphs
  }

  extractText(node) {
    if (!node) return ''
    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.content)) {
      return node.content.map(n => this.extractText(n)).join('')
    }
    return ''
  }

  /**
   * 创建表格行
   * @param {Object} tableData - 表格数据
   * @returns {Array} TableRow数组
   */
  createTableRows(tableData) {
    const rows = []

    tableData.rows.forEach(rowData => {
      const cells = this.createTableCells(rowData.cells, tableData.maxCols)
      const row = new TableRow({
        children: cells,
        tableHeader: rowData.isHeader
      })
      rows.push(row)
    })

    return rows
  }

  /**
   * 创建表格单元格
   * @param {Array} cellsData - 单元格数据数组
   * @param {number} maxCols - 最大列数
   * @returns {Array} TableCell数组
   */
  createTableCells(cellsData, maxCols) {
    const cells = []

    if (!Array.isArray(cellsData)) {
      console.warn('单元格数据不是数组')
      return cells
    }

    cellsData.forEach(cellData => {
      if (!cellData) {
        console.warn('单元格数据为空，跳过')
        return
      }

      // 确保内容不为空
      const content = Array.isArray(cellData.content) && cellData.content.length > 0
        ? cellData.content.filter(Boolean)
        : [new Paragraph({ children: [new TextRun('')] })]

      const cell = new TableCell({
        children: content,
        columnSpan: (cellData.colspan && cellData.colspan > 1) ? cellData.colspan : undefined,
        rowSpan: (cellData.rowspan && cellData.rowspan > 1) ? cellData.rowspan : undefined,
        width: {
          size: Math.max(Math.floor(100 / Math.max(maxCols, 1) * Math.max(cellData.colspan || 1, 1)), 5),
          type: WidthType.PERCENTAGE
        },
        shading: cellData.backgroundColor ? {
          fill: cellData.backgroundColor.replace('#', '')
        } : undefined,
        borders: this.getCellBorders(),
        verticalAlign: this.getVerticalAlignment(cellData.verticalAlign || 'top')
      })

      cells.push(cell)
    })

    return cells
  }

  /**
   * 创建文本运行对象
   * @param {string} text - 文本内容
   * @param {Array} marks - 文本标记
   * @returns {TextRun} 文本运行对象
   */
  createTextRun(text, marks = []) {
    const options = { text }

    if (marks) {
      marks.forEach(mark => {
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
            break
        }
      })
    }

    return new TextRun(options)
  }

  /**
   * 获取对齐方式
   * @param {string} align - 对齐方式
   * @returns {AlignmentType} Word对齐类型
   */
  getAlignment(align) {
    switch (align) {
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
   * 获取垂直对齐方式
   * @param {string} vAlign - 垂直对齐方式
   * @returns {VerticalAlign} Word垂直对齐类型
   */
  getVerticalAlignment(vAlign) {
    switch (vAlign) {
      case 'top':
        return VerticalAlign.TOP
      case 'center':
      case 'middle':
        return VerticalAlign.CENTER
      case 'bottom':
        return VerticalAlign.BOTTOM
      default:
        return VerticalAlign.TOP
    }
  }

  /**
   * 获取表格边框样式
   * @param {Object} attrs - 表格属性
   * @returns {Object} 边框样式
   */
  getTableBorders(_attrs = {}) {
    // 可以根据attrs自定义边框样式，目前使用默认样式
    return {
      top: this.defaultBorderStyle,
      bottom: this.defaultBorderStyle,
      left: this.defaultBorderStyle,
      right: this.defaultBorderStyle,
      insideHorizontal: this.defaultBorderStyle,
      insideVertical: this.defaultBorderStyle
    }
  }

  /**
   * 获取单元格边框样式
   * @returns {Object} 单元格边框样式
   */
  getCellBorders() {
    return {
      top: this.defaultBorderStyle,
      bottom: this.defaultBorderStyle,
      left: this.defaultBorderStyle,
      right: this.defaultBorderStyle
    }
  }

  /**
   * 验证表格结构
   * @param {Object} tableNode - 表格节点
   * @returns {boolean} 是否有效
   */
  validateTableStructure(tableNode) {
    if (!tableNode || tableNode.type !== 'table') {
      return false
    }

    if (!tableNode.content || tableNode.content.length === 0) {
      return false
    }

    // 检查是否有有效的行
    const hasValidRows = tableNode.content.some(node => 
      node.type === 'tableRow' && node.content && node.content.length > 0
    )

    return hasValidRows
  }
}

// 导出单例
export const tableProcessor = new TableProcessor()
