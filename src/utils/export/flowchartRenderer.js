/**
 * 流程图渲染工具类
 * 负责将Vue Flow流程图转换为图片
 */
export class FlowchartRenderer {
  constructor() {
    this.originalZoom = 1
    this.renderQueue = []
    this.isProcessing = false
  }

  /**
   * 渲染流程图为图片
   * @param {Object} flowchartData - 流程图数据 {nodes, edges, viewport, metadata}
   * @param {Object} options - 渲染选项
   * @returns {Promise<string>} base64图片数据
   */
  async renderFlowchartToImage(flowchartData, options = {}) {
    if (!flowchartData || !flowchartData.nodes) {
      throw new Error('流程图数据不存在')
    }

    // 使用队列机制处理并发渲染
    return new Promise((resolve, reject) => {
      this.renderQueue.push({
        flowchartData,
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
      const { flowchartData, options, resolve, reject } = task

      try {
        console.log('开始渲染流程图为图片...', flowchartData)

        // 稳定性优化：保存和重置环境
        await this.prepareRenderingEnvironment()

        // 创建离屏渲染容器
        const renderContainer = await this.createRenderContainer(flowchartData, options)

        // 确保流程图完全加载和渲染完成
        await this.waitForFlowchartReady(renderContainer)

        // 渲染配置
        const renderOptions = this.getOptimalRenderConfig(renderContainer, options)

        // 执行渲染
        let imageData
        if (options.format === 'svg') {
          imageData = await this.renderToSVG(renderContainer, renderOptions)
        } else {
          imageData = await this.renderToPNG(renderContainer, renderOptions)
        }

        // 清理渲染容器
        this.cleanupRenderContainer(renderContainer)

        // 恢复环境
        await this.restoreRenderingEnvironment()

        resolve(imageData)
      } catch (error) {
        console.error('流程图渲染失败:', error)
        
        // 重试机制
        if (task.retryCount < 3) {
          task.retryCount = (task.retryCount || 0) + 1
          console.log(`重试渲染流程图 (${task.retryCount}/3)`)
          this.renderQueue.unshift(task)
        } else {
          reject(new Error(`流程图渲染失败: ${error.message}`))
        }
      }
    }

    this.isProcessing = false
  }

  /**
   * 批量渲染多个流程图
   */
  async renderMultipleFlowcharts(flowchartDataList, options = {}, onProgress = null) {
    const results = []
    const total = flowchartDataList.length

    for (let i = 0; i < total; i++) {
      try {
        const result = await this.renderFlowchartToImage(flowchartDataList[i], options)
        results.push(result)
        
        if (onProgress) {
          onProgress(i + 1, total)
        }
      } catch (error) {
        console.error(`渲染第 ${i + 1} 个流程图失败:`, error)
        results.push(null)
      }
    }

    return results
  }

  /**
   * 创建离屏渲染容器
   */
  async createRenderContainer(flowchartData, options = {}) {
    // 创建离屏容器
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: -10000px;
      left: -10000px;
      width: ${options.width || 800}px;
      height: ${options.height || 600}px;
      background: #ffffff;
      z-index: -1;
      visibility: hidden;
      pointer-events: none;
    `

    // 渲染流程图内容
    await this.renderFlowchartContent(container, flowchartData)

    return container
  }

  /**
   * 渲染流程图内容到容器
   */
  async renderFlowchartContent(container, flowchartData) {
    // 生成 SVG 内容
    const svgContent = this.generateFlowchartSVG(flowchartData)
    container.innerHTML = svgContent
    document.body.appendChild(container)

    // 等待渲染完成
    await this.delay(100)
  }

  /**
   * 生成流程图 SVG
   */
  generateFlowchartSVG(flowchartData) {
    const { nodes, edges } = flowchartData
    
    if (!nodes || nodes.length === 0) {
      return '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">空流程图</div>'
    }

    // 计算画布边界
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    nodes.forEach(node => {
      const x = node.position.x
      const y = node.position.y
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x + 160) // 节点宽度
      maxY = Math.max(maxY, y + 60)  // 节点高度
    })

    const padding = 40
    const width = Math.max(400, maxX - minX + padding * 2)
    const height = Math.max(300, maxY - minY + padding * 2)
    const offsetX = -minX + padding
    const offsetY = -minY + padding

    let svgContent = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.1"/>
          </filter>
        </defs>
    `

    // 渲染连接线
    edges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      
      if (sourceNode && targetNode) {
        const x1 = sourceNode.position.x + offsetX + 80
        const y1 = sourceNode.position.y + offsetY + 30
        const x2 = targetNode.position.x + offsetX + 80
        const y2 = targetNode.position.y + offsetY + 30

        svgContent += `
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
                stroke="#666" stroke-width="2" marker-end="url(#arrowhead)" />
        `
        
        if (edge.label) {
          const midX = (x1 + x2) / 2
          const midY = (y1 + y2) / 2
          svgContent += `
            <rect x="${midX - 20}" y="${midY - 10}" width="40" height="20" 
                  fill="#fff" stroke="#ddd" rx="3" />
            <text x="${midX}" y="${midY + 4}" text-anchor="middle" 
                  fill="#666" font-size="12">${edge.label}</text>
          `
        }
      }
    })

    // 渲染节点
    nodes.forEach(node => {
      const x = node.position.x + offsetX
      const y = node.position.y + offsetY
      const nodeType = node.type || 'default'
      
      let nodeColor = '#f8f9fa'
      let borderColor = '#dee2e6'
      let textColor = '#333'
      
      switch (nodeType) {
        case 'input':
          nodeColor = '#e6f7ff'
          borderColor = '#1890ff'
          break
        case 'output':
          nodeColor = '#f6ffed'
          borderColor = '#52c41a'
          break
        case 'process':
          nodeColor = '#fff7e6'
          borderColor = '#fa8c16'
          break
        case 'decision':
          nodeColor = '#fff1f0'
          borderColor = '#f5222d'
          break
      }

      // 根据节点类型选择形状
      if (nodeType === 'decision') {
        // 菱形
        const centerX = x + 80
        const centerY = y + 30
        svgContent += `
          <polygon points="${centerX},${y + 10} ${x + 150},${centerY} ${centerX},${y + 50} ${x + 10},${centerY}" 
                   fill="${nodeColor}" stroke="${borderColor}" stroke-width="2" filter="url(#shadow)" />
        `
      } else {
        // 矩形
        svgContent += `
          <rect x="${x}" y="${y}" width="160" height="60" 
                fill="${nodeColor}" stroke="${borderColor}" stroke-width="2" rx="8" filter="url(#shadow)" />
        `
      }

      // 节点文本
      const textX = x + 80
      const textY = y + 35
      svgContent += `
        <text x="${textX}" y="${textY}" text-anchor="middle" 
              fill="${textColor}" font-size="14" font-family="Arial, sans-serif">${node.data.label || 'Node'}</text>
      `

      // 节点描述（如果有）
      if (node.data.description) {
        svgContent += `
          <text x="${textX}" y="${textY + 16}" text-anchor="middle" 
                fill="#999" font-size="11" font-family="Arial, sans-serif">${node.data.description}</text>
        `
      }
    })

    svgContent += '</svg>'
    return svgContent
  }

  /**
   * 渲染为 SVG
   */
  async renderToSVG(container, options) {
    try {
      const svgElement = container.querySelector('svg')
      if (svgElement) {
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgElement.outerHTML)))}`
      }
      
      // 如果没有 SVG，生成一个
      const flowchartElement = container.querySelector('[data-flowchart]')
      if (flowchartElement) {
        const flowchartData = JSON.parse(flowchartElement.getAttribute('data-flowchart'))
        const svgContent = this.generateFlowchartSVG(flowchartData)
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
      }

      throw new Error('无法找到可渲染的流程图内容')
    } catch (error) {
      console.error('SVG 渲染失败:', error)
      throw error
    }
  }

  /**
   * 渲染为 PNG
   */
  async renderToPNG(container, options) {
    try {
      const { toPng } = await import('html-to-image')
      
      const dataUrl = await toPng(container, {
        backgroundColor: options.backgroundColor || '#ffffff',
        width: options.width,
        height: options.height,
        pixelRatio: options.pixelRatio || 2,
        quality: options.quality || 0.95
      })

      return dataUrl
    } catch (error) {
      console.error('PNG 渲染失败:', error)
      throw error
    }
  }

  /**
   * 动态加载 Vue Flow 依赖
   */
  async loadVueFlowDependencies() {
    try {
      const modules = await Promise.all([
        import('@vue-flow/core'),
        import('@vue-flow/background'),
        import('@vue-flow/controls')
      ])

      return {
        VueFlow: modules[0].VueFlow,
        Background: modules[1].Background,
        Controls: modules[2].Controls
      }
    } catch (error) {
      console.error('Vue Flow 依赖加载失败:', error)
      return null
    }
  }

  /**
   * 准备渲染环境
   */
  async prepareRenderingEnvironment() {
    // 保存当前页面缩放
    this.originalZoom = document.body.style.zoom || 1
    
    // 重置页面缩放以确保渲染准确性
    document.body.style.zoom = 1
    
    // 禁用页面滚动
    this.originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    
    // 等待环境稳定
    await this.delay(100)
  }

  /**
   * 恢复渲染环境
   */
  async restoreRenderingEnvironment() {
    // 恢复页面缩放
    document.body.style.zoom = this.originalZoom
    
    // 恢复页面滚动
    document.body.style.overflow = this.originalOverflow || ''
    
    // 等待环境恢复
    await this.delay(50)
  }

  /**
   * 等待流程图就绪
   */
  async waitForFlowchartReady(container) {
    return new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 50

      const checkReady = () => {
        attempts++
        
        // 检查 SVG 是否已渲染
        const svgElement = container.querySelector('svg')
        if (svgElement && svgElement.children.length > 0) {
          resolve()
          return
        }

        // 检查是否有流程图内容
        const hasContent = container.querySelector('[data-flowchart]') || 
                          container.innerHTML.trim().length > 0

        if (hasContent || attempts >= maxAttempts) {
          resolve()
        } else {
          setTimeout(checkReady, 100)
        }
      }

      checkReady()
    })
  }

  /**
   * 获取最佳渲染配置
   */
  getOptimalRenderConfig(container, options = {}) {
    const rect = container.getBoundingClientRect()
    
    return {
      backgroundColor: options.backgroundColor || '#ffffff',
      width: options.width || Math.max(rect.width, 400),
      height: options.height || Math.max(rect.height, 300),
      pixelRatio: options.pixelRatio || 2,
      quality: options.quality || 0.95,
      format: options.format || 'png'
    }
  }

  /**
   * 清理渲染容器
   */
  cleanupRenderContainer(container) {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
  }

  /**
   * 延迟工具方法
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 验证流程图数据
   */
  validateFlowchartData(data) {
    if (!data || typeof data !== 'object') {
      return false
    }

    const { nodes, edges } = data
    
    // 检查节点数据
    if (!Array.isArray(nodes) || nodes.length === 0) {
      return false
    }

    // 检查节点结构
    const validNodes = nodes.every(node => 
      node.id && 
      node.position && 
      typeof node.position.x === 'number' && 
      typeof node.position.y === 'number' &&
      node.data &&
      node.data.label
    )

    if (!validNodes) {
      return false
    }

    // 检查连接线数据
    if (edges && Array.isArray(edges)) {
      const validEdges = edges.every(edge => 
        edge.id && edge.source && edge.target
      )
      if (!validEdges) {
        return false
      }
    }

    return true
  }

  /**
   * 获取流程图元数据
   */
  getFlowchartMetadata(data) {
    if (!this.validateFlowchartData(data)) {
      return null
    }

    return {
      nodeCount: data.nodes.length,
      edgeCount: data.edges ? data.edges.length : 0,
      title: data.metadata?.title || '流程图',
      createdAt: data.metadata?.createdAt,
      updatedAt: data.metadata?.updatedAt
    }
  }
}

// 导出单例实例
export const flowchartRenderer = new FlowchartRenderer()

// 导出默认渲染配置
export const DEFAULT_FLOWCHART_RENDER_CONFIG = {
  backgroundColor: '#ffffff',
  pixelRatio: 2,
  quality: 0.95,
  format: 'png',
  width: 800,
  height: 600
}