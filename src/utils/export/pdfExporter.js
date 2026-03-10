import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { progressManager } from './progressManager.js'
import { saveAs } from 'file-saver'

/**
 * PDF文档导出工具类
 * 负责将TipTap编辑器内容转换为PDF文档
 */
export class PDFExporter {
  constructor() {
    this.pdf = null
    this.pageWidth = 210 // A4宽度 (mm)
    this.pageHeight = 297 // A4高度 (mm)
    this.margin = 20 // 页边距 (mm)
    this.contentWidth = this.pageWidth - 2 * this.margin
    this.contentHeight = this.pageHeight - 2 * this.margin
	    // 导出过程中用于暂存被替换为图片的思维导图DOM，方便导出完成后恢复
	    this.mindmapExportSnapshots = []
  }

  /**
   * 导出PDF文档 - 采用逐元素分页方案
   * 借鉴参考项目的策略：先将元素分配到各页，再逐页截图
   * @param {Object} content - TipTap JSON内容
   * @param {string} filename - 文件名
   * @param {Object} options - 导出选项
   */
  async exportToPDF(content, filename = 'document.pdf', options = {}) {
	    try {
	      console.log('=== 开始PDF文档导出（逐元素分页方案）===', content)

	      // 显示进度条
	      progressManager.show(100, '正在导出PDF文档...')
	      progressManager.updateProgress(5, '准备导出...')

	      // 获取编辑器容器
	      const editorContainer = this.findEditorContainer()
	      if (!editorContainer) {
	        throw new Error('找不到编辑器容器')
	      }

	      progressManager.updateProgress(10, '正在准备页面内容...')

	      // 准备导出内容（图片预处理、图表渲染等）
	      await this.prepareContentForExport(editorContainer)

	      // 等待页面布局稳定
	      await this.waitForLayoutStable(editorContainer)

	      progressManager.updateProgress(20, '正在分析页面结构...')

	      // 【核心改动】使用逐元素分页方案
	      await this.exportWithElementPaging(editorContainer, filename, options)

	      progressManager.updateProgress(90, '正在下载文件...')

	      console.log('=== PDF文档导出完成 ===', filename)

	      // 显示成功状态
	      progressManager.setSuccess()

	      return true
	    } catch (error) {
	      console.error('=== PDF文档导出失败 ===', error)
	      console.error('错误详情:', error.message)

	      // 显示错误状态
	      progressManager.setError(error.message)

	      throw error
	    } finally {
	      // 无论导出是否成功，都尝试恢复被临时替换为图片的思维导图DOM
	      try {
	        if (typeof this.restoreMindmapsAfterExport === 'function') {
	          this.restoreMindmapsAfterExport()
	        }
	      } catch (restoreError) {
	        console.warn('恢复思维导图DOM失败:', restoreError)
	      }
	    }
  }

  /**
   * 【核心方法】逐元素分页导出
   * 借鉴参考项目的策略：遍历所有子元素，按高度分配到各页
   * @param {HTMLElement} editorContainer - 编辑器容器
   * @param {string} filename - 文件名
   * @param {Object} options - 选项
   */
  async exportWithElementPaging(editorContainer, filename, options = {}) {
    console.log('=== 开始逐元素分页 ===')

    const {
      canvasScale = 1.5,
      imageType = 'JPEG',
      imageQuality = 0.8,
      imageCompression = 'MEDIUM'
    } = options

    const normalizedImageType = (imageType || 'JPEG').toUpperCase()
    const isPng = normalizedImageType === 'PNG'

    console.log('[PDF 导出] 图像参数:', {
      canvasScale,
      imageType: normalizedImageType,
      imageQuality,
      imageCompression
    })

    // 创建PDF（先创建，以便获取精确的页面尺寸）
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pdfWidth = this.pdf.internal.pageSize.getWidth()   // 210mm
    const pdfHeight = this.pdf.internal.pageSize.getHeight() // 297mm
    const margin = 10 // mm
    const contentWidth = pdfWidth - 2 * margin   // 190mm
    const contentHeight = pdfHeight - 2 * margin // 277mm

    // 固定宽度，适合A4纸（与参考项目一致）
    const pageContainerWidth = 800
    // 页面容器的 padding（与 createPageContainer 中一致）
    const pageContainerPadding = 20

    // 【关键】精确计算 maxPageHeight：
    // 页面容器宽度 800px 对应 PDF 内容宽度 190mm
    // 所以 1mm = 800 / 190 ≈ 4.21px
    // PDF 内容高度 277mm 对应的像素高度 = 277 * (800 / 190) ≈ 1166px
    // 再减去页面容器的上下 padding（各 20px）= 1166 - 40 = 1126px
    // 为了安全，再预留 5% 的缓冲 = 1126 * 0.95 ≈ 1070px
    const pxPerMm = pageContainerWidth / contentWidth
    const rawMaxPageHeight = contentHeight * pxPerMm - 2 * pageContainerPadding
    const maxPageHeight = Math.floor(rawMaxPageHeight * 0.95)

    console.log(`[PDF 导出] 计算分页参数:`)
    console.log(`  - PDF 内容区域: ${contentWidth}mm x ${contentHeight}mm`)
    console.log(`  - 页面容器宽度: ${pageContainerWidth}px`)
    console.log(`  - 换算比例: ${pxPerMm.toFixed(2)} px/mm`)
    console.log(`  - 原始最大高度: ${rawMaxPageHeight.toFixed(0)}px`)
    console.log(`  - 安全最大高度: ${maxPageHeight}px (预留5%缓冲)`)

    // 创建页面数组
    const pages = await this.createPagesFromElements(
      editorContainer,
      pageContainerWidth,
      maxPageHeight
    )

    console.log(`分页完成，共 ${pages.length} 页`)

    // 逐页渲染并直接写入 PDF（不做任何缩放，分页时已经严格控制高度）
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      const hasImgElement = !!page.querySelector('img')
      const hasPdfSeparator = !!page.querySelector('[data-pdf-separator]')

      progressManager.updateProgress(
        30 + (i / pages.length) * 60,
        `正在渲染第 ${i + 1}/${pages.length} 页...`
      )

      // 添加页面到文档以便渲染
      page.style.position = 'absolute'
      page.style.left = '-9999px'
      page.style.top = '0'
      document.body.appendChild(page)

      // 等待一帧确保DOM更新
      await new Promise(resolve => requestAnimationFrame(resolve))

      try {
        // 渲染当前页
        const canvas = await html2canvas(page, {
          scale: canvasScale,
          useCORS: true,
          allowTaint: true,
          backgroundColor: 'white',
          logging: false,
          width: pageContainerWidth,
          onclone: (clonedDoc, clonedElement) => {
            // 应用样式优化
            const style = clonedDoc.createElement('style')
            style.innerHTML = this.getExportStyles()
            clonedDoc.head.appendChild(style)
            
            // 【关键】在克隆文档中再次处理分隔线
            // 因为html2canvas会重新克隆DOM，之前的修改可能丢失
            this.processSeparatorsInClonedDoc(clonedElement)
          }
        })

        // 计算图片在 PDF 中的尺寸
        // 【关键】宽度固定为 contentWidth，高度按比例计算，不做任何缩放
        const imgWidth = contentWidth
        const imgHeight = (canvas.height * contentWidth) / canvas.width

        console.log(`第 ${i + 1} 页: canvas ${canvas.width}x${canvas.height}px -> PDF ${imgWidth.toFixed(1)}x${imgHeight.toFixed(1)}mm`)

        // 如果高度超出（理论上不应该发生，因为分页时已经严格控制），打印警告
        if (imgHeight > contentHeight) {
          console.warn(
            `[PDF 导出] 警告：第 ${i + 1} 页高度 ${imgHeight.toFixed(1)}mm 超出内容区域 ${contentHeight}mm，` +
            '可能存在分页计算误差，建议检查 maxPageHeight 参数'
          )
        }

        if (i > 0) {
          this.pdf.addPage()
        }

        // 分隔线属于细线条元素，JPEG 容易出现颜色/边缘损失；包含已转换的分隔线时优先 PNG
        const usePngForThisPage = isPng || hasImgElement || hasPdfSeparator
        const mimeType = usePngForThisPage ? 'image/png' : 'image/jpeg'
        const quality = usePngForThisPage ? 1.0 : imageQuality
        const formatForThisPage = usePngForThisPage ? 'PNG' : normalizedImageType

        this.pdf.addImage({
          imageData: canvas.toDataURL(mimeType, quality),
          format: formatForThisPage,
          x: margin,
          y: margin,
          width: imgWidth,
          height: imgHeight,
          compression: usePngForThisPage ? 'FAST' : imageCompression
        })

        this.addPageNumber(i + 1, pages.length)

      } finally {
        // 渲染完成后立即从文档中移除临时页面节点
        if (document.body.contains(page)) {
          document.body.removeChild(page)
        }
      }
    }

    // 保存PDF
    const pdfBlob = this.pdf.output('blob')
    saveAs(pdfBlob, filename)

    console.log('PDF文档创建完成')
  }

  /**
   * 【核心方法】将编辑器元素分配到各个页面容器
   * @param {HTMLElement} editorContainer - 编辑器容器
   * @param {number} pageWidth - 页面宽度(px)
   * @param {number} maxPageHeight - 单页最大高度(px)
   * @returns {Promise<HTMLElement[]>} 页面容器数组
   */
  async createPagesFromElements(editorContainer, pageWidth, maxPageHeight) {
    const pages = []

    // 创建第一个页面容器
    let currentPage = this.createPageContainer(pageWidth)
    let currentPageHeight = 0

    // 获取编辑器的所有直接子元素
    const children = Array.from(editorContainer.children)
    console.log(`编辑器共有 ${children.length} 个顶层元素`)

    for (let i = 0; i < children.length; i++) {
      const element = children[i]

      // 跳过不可见元素和UI元素
      if (this.shouldSkipElement(element)) {
        continue
      }

      // 克隆元素
      const clone = element.cloneNode(true)

      // 清除克隆元素的UI状态
      this.clearElementUIState(clone)

      // 为代码块应用完整的内联样式（确保导出时样式不丢失）
      this.applyCodeBlockStyles(clone)
      // 为表格应用内联样式
      this.applyTableStyles(clone)
      // 为分隔线应用内联样式（将mask-image转换为实际SVG，解决html2canvas不支持mask的问题）
      // 传入原始元素以便获取计算后的颜色（解决currentColor颜色丢失问题）
      this.applySeparatorStyles(clone, element)

      // 测量元素高度
      const tempContainer = document.createElement('div')
      tempContainer.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: ${pageWidth}px;
        visibility: hidden;
      `
      tempContainer.appendChild(clone.cloneNode(true))
      document.body.appendChild(tempContainer)
      const elementHeight = tempContainer.offsetHeight || tempContainer.scrollHeight
      document.body.removeChild(tempContainer)

      // 对超出单页高度的代码块进行特殊拆分处理
      const isCodeBlock =
        clone.tagName === 'PRE' ||
        clone.matches?.('pre, pre.hljs') ||
        clone.querySelector?.('pre')

      // 只有当代码块高度真正超过单页高度时才拆分（不是 1.1 倍，而是直接超过）
      if (isCodeBlock && elementHeight > maxPageHeight) {
        console.log(
          `检测到超高代码块元素，高度: ${elementHeight}px, maxPageHeight: ${maxPageHeight}px`
        )

        const segments = this.splitCodeBlockElement(clone, pageWidth, maxPageHeight)

        for (const segment of segments) {
          // 再次测量每一段的实际高度，避免因为样式差异导致高度不准
          const segTemp = document.createElement('div')
          segTemp.style.cssText = `
            position: absolute;
            left: -9999px;
            top: 0;
            width: ${pageWidth}px;
            visibility: hidden;
          `
          segTemp.appendChild(segment.cloneNode(true))
          document.body.appendChild(segTemp)
          const segmentHeight = segTemp.offsetHeight || segTemp.scrollHeight
          document.body.removeChild(segTemp)

          // 如果当前页放不下这一段，则先换页
          if (currentPageHeight > 0 && currentPageHeight + segmentHeight > maxPageHeight) {
            if (currentPage.childNodes.length > 0) {
              pages.push(currentPage)
              console.log(
                `第 ${pages.length} 页完成(代码块拆分), 高度: ${currentPageHeight}px`
              )
            }
            currentPage = this.createPageContainer(pageWidth)
            currentPageHeight = 0
          }

          currentPage.appendChild(segment)
          currentPageHeight += segmentHeight
        }

        // 已经用拆分段替代原始代码块，继续处理下一个顶层元素
        continue
      }

      // 判断是否需要分页
      if (currentPageHeight > 0 && currentPageHeight + elementHeight > maxPageHeight) {
        // 保存当前页，创建新页
        if (currentPage.childNodes.length > 0) {
          pages.push(currentPage)
          console.log(`第 ${pages.length} 页完成，高度: ${currentPageHeight}px`)
        }
        currentPage = this.createPageContainer(pageWidth)
        currentPageHeight = 0
      }

      // 添加元素到当前页面
      currentPage.appendChild(clone)
      currentPageHeight += elementHeight
    }

    // 添加最后一页
    if (currentPage.childNodes.length > 0) {
      pages.push(currentPage)
      console.log(`第 ${pages.length} 页完成，高度: ${currentPageHeight}px`)
    }

    // 同步图片（确保base64数据被正确复制）
    for (const page of pages) {
      await this.syncImagesInPage(page, editorContainer)
    }

    return pages
  }

  /**
   * 创建页面容器
   * @param {number} width - 容器宽度
   * @returns {HTMLElement} 页面容器
   */
  createPageContainer(width) {
    const container = document.createElement('div')
    // 标记为 PDF 导出页面容器，便于在克隆文档中应用专用样式
    container.classList.add('px-pdf-page')
    container.style.cssText = `
      width: ${width}px;
      background-color: white;
      position: relative;
      overflow: visible;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      word-wrap: break-word;
      letter-spacing: normal;
      padding: 20px;
      box-sizing: border-box;
    `
    return container
  }

  /**
   * 将超高代码块元素拆分为多个可分页片段
   * 按“文本行”维度拆分，避免通过裁剪导致内容丢失或文字被截断
   * @param {HTMLElement} codeElement - 代码块元素（或其容器）
   * @param {number} pageWidth - 页面宽度(px)
   * @param {number} maxPageHeight - 单页最大高度(px)
   * @returns {HTMLElement[]} 拆分后的片段元素数组
   */
  splitCodeBlockElement(codeElement, pageWidth, maxPageHeight) {
    // 1. 找到真正的 <pre> 元素，兼容外层包裹容器的情况
    const pre = codeElement.tagName === 'PRE'
      ? codeElement
      : codeElement.querySelector('pre') || codeElement

    const fullText = pre.textContent || ''
    const lines = fullText.split('\n')

    // 如果行数很少，不做复杂拆分，直接整体返回
    if (lines.length <= 1) {
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `width: ${pageWidth}px; box-sizing: border-box;`
      const preClone = pre.cloneNode(true)
      // 确保代码块样式完整
      preClone.style.cssText = `
        margin: 12px 0;
        padding: 16px 20px;
        border-radius: 4px;
        background-color: #111827;
        color: #f9fafb;
        font-family: "JetBrainsMono", "Courier New", Courier, monospace;
        font-size: 0.8rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
      `
      wrapper.appendChild(preClone)
      return [wrapper]
    }

    // 2. 在隐藏容器中用与导出相同的宽度、样式测量“若干行”的高度
    const measureContainer = document.createElement('div')
    measureContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: ${pageWidth}px;
      visibility: hidden;
    `

    // 只克隆 pre 的外壳（标签、class、样式），不拷贝内部高亮 span，避免测量误差
    const measurePre = pre.cloneNode(false)
    measureContainer.appendChild(measurePre)
    document.body.appendChild(measureContainer)

    const segments = []
    const totalLines = lines.length
    let start = 0

    // 安全兜底：最多拆分 totalLines 段 + 少量冗余，避免异常情况下死循环
    const safeMaxIterations = totalLines + 10
    let iteration = 0

    const measureLinesHeight = (from, to) => {
      // [from, to) 行的文本
      const text = lines.slice(from, to).join('\n') || '\u200b'
      measurePre.textContent = text
      const h = measureContainer.offsetHeight || measureContainer.scrollHeight || 0
      return h
    }

    while (start < totalLines && iteration < safeMaxIterations) {
      iteration++

      // 3. 二分查找当前这一页最多能容纳多少行
      let low = start + 1
      let high = totalLines
      let best = low

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const h = measureLinesHeight(start, mid)

        if (h <= maxPageHeight) {
          best = mid
          low = mid + 1
        } else {
          high = mid - 1
        }
      }

      // 防御：如果一行都放不下（极端情况下 maxPageHeight 太小），至少也要前进一行
      if (best <= start) {
        best = Math.min(start + 1, totalLines)
      }

      // 4. 根据 [start, best) 行创建一个新的 <pre> 片段
      const segmentPre = pre.cloneNode(false)
      segmentPre.textContent = lines.slice(start, best).join('\n')
      // 确保代码块样式完整
      segmentPre.style.cssText = `
        margin: 12px 0;
        padding: 16px 20px;
        border-radius: 4px;
        background-color: #111827;
        color: #f9fafb;
        font-family: "JetBrainsMono", "Courier New", Courier, monospace;
        font-size: 0.8rem;
        line-height: 1.5;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-wrap: break-word;
        box-sizing: border-box;
        width: 100%;
        max-width: 100%;
      `

      const wrapper = document.createElement('div')
      wrapper.style.cssText = `width: ${pageWidth}px; box-sizing: border-box;`
      wrapper.appendChild(segmentPre)
      segments.push(wrapper)

      start = best
    }

    if (iteration >= safeMaxIterations) {
      console.warn('splitCodeBlockElement: 达到最大拆分迭代次数，可能存在异常行拆分')
    }

    document.body.removeChild(measureContainer)

    return segments
  }

  /**
   * 判断是否应该跳过元素
   * @param {HTMLElement} element - 元素
   * @returns {boolean} 是否跳过
   */
  shouldSkipElement(element) {
    if (!element || !element.tagName) return true

    // 检查是否是UI元素
    const uiClasses = [
      'toolbar', 'menu', 'floating', 'tooltip', 'modal',
      'dropdown', 'progress', 'loading', 'overlay', 'popup',
      'px-editor-toolbar-menu', 'px-editor-bubble-menu', 'px-editor-slash-menu',
      'bubble-menu', 'slash-menu', 'side-insert-handle',
      'a-modal', 'a-tooltip', 'a-dropdown', 'a-popover',
      'collaboration-cursor', 'ProseMirror-yjs-cursor',
      'ai-cursor-input', 'ai-writer-modal', 'ai-writer-drawer'
    ]

    for (const cls of uiClasses) {
      if (element.classList && element.classList.contains(cls)) {
        return true
      }
    }

    // 检查元素是否可见
    const style = window.getComputedStyle(element)
    if (style.display === 'none' || style.visibility === 'hidden') {
      return true
    }

    // 检查高度
    const rect = element.getBoundingClientRect()
    if (rect.height === 0) {
      return true
    }

    return false
  }

  /**
   * 清除元素的UI状态
   * @param {HTMLElement} element - 元素
   */
  clearElementUIState(element) {
    // 移除选中状态类
    element.classList.remove('selected', 'active', 'focused', 'highlighted', 'ProseMirror-selectednode')

    // 移除协作光标
    const cursors = element.querySelectorAll(`
      .collaboration-cursor, .collaboration-cursor__caret, .collaboration-cursor__label,
      .ProseMirror-yjs-cursor, .yjs-cursor, [data-decoration-id]
    `)
    cursors.forEach(el => el.remove())

    // 移除AI输入框等UI元素
    const uiElements = element.querySelectorAll(`
      .ai-cursor-input, .ai-writer-modal, .ai-writer-drawer,
      .tooltip, .dropdown, .modal, .popup
    `)
    uiElements.forEach(el => el.remove())

    // 清除评论高亮
    const commentMarks = element.querySelectorAll('.px-editor__comment-mark, [data-comment-id]')
    commentMarks.forEach(el => {
      el.style.backgroundColor = ''
      el.style.borderBottom = ''
      el.style.boxShadow = ''
    })

    // 清除图片选中边框
    const images = element.querySelectorAll('img')
    images.forEach(img => {
      img.style.borderColor = 'transparent'
    })

    // 隐藏图片调整句柄
    const handles = element.querySelectorAll('.px-editor__image-resize-handles, .px-editor__image-resize-handle')
    handles.forEach(h => h.style.display = 'none')

    // 清除占位符
    const placeholders = element.querySelectorAll('[data-placeholder]')
    placeholders.forEach(el => el.removeAttribute('data-placeholder'))

    // 递归处理子元素的选中状态
    const selectedChildren = element.querySelectorAll('.selected, .active, .focused, .highlighted')
    selectedChildren.forEach(el => {
      el.classList.remove('selected', 'active', 'focused', 'highlighted')
    })
  }

  /**
   * 为代码块应用完整的内联样式
   * @param {HTMLElement} element - 元素
   */
  applyCodeBlockStyles(element) {
    // 代码块样式定义
    const preStyles = `
      margin: 12px 0;
      padding: 16px 20px;
      border-radius: 4px;
      background-color: #111827;
      color: #f9fafb;
      font-family: "JetBrainsMono", "Courier New", Courier, monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
    `

    const codeStyles = `
      background: none;
      color: inherit;
      font-size: inherit;
      display: block;
      white-space: pre-wrap;
      word-wrap: break-word;
    `

    // 如果元素本身是 pre
    if (element.tagName === 'PRE') {
      element.style.cssText = preStyles
      const codeEl = element.querySelector('code')
      if (codeEl) {
        codeEl.style.cssText = codeStyles
      }
    }

    // 查找所有 pre 子元素
    const preElements = element.querySelectorAll('pre')
    preElements.forEach(pre => {
      pre.style.cssText = preStyles
      const codeEl = pre.querySelector('code')
      if (codeEl) {
        codeEl.style.cssText = codeStyles
      }
    })
  }

  /**
   * 为表格应用内联样式
   * @param {HTMLElement} element - 元素
   */
  applyTableStyles(element) {
    const tableStyles = `
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
      table-layout: fixed;
      border: none;
    `
    
    const cellStyles = `
      border: 1px solid rgba(228, 228, 231, 1);
      padding: 3px 5px;
      text-align: left;
      vertical-align: top;
      word-wrap: break-word;
      overflow-wrap: break-word;
      box-sizing: border-box;
      min-width: 1em;
      position: relative;
      line-height: 1.5;
      font-size: 1rem;
    `

    const headerStyles = `
      background-color: rgba(228, 228, 231, 0.4);
      font-weight: bold;
    `

    // 处理单个表格
    const applyToTable = (table) => {
      table.style.cssText = tableStyles
      
      const cells = table.querySelectorAll('td, th')
      cells.forEach(cell => {
        let style = cellStyles
        if (cell.tagName === 'TH') {
          style += headerStyles
        }
        cell.style.cssText = style
        
        // 确保单元格内的 p 标签没有 margin
        const paragraphs = cell.querySelectorAll('p')
        paragraphs.forEach(p => {
          p.style.margin = '0'
        })
      })
    }

    if (element.tagName === 'TABLE') {
      applyToTable(element)
    }

    const tables = element.querySelectorAll('table')
    tables.forEach(table => applyToTable(table))
  }

  /**
   * 为分隔线应用内联样式
   * 将使用CSS mask-image的复杂分隔线转换为实际的内联SVG元素
   * 解决html2canvas不支持mask-image属性的问题
   * @param {HTMLElement} element - 克隆后的元素
   * @param {HTMLElement} originalElement - 原始元素（可选，用于获取计算后的颜色）
   */
  applySeparatorStyles(element, originalElement = null) {
    // 构建原始元素中分隔线的颜色映射（用于解决currentColor问题）
    // 在克隆之前，从原始DOM获取计算后的颜色
    const originalColorMap = new Map()
    if (originalElement) {
      const originalSeparators = originalElement.tagName === 'HR' 
        ? [originalElement] 
        : Array.from(originalElement.querySelectorAll('hr[data-separator]'))
      
      originalSeparators.forEach((hr, index) => {
        // 获取计算后的颜色
        const computedStyle = window.getComputedStyle(hr)
        // 不同类型分隔线的颜色来源不同：
        // - mask 分隔线：用 background-color 作为线条颜色
        // - border 分隔线（如 double）：用 borderTopColor 作为线条颜色
        const styleAttr = hr.getAttribute('style') || ''
        const isMaskSeparator = styleAttr.includes('mask-image')
        const isBorderSeparator = /border-top-style\s*:/i.test(styleAttr)
        
        const isTransparent = (c) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)'
        
        let computedColor = null
        if (isMaskSeparator) {
          computedColor = computedStyle.backgroundColor
        } else if (isBorderSeparator) {
          computedColor = computedStyle.borderTopColor || computedStyle.borderColor
        } else {
          computedColor = computedStyle.backgroundColor
        }
        
        // 兜底回退：避免拿到继承文本颜色导致边框分隔线颜色错误
        if (isTransparent(computedColor)) {
          computedColor = computedStyle.backgroundColor
        }
        if (isTransparent(computedColor)) {
          computedColor = computedStyle.borderTopColor || computedStyle.borderColor
        }
        if (isTransparent(computedColor)) {
          computedColor = computedStyle.color
        }
        
        console.log(
          `[PDF导出] 原始分隔线 #${index} 计算颜色: mask=${isMaskSeparator}, border=${isBorderSeparator}, bg=${computedStyle.backgroundColor}, color=${computedStyle.color}, border=${computedStyle.borderTopColor}`
        )
        
        if (computedColor && computedColor !== 'transparent' && computedColor !== 'rgba(0, 0, 0, 0)') {
          originalColorMap.set(index, computedColor)
        }
      })
    }

    // 用于匹配的特征字符串（从mask URL中提取的唯一标识）
    // 使用数组保证遍历顺序，按特异性从高到低排序
    const MASK_SIGNATURES = [
      { type: "dash-dot-dot", signatures: ["width='27'", "cx='22.5'"] },
      { type: "dash-dot", signatures: ["width='21'", "cx='16.5'"] },
      { type: "wavy-double", signatures: ["M0 4 Q3 0", "M0 10 Q3 6"] },
      { type: "wavy", signatures: ["viewBox='0 0 12 6'", "Q3 0 6 6"] },
      { type: "zigzag", signatures: ["L6 0 L12 12"] },
      { type: "triple", signatures: ["y='4'", "y='8'", "height='2'", "width='10'"] },
      { type: "thick-thin", signatures: ["height='6'", "y='8'"] },
      { type: "thin-thick", signatures: ["y='4'", "height='6'"] },
    ]

    // 识别分隔线类型
    const identifySeparatorType = (styleAttr) => {
      if (!styleAttr || !styleAttr.includes('mask-image')) {
        return null
      }
      
      // 解码URL编码的字符串以便匹配
      let decodedStyle = styleAttr
      try {
        decodedStyle = decodeURIComponent(styleAttr)
      } catch {
        // 如果解码失败，使用原始字符串
        decodedStyle = styleAttr
      }

      // 按特征匹配类型（数组保证顺序）
      for (const { type, signatures } of MASK_SIGNATURES) {
        const allMatch = signatures.every(sig => decodedStyle.includes(sig))
        if (allMatch) {
          return type
        }
      }
      
      return null
    }

    // 辅助函数：尽可能保持颜色原样（尤其是 rgba 的 alpha），仅在无法解析时回退为黑色
    const normalizeColor = (colorStr) => {
      if (!colorStr) return '#000000'
      
      const trimmed = colorStr.trim()
      if (!trimmed) return '#000000'
      
      // 处理 currentColor
      if (trimmed === 'currentColor' || trimmed === 'inherit') {
        return '#000000'
      }
      
      // 处理 transparent
      if (trimmed === 'transparent') {
        return 'rgba(0, 0, 0, 0)'
      }
      
      // 处理 CSS 变量
      if (trimmed.startsWith('var(')) {
        return '#000000'
      }
      
      // 规范化 rgb/rgba（保留 alpha，避免导出后颜色变深/变黑）
      const rgbaMatch = trimmed.match(
        /rgba?\s*\(\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:\s*(?:,\s*|\/\s*|\s+)\s*([0-9.]+)\s*)?\)/i
      )
      if (rgbaMatch) {
        const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
        const r = clamp(Math.round(parseFloat(rgbaMatch[1])), 0, 255)
        const g = clamp(Math.round(parseFloat(rgbaMatch[2])), 0, 255)
        const b = clamp(Math.round(parseFloat(rgbaMatch[3])), 0, 255)
        const aRaw = rgbaMatch[4]
        if (aRaw !== undefined) {
          const a = clamp(parseFloat(aRaw), 0, 1)
          return `rgba(${r}, ${g}, ${b}, ${a})`
        }
        return `rgb(${r}, ${g}, ${b})`
      }
      
      // 其他格式（hex、颜色名称、hsl等）保持原样，交由 SVG 生成器处理/兜底
      return trimmed
    }

    // 处理单个分隔线元素
    const processSeparator = (hr, index = 0) => {
      if (!hr.hasAttribute('data-separator')) {
        return
      }

      const styleAttr = hr.getAttribute('style') || ''
      
      // 识别分隔线类型
      // - mask 分隔线：通过 mask-image 签名识别
      // - double：border-top-style: double（html2canvas 对 double 支持不稳定，导出时统一转 SVG）
      let separatorType = identifySeparatorType(styleAttr)
      if (!separatorType) {
        const borderStyleMatch = styleAttr.match(/border-top-style:\s*([^;]+)/i)
        const borderStyle = (borderStyleMatch?.[1] || '').trim().toLowerCase()
        if (borderStyle === 'double') {
          separatorType = 'double'
        }
      }
      if (!separatorType) {
        console.log('[PDF导出] 非需转换分隔线或无法识别类型，跳过')
        return
      }

      // 提取颜色 - 改进的颜色提取逻辑
      // 优先使用从原始元素获取的计算颜色（解决currentColor问题）
      let color = '#000000'
      
      // 首先尝试从原始元素的计算样式获取颜色
      if (originalColorMap.has(index)) {
        color = normalizeColor(originalColorMap.get(index))
        console.log(`[PDF导出] 使用原始元素计算颜色 #${index}: ${originalColorMap.get(index)} -> ${color}`)
      } else {
        // 回退到从style属性提取
        const rawColor = (() => {
          // border 分隔线（double）从 border-color 提取；mask 分隔线从 background-color 提取
          if (separatorType === 'double') {
            const borderColorMatch =
              styleAttr.match(/(?:^|;)\s*border-top-color:\s*([^;]+)/i) ||
              styleAttr.match(/(?:^|;)\s*border-color:\s*([^;]+)/i)
            return borderColorMatch?.[1] || ''
          }
          const bgColorMatch = styleAttr.match(/background-color:\s*([^;]+)/i)
          return bgColorMatch?.[1] || ''
        })()

        if (rawColor) {
          // 如果是 currentColor，尝试从 color 属性获取
          if (rawColor.trim() === 'currentColor') {
            const colorMatch = styleAttr.match(/(?:^|;)\s*color:\s*([^;]+)/i)
            if (colorMatch) {
              color = normalizeColor(colorMatch[1])
            }
          } else {
            color = normalizeColor(rawColor)
          }
        }
        console.log(`[PDF导出] 从style属性提取颜色: ${color}`)
      }
      
      console.log(`[PDF导出] 提取的最终颜色: ${color}`)

      // 提取高度
      let height = '4px'
      const heightMatch = styleAttr.match(/height:\s*(\d+(?:\.\d+)?(?:px|pt|em|rem)?)/i)
      if (heightMatch) {
        height = heightMatch[1]
      }
      // border 分隔线（如 double）height 常为 0，需要读取 border-top-width
      if ((parseFloat(height) || 0) <= 0 || separatorType === 'double') {
        const borderWidthMatch = styleAttr.match(/border-top-width:\s*(\d+(?:\.\d+)?(?:px|pt|em|rem)?)/i)
        if (borderWidthMatch) {
          height = borderWidthMatch[1]
        }
      }

      console.log(`[PDF导出] 处理分隔线: type=${separatorType}, color=${color}, height=${height}`)

      // 计算实际高度
      const minHeights = {
        'double': 3,
        'thick-thin': 8, 'thin-thick': 8, 'triple': 10, 'wavy-double': 10,
        'dash-dot': 4, 'dash-dot-dot': 4, 'wavy': 6, 'zigzag': 8,
      }
      const numHeight = Math.max(parseFloat(height) || 4, minHeights[separatorType] || 4)

      // 生成SVG（使用共享方法）
      const svgContent = this.generateSeparatorSvg(separatorType, color, numHeight)
      if (!svgContent) {
        console.log('[PDF导出] 无法生成SVG，跳过')
        return
      }

      // 创建替换元素
      const wrapper = document.createElement('div')
      wrapper.innerHTML = svgContent
      wrapper.style.cssText = `
        display: block;
        width: 100%;
        height: ${numHeight}px;
        margin: 1em 0;
        line-height: 0;
      `
      wrapper.setAttribute('data-pdf-separator', 'true')
      wrapper.setAttribute('data-separator-color', color)
      wrapper.setAttribute('data-separator-type', separatorType)
      wrapper.setAttribute('data-separator-height', String(numHeight))

      // 替换原始hr元素
      if (hr.parentNode) {
        hr.parentNode.replaceChild(wrapper, hr)
        console.log(`[PDF导出] 分隔线已替换为SVG: ${separatorType}, color=${color}, height=${numHeight}px`)
      }
    }

    // 处理元素本身（如果是hr）
    if (element.tagName === 'HR') {
      processSeparator(element, 0)
      return
    }

    // 处理所有子元素中的分隔线（需要转换为数组，因为会修改DOM）
    const separators = Array.from(element.querySelectorAll('hr[data-separator]'))
    console.log(`[PDF导出] 发现 ${separators.length} 个分隔线`)
    separators.forEach((hr, index) => processSeparator(hr, index))
  }

  /**
   * 在html2canvas克隆的文档中处理分隔线
   * 这是一个独立的方法，用于在onclone回调中调用
   * 注意：此方法主要作为安全网，处理任何在applySeparatorStyles中未被处理的分隔线
   * 导出时优先从克隆文档的 computed style 解析颜色，避免 currentColor/rgba(alpha) 解析失败导致“颜色丢失”
   * @param {HTMLElement} clonedElement - 克隆的元素
   */
  processSeparatorsInClonedDoc(clonedElement) {
    // 首先检查是否有已经转换的分隔线（带有data-pdf-separator属性）
    // 如果SVG内容丢失，需要重新生成
    const convertedSeparators = Array.from(clonedElement.querySelectorAll('[data-pdf-separator]'))
    console.log(`[PDF导出-onclone] 发现 ${convertedSeparators.length} 个已转换的分隔线`)
    
    convertedSeparators.forEach(wrapper => {
      // 检查SVG是否存在
      const svg = wrapper.querySelector('svg')
      if (!svg) {
        // SVG丢失，需要重新生成
        const color = wrapper.getAttribute('data-separator-color') || '#000000'
        const type = wrapper.getAttribute('data-separator-type')
        const height = wrapper.getAttribute('data-separator-height') || '4'
        
        if (type) {
          const svgContent = this.generateSeparatorSvg(type, color, parseFloat(height))
          if (svgContent) {
            wrapper.innerHTML = svgContent
            console.log(`[PDF导出-onclone] 重新生成SVG: type=${type}, color=${color}`)
          }
        }
      }
    })

    // 用于匹配的特征字符串（使用数组保证顺序）
    const MASK_SIGNATURES = [
      { type: "dash-dot-dot", signatures: ["width='27'", "cx='22.5'"] },
      { type: "dash-dot", signatures: ["width='21'", "cx='16.5'"] },
      { type: "wavy-double", signatures: ["M0 4 Q3 0", "M0 10 Q3 6"] },
      { type: "wavy", signatures: ["viewBox='0 0 12 6'", "Q3 0 6 6"] },
      { type: "zigzag", signatures: ["L6 0 L12 12"] },
      { type: "triple", signatures: ["y='4'", "y='8'", "height='2'", "width='10'"] },
      { type: "thick-thin", signatures: ["height='6'", "y='8'"] },
      { type: "thin-thick", signatures: ["y='4'", "height='6'"] },
    ]

    // 辅助函数：尽可能保持颜色原样（尤其是 rgba 的 alpha），仅在无法解析时回退为黑色
    const normalizeColor = (colorStr) => {
      if (!colorStr) return '#000000'

      const trimmed = colorStr.trim()
      if (!trimmed) return '#000000'
      if (trimmed === 'currentColor' || trimmed === 'inherit') return '#000000'
      if (trimmed === 'transparent') return 'rgba(0, 0, 0, 0)'
      if (trimmed.startsWith('var(')) return '#000000'

      const rgbaMatch = trimmed.match(
        /rgba?\s*\(\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:\s*(?:,\s*|\/\s*|\s+)\s*([0-9.]+)\s*)?\)/i
      )
      if (rgbaMatch) {
        const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
        const r = clamp(Math.round(parseFloat(rgbaMatch[1])), 0, 255)
        const g = clamp(Math.round(parseFloat(rgbaMatch[2])), 0, 255)
        const b = clamp(Math.round(parseFloat(rgbaMatch[3])), 0, 255)
        const aRaw = rgbaMatch[4]
        if (aRaw !== undefined) {
          const a = clamp(parseFloat(aRaw), 0, 1)
          return `rgba(${r}, ${g}, ${b}, ${a})`
        }
        return `rgb(${r}, ${g}, ${b})`
      }

      return trimmed
    }

    // 识别分隔线类型
    const identifySeparatorType = (styleAttr) => {
      if (!styleAttr || !styleAttr.includes('mask-image')) {
        return null
      }
      
      let decodedStyle = styleAttr
      try {
        decodedStyle = decodeURIComponent(styleAttr)
      } catch {
        decodedStyle = styleAttr
      }

      for (const { type, signatures } of MASK_SIGNATURES) {
        const allMatch = signatures.every(sig => decodedStyle.includes(sig))
        if (allMatch) {
          return type
        }
      }
      
      return null
    }

    // 查找所有未转换的分隔线（转换为数组，因为会修改DOM）
    const separators = Array.from(clonedElement.querySelectorAll('hr[data-separator]'))
    console.log(`[PDF导出-onclone] 发现 ${separators.length} 个未转换的分隔线`)

    const getComputedStyleSafe = (el) => {
      const view = el?.ownerDocument?.defaultView
      return view && typeof view.getComputedStyle === 'function' ? view.getComputedStyle(el) : null
    }
    const isTransparent = (c) => !c || c === 'transparent' || c === 'rgba(0, 0, 0, 0)'

    separators.forEach(hr => {
      const styleAttr = hr.getAttribute('style') || ''
      
      let separatorType = identifySeparatorType(styleAttr)
      if (!separatorType) {
        const borderStyleMatch = styleAttr.match(/border-top-style:\s*([^;]+)/i)
        const borderStyle = (borderStyleMatch?.[1] || '').trim().toLowerCase()
        if (borderStyle === 'double') {
          separatorType = 'double'
        }
      }
      if (!separatorType) return

      const computedStyle = getComputedStyleSafe(hr)

      // 颜色：优先从克隆文档 computed style 中取，避免 currentColor/rgba(alpha) 丢失
      let color = null
      if (computedStyle) {
        const preferBorder = separatorType === 'double'
        let computedColor = preferBorder
          ? computedStyle.borderTopColor || computedStyle.borderColor
          : computedStyle.backgroundColor

        if (isTransparent(computedColor)) computedColor = computedStyle.backgroundColor
        if (isTransparent(computedColor)) computedColor = computedStyle.borderTopColor || computedStyle.borderColor
        if (isTransparent(computedColor)) computedColor = computedStyle.color

        if (!isTransparent(computedColor)) {
          color = computedColor.trim()
        }
      }

      // 兜底：从属性/内联样式提取
      if (!color) {
        const dataColor = hr.getAttribute('data-resolved-color')
        if (dataColor) {
          color = normalizeColor(dataColor)
        } else {
          const rawColor =
            separatorType === 'double'
              ? (styleAttr.match(/(?:^|;)\s*border-top-color:\s*([^;]+)/i)?.[1] ||
                  styleAttr.match(/(?:^|;)\s*border-color:\s*([^;]+)/i)?.[1] ||
                  '')
              : (styleAttr.match(/background-color:\s*([^;]+)/i)?.[1] || '')
          color = rawColor ? normalizeColor(rawColor) : '#000000'
        }
      }

      // 高度：mask 分隔线使用 height；border 分隔线使用 border-top-width
      let height = '4px'
      if (computedStyle) {
        const computedHeight = computedStyle.height
        if (computedHeight && (parseFloat(computedHeight) || 0) > 0) {
          height = computedHeight
        } else if (separatorType === 'double') {
          const borderTopWidth = computedStyle.borderTopWidth || computedStyle.borderWidth
          if (borderTopWidth) height = borderTopWidth
        }
      }
      if (!computedStyle) {
        const heightMatch = styleAttr.match(/height:\s*(\d+(?:\.\d+)?(?:px|pt|em|rem)?)/i)
        if (heightMatch) height = heightMatch[1]
      }
      if ((parseFloat(height) || 0) <= 0 || separatorType === 'double') {
        const borderWidthMatch = styleAttr.match(/border-top-width:\s*(\d+(?:\.\d+)?(?:px|pt|em|rem)?)/i)
        if (borderWidthMatch) height = borderWidthMatch[1]
      }

      // 计算实际高度
      const minHeights = {
        'double': 3,
        'thick-thin': 8, 'thin-thick': 8, 'triple': 10, 'wavy-double': 10,
        'dash-dot': 4, 'dash-dot-dot': 4, 'wavy': 6, 'zigzag': 8,
      }
      const numHeight = Math.max(parseFloat(height) || 4, minHeights[separatorType] || 4)

      const svgContent = this.generateSeparatorSvg(separatorType, color, numHeight)
      if (!svgContent) {
        return
      }

      // 创建替换元素
      const wrapper = hr.ownerDocument.createElement('div')
      wrapper.innerHTML = svgContent
      wrapper.style.cssText = `
        display: block;
        width: 100%;
        height: ${numHeight}px;
        margin: 1em 0;
        line-height: 0;
      `
      wrapper.setAttribute('data-pdf-separator', 'true')
      wrapper.setAttribute('data-separator-color', color)
      wrapper.setAttribute('data-separator-type', separatorType)
      wrapper.setAttribute('data-separator-height', String(numHeight))

      if (hr.parentNode) {
        hr.parentNode.replaceChild(wrapper, hr)
        console.log(`[PDF导出-onclone] 分隔线已替换为SVG: ${separatorType}, color=${color}, height=${numHeight}px`)
      }
    })
  }

  /**
   * 生成分隔线SVG内容
   * 抽取为独立方法，供applySeparatorStyles和processSeparatorsInClonedDoc共用
   * @param {string} type - 分隔线类型
   * @param {string} color - 颜色
   * @param {number} height - 高度（像素）
   * @returns {string|null} SVG内容
   */
  generateSeparatorSvg(type, color, height) {
    const uniqueId = Date.now() + Math.random().toString(36).substr(2, 9)

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n))
    const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')

    // 将任意 CSS 颜色尽可能转换为 SVG 友好的 (hex + opacity) 组合
    // 目的：保留 rgba 的 alpha，避免导出后颜色变深/变黑
    const parseColorForSvg = (value) => {
      const v = typeof value === 'string' ? value.trim() : ''
      if (!v) return { color: '#000000', opacity: null }
      if (v === 'transparent') return { color: '#000000', opacity: 0 }
      if (v === 'currentColor' || v === 'inherit') return { color: '#000000', opacity: null }
      if (v.startsWith('var(')) return { color: '#000000', opacity: null }

      const shortHex = v.match(/^#([0-9a-f]{3})$/i)
      if (shortHex) {
        const [r, g, b] = shortHex[1].split('')
        return { color: `#${r}${r}${g}${g}${b}${b}`.toLowerCase(), opacity: null }
      }
      const fullHex = v.match(/^#([0-9a-f]{6})$/i)
      if (fullHex) {
        return { color: `#${fullHex[1]}`.toLowerCase(), opacity: null }
      }

      const rgbaMatch = v.match(
        /rgba?\s*\(\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:,\s*|\s+)\s*([0-9.]+)\s*(?:\s*(?:,\s*|\/\s*|\s+)\s*([0-9.]+)\s*)?\)/i
      )
      if (rgbaMatch) {
        const r = parseFloat(rgbaMatch[1])
        const g = parseFloat(rgbaMatch[2])
        const b = parseFloat(rgbaMatch[3])
        const aRaw = rgbaMatch[4]
        const opacity = aRaw !== undefined ? clamp(parseFloat(aRaw), 0, 1) : null
        return { color: `#${toHex(r)}${toHex(g)}${toHex(b)}`, opacity }
      }

      const hslaMatch = v.match(
        /hsla?\s*\(\s*([0-9.]+)(?:deg)?\s*(?:,\s*|\s+)\s*([0-9.]+)%\s*(?:,\s*|\s+)\s*([0-9.]+)%\s*(?:\s*(?:,\s*|\/\s*|\s+)\s*([0-9.]+)\s*)?\)/i
      )
      if (hslaMatch) {
        const h = ((parseFloat(hslaMatch[1]) % 360) + 360) % 360
        const s = clamp(parseFloat(hslaMatch[2]) / 100, 0, 1)
        const l = clamp(parseFloat(hslaMatch[3]) / 100, 0, 1)
        const aRaw = hslaMatch[4]
        const opacity = aRaw !== undefined ? clamp(parseFloat(aRaw), 0, 1) : null

        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1 / 6) return p + (q - p) * 6 * t
          if (t < 1 / 2) return q
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
          return p
        }

        let r
        let g
        let b
        if (s === 0) {
          r = g = b = l
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s
          const p = 2 * l - q
          const hk = h / 360
          r = hue2rgb(p, q, hk + 1 / 3)
          g = hue2rgb(p, q, hk)
          b = hue2rgb(p, q, hk - 1 / 3)
        }

        return { color: `#${toHex(r * 255)}${toHex(g * 255)}${toHex(b * 255)}`, opacity }
      }

      // 颜色名称等其它合法值
      return { color: v, opacity: null }
    }

    const { color: safeColor, opacity } = parseColorForSvg(color || '#000000')
    const opacityAttr = typeof opacity === 'number' && opacity < 1 ? String(opacity) : null
    const fillAttr = opacityAttr ? `fill="${safeColor}" fill-opacity="${opacityAttr}"` : `fill="${safeColor}"`
    const strokeAttr = opacityAttr
      ? `stroke="${safeColor}" stroke-opacity="${opacityAttr}"`
      : `stroke="${safeColor}"`
    
    const svgTemplates = {
      'double': `<svg width="100%" height="${height}px" viewBox="0 0 100 3" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="1" ${fillAttr}/><rect x="0" y="2" width="100" height="1" ${fillAttr}/></svg>`,
      'thick-thin': `<svg width="100%" height="${height}px" viewBox="0 0 100 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="5" ${fillAttr}/><rect x="0" y="7" width="100" height="3" ${fillAttr}/></svg>`,
      'thin-thick': `<svg width="100%" height="${height}px" viewBox="0 0 100 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="3" ${fillAttr}/><rect x="0" y="5" width="100" height="5" ${fillAttr}/></svg>`,
      'triple': `<svg width="100%" height="${height}px" viewBox="0 0 100 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100" height="2" ${fillAttr}/><rect x="0" y="4" width="100" height="2" ${fillAttr}/><rect x="0" y="8" width="100" height="2" ${fillAttr}/></svg>`,
      'dash-dot': `<svg width="100%" height="${height}px" viewBox="0 0 21 10" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dd-${uniqueId}" patternUnits="userSpaceOnUse" width="21" height="10"><rect x="0" y="0" width="12" height="10" ${fillAttr}/><circle cx="16.5" cy="5" r="2.5" ${fillAttr}/></pattern></defs><rect width="100%" height="100%" fill="url(#dd-${uniqueId})"/></svg>`,
      'dash-dot-dot': `<svg width="100%" height="${height}px" viewBox="0 0 27 10" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="ddd-${uniqueId}" patternUnits="userSpaceOnUse" width="27" height="10"><rect x="0" y="0" width="12" height="10" ${fillAttr}/><circle cx="16.5" cy="5" r="2.5" ${fillAttr}/><circle cx="22.5" cy="5" r="2.5" ${fillAttr}/></pattern></defs><rect width="100%" height="100%" fill="url(#ddd-${uniqueId})"/></svg>`,
      'wavy': `<svg width="100%" height="${height}px" viewBox="0 0 12 6" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="w-${uniqueId}" patternUnits="userSpaceOnUse" width="12" height="6"><path d="M0 5 Q3 1 6 5 T12 5" fill="none" ${strokeAttr} stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#w-${uniqueId})"/></svg>`,
      'wavy-double': `<svg width="100%" height="${height}px" viewBox="0 0 12 10" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="wd-${uniqueId}" patternUnits="userSpaceOnUse" width="12" height="10"><path d="M0 3 Q3 0 6 3 T12 3" fill="none" ${strokeAttr} stroke-width="1.5"/><path d="M0 8 Q3 5 6 8 T12 8" fill="none" ${strokeAttr} stroke-width="1.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#wd-${uniqueId})"/></svg>`,
      'zigzag': `<svg width="100%" height="${height}px" viewBox="0 0 12 10" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="zz-${uniqueId}" patternUnits="userSpaceOnUse" width="12" height="10"><path d="M0 9 L6 1 L12 9" fill="none" ${strokeAttr} stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#zz-${uniqueId})"/></svg>`,
    }
    return svgTemplates[type] || null
  }

  /**
   * 同步页面中的图片
   * @param {HTMLElement} page - 页面容器
   * @param {HTMLElement} originalContainer - 原始编辑器容器
   */
  async syncImagesInPage(page, originalContainer) {
    const pageImages = page.querySelectorAll('img')
    const originalImages = Array.from(originalContainer.querySelectorAll('img'))

    console.log(`同步图片: 页面有 ${pageImages.length} 张图片，原始容器有 ${originalImages.length} 张图片`)

    // 建立多种映射方式
    const base64Map = new Map() // 原始src -> base64
    const indexMap = new Map()  // 索引 -> base64

    originalImages.forEach((img, index) => {
      if (img.src.startsWith('data:image/')) {
        // 记录base64数据
        const originalSrc = img.getAttribute('data-original-src') || ''
        if (originalSrc) {
          base64Map.set(originalSrc, img.src)
        }
        // 也按索引记录
        indexMap.set(index, img.src)
      }
    })

    // 同步图片src
    let syncCount = 0
    for (let i = 0; i < pageImages.length; i++) {
      const img = pageImages[i]
      const currentSrc = img.src

      // 如果已经是base64，跳过
      if (currentSrc.startsWith('data:image/')) {
        syncCount++
        continue
      }

      // 方法1: 通过原始src查找
      if (base64Map.has(currentSrc)) {
        img.src = base64Map.get(currentSrc)
        syncCount++
        continue
      }

      // 方法2: 通过data-original-src属性查找
      const dataSrc = img.getAttribute('data-original-src')
      if (dataSrc && base64Map.has(dataSrc)) {
        img.src = base64Map.get(dataSrc)
        syncCount++
        continue
      }

      // 方法3: 在原始图片中查找匹配的src
      for (const [origSrc, base64] of base64Map) {
        if (currentSrc.includes(origSrc) || origSrc.includes(currentSrc)) {
          img.src = base64
          syncCount++
          break
        }
      }

      // 确保图片可见
      img.style.display = 'block'
      img.style.visibility = 'visible'
      img.style.opacity = '1'
    }

    console.log(`图片同步完成: ${syncCount}/${pageImages.length} 张图片已同步`)

    // 等待图片加载
    await Promise.all(
      Array.from(pageImages).map(img => {
        return new Promise(resolve => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = resolve
            img.onerror = resolve
            setTimeout(resolve, 3000)
          }
        })
      })
    )
  }

  /**
   * 获取导出样式
   * @returns {string} CSS样式字符串
   */
  getExportStyles() {
    return `
      * {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }

      /* PDF 导出页面容器中的代码块样式 - 仅作用于克隆文档 */
      .px-pdf-page pre {
        margin: 12px 0 !important;
        padding: 16px 20px !important;
        border-radius: 4px !important;
        background-color: #111827 !important;
        color: #f9fafb !important;
        font-family: "JetBrainsMono", "Courier New", Courier, monospace !important;
        font-size: 0.8rem !important;
        line-height: 1.5 !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        font-variant-ligatures: none !important;
        font-feature-settings: "liga" 0, "kern" 0 !important;
        box-sizing: border-box !important;
        width: 100% !important;
        max-width: 100% !important;
      }

      .px-pdf-page pre code {
        background: none !important;
        color: inherit !important;
        font-size: inherit !important;
        display: block !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
      }

      /* 表格样式 */
      .px-pdf-page table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 16px 0 !important;
        table-layout: fixed !important;
        border: none !important;
      }
      
      .px-pdf-page th,
      .px-pdf-page td {
        border: 1px solid rgba(228, 228, 231, 1) !important;
        padding: 3px 5px !important;
        text-align: left !important;
        vertical-align: top !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        box-sizing: border-box !important;
        min-width: 1em !important;
        position: relative !important;
        line-height: 1.5 !important;
        font-size: 1rem !important;
      }

      .px-pdf-page th {
        background-color: rgba(228, 228, 231, 0.4) !important;
        font-weight: bold !important;
      }

      /* 修复表格内部段落的 margin，避免高度撑开 */
      .px-pdf-page td p,
      .px-pdf-page th p {
        margin: 0 !important;
      }


      /* 隐藏所有UI元素 */
      .toolbar, .menu, .floating, .tooltip, .modal,
      .dropdown, .progress, .loading, .overlay, .popup,
      .px-editor-toolbar-menu, .px-editor-bubble-menu, .px-editor-slash-menu,
      .bubble-menu, .slash-menu, .side-insert-handle,
      .ai-cursor-input, .ai-writer-modal, .ai-writer-drawer {
        display: none !important;
      }

      /* 隐藏协作UI */
      .collaboration-cursor, .collaboration-cursor__caret, .collaboration-cursor__label,
      .ProseMirror-yjs-cursor, .yjs-cursor, [data-decoration-id] {
        display: none !important;
      }

      /* 隐藏占位符 */
      .px-editor-empty::before,
      .px-editor-node-empty::before,
      [data-placeholder]::before {
        content: none !important;
        display: none !important;
      }

      /* 清除选中状态 */
      ::selection, ::-moz-selection {
        background-color: transparent !important;
      }

      /* 清除评论高亮 */
      .px-editor__comment-mark, [data-comment-id] {
        background-color: transparent !important;
        border-bottom: none !important;
      }

      /* 隐藏图片调整句柄 */
      .px-editor__image-resize-handles,
      .px-editor__image-resize-handle {
        display: none !important;
      }

      /* 清除图片选中边框 */
      .px-editor__image-resizable img {
        border-color: transparent !important;
      }

      /* 【关键】禁用分隔线的mask-image，确保使用background-image渲染 */
      hr[data-separator] {
        mask-image: none !important;
        -webkit-mask-image: none !important;
        mask: none !important;
        -webkit-mask: none !important;
      }
    `
  }

  /**
   * 查找编辑器容器
   * @returns {HTMLElement|null} 编辑器容器元素
   */
  findEditorContainer() {
    // 尝试多种选择器来找到编辑器容器
    const selectors = [
      '.ProseMirror',
      '.px-editor__doc',
      '.tiptap',
      '[data-tiptap-editor]',
      '.editor-content'
    ]

    for (const selector of selectors) {
      const element = document.querySelector(selector)
      if (element) {
        console.log(`找到编辑器容器: ${selector}`)
        return element
      }
    }

    console.warn('未找到编辑器容器，使用document.body')
    return document.body
  }

  /**
   * 准备导出内容
   * @param {HTMLElement} container - 容器元素
   */
  async prepareContentForExport(container) {
    // 确保所有图片都已加载
    await this.waitForImages(container)

    // 确保所有图表都已渲染
    await this.waitForCharts(container)

	    // 【关键优化】将图表预渲染为图片,参考DOCX导出的成功经验
	    // 这样可以利用ECharts原生导出功能,避免html2canvas处理动态canvas的问题
	    await this.renderChartsToImages(container)

	    // 【新增】将思维导图预渲染为图片,避免复杂交互DOM影响整体截图稳定性
	    // 渲染过程中会临时用静态图片替换DOM,导出结束后通过 restoreMindmapsAfterExport 统一恢复
	    await this.renderMindmapsToImages(container)

    // 【新增关键优化】将所有图片预处理为base64
    // 避免html2canvas处理跨域/懒加载图片的问题
    await this.preloadImagesToBase64(container)

    // 滚动到顶部确保完整内容可见
    window.scrollTo(0, 0)

    // 等待一小段时间确保渲染完成
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  /**
   * 等待图片加载完成
   * @param {HTMLElement} container - 容器元素
   */
  async waitForImages(container) {
    const images = container.querySelectorAll('img')

    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve()
        } else {
          img.onload = resolve
          img.onerror = resolve // 即使加载失败也继续
          // 设置超时，避免无限等待
          setTimeout(resolve, 5000)
        }
      })
    })

    await Promise.all(imagePromises)
    console.log(`等待 ${images.length} 张图片加载完成`)
  }

  /**
   * 等待图表渲染完成
   * @param {HTMLElement} container - 容器元素
   */
  async waitForCharts(container) {
    const charts = container.querySelectorAll('.px-editor__chart-content, .echarts-container, [data-chart-type]')

    if (charts.length > 0) {
      console.log(`发现 ${charts.length} 个图表，等待渲染完成`)

      // 检查每个图表是否已经渲染
      const chartPromises = Array.from(charts).map((chart, index) => {
        return new Promise((resolve) => {
          // 检查图表是否有内容
          const hasContent = chart.children.length > 0 ||
                           chart.querySelector('canvas') ||
                           chart.querySelector('svg') ||
                           chart.offsetHeight > 0

          if (hasContent) {
            console.log(`图表 ${index + 1} 已渲染`)
            resolve()
          } else {
            console.log(`图表 ${index + 1} 等待渲染...`)
            // 等待一段时间后再检查
            setTimeout(() => {
              console.log(`图表 ${index + 1} 渲染等待完成`)
              resolve()
            }, 1500)
          }
        })
      })

      await Promise.all(chartPromises)
      console.log('所有图表渲染检查完成')
    }
  }

  /**
   * 将图表预渲染为图片
   * 参考DOCX导出的成功经验,使用chartRenderer将图表转换为静态图片
   * 这样可以避免html2canvas处理动态canvas的问题
   * @param {HTMLElement} container - 容器元素
   */
  async renderChartsToImages(container) {
    try {
      // 动态导入chartRenderer
      const { chartRenderer } = await import('./chartRenderer.js')
      console.log('chartRenderer已加载')

      // 查找所有图表容器
      const chartContainers = container.querySelectorAll('.px-editor__chart-container')

      if (chartContainers.length === 0) {
        console.log('未发现图表容器,跳过图表预渲染')
        return
      }

      console.log(`开始预渲染 ${chartContainers.length} 个图表...`)
      progressManager.updateProgress(15, `正在预渲染 ${chartContainers.length} 个图表...`)

      // 遍历每个图表容器
      for (let i = 0; i < chartContainers.length; i++) {
        const chartContainer = chartContainers[i]

        try {
          // 查找图表内容元素
          const chartContent = chartContainer.querySelector('.px-editor__chart-content, .echarts-container, [data-chart-type]')

          if (!chartContent) {
            console.warn(`图表容器 ${i + 1} 没有找到图表内容元素`)
            continue
          }

          // 获取图表的实际尺寸
          const rect = chartContent.getBoundingClientRect()
          const width = rect.width > 0 ? rect.width : 600
          const height = rect.height > 0 ? rect.height : 400

          console.log(`渲染图表 ${i + 1}/${chartContainers.length}, 尺寸: ${width}x${height}`)

          // 使用chartRenderer渲染图表为图片
          const imageData = await chartRenderer.renderChartToImage(chartContent, {
            width: width + 20, // 增加padding避免边界裁剪
            height: height + 20,
            backgroundColor: '#ffffff',
            pixelRatio: 2 // 高清晰度
          })

          if (imageData && imageData.includes(',')) {
            // 创建img元素替换图表内容
            const img = document.createElement('img')
            img.src = imageData
            img.style.width = `${width}px`
            img.style.height = `${height}px`
            img.style.display = 'block'
            img.style.margin = '0 auto'
            img.className = 'chart-rendered-image'
            img.setAttribute('data-original-chart', 'true')

            // 替换图表内容为图片
            chartContent.innerHTML = ''
            chartContent.appendChild(img)

            console.log(`图表 ${i + 1} 预渲染成功`)
          } else {
            console.warn(`图表 ${i + 1} 渲染失败: 无效的图片数据`)
          }

        } catch (error) {
          console.error(`图表 ${i + 1} 预渲染失败:`, error)
          // 继续处理下一个图表,不中断整个流程
        }
      }

      console.log('所有图表预渲染完成')

	    } catch (error) {
	      console.error('图表预渲染过程失败:', error)
	      // 不抛出错误,允许导出流程继续
	      // 如果预渲染失败,html2canvas会尝试直接截取原始图表
	    }
	  }

	  /**
	   * 将 MindElixir 思维导图预渲染为图片
	   * 导出过程中临时使用静态图片替换交互式 DOM, 导出结束后再恢复
	   * @param {HTMLElement} container - 容器元素
	   */
	  async renderMindmapsToImages(container) {
	    try {
	      const { mindmapRenderer } = await import('./mindmapRenderer.js')
	      console.log('mindmapRenderer已加载')

	      const mindmapContainers = container.querySelectorAll('.px-editor__mindmap-container, [data-mindmap-id]')

	      if (mindmapContainers.length === 0) {
	        console.log('未发现思维导图容器,跳过思维导图预渲染')
	        return
	      }

	      console.log(`开始预渲染 ${mindmapContainers.length} 个思维导图...`)
	      progressManager.updateProgress(17, `正在预渲染 ${mindmapContainers.length} 个思维导图...`)

	      // 重置快照, 确保每次导出状态独立
	      this.mindmapExportSnapshots = []

	      for (let i = 0; i < mindmapContainers.length; i++) {
	        const mindmapContainer = mindmapContainers[i]

	        try {
	          const mindmapElement =
	            mindmapContainer.querySelector('.mindmap-canvas, .map-canvas') ||
	            mindmapContainer

	          const rect = mindmapElement.getBoundingClientRect()
	          const width = rect.width > 0 ? rect.width : 800
	          const height = rect.height > 0 ? rect.height : 400

	          console.log(`渲染思维导图 ${i + 1}/${mindmapContainers.length}, 尺寸: ${width}x${height}`)

	          const imageData = await mindmapRenderer.renderMindmapToImage(mindmapElement, {
            width: width + 20,
            height: height + 20,
            backgroundColor: null, // 保持透明背景，避免色差
            pixelRatio: 2
          })

	          if (imageData && imageData.startsWith('data:image/')) {
	            // 记录当前 DOM 状态, 以便导出结束后还原
	            const snapshot = {
	              container: mindmapElement,
	              children: Array.from(mindmapElement.childNodes)
	            }
	            this.mindmapExportSnapshots.push(snapshot)

	            const img = document.createElement('img')
	            img.src = imageData
	            img.style.width = `${width}px`
	            img.style.height = `${height}px`
	            img.style.display = 'block'
	            img.style.margin = '0 auto'
	            img.className = 'mindmap-rendered-image'
	            img.setAttribute('data-original-mindmap', 'true')

	            // 用静态图片替换思维导图内容 DOM
	            mindmapElement.innerHTML = ''
	            mindmapElement.appendChild(img)

	            console.log(`思维导图 ${i + 1} 预渲染成功`)
	          } else {
	            console.warn(`思维导图 ${i + 1} 渲染失败: 无效的图片数据`)
	          }
	        } catch (error) {
	          console.error(`思维导图 ${i + 1} 预渲染失败:`, error)
	          // 不中断整体流程, 继续处理下一个思维导图
	        }
	      }

	      console.log('所有思维导图预渲染完成')
	    } catch (error) {
	      console.error('思维导图预渲染过程失败:', error)
	      // 不抛出错误,允许导出流程继续
	    }
	  }

	  /**
	   * 恢复被临时替换为图片的思维导图 DOM
	   * 在导出流程结束时调用, 确保编辑器内的思维导图仍然可编辑
	   */
	  restoreMindmapsAfterExport() {
	    if (!Array.isArray(this.mindmapExportSnapshots) || this.mindmapExportSnapshots.length === 0) {
	      return
	    }

	    try {
	      this.mindmapExportSnapshots.forEach(snapshot => {
	        const { container, children } = snapshot || {}
	        if (!container || !children || !container.ownerDocument) {
	          return
	        }

	        // 清空当前内容, 重新挂载原始子节点
	        container.innerHTML = ''
	        children.forEach(child => {
	          try {
	            if (child && child.nodeType) {
	              container.appendChild(child)
	            }
	          } catch (e) {
	            console.warn('恢复思维导图子节点失败:', e)
	          }
	        })
	      })
	    } finally {
	      this.mindmapExportSnapshots = []
	    }
	  }

	  /**
	   * 【关键优化】将所有图片预处理为base64
	   * 参考图表预渲染和DOCX导出的成功经验
	   * 这样可以避免html2canvas处理跨域/懒加载图片的问题
	   * @param {HTMLElement} container - 容器元素
	   */
  async preloadImagesToBase64(container) {
    try {
      // 获取所有图片元素
      const images = container.querySelectorAll('img')
      console.log(`=== 开始图片预处理 ===`)
      console.log(`发现 ${images.length} 张图片需要预处理`)

      let successCount = 0
      let skipCount = 0
      let failCount = 0

      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        const src = img.src

        try {
          // 1. 跳过已经是 base64 的图片
          if (src.startsWith('data:image/')) {
            console.log(`图片 ${i + 1}: 已是base64格式，跳过`)
            skipCount++
            continue
          }

          // 2. 跳过图表容器内的图片（已由renderChartsToImages处理）
          if (img.closest('.px-editor__chart-container')) {
            console.log(`图片 ${i + 1}: 图表图片，跳过`)
            skipCount++
            continue
          }

          // 3. 跳过空的或无效的src
          if (!src || src === 'about:blank' || src === '') {
            console.log(`图片 ${i + 1}: 无效src，跳过`)
            skipCount++
            continue
          }

          console.log(`图片 ${i + 1}: 开始转换 - ${src.substring(0, 100)}...`)

          // 4. 转换图片为base64
          const base64Data = await this.convertImageToBase64(img)

          if (base64Data) {
            // 直接修改原始图片的src为base64
            img.src = base64Data
            console.log(`图片 ${i + 1}: 转换成功`)
            successCount++
          } else {
            console.warn(`图片 ${i + 1}: 转换失败，保留原始src`)
            failCount++
          }

        } catch (error) {
          console.error(`图片 ${i + 1} 预处理失败:`, error)
          failCount++
          // 继续处理下一张图片，不中断整个流程
        }
      }

      console.log(`=== 图片预处理完成 ===`)
      console.log(`   成功: ${successCount}, 跳过: ${skipCount}, 失败: ${failCount}`)

    } catch (error) {
      console.error('图片预处理过程失败:', error)
      // 不抛出错误，允许导出流程继续
    }
  }

  /**
   * 将单个图片转换为base64
   * @param {HTMLImageElement} img - 图片元素
   * @returns {Promise<string|null>} base64数据或null
   */
  async convertImageToBase64(img) {
    const src = img.src

    // 方法1: 如果图片已加载完成，直接使用canvas转换
    if (img.complete && img.naturalWidth > 0) {
      const result = this.imageToBase64ViaCanvas(img)
      if (result) {
        console.log('方法1成功: Canvas直接转换')
        return result
      }
    }

    // 对于blob URL，如果上面的方法失败，说明blob已失效，无法恢复
    if (src.startsWith('blob:')) {
      console.log('Blob URL已失效，无法恢复。建议在图片上传时转换为base64存储。')
      return null
    }

    // 方法2: 尝试重新加载图片并转换（带crossOrigin）
    const reloadResult = await this.reloadAndConvertImage(src)
    if (reloadResult) {
      console.log('方法2成功: 重新加载并转换')
      return reloadResult
    }

    // 方法3: 尝试fetch方式获取
    const fetchResult = await this.fetchImageAsBase64(src)
    if (fetchResult) {
      console.log('方法3成功: fetch方式获取')
      return fetchResult
    }

    // 方法4: 尝试通过代理访问（解决跨域问题）
    const proxyResult = await this.tryProxyImageAccess(src)
    if (proxyResult) {
      console.log('方法4成功: 代理方式获取')
      return proxyResult
    }

    console.error('所有图片转换方式都失败了:', src)
    return null
  }

  /**
   * 通过Canvas将已加载的图片转换为base64
   * @param {HTMLImageElement} img - 已加载的图片元素
   * @returns {string|null} base64数据或null
   */
  imageToBase64ViaCanvas(img) {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 使用图片的自然尺寸
      canvas.width = img.naturalWidth || img.width || 400
      canvas.height = img.naturalHeight || img.height || 300

      // 绘制图片到canvas
      ctx.drawImage(img, 0, 0)

      // 转换为base64
      const dataURL = canvas.toDataURL('image/png', 0.92)

      // 验证数据有效性
      if (dataURL && dataURL.length > 100 && dataURL.startsWith('data:image/')) {
        return dataURL
      }

      return null
    } catch (error) {
      console.log('Canvas转换失败（可能是跨域）:', error.message)
      return null
    }
  }

  /**
   * 重新加载图片并转换为base64
   * @param {string} src - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async reloadAndConvertImage(src) {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height

          ctx.drawImage(img, 0, 0)

          const dataURL = canvas.toDataURL('image/png', 0.92)
          if (dataURL && dataURL.length > 100) {
            resolve(dataURL)
          } else {
            resolve(null)
          }
        } catch (error) {
          console.log('重新加载后Canvas转换失败:', error.message)
          resolve(null)
        }
      }

      img.onerror = () => {
        console.log('图片重新加载失败')
        resolve(null)
      }

      // 设置超时
      setTimeout(() => resolve(null), 8000)

      // 添加时间戳避免缓存问题
      const separator = src.includes('?') ? '&' : '?'
      img.src = `${src}${separator}_t=${Date.now()}`
    })
  }

  /**
   * 通过fetch获取图片并转换为base64
   * @param {string} src - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async fetchImageAsBase64(src) {
    try {
      const response = await fetch(src, {
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
        reader.onload = () => {
          const result = reader.result
          if (result && result.length > 100) {
            resolve(result)
          } else {
            resolve(null)
          }
        }
        reader.onerror = () => resolve(null)
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.log('fetch获取图片失败:', error.message)
      return null
    }
  }

  /**
   * 尝试通过代理访问图片（解决跨域问题）
   * @param {string} url - 图片URL
   * @returns {Promise<string|null>} base64数据或null
   */
  async tryProxyImageAccess(url) {
    try {
      // 只对http/https URL使用代理
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return null
      }

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

            const dataURL = canvas.toDataURL('image/png', 0.92)
            if (dataURL && dataURL.length > 100 && dataURL.startsWith('data:image/')) {
              resolve(dataURL)
            } else {
              resolve(null)
            }
          } catch (canvasError) {
            console.log('代理Canvas转换失败:', canvasError.message)
            resolve(null)
          }
        }

        img.onerror = () => {
          console.log('代理图片加载失败')
          resolve(null)
        }

        // 设置超时
        setTimeout(() => {
          console.log('代理访问超时')
          resolve(null)
        }, 10000)

        img.src = proxyUrl
      })
    } catch (error) {
      console.log('代理访问异常:', error.message)
      return null
    }
  }

  /**
   * 同步克隆元素中的图片src
   * cloneNode可能不会正确复制动态修改的src属性
   * @param {HTMLElement} originalElement - 原始元素
   * @param {HTMLElement} clonedElement - 克隆元素
   */
  async syncClonedImages(originalElement, clonedElement) {
    const originalImages = originalElement.querySelectorAll('img')
    const clonedImages = clonedElement.querySelectorAll('img')

    console.log(`=== 同步克隆图片 ===`)
    console.log(`原始图片数量: ${originalImages.length}, 克隆图片数量: ${clonedImages.length}`)

    // 确保数量匹配
    const minLength = Math.min(originalImages.length, clonedImages.length)

    for (let i = 0; i < minLength; i++) {
      const originalImg = originalImages[i]
      const clonedImg = clonedImages[i]

      // 如果原始图片是base64，同步到克隆图片
      if (originalImg.src.startsWith('data:image/')) {
        if (clonedImg.src !== originalImg.src) {
          console.log(`同步图片 ${i + 1}: base64数据`)
          clonedImg.src = originalImg.src
        }
      }

      // 确保克隆图片的样式正确
      clonedImg.style.display = 'block'
      clonedImg.style.visibility = 'visible'
      clonedImg.style.opacity = '1'

      // 如果图片有尺寸属性，确保设置正确
      if (originalImg.width) clonedImg.width = originalImg.width
      if (originalImg.height) clonedImg.height = originalImg.height
    }

    // 等待图片加载
    await Promise.all(
      Array.from(clonedImages).map(img => {
        return new Promise(resolve => {
          if (img.complete) {
            resolve()
          } else {
            img.onload = resolve
            img.onerror = resolve
            setTimeout(resolve, 3000)
          }
        })
      })
    )

    console.log(`=== 克隆图片同步完成 ===`)
  }

  /**
   * 等待页面布局稳定
   * @param {HTMLElement} container - 容器元素
   */
  async waitForLayoutStable(container) {
    return new Promise((resolve) => {
      let lastHeight = container.scrollHeight
      let stableCount = 0
      const maxChecks = 10
      let checkCount = 0

      const checkStability = () => {
        const currentHeight = container.scrollHeight

        if (currentHeight === lastHeight) {
          stableCount++
        } else {
          stableCount = 0
          lastHeight = currentHeight
        }

        checkCount++

        // 如果高度连续3次相同，或者检查次数超过最大值，认为布局稳定
        if (stableCount >= 3 || checkCount >= maxChecks) {
          console.log(`页面布局稳定，高度: ${currentHeight}px，检查次数: ${checkCount}`)
          resolve()
        } else {
          // 继续检查
          setTimeout(checkStability, 100)
        }
      }

      // 开始检查
      setTimeout(checkStability, 100)
    })
  }

  /**
   * 优化页面样式用于导出
   * @param {HTMLElement} container - 容器元素
   * @returns {Function} 清理函数
   */
  optimizePageForExport(container) {
    console.log('开始应用PDF导出样式优化')

    // 检查是否有图表
    const charts = container.querySelectorAll('.px-editor__chart-content, .echarts-container, [data-chart-type]')
    console.log(`发现 ${charts.length} 个图表元素`)

    // 先清理可能存在的旧样式
    const existingStyle = document.getElementById('pdf-export-optimization')
    if (existingStyle) {
      existingStyle.remove()
      console.log('清理了已存在的PDF导出样式')
    }

    // 创建临时样式，但要小心不破坏图表
    const style = document.createElement('style')
    style.id = 'pdf-export-optimization'
    style.textContent = `
      /* 优化文字渲染 */
      .ProseMirror, .px-editor__doc, .tiptap {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
        font-feature-settings: "liga" 1, "kern" 1 !important;
      }

      /* 代码块专用样式 - 确保等宽字体正常渲染，防止文字被压扁 */
      .ProseMirror pre, .px-editor__doc pre, .tiptap pre,
      .ProseMirror pre code, .px-editor__doc pre code, .tiptap pre code {
        line-height: 1.5 !important;
        font-family: "JetBrainsMono", "Courier New", Courier, monospace !important;
        white-space: pre-wrap !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        font-feature-settings: normal !important; /* 重置字体特性，避免影响等宽字体 */
      }

      .ProseMirror pre code, .px-editor__doc pre code, .tiptap pre code {
        font-size: 0.8rem !important;
        display: block !important;
      }

      /* 确保文字不被压缩 - 但排除图表容器和LaTeX公式 */
      .ProseMirror p:not(.px-editor__chart-container *):not(.katex):not(.katex *),
      .px-editor__doc p:not(.px-editor__chart-container *):not(.katex):not(.katex *),
      .tiptap p:not(.px-editor__chart-container *):not(.katex):not(.katex *),
      .ProseMirror div:not(.px-editor__chart-container):not(.px-editor__chart-content):not(.echarts-container):not(.katex):not(.katex-display),
      .px-editor__doc div:not(.px-editor__chart-container):not(.px-editor__chart-content):not(.echarts-container):not(.katex):not(.katex-display),
      .tiptap div:not(.px-editor__chart-container):not(.px-editor__chart-content):not(.echarts-container):not(.katex):not(.katex-display),
      .ProseMirror span:not(.px-editor__chart-container *):not(.katex):not(.katex *):not(.tiptap-math):not(.latex),
      .px-editor__doc span:not(.px-editor__chart-container *):not(.katex):not(.katex *):not(.tiptap-math):not(.latex),
      .tiptap span:not(.px-editor__chart-container *):not(.katex):not(.katex *):not(.tiptap-math):not(.latex),
      .ProseMirror h1, .px-editor__doc h1, .tiptap h1,
      .ProseMirror h2, .px-editor__doc h2, .tiptap h2,
      .ProseMirror h3, .px-editor__doc h3, .tiptap h3,
      .ProseMirror h4, .px-editor__doc h4, .tiptap h4,
      .ProseMirror h5, .px-editor__doc h5, .tiptap h5,
      .ProseMirror h6, .px-editor__doc h6, .tiptap h6 {
        white-space: normal !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        line-height: 1.6 !important;
        letter-spacing: normal !important;
      }



      /* 隐藏所有UI元素 - 工具栏、菜单、弹窗等 */
      .toolbar, .menu, .floating, .tooltip, .modal,
      .dropdown, .progress, .loading, .overlay, .popup,
      .px-editor-toolbar-menu, .px-editor-bubble-menu, .px-editor-slash-menu,
      .bubble-menu, .slash-menu, .side-insert-handle,
      .a-modal, .a-tooltip, .a-dropdown, .a-popover,
      .comment-tooltip, .px-editor-chart-editor__panel,
      .search-replace-panel, .word-view-corner-marker,
      .word-view-corner-marker-top-right, .word-view-corner-marker-bottom-right,
      .ai-cursor-input, .ai-writer-modal, .ai-writer-drawer {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      /* 隐藏占位符文本 */
      .px-editor-empty::before,
      .px-editor-node-empty::before,
      [data-placeholder]::before {
        content: none !important;
        display: none !important;
      }

      /* 隐藏协作相关UI元素 - 用户头像、光标、用户名标签等 */
      .a-avatar, .a-avatar-group, .mobile-user-dropdown,
      .collaboration-cursor, .collaboration-cursor__caret, .collaboration-cursor__label,
      [data-decoration-id],
      .ProseMirror-yjs-cursor, .yjs-cursor,
      .online-users, .user-info, .connection-status {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }

      /* 清除文本选中状态的视觉效果 */
      ::selection, ::-moz-selection {
        background-color: transparent !important;
        color: inherit !important;
      }

      /* 清除编辑器光标和拖放状态 */
      .ProseMirror-cursor,
      .ProseMirror-dropcursor,
      .ProseMirror-gapcursor {
        display: none !important;
        opacity: 0 !important;
      }

      /* 清除图片的选中边框效果 */
      .px-editor__image-resizable img {
        border-color: transparent !important;
      }

      /* 隐藏图片的调整大小句柄 */
      .px-editor__image-resize-handles,
      .px-editor__image-resize-handle {
        display: none !important;
        opacity: 0 !important;
      }

      /* 特别处理LaTeX公式的选中状态 */
      .katex.selected, .tiptap-math.selected, .latex.selected,
      .katex.active, .tiptap-math.active, .latex.active,
      .katex.focused, .tiptap-math.focused, .latex.focused,
      .katex.highlighted, .tiptap-math.highlighted, .latex.highlighted {
        background-color: transparent !important;
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }

      /* 【新增】清除评论高亮样式 - 确保导出的PDF是纯净的文档内容 */
      .px-editor__comment-mark,
      [data-comment-id] {
        background-color: transparent !important;
        border-bottom: none !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        cursor: default !important;
        transition: none !important;
      }

      /* 清除评论mark的hover效果 */
      .px-editor__comment-mark:hover,
      [data-comment-id]:hover {
        background-color: transparent !important;
        box-shadow: none !important;
      }
    `

    document.head.appendChild(style)
    console.log('PDF导出样式优化已应用')

    // 返回清理函数
    return () => {
      try {
        const styleElement = document.getElementById('pdf-export-optimization')
        if (styleElement) {
          styleElement.remove()
          console.log('PDF导出样式优化已清理')
        }

        // 额外检查：清理所有可能的PDF导出相关样式
        const allPdfStyles = document.querySelectorAll('style[id*="pdf-export"]')
        allPdfStyles.forEach(s => {
          s.remove()
          console.log('清理了额外的PDF导出样式:', s.id)
        })
      } catch (error) {
        console.warn('清理PDF导出样式时出错:', error)
        // 即使清理失败也不抛出异常，避免影响主流程
      }
    }
  }

  /**
   * 生成Canvas
   * @param {HTMLElement} element - 要截图的元素
   * @param {Object} options - 选项
   * @returns {Promise<HTMLCanvasElement>} Canvas元素
   */
  async generateCanvas(element, options = {}) {
    // 创建文档副本进行导出，避免影响原始文档
    const clonedElement = element.cloneNode(true)
    clonedElement.style.position = 'absolute'
    clonedElement.style.left = '-9999px'
    clonedElement.style.top = '0'
    clonedElement.style.zIndex = '-1'
    clonedElement.style.pointerEvents = 'none'

    // 获取原始元素的实际尺寸
    const rect = element.getBoundingClientRect()
    const elementWidth = element.scrollWidth || rect.width
    const elementHeight = element.scrollHeight || rect.height

    console.log(`=== 开始生成Canvas ===`)
    console.log(`原始元素尺寸 - scrollWidth: ${element.scrollWidth}, scrollHeight: ${element.scrollHeight}`)
    console.log(`原始元素尺寸 - offsetWidth: ${element.offsetWidth}, offsetHeight: ${element.offsetHeight}`)
    console.log(`原始元素尺寸 - clientWidth: ${element.clientWidth}, clientHeight: ${element.clientHeight}`)
    console.log(`原始元素尺寸 - rect: ${rect.width}x${rect.height}`)
    console.log(`计算后的元素尺寸: ${elementWidth}x${elementHeight}`)

    // 设置副本的尺寸 - 明确设置高度以确保完整捕获
    clonedElement.style.width = elementWidth + 'px'
    clonedElement.style.height = elementHeight + 'px'  // 修改: 明确设置高度而不是auto
    clonedElement.style.overflow = 'visible'
    clonedElement.style.minHeight = elementHeight + 'px'  // 新增: 确保最小高度

    // 将副本添加到页面
    document.body.appendChild(clonedElement)

    // 等待一帧,确保DOM更新
    await new Promise(resolve => requestAnimationFrame(resolve))

    // 【关键】同步克隆元素中的图片src（因为cloneNode可能不会复制动态修改的src）
    await this.syncClonedImages(element, clonedElement)

    // 清除副本中的所有选中状态，避免导出选中效果
    this.clearSelectionStates(clonedElement)

    // 验证克隆元素的实际高度
    const clonedHeight = clonedElement.scrollHeight || clonedElement.offsetHeight
    console.log(`克隆元素实际高度: ${clonedHeight}`)
    console.log(`元素显示尺寸: ${rect.width}x${rect.height}`)
    console.log('使用文档副本进行PDF导出，避免影响原始文档')

    // 获取设备像素比，但限制在合理范围内
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)

    // 使用克隆元素的实际高度,确保捕获完整内容
    const actualClonedHeight = Math.max(clonedHeight, elementHeight)

    console.log(`html2canvas配置 - width: ${elementWidth}, height: ${actualClonedHeight}`)
    console.log(`html2canvas配置 - scale: ${devicePixelRatio}`)
    console.log(`预期Canvas尺寸: ${elementWidth * devicePixelRatio}x${actualClonedHeight * devicePixelRatio}`)

    const defaultOptions = {
      scale: devicePixelRatio, // 根据设备像素比调整，但不超过2倍
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true,  // 修改: 启用日志以便调试
      // 使用元素的实际尺寸
      width: elementWidth,
      height: actualClonedHeight,  // 修改: 使用实际克隆高度
      scrollX: 0,
      scrollY: 0,
      // 设置合适的窗口尺寸
      windowWidth: Math.max(elementWidth, window.innerWidth),
      windowHeight: Math.max(actualClonedHeight, window.innerHeight),  // 修改: 使用实际高度
      // 设置DPI以确保清晰度
      dpi: 96,
      // 字体渲染优化
      letterRendering: true,
      // 忽略某些元素
      ignoreElements: (element) => {
        // 忽略工具栏、菜单等UI元素
        return element.classList.contains('toolbar') ||
               element.classList.contains('menu') ||
               element.classList.contains('floating') ||
               element.classList.contains('tooltip') ||
               element.classList.contains('modal') ||
               element.classList.contains('dropdown') ||
               element.classList.contains('progress') ||
               element.classList.contains('loading') ||
               element.classList.contains('overlay') ||
               element.classList.contains('popup')
      },
      // 在渲染前应用样式优化
      onclone: (clonedDoc, clonedElement) => {
        // 确保字体渲染清晰
        const style = clonedDoc.createElement('style')
        style.textContent = `
          * {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            text-rendering: optimizeLegibility !important;
            font-feature-settings: "liga" 1, "kern" 1 !important;
          }

          /* 确保文字不会被压缩 - 但不影响图表和LaTeX公式 */
          p:not(.px-editor__chart-container *):not(.katex):not(.katex *),
          span:not(.px-editor__chart-container *):not(.katex):not(.katex *):not(.tiptap-math):not(.latex),
          h1, h2, h3, h4, h5, h6 {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }

          /* 代码块专用样式 - 确保等宽字体正常渲染，防止文字被压扁 */
          pre, pre code {
            line-height: 1.5 !important;
            font-family: "JetBrainsMono", "Courier New", Courier, monospace !important;
            white-space: pre-wrap !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            font-feature-settings: normal !important; /* 重置字体特性，避免影响等宽字体 */
          }

          pre code {
            font-size: 0.8rem !important;
            display: block !important;
          }



          /* 确保图表和相关元素完全可见 */
          .px-editor__chart-container,
          .px-editor__chart-content,
          .echarts-container,
          canvas, svg {
            visibility: visible !important;
            opacity: 1 !important;
            display: block !important;
            position: relative !important;
          }

          /* 隐藏所有UI元素 - 工具栏、菜单、弹窗等 */
          .toolbar, .menu, .floating, .tooltip, .modal,
          .dropdown, .progress, .loading, .overlay, .popup,
          .px-editor-toolbar-menu, .px-editor-bubble-menu, .px-editor-slash-menu,
          .bubble-menu, .slash-menu, .side-insert-handle,
          .a-modal, .a-tooltip, .a-dropdown, .a-popover,
          .comment-tooltip, .px-editor-chart-editor__panel,
          .search-replace-panel, .word-view-corner-marker,
          .word-view-corner-marker-top-right, .word-view-corner-marker-bottom-right,
          .ai-cursor-input, .ai-writer-modal, .ai-writer-drawer {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }

          /* 隐藏占位符文本 */
          .px-editor-empty::before,
          .px-editor-node-empty::before,
          [data-placeholder]::before {
            content: none !important;
            display: none !important;
          }

          /* 隐藏协作相关UI元素 - 用户头像、光标、用户名标签等 */
          .a-avatar, .a-avatar-group, .mobile-user-dropdown,
          .collaboration-cursor, .collaboration-cursor__caret, .collaboration-cursor__label,
          [data-decoration-id],
          .ProseMirror-yjs-cursor, .yjs-cursor,
          .online-users, .user-info, .connection-status {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }

          /* 清除文本选中状态的视觉效果 */
          ::selection, ::-moz-selection {
            background-color: transparent !important;
            color: inherit !important;
          }

          /* 清除编辑器光标和拖放状态 */
          .ProseMirror-cursor,
          .ProseMirror-dropcursor,
          .ProseMirror-gapcursor {
            display: none !important;
            opacity: 0 !important;
          }

          /* 清除图片的选中边框效果 */
          .px-editor__image-resizable img {
            border-color: transparent !important;
          }

          /* 隐藏图片的调整大小句柄 */
          .px-editor__image-resize-handles,
          .px-editor__image-resize-handle {
            display: none !important;
            opacity: 0 !important;
          }

          /* 特别处理LaTeX公式的选中状态 */
          .katex.selected, .tiptap-math.selected, .latex.selected,
          .katex.active, .tiptap-math.active, .latex.active,
          .katex.focused, .tiptap-math.focused, .latex.focused,
          .katex.highlighted, .tiptap-math.highlighted, .latex.highlighted {
            background-color: transparent !important;
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }

          /* 【新增】清除评论高亮样式 - 确保导出的PDF是纯净的文档内容 */
          .px-editor__comment-mark,
          [data-comment-id] {
            background-color: transparent !important;
            border-bottom: none !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            cursor: default !important;
            transition: none !important;
          }

          /* 清除评论mark的hover效果 */
          .px-editor__comment-mark:hover,
          [data-comment-id]:hover {
            background-color: transparent !important;
            box-shadow: none !important;
          }
        `
        clonedDoc.head.appendChild(style)

        // 检查克隆的文档中是否有图表
        const clonedCharts = clonedElement.querySelectorAll('.px-editor__chart-content, .echarts-container, [data-chart-type]')
        console.log(`克隆文档中发现 ${clonedCharts.length} 个图表`)

        // 【关键】在克隆文档中处理分隔线
        this.processSeparatorsInClonedDoc(clonedElement)

        console.log('已为克隆文档应用优化样式')
      }
    }

    const finalOptions = { ...defaultOptions, ...options }

    console.log('html2canvas选项:', finalOptions)

    let styleCleanup = null
    try {
      // 对副本应用样式优化，不影响原始文档
      styleCleanup = this.optimizePageForExport(clonedElement)

      const canvas = await html2canvas(clonedElement, finalOptions)
      console.log(`生成Canvas成功: ${canvas.width}x${canvas.height}`)
      console.log(`Canvas像素密度: ${canvas.width / elementWidth}x${canvas.height / elementHeight}`)
      return canvas
    } catch (error) {
      console.error('html2canvas生成失败:', error)
      throw new Error(`页面截图生成失败: ${error.message}`)
    } finally {
      // 清理副本和样式
      try {
        if (styleCleanup && typeof styleCleanup === 'function') {
          styleCleanup()
        }
      } catch (cleanupError) {
        console.warn('样式清理失败:', cleanupError)
      }

      try {
        if (clonedElement && clonedElement.parentNode) {
          clonedElement.parentNode.removeChild(clonedElement)
          console.log('已清理文档副本')
        }
      } catch (removeError) {
        console.warn('副本清理失败:', removeError)
      }
    }
  }

  /**
   * 清除副本中的所有UI状态和选中效果
   * @param {HTMLElement} element - 要清理的元素
   */
  clearSelectionStates(element) {
    console.log('清除副本中的所有UI状态和选中效果...')

    // 1. 清除文本选中状态
    if (window.getSelection) {
      window.getSelection().removeAllRanges()
    }

    // 2. 移除所有UI元素 - 工具栏、菜单、弹窗、AI输入框等
    const uiElements = element.querySelectorAll(`
      .toolbar, .menu, .floating, .tooltip, .modal,
      .dropdown, .progress, .loading, .overlay, .popup,
      .px-editor-toolbar-menu, .px-editor-bubble-menu, .px-editor-slash-menu,
      .bubble-menu, .slash-menu, .side-insert-handle,
      .a-modal, .a-tooltip, .a-dropdown, .a-popover,
      .comment-tooltip, .px-editor-chart-editor__panel,
      .search-replace-panel, .word-view-corner-marker,
      .word-view-corner-marker-top-right, .word-view-corner-marker-bottom-right,
      .ai-cursor-input, .ai-writer-modal, .ai-writer-drawer
    `)
    console.log(`移除 ${uiElements.length} 个UI元素...`)
    uiElements.forEach(el => {
      el.remove()
    })

    // 清除占位符伪元素的内容
    const placeholderElements = element.querySelectorAll('.px-editor-empty, .px-editor-node-empty, [data-placeholder]')
    console.log(`清除 ${placeholderElements.length} 个占位符元素...`)
    placeholderElements.forEach(el => {
      el.removeAttribute('data-placeholder')
      el.classList.remove('px-editor-empty', 'px-editor-node-empty')
    })

    // 3. 移除协作相关UI元素 - 用户头像、光标、用户名标签等
    const collabElements = element.querySelectorAll(`
      .a-avatar, .a-avatar-group, .mobile-user-dropdown,
      .collaboration-cursor, .collaboration-cursor__caret, .collaboration-cursor__label,
      [data-decoration-id],
      .ProseMirror-yjs-cursor, .yjs-cursor,
      .online-users, .user-info, .connection-status
    `)
    console.log(`移除 ${collabElements.length} 个协作UI元素(包括光标和用户名标签)...`)
    collabElements.forEach(el => {
      el.remove()
    })

    // 4. 清除所有选中状态的样式类（但保留图片和图表的可见性）
    const selectedElements = element.querySelectorAll('.selected, .active, .focused, .highlighted')
    selectedElements.forEach(el => {
      // 只移除选中类，不隐藏元素（图片容器可能有selected类）
      el.classList.remove('selected', 'active', 'focused', 'highlighted')
    })

    // 5. 清除编辑器光标（这些元素不是图片，可以安全隐藏）
    const cursorElements = element.querySelectorAll(`
      .ProseMirror-cursor, .ProseMirror-dropcursor, .ProseMirror-gapcursor
    `)
    cursorElements.forEach(el => {
      el.style.display = 'none'
      el.style.visibility = 'hidden'
      el.style.opacity = '0'
    })

    // 清除节点选中状态类（但不隐藏元素，因为图片可能有这个类）
    const selectedNodeElements = element.querySelectorAll('.ProseMirror-selectednode')
    selectedNodeElements.forEach(el => {
      el.classList.remove('ProseMirror-selectednode')
    })

    // 【核心修复】确保所有图片及其祖先链都可见
    // 这是最后一步，会覆盖之前所有可能误伤图片的规则
    this.ensureImagesVisible(element)

    // 6. 清除LaTeX公式的选中状态
    const mathElements = element.querySelectorAll('.katex.selected, .tiptap-math.selected, .latex.selected')
    mathElements.forEach(el => {
      el.classList.remove('selected')
      el.style.backgroundColor = ''
      el.style.outline = ''
      el.style.border = ''
    })

    // 7. 清除评论高亮样式
    const commentMarks = element.querySelectorAll('.px-editor__comment-mark, [data-comment-id]')
    console.log(`发现 ${commentMarks.length} 个评论标记，正在清除高亮样式...`)
    commentMarks.forEach(el => {
      el.classList.remove('px-editor__comment-mark')
      el.style.backgroundColor = ''
      el.style.borderBottom = ''
      el.style.border = ''
      el.style.boxShadow = ''
      el.style.padding = ''
      el.style.borderRadius = ''
      el.style.cursor = ''
      el.style.transition = ''
    })

    // 8. 清除所有元素的focus状态
    const focusedElements = element.querySelectorAll(':focus')
    focusedElements.forEach(el => {
      el.blur()
    })

    // 9. 清除所有可能的选中背景色和边框（保留文档真实内容的样式）
    const elementsWithBg = element.querySelectorAll('[style*="background"], [style*="border"], [style*="outline"]')
    elementsWithBg.forEach(el => {
      const style = el.style
      // 只清除明显的选中状态颜色（蓝色系、高亮色），保留用户设置的文档样式
      if (style.backgroundColor && (
        style.backgroundColor.includes('blue') ||
        style.backgroundColor.includes('rgb(0, 123, 255)') ||
        style.backgroundColor.includes('#007bff') ||
        style.backgroundColor.includes('rgba(0, 123, 255') ||
        style.backgroundColor.includes('#0066cc') ||
        style.backgroundColor.includes('lightblue') ||
        style.backgroundColor.includes('rgb(178, 212, 255)') || // 常见的选中蓝色
        style.backgroundColor.includes('rgba(178, 212, 255') ||
        style.backgroundColor.includes('#b2d4ff')
      )) {
        style.backgroundColor = ''
      }

      // 清除选中状态的边框（蓝色系）
      if (style.border && (
        style.border.includes('blue') ||
        style.border.includes('#007bff') ||
        style.border.includes('#0066cc')
      )) {
        style.border = ''
      }

      // 清除选中状态的轮廓（蓝色系）
      if (style.outline && (
        style.outline.includes('blue') ||
        style.outline.includes('#007bff') ||
        style.outline.includes('#0066cc')
      )) {
        style.outline = ''
      }
    })

    // 10. 特别处理所有span和mark元素,清除可能的选中背景
    const allTextElements = element.querySelectorAll('span, mark, em, strong, u, s')
    allTextElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el)
      const bgColor = computedStyle.backgroundColor
      // 检测是否是选中状态的蓝色背景
      if (bgColor && (
        bgColor.includes('178, 212, 255') || // rgb(178, 212, 255)
        bgColor.includes('0, 123, 255') ||
        bgColor === 'rgb(178, 212, 255)' ||
        bgColor === 'rgba(178, 212, 255, 1)'
      )) {
        el.style.backgroundColor = 'transparent'
      }
    })

    // 11. 特别处理LaTeX公式的选中状态
    const allMathElements = element.querySelectorAll('.katex, .tiptap-math, .latex, [data-latex]')
    allMathElements.forEach(el => {
      el.classList.remove('selected', 'active', 'focused', 'highlighted', 'ProseMirror-selectednode')
      el.style.backgroundColor = ''
      el.style.outline = ''
      el.style.border = ''
      el.style.boxShadow = ''

      if (el.parentElement) {
        el.parentElement.classList.remove('selected', 'active', 'focused', 'highlighted', 'ProseMirror-selectednode')
        el.parentElement.style.backgroundColor = ''
        el.parentElement.style.outline = ''
        el.parentElement.style.border = ''
      }
    })

    console.log('✅ 所有UI状态和选中效果清除完成')
    console.log(`   - 移除了 ${uiElements.length} 个UI元素`)
    console.log(`   - 移除了 ${collabElements.length} 个协作UI元素`)
    console.log(`   - 清除了 ${commentMarks.length} 个评论高亮`)
    console.log(`   - 清除了 ${allTextElements.length} 个文本元素的选中背景`)
  }

  /**
   * 【核心方法】确保所有图片及其祖先链都可见
   * 这是解决图片被误伤问题的根本方法
   * @param {HTMLElement} element - 容器元素
   */
  ensureImagesVisible(element) {
    // 1. 找到所有图片元素
    const allImages = element.querySelectorAll('img')
    console.log(`🖼️ 确保 ${allImages.length} 张图片可见...`)

    allImages.forEach((img, index) => {
      // 强制设置图片本身可见
      img.style.setProperty('display', 'block', 'important')
      img.style.setProperty('visibility', 'visible', 'important')
      img.style.setProperty('opacity', '1', 'important')

      // 清除图片的选中边框（如果有）
      img.style.setProperty('border-color', 'transparent', 'important')

      // 遍历所有祖先元素，确保它们都可见
      let parent = img.parentElement
      while (parent && parent !== element && parent !== document.body) {
        const computedStyle = window.getComputedStyle(parent)

        // 如果祖先元素被隐藏，强制设置为可见
        if (computedStyle.display === 'none') {
          parent.style.setProperty('display', 'block', 'important')
        }
        if (computedStyle.visibility === 'hidden') {
          parent.style.setProperty('visibility', 'visible', 'important')
        }
        if (parseFloat(computedStyle.opacity) < 1) {
          parent.style.setProperty('opacity', '1', 'important')
        }

        // 如果是图片容器，清除选中相关的样式
        if (parent.classList.contains('px-editor__image-resizable')) {
          parent.classList.remove('selected', 'active', 'focused', 'highlighted')

          // 隐藏调整大小的句柄
          const handles = parent.querySelector('.px-editor__image-resize-handles')
          if (handles) {
            handles.style.setProperty('display', 'none', 'important')
          }
        }

        parent = parent.parentElement
      }

      console.log(`   图片 ${index + 1}: 已确保可见`)
    })

    // 2. 同样处理图表容器中的图片
    const chartContainers = element.querySelectorAll('.px-editor__chart-container')
    chartContainers.forEach(container => {
      container.style.setProperty('display', 'block', 'important')
      container.style.setProperty('visibility', 'visible', 'important')
      container.style.setProperty('opacity', '1', 'important')

      const chartImg = container.querySelector('img')
      if (chartImg) {
        chartImg.style.setProperty('display', 'block', 'important')
        chartImg.style.setProperty('visibility', 'visible', 'important')
        chartImg.style.setProperty('opacity', '1', 'important')
      }
    })

    console.log(`✅ 图片可见性确保完成`)
  }

  /**
   * 从Canvas创建PDF
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @param {string} filename - 文件名
   * @param {Object} options - 选项
   */
  async createPDFFromCanvas(canvas, filename) {
    // 创建PDF文档
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    })

    // 计算合适的图片尺寸，保持原始宽高比
    const canvasRatio = canvas.width / canvas.height
    const contentRatio = this.contentWidth / this.contentHeight

    let imgWidth, imgHeight

    // 始终以内容区域宽度为准，保持原始宽高比
    imgWidth = this.contentWidth
    imgHeight = (canvas.height * this.contentWidth) / canvas.width

    // 确保尺寸计算的精确性
    const scaleRatio = imgWidth / canvas.width

    console.log(`=== PDF分页判断 ===`)
    console.log(`Canvas原始尺寸: ${canvas.width}x${canvas.height}px`)
    console.log(`Canvas宽高比: ${canvasRatio.toFixed(4)}`)
    console.log(`PDF页面尺寸: ${this.pageWidth}x${this.pageHeight}mm`)
    console.log(`PDF内容区域: ${this.contentWidth}x${this.contentHeight}mm (页边距${this.margin}mm)`)
    console.log(`内容区域宽高比: ${contentRatio.toFixed(4)}`)
    console.log(`缩放比例: ${scaleRatio.toFixed(4)}`)
    console.log(`计算后图片尺寸: ${imgWidth.toFixed(2)}x${imgHeight.toFixed(2)}mm`)
    console.log(`图片高度 vs 单页高度: ${imgHeight.toFixed(2)}mm vs ${this.contentHeight}mm`)
    console.log(`需要分页: ${imgHeight > this.contentHeight ? '是' : '否'}`)
    console.log(`预计页数: ${Math.ceil(imgHeight / this.contentHeight)}页`)

    // 将Canvas转为图片数据，使用更高质量
    const imgData = canvas.toDataURL('image/png', 1.0)

    // 如果内容高度超过一页，需要智能分页
    if (imgHeight > this.contentHeight) {
      console.log(`=== 开始智能分页 ===`)
      await this.addSmartPages(canvas, imgData, imgWidth)
    } else {
      // 单页内容
      console.log(`=== 单页内容,直接添加 ===`)
      this.pdf.addImage(imgData, 'PNG', this.margin, this.margin, imgWidth, imgHeight)
    }

    // 保存PDF
    const pdfBlob = this.pdf.output('blob')
    saveAs(pdfBlob, filename)

    console.log('PDF文档创建完成')
  }

  /**
   * 智能分页处理
   * @param {HTMLCanvasElement} canvas - Canvas元素
   * @param {string} imgData - 图片数据
   * @param {number} imgWidth - 图片宽度
   * @param {number} imgHeight - 图片高度
   */
  async addSmartPages(canvas, imgData, imgWidth) {
    // 获取编辑器容器来分析内容结构
    const editorContainer = this.findEditorContainer()
    const breakPoints = await this.findOptimalBreakPoints(editorContainer, canvas.width, canvas.height)

    console.log(`找到 ${breakPoints.length} 个分页点`)

    const pageCount = breakPoints.length

    for (let i = 0; i < pageCount; i++) {
      if (i > 0) {
        this.pdf.addPage()
      }

      const startY = i === 0 ? 0 : breakPoints[i - 1]
      const endY = breakPoints[i]
      const pageHeight = endY - startY

      // 计算在PDF中的实际高度，严格保持原始比例
      const actualPageHeight = Math.min(pageHeight, canvas.height - startY)
      const pdfHeight = (actualPageHeight * imgWidth) / canvas.width

      console.log(`第${i + 1}页: startY=${startY}, pageHeight=${actualPageHeight}, pdfHeight=${pdfHeight.toFixed(2)}mm`)

      // 创建当前页的图片片段
      const pageCanvas = document.createElement('canvas')
      const pageCtx = pageCanvas.getContext('2d')

      // 保持原始分辨率和比例
      pageCanvas.width = canvas.width
      pageCanvas.height = actualPageHeight

      // 设置高质量绘制选项
      pageCtx.imageSmoothingEnabled = true
      pageCtx.imageSmoothingQuality = 'high'
      pageCtx.textBaseline = 'top'
      pageCtx.textAlign = 'left'

      // 绘制当前页的内容，确保像素对齐
      pageCtx.drawImage(
        canvas,
        0, startY, canvas.width, actualPageHeight,
        0, 0, canvas.width, actualPageHeight
      )

      // 使用PNG格式保持最高质量
      const pageImgData = pageCanvas.toDataURL('image/png', 1.0)

      // 添加到PDF，严格保持宽高比
      this.pdf.addImage(
        pageImgData,
        'PNG',
        this.margin,
        this.margin,
        imgWidth,
        pdfHeight
      )

      // 添加页码
      this.addPageNumber(i + 1, pageCount)

      // 更新进度
      const progress = 60 + (i / pageCount) * 25
      progressManager.updateProgress(progress, `正在生成第 ${i + 1}/${pageCount} 页...`)
    }
  }

  /**
   * 寻找最佳分页点
   * @param {HTMLElement} container - 编辑器容器
   * @param {number} canvasWidth - Canvas宽度
   * @param {number} canvasHeight - Canvas总高度
   * @returns {Promise<number[]>} 分页点数组
   */
  async findOptimalBreakPoints(container, canvasWidth, canvasHeight) {
    const breakPoints = []
    const containerHeight = container.scrollHeight || container.offsetHeight
    const containerWidth = container.scrollWidth || container.offsetWidth

    // 计算容器到Canvas的缩放比例
    const scale = canvasHeight / containerHeight

    // 核心修复: 正确计算Canvas中一页的高度
    //
    // 逻辑说明:
    // 1. Canvas会被缩放到PDF的内容宽度(170mm)
    // 2. imgWidth = this.contentWidth = 170mm (固定值)
    // 3. imgHeight = (canvasHeight * imgWidth) / canvasWidth (保持宽高比)
    // 4. 一页PDF的内容高度 = this.contentHeight = 257mm
    // 5. 因此,Canvas中一页的高度 = (canvasWidth * this.contentHeight) / this.contentWidth
    //
    // 简化: maxPageHeight = canvasHeight * (this.contentHeight / imgHeight)
    //                     = canvasHeight * (this.contentHeight / ((canvasHeight * this.contentWidth) / canvasWidth))
    //                     = canvasWidth * (this.contentHeight / this.contentWidth)

    const maxPageHeight = canvasWidth * (this.contentHeight / this.contentWidth)

    console.log(`=== 分页点计算 ===`)
    console.log(`容器尺寸: ${containerWidth}x${containerHeight}px`)
    console.log(`Canvas尺寸: ${canvasWidth}x${canvasHeight}px`)
    console.log(`容器到Canvas缩放比例: ${scale.toFixed(4)}`)
    console.log(`PDF页面尺寸: ${this.pageWidth}x${this.pageHeight}mm`)
    console.log(`PDF内容区域: ${this.contentWidth}x${this.contentHeight}mm`)
    console.log(`Canvas单页高度: ${maxPageHeight.toFixed(2)}px (基于A4纸张比例)`)
    console.log(`预计需要页数: ${Math.ceil(canvasHeight / maxPageHeight)}`)

    // 获取所有可能的分页元素
    const elements = this.getBreakableElements(container)

    let lastBreakPoint = 0  // 上一个分页点的位置
    let lastSafeBreakPoint = 0  // 上一个安全分页点的位置(用于回退)

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const rect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // 计算元素在canvas中的相对位置
      const elementTop = Math.max(0, (rect.top - containerRect.top + container.scrollTop) * scale)
      const elementHeight = rect.height * scale
      const elementBottom = elementTop + elementHeight

      // 检查是否需要分页 - 关键修复: 使用lastBreakPoint而不是lastSafeBreakPoint
      const currentPageUsed = elementBottom - lastBreakPoint

      if (currentPageUsed > maxPageHeight) {
        // 特殊处理图表元素 - 图表绝对不能被截断
        if (this.isChartElement(element)) {
          // 无论如何都要在图表前分页，确保图表完整
          if (elementTop > lastBreakPoint + 10) { // 留一点缓冲
            breakPoints.push(elementTop)
            lastBreakPoint = elementTop
            lastSafeBreakPoint = elementTop
          }

          // 如果图表本身太高，可能需要特殊处理
          if (elementHeight > maxPageHeight * 0.95) {
            // 这里可以添加图表缩放逻辑
          }
        } else {
          // 非图表元素的常规分页处理
          if (elementHeight > maxPageHeight * 0.8) {
            // 大元素在其开始处分页
            if (elementTop > lastBreakPoint) {
              breakPoints.push(elementTop)
              lastBreakPoint = elementTop
              lastSafeBreakPoint = elementTop
            }
          } else {
            // 寻找最近的安全分页点
            const safePoint = this.findNearestSafeBreakPoint(elements, i, lastBreakPoint, maxPageHeight, scale)
            if (safePoint > lastBreakPoint) {
              breakPoints.push(safePoint)
              lastBreakPoint = safePoint
              lastSafeBreakPoint = safePoint
            }
          }
        }
      }

      // 更新最后一个安全分页点(用于回退)
      if (this.isSafeBreakElement(element) && elementBottom > lastSafeBreakPoint) {
        lastSafeBreakPoint = elementBottom
      }
    }

    // 添加最后一页
    breakPoints.push(canvasHeight)

    return breakPoints
  }

  /**
   * 寻找最近的安全分页点
   * @param {HTMLElement[]} elements - 所有元素
   * @param {number} currentIndex - 当前元素索引
   * @param {number} lastBreakPoint - 上一个分页点
   * @param {number} maxPageHeight - 最大页面高度
   * @param {number} scale - 缩放比例
   * @returns {number} 安全分页点位置
   */
  findNearestSafeBreakPoint(elements, currentIndex, lastBreakPoint, maxPageHeight, scale) {
    // 向前查找最近的安全分页点
    for (let i = currentIndex - 1; i >= 0; i--) {
      const element = elements[i]
      if (this.isSafeBreakElement(element)) {
        const rect = element.getBoundingClientRect()
        const containerRect = element.closest('.ProseMirror, .px-editor__doc, .tiptap').getBoundingClientRect()
        const elementBottom = (rect.bottom - containerRect.top) * scale

        // 确保这个分页点不会让页面太短
        if (elementBottom - lastBreakPoint > maxPageHeight * 0.3) {
          return elementBottom
        }
      }
    }

    // 如果找不到合适的安全点，返回当前元素的开始位置
    const currentElement = elements[currentIndex]
    const rect = currentElement.getBoundingClientRect()
    const containerRect = currentElement.closest('.ProseMirror, .px-editor__doc, .tiptap').getBoundingClientRect()
    return (rect.top - containerRect.top) * scale
  }

  /**
   * 获取可分页的元素
   * @param {HTMLElement} container - 容器元素
   * @returns {HTMLElement[]} 元素数组
   */
  getBreakableElements(container) {
    const selectors = [
      // 文本元素
      'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // 图表元素 - 优先级最高
      '.px-editor__chart-container',
      '.px-editor__chart-content',
      '.px-editor__chart',
      '[data-chart-type]',
      '.echarts-container',
      // 其他块级元素
      'table', 'blockquote', 'pre',
      'ul', 'ol',
      'img', 'figure',
      'hr', '.divider',
      // 音视频元素
      '.px-editor__audio',
      '.px-editor__video'
    ]

    const elements = []
    const addedElements = new Set() // 避免重复添加

    for (const selector of selectors) {
      const found = container.querySelectorAll(selector)
      for (const element of found) {
        if (!addedElements.has(element)) {
          elements.push(element)
          addedElements.add(element)
        }
      }
    }

    // 按垂直位置排序
    const sortedElements = elements.sort((a, b) => {
      const rectA = a.getBoundingClientRect()
      const rectB = b.getBoundingClientRect()
      return rectA.top - rectB.top
    })

    // 过滤掉不可见或高度为0的元素
    return sortedElements.filter(element => {
      const rect = element.getBoundingClientRect()
      return rect.height > 0 && rect.width > 0
    })
  }

  /**
   * 判断是否为图表元素
   * @param {HTMLElement} element - 元素
   * @returns {boolean} 是否为图表
   */
  isChartElement(element) {
    const className = element.className || ''
    const tagName = element.tagName.toLowerCase()

    return (
      className.includes('chart') ||
      className.includes('px-editor__chart') ||
      element.querySelector('.px-editor__chart-content') ||
      element.querySelector('.echarts-container') ||
      element.querySelector('[data-chart-type]') ||
      (tagName === 'canvas' && className.includes('chart'))
    )
  }

  /**
   * 判断是否为安全分页元素
   * @param {HTMLElement} element - 元素
   * @returns {boolean} 是否安全
   */
  isSafeBreakElement(element) {
    const tagName = element.tagName.toLowerCase()
    const className = element.className || ''

    // 段落结束、标题结束、图表结束等都是安全的分页点
    return (
      tagName === 'p' ||
      tagName === 'table' ||
      tagName.match(/^h[1-6]$/) ||
      tagName === 'blockquote' ||
      tagName === 'hr' ||
      this.isChartElement(element) ||
      className.includes('divider')
    )
  }

  /**
   * 添加页码
   * @param {number} currentPage - 当前页码
   * @param {number} totalPages - 总页数
   */
  addPageNumber(currentPage, totalPages) {
    const pageText = `${currentPage} / ${totalPages}`
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(128, 128, 128)

    // 在页面底部中央添加页码
    const textWidth = this.pdf.getTextWidth(pageText)
    const x = (this.pageWidth - textWidth) / 2
    const y = this.pageHeight - 10

    this.pdf.text(pageText, x, y)
  }

  /**
   * 导出当前页面为PDF（简化版本）
   * @param {string} filename - 文件名
   * @param {Object} options - 选项
   */
  async exportCurrentPageToPDF(filename = 'page.pdf', options = {}) {
    try {
      progressManager.show(100, '正在导出当前页面为PDF...')
      progressManager.updateProgress(10, '准备截图...')

      // 截取整个页面
      const canvas = await html2canvas(document.body, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: window.innerWidth,
        height: document.body.scrollHeight
      })

      progressManager.updateProgress(70, '正在生成PDF...')

      await this.createPDFFromCanvas(canvas, filename, options)

      progressManager.setSuccess()
      return true
    } catch (error) {
      console.error('导出当前页面失败:', error)
      progressManager.setError(error.message)
      throw error
    }
  }
}
