import html2canvas from 'html2canvas'

/**
 * 思维导图渲染工具类
 * 将 MindElixir 思维导图 DOM 转换为图片（base64 PNG）
 *
 * 设计思路：
 * - 输入：已经在页面中渲染完成的思维导图容器（通常为 .mindmap-canvas / .px-editor__mindmap-container）
 * - 输出：data:image/png;base64,... 字符串
 * - 使用队列串行渲染，避免同时对多个复杂 DOM 做🍍 "pageSettings" store installed 🆕
 index.js:4164 🍍 "comments" store installed 🆕
 miyip83c8ajvtbjbl4e:1 [DOM] Input elements should have autocomplete attributes (suggested: "current-password"): (More info: https://goo.gl/9p2vKq) input.arco-input.arco-input-size-medium
 toolbar-menu.js:277 === Toolbar menus === (39) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
 bubble-menu.js:181 [BubbleMenu] Registering bubble menu plugin
 bubble-menu.js:199 [BubbleMenu] yUndoPlugin 已重新注册，确保 redo 功能正常
 unique-id.js:49 [uniqueID] onCreate 被延迟执行，等待 Collaboration 同步完成
 index.js:11 Chart extension created
 index.js:96 Mindmap extension created
 Editor.ts:119 [Violation] 'setTimeout' 截图导致浏览器卡顿
 */
export class MindmapRenderer {
  constructor() {
    this.renderQueue = []
    this.isProcessing = false
  }

  /**
   * 渲染单个思维导图为图片
   * @param {HTMLElement} mindmapElement - 思维导图 DOM 元素
   * @param {Object} options - 渲染选项
   * @returns {Promise<string>} base64 图片数据
   */
  async renderMindmapToImage(mindmapElement, options = {}) {
    if (!mindmapElement) {
      throw new Error('思维导图元素不存在')
    }

    return new Promise((resolve, reject) => {
      this.renderQueue.push({
        mindmapElement,
        options,
        resolve,
        reject
      })

      this.processQueue()
    })
  }

  async processQueue() {
    if (this.isProcessing || this.renderQueue.length === 0) {
      return
    }

    this.isProcessing = true

    while (this.renderQueue.length > 0) {
      const task = this.renderQueue.shift()
      const { mindmapElement, options, resolve, reject } = task

      try {
        const imageData = await this.renderSingleMindmap(mindmapElement, options)
        resolve(imageData)
      } catch (error) {
        console.error('思维导图渲染失败:', error)
        reject(error)
      }
    }

    this.isProcessing = false
  }

  /**
   * 实际执行一次思维导图截图
   * @param {HTMLElement} mindmapElement
   * @param {Object} options
   * @returns {Promise<string>} base64 图片数据
   */
  async renderSingleMindmap(mindmapElement, options = {}) {
    // 等待思维导图渲染完成，避免截到空白
    await this.waitForMindmapReady(mindmapElement, options.timeout || 2000)

    // 自动调整视图以确保内容完整
    await this.autoFitView(mindmapElement)

    const rect = mindmapElement.getBoundingClientRect()
    const width = options.width || Math.max(rect.width || 0, 400)
    const height = options.height || Math.max(rect.height || 0, 300)

    // 基础渲染配置，优先保证成功率和清晰度
    const baseRenderOptions = {
      backgroundColor: null,
      scale: options.pixelRatio || 2,
      width,
      height,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      removeContainer: true, // 确保 html2canvas 清理临时 DOM
      ignoreElements: (element) => {
        if (!element || !element.classList) return false
        try {
          // 直接忽略工具栏和菜单元素，这是最彻底的移除方式
          if (element.matches && element.matches('.mind-elixir-toolbar, .me-theme-container, .me-theme-menu, .mindmap-toolbar, .mindmap-toolbar-container, .mindmap-floating-toolbar, .me-node-menu, .me-context-menu, .context-menu, [class*="toolbar"]')) {
            return true
          }
        } catch {}
        return false
      },
      ...options
    }

    // 在克隆文档中确保思维导图容器可见，并彻底移除编辑工具条等浮层
    const originalOnclone = baseRenderOptions.onclone
    baseRenderOptions.onclone = (clonedDoc) => {
      try {
        // 注入强制样式，覆盖所有背景色和工具栏显示
        const style = clonedDoc.createElement('style')
        style.innerHTML = `
          :root {
            --bgcolor: transparent !important;
          }
          .mind-elixir-toolbar, .me-theme-container, .me-theme-menu, .mindmap-toolbar, [class*="toolbar"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
          .mindmap-canvas, .px-editor__mindmap-container, .map-container, .map-canvas, .mindmap-host, [data-mindmap-id] {
            background: transparent !important;
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* 强制 SVG 及其内部背景透明 */
          svg {
            background: transparent !important;
            background-color: transparent !important;
          }
          /* 强制移除 html2canvas 默认可能产生的白色背景 */
          body, html {
            background: transparent !important;
            background-color: transparent !important;
          }
        `
        clonedDoc.head.appendChild(style)

        // JS 强力覆盖：遍历所有可能的容器并强制背景透明
        const potentialContainers = clonedDoc.querySelectorAll('.px-editor__mindmap-container, [data-mindmap-id], .map-container, .map-canvas, .mindmap-host');
        potentialContainers.forEach(el => {
          el.style.setProperty('background-color', 'transparent', 'important');
          el.style.setProperty('background', 'transparent', 'important');
        });

        const mindmapId = mindmapElement.getAttribute('data-mindmap-id')
	        let target = null
	
	        if (mindmapId) {
	          target = clonedDoc.querySelector(`[data-mindmap-id="${mindmapId}"]`)
	        }
	
	        if (!target) {
	          // 兜底：按顺序匹配 .px-editor__mindmap-container
	          const originals = Array.from(
	            document.querySelectorAll('.px-editor__mindmap-container, [data-mindmap-id]')
	          )
	          const index = originals.indexOf(mindmapElement)
	          if (index >= 0) {
	            const clonedList = clonedDoc.querySelectorAll(
	              '.px-editor__mindmap-container, [data-mindmap-id]'
	            )
	            target = clonedList[index] || null
	          }
	        }
	
	        if (target) {
	          // 确保导图容器和画布在克隆文档中是可见的
          target.style.display = 'block'
          target.style.visibility = 'visible'
          target.style.opacity = '1'
          target.style.backgroundColor = 'transparent'

          const canvas = target.querySelector('.mindmap-canvas, .map-canvas') || target
          if (canvas) {
            canvas.style.display = 'block'
            canvas.style.visibility = 'visible'
            canvas.style.opacity = '1'
            canvas.style.overflow = 'visible'
            canvas.style.backgroundColor = 'transparent'
          }

          // 关键：在克隆文档中直接移除所有思维导图工具条和主题菜单节点，
          // 避免样式中的 !important 把 display/visibility 改回去
          const overlaySelectors = [
            '.mind-elixir-toolbar',
            '.me-theme-container',
            '.me-theme-menu',
            '.mindmap-toolbar',
            '.mindmap-toolbar-container',
            '.mindmap-floating-toolbar',
            '.me-node-menu',
            '.me-context-menu',
            '.context-menu',
            '[class*="toolbar"]'
          ].join(', ')

          // 扩大搜索范围：在整个克隆文档中查找并移除工具栏，确保万无一失
          const overlays = clonedDoc.querySelectorAll(overlaySelectors)
          console.log(`[MindmapRenderer] Found ${overlays.length} overlay elements to remove in cloned doc`)
          overlays.forEach(el => {
            try {
              console.log(`[MindmapRenderer] Removing overlay: ${el.className} (${el.tagName})`)
              // 先强制隐藏，防止 remove 失败或 html2canvas 依然渲染
              el.style.setProperty('display', 'none', 'important')
              el.style.setProperty('visibility', 'hidden', 'important')
              el.style.setProperty('opacity', '0', 'important')
              
              if (el.parentNode) {
                el.parentNode.removeChild(el)
              }
            } catch (e) {
               console.warn('[MindmapRenderer] Failed to remove overlay:', e)
            }
          })
	        }
	      } catch (e) {
	        console.warn('思维导图 onclone 样式调整失败:', e)
	      }
	
	      if (typeof originalOnclone === 'function') {
	        try {
	          originalOnclone(clonedDoc)
	        } catch (e) {
	          console.warn('原始 onclone 回调执行失败:', e)
	        }
	      }
	    }

    const retryConfigs = [
      baseRenderOptions,
      { ...baseRenderOptions, scale: 1 } // 降低 scale 的备用配置，提升成功率
    ]

    let lastError

    for (let i = 0; i < retryConfigs.length; i++) {
      try {
        console.log(`尝试渲染思维导图(配置 ${i + 1}/${retryConfigs.length})`, retryConfigs[i])
        const canvas = await html2canvas(mindmapElement, retryConfigs[i])
        const quality = typeof options.quality === 'number' ? options.quality : 0.95
        const imageData = canvas.toDataURL('image/png', quality)
        console.log('思维导图渲染完成, 图片大小:', imageData.length)
        return imageData
      } catch (error) {
        lastError = error
        console.warn(`思维导图渲染配置 ${i + 1} 失败:`, error?.message || error)
        // 失败则尝试下一种配置
      }
    }

    throw new Error(`思维导图渲染失败: ${lastError?.message || '未知错误'}`)
  }

  /**
   * 自动调整视图以确保内容完整显示
   * 策略：先居中，然后如果内容超出视图则缩小
   */
  async autoFitView(mindmapElement) {
    try {
      console.log('执行思维导图视图自动调整...')
      
      // 查找控制按钮的辅助函数
      const findControl = (selector) => {
        // 1. 在容器内部查找
        let el = mindmapElement.querySelector(selector)
        if (el) return el
        
        // 2. 在父容器查找 (对应 .px-editor__mindmap-container)
        if (mindmapElement.parentElement) {
          el = mindmapElement.parentElement.querySelector(selector)
          if (el) return el
        }
        
        // 3. 全局查找 (作为兜底)
        return document.querySelector(selector)
      }

      const toCenterBtn = findControl('#toCenter')
      const zoomOutBtn = findControl('#zoomout')

      // 1. 先居中
      if (toCenterBtn) {
        toCenterBtn.click()
        await this.delay(300) // 等待居中动画
      } else {
        // 尝试获取实例调用
        const instance = mindmapElement.__mindmapInstance || 
                        (mindmapElement.parentElement && mindmapElement.parentElement.__mindmapInstance)
        if (instance && typeof instance.toCenter === 'function') {
          instance.toCenter()
          await this.delay(300)
        }
      }

      // 2. 检查边界并循环缩小
      let retry = 0
      const maxRetries = 15 // 稍微多一点重试次数，应对大图
      
      while (retry < maxRetries) {
        if (this.isContentInView(mindmapElement)) {
          break
        }

        if (zoomOutBtn) {
          zoomOutBtn.click()
          await this.delay(150) // 缩放动画通常较快
        } else {
           // 如果没有按钮，尝试实例方法作为备选
           const instance = mindmapElement.__mindmapInstance || 
                           (mindmapElement.parentElement && mindmapElement.parentElement.__mindmapInstance)
           if (instance && typeof instance.scale === 'function' && typeof instance.scaleVal === 'number') {
             instance.scale(instance.scaleVal - 0.1)
             await this.delay(150)
           } else {
             console.warn('未找到 zoomout 按钮且无法获取实例，无法自动缩小')
             break
           }
        }
        retry++
      }
      
      // 稍微多等待一下，确保最终渲染稳定
      await this.delay(200)
      
    } catch (e) {
      console.warn('思维导图视图自动调整失败:', e)
    }
  }

  /**
   * 检查思维导图内容是否完全在视图内
   */
  isContentInView(container) {
    const rect = container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return true

    // 获取所有节点 (Topic 节点)
    const nodes = container.querySelectorAll('.tpc, [data-nodeid]')
    
    if (nodes.length === 0) return true

    const padding = 10 
    const viewLeft = 0
    const viewTop = 0
    const viewRight = rect.width
    const viewBottom = rect.height

    // 遍历检查节点是否在容器相对坐标范围内
    for (const node of nodes) {
      const nodeRect = node.getBoundingClientRect()
      
      // 转换为相对于容器的坐标
      const relativeLeft = nodeRect.left - rect.left
      const relativeTop = nodeRect.top - rect.top
      const relativeRight = relativeLeft + nodeRect.width
      const relativeBottom = relativeTop + nodeRect.height

      if (
        relativeLeft < padding ||
        relativeTop < padding ||
        relativeRight > viewRight - padding ||
        relativeBottom > viewBottom - padding
      ) {
        return false
      }
    }

    return true
  }

  /**
   * 等待思维导图渲染完成
   * 简单检查：元素尺寸>0 且 内部存在节点元素
   * @param {HTMLElement} mindmapElement
   * @param {number} timeout - 超时时间(ms)
   */
  async waitForMindmapReady(mindmapElement, timeout = 2000) {
    const start = Date.now()

    while (Date.now() - start < timeout) {
      if (!document.body.contains(mindmapElement)) {
        // 元素已不在文档中, 直接返回, 避免死循环
        return
      }

      const rect = mindmapElement.getBoundingClientRect()
      const hasSize = rect.width > 0 && rect.height > 0
      const hasNodes = mindmapElement.querySelector('[data-nodeid], .tpc, .box')

      if (hasSize && hasNodes) {
        return
      }

      await this.delay(100)
    }

    console.warn('等待思维导图渲染超时, 将直接尝试截图')
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 导出单例和默认配置, 方便其他模块复用
export const mindmapRenderer = new MindmapRenderer()

export const DEFAULT_MINDMAP_RENDER_CONFIG = {
  backgroundColor: null,
  pixelRatio: 2,
  quality: 0.95,
  width: 800,
  height: 600
}
