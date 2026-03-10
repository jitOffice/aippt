import html2canvas from 'html2canvas'

/**
 * 图表渲染工具类
 * 负责将ECharts图表转换为图片
 */
export class ChartRenderer {
  constructor() {
    this.originalZoom = 1
    this.renderQueue = []
    this.isProcessing = false
  }

  /**
   * 渲染图表为图片
   * @param {HTMLElement} chartElement - 图表DOM元素
   * @param {Object} options - 渲染选项
   * @returns {Promise<string>} base64图片数据
   */
  async renderChartToImage(chartElement, options = {}) {
    if (!chartElement) {
      throw new Error('图表元素不存在')
    }

    // 优先尝试使用ECharts原生导出功能
    const echartsImageData = await this.tryEChartsNativeExport(chartElement, options)
    if (echartsImageData) {
      console.log('使用ECharts原生导出成功')
      return echartsImageData
    }

    // 如果ECharts原生导出失败，回退到html2canvas
    console.log('ECharts原生导出失败，回退到html2canvas')

    // 使用队列机制处理并发渲染
    return new Promise((resolve, reject) => {
      this.renderQueue.push({
        chartElement,
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
      const { chartElement, options, resolve, reject } = task

      try {
        console.log('开始渲染图表为图片...', chartElement)

        // 稳定性优化：保存和重置环境
        await this.prepareRenderingEnvironment()

        // 确保图表完全加载和渲染完成
        await this.waitForChartReady(chartElement)
        await this.waitForChartRender(chartElement)

        // 渲染配置 - 优化参数以提高成功率
        const renderOptions = {
          backgroundColor: '#ffffff',
          scale: options.pixelRatio || 1, // 降低scale减少渲染负载
          width: options.width || Math.max(chartElement.offsetWidth, 400),
          height: options.height || Math.max(chartElement.offsetHeight, 300),
          useCORS: true,
          allowTaint: true,
          logging: false,
          // 添加更多容错参数
          removeContainer: true,
          foreignObjectRendering: false,
          imageTimeout: 15000, // 增加图片加载超时时间
          onclone: (clonedDoc) => {
            // 获取当前图表的唯一标识
            const chartId = chartElement.dataset.chartId

            if (chartId) {
              // 只处理当前正在渲染的图表元素，避免影响其他图表
              const targetCharts = clonedDoc.querySelectorAll(`[data-chart-id="${chartId}"]`)
              targetCharts.forEach(targetChart => {
                targetChart.style.display = 'block'
                targetChart.style.visibility = 'visible'
                targetChart.style.opacity = '1'
                // 使用传入的尺寸而不是固定的640x400，避免变形
                // 为图表添加padding确保边界线条完整显示
                targetChart.style.width = `${renderOptions.width}px`
                targetChart.style.height = `${renderOptions.height}px`
                targetChart.style.minWidth = `${renderOptions.width}px`
                targetChart.style.minHeight = `${renderOptions.height}px`
                targetChart.style.padding = '10px'
                targetChart.style.boxSizing = 'border-box'

                // 处理目标图表的canvas，使用传入的尺寸
                const canvas = targetChart.querySelector('canvas')
                if (canvas && (canvas.width === 0 || canvas.height === 0)) {
                  canvas.width = renderOptions.width
                  canvas.height = renderOptions.height
                  canvas.style.width = `${renderOptions.width}px`
                  canvas.style.height = `${renderOptions.height}px`
                }
              })
            } else {
              // 兜底处理：如果没有chartId，处理所有图表，使用传入的尺寸
              const allCharts = clonedDoc.querySelectorAll('.px-editor__chart-content')
              allCharts.forEach(chart => {
                chart.style.display = 'block'
                chart.style.visibility = 'visible'
                chart.style.opacity = '1'
                chart.style.width = `${renderOptions.width}px`
                chart.style.height = `${renderOptions.height}px`
                chart.style.padding = '10px'
                chart.style.boxSizing = 'border-box'
              })
            }
          },
          ...options
        }

        console.log('渲染配置:', renderOptions)

        // 使用html2canvas截图，带重试机制
        let canvas
        let lastError

        // 优化后的渲染策略：减少重试次数，提升性能
        const retryConfigs = [
          renderOptions, // 原始配置
          { ...renderOptions, scale: 0.8 } // 只保留一个备用配置
        ]

        for (let i = 0; i < retryConfigs.length; i++) {
          try {
            console.log(`尝试渲染配置 ${i + 1}/${retryConfigs.length}:`, retryConfigs[i])
            canvas = await html2canvas(chartElement, retryConfigs[i])
            break // 成功则跳出循环
          } catch (error) {
            lastError = error
            console.warn(`渲染配置 ${i + 1} 失败:`, error.message)
            if (i < retryConfigs.length - 1) {
              console.log('尝试下一个配置...')
              await new Promise(resolve => setTimeout(resolve, 200)) // 减少等待时间
            }
          }
        }

        if (!canvas) {
          throw new Error(`所有渲染配置都失败了，最后错误: ${lastError?.message}`)
        }

        // 转换为base64
        const imageData = canvas.toDataURL('image/png', 0.95)

        console.log('图表渲染完成，图片大小:', imageData.length)

        resolve(imageData)

      } catch (error) {
        console.error('图表渲染失败:', error)
        reject(error)
      } finally {
        // 恢复环境
        await this.restoreRenderingEnvironment()
      }
    }

    this.isProcessing = false
  }

  /**
   * 批量渲染多个图表 - 并行版本，提升性能
   * @param {Array} chartElements - 图表元素数组
   * @param {Object} options - 渲染选项
   * @param {Function} onProgress - 进度回调函数
   * @returns {Promise<Array>} 图片数据数组
   */
  async renderMultipleCharts(chartElements, options = {}, onProgress = null) {
    console.log(`开始并行渲染 ${chartElements.length} 个图表`)

    // 并行渲染所有图表，但限制并发数量避免浏览器卡顿
    const concurrency = Math.min(5, chartElements.length) // 最多同时渲染5个图表，提升性能
    const results = []
    let completedCount = 0

    for (let i = 0; i < chartElements.length; i += concurrency) {
      const batch = chartElements.slice(i, i + concurrency)
      console.log(`渲染批次 ${Math.floor(i/concurrency) + 1}，包含 ${batch.length} 个图表`)

      const batchPromises = batch.map(async (element, batchIndex) => {
        const globalIndex = i + batchIndex
        try {
          console.log(`开始渲染图表 ${globalIndex + 1}/${chartElements.length}`)

          // 更新进度
          if (onProgress) {
            onProgress(completedCount, chartElements.length, `正在渲染第 ${globalIndex + 1} 个图表...`)
          }

          const imageData = await this.renderChartToImage(element, options)

          completedCount++

          // 更新进度
          if (onProgress) {
            onProgress(completedCount, chartElements.length, `已完成 ${completedCount} 个图表渲染`)
          }

          return {
            index: globalIndex,
            element: element,
            imageData: imageData,
            success: true
          }
        } catch (error) {
          console.error(`图表 ${globalIndex + 1} 渲染失败:`, error)
          completedCount++

          // 更新进度（即使失败也要更新）
          if (onProgress) {
            onProgress(completedCount, chartElements.length, `图表 ${globalIndex + 1} 渲染失败`)
          }

          return {
            index: globalIndex,
            element: element,
            error: error.message,
            success: false
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // 批次间短暂延迟，避免浏览器过载
      if (i + concurrency < chartElements.length) {
        await this.delay(100) // 减少延迟时间
      }
    }

    // 按索引排序确保顺序正确
    results.sort((a, b) => a.index - b.index)

    console.log(`并行渲染完成，成功: ${results.filter(r => r.success).length}，失败: ${results.filter(r => !r.success).length}`)
    return results
  }

  /**
   * 准备渲染环境
   * 重置缩放、禁用滚动等
   */
  async prepareRenderingEnvironment() {
    try {
      // 保存当前缩放比例
      this.originalZoom = window.devicePixelRatio || 1

      // 禁用页面滚动
      document.body.style.overflow = 'hidden'
      
      // 重置页面缩放（如果可能）
      if (document.body.style.zoom !== undefined) {
        document.body.style.zoom = '1'
      }

      // 确保页面稳定
      await this.delay(100)

      console.log('渲染环境准备完成')
    } catch (error) {
      console.warn('准备渲染环境时出现警告:', error)
    }
  }

  /**
   * 恢复渲染环境
   */
  async restoreRenderingEnvironment() {
    try {
      // 恢复页面滚动
      document.body.style.overflow = ''
      
      // 恢复缩放
      if (document.body.style.zoom !== undefined) {
        document.body.style.zoom = ''
      }

      console.log('渲染环境已恢复')
    } catch (error) {
      console.warn('恢复渲染环境时出现警告:', error)
    }
  }

  /**
   * 等待图表准备就绪
   * @param {HTMLElement} chartElement - 图表元素
   */
  async waitForChartReady(chartElement) {
    return new Promise((resolve) => {
      let attempts = 0
      const maxAttempts = 100 // 最多等待5秒 (100 * 50ms)

      // 检查图表是否已渲染
      const checkReady = () => {
        attempts++

        const canvas = chartElement.querySelector('canvas')
        const svg = chartElement.querySelector('svg')

        if (canvas || svg) {
          console.log('图表元素检测到，等待渲染完成...')
          // 图表已渲染，等待更长时间确保完全加载
          setTimeout(() => {
            console.log('图表等待完成')
            resolve()
          }, 1000) // 增加到1秒
        } else if (attempts >= maxAttempts) {
          console.warn('图表等待超时，继续渲染...')
          resolve() // 超时也继续，避免卡死
        } else {
          // 继续等待
          setTimeout(checkReady, 50)
        }
      }

      console.log('开始等待图表准备就绪...')
      checkReady()
    })
  }

  /**
   * 根据图表类型获取最佳渲染配置
   * @param {HTMLElement} chartElement - 图表元素
   * @returns {Object} 渲染配置
   */
  getOptimalRenderConfig(chartElement) {
    const rect = chartElement.getBoundingClientRect()
    const config = {
      width: Math.max(rect.width, 400),
      height: Math.max(rect.height, 300),
      pixelRatio: 2
    }

    // 根据图表大小调整像素比例
    if (rect.width > 800 || rect.height > 600) {
      config.pixelRatio = 1.5 // 大图表降低像素比例避免内存问题
    }

    return config
  }

  /**
   * 等待图表完全渲染完成
   * @param {HTMLElement} chartElement - 图表元素
   * @returns {Promise}
   */
  async waitForChartRender(chartElement) {
    return new Promise((resolve) => {
      // 进一步优化：使用轮询检查而不是固定等待
      let attempts = 0
      const maxAttempts = 10 // 最多检查10次

      const checkCanvas = () => {
        const canvas = chartElement.querySelector('canvas')
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          // 图表已渲染，立即resolve
          resolve()
        } else if (attempts < maxAttempts) {
          attempts++
          setTimeout(checkCanvas, 50) // 每50ms检查一次
        } else {
          // 超时后直接resolve，避免无限等待
          console.warn('图表渲染检查超时，继续执行')
          resolve()
        }
      }

      // 立即开始检查
      checkCanvas()
    })
  }

  /**
   * 查找页面中的所有图表元素
   * @returns {Array} 图表元素数组
   */
  findAllChartElements() {
    const selectors = [
      '.px-editor__chart-container',  // px-editor图表容器
      '.px-editor__chart-content',    // px-editor图表内容
      '[data-chart-type="echarts"]',  // ECharts图表
      '.echarts-container',           // ECharts容器
      '.chart-container',             // 通用图表容器
      '[id*="chart"]',               // ID包含chart的元素
      '[class*="chart"]'             // class包含chart的元素
    ]

    const elements = []

    selectors.forEach(selector => {
      const found = document.querySelectorAll(selector)
      found.forEach(el => {
        // 避免重复添加
        if (!elements.includes(el)) {
          // 对于px-editor图表容器，优先使用内容元素
          if (el.classList.contains('px-editor__chart-container')) {
            const contentEl = el.querySelector('.px-editor__chart-content')
            if (contentEl && !elements.includes(contentEl)) {
              elements.push(contentEl)
            } else if (!elements.includes(el)) {
              elements.push(el)
            }
          } else {
            elements.push(el)
          }
        }
      })
    })

    console.log(`找到 ${elements.length} 个图表元素`)
    return elements
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 尝试使用ECharts原生导出功能
   * @param {HTMLElement} chartElement - 图表DOM元素
   * @param {Object} options - 渲染选项
   * @returns {Promise<string|null>} base64图片数据或null
   */
  async tryEChartsNativeExport(chartElement, options = {}) {
    try {
      // 检查是否有ECharts实例
      if (!window.echarts) {
        console.log('ECharts未加载，无法使用原生导出')
        return null
      }

      // 查找图表容器中的ECharts实例
      let chartInstance = null

      // 方法1: 直接从元素获取实例
      chartInstance = window.echarts.getInstanceByDom(chartElement)

      // 方法2: 从子元素中查找
      if (!chartInstance) {
        const chartContent = chartElement.querySelector('.px-editor__chart-content')
        if (chartContent) {
          chartInstance = window.echarts.getInstanceByDom(chartContent)
        }
      }

      // 方法3: 从canvas元素的父元素查找
      if (!chartInstance) {
        const canvas = chartElement.querySelector('canvas')
        if (canvas && canvas.parentElement) {
          chartInstance = window.echarts.getInstanceByDom(canvas.parentElement)
        }
      }

      if (!chartInstance) {
        console.log('未找到ECharts实例，无法使用原生导出')
        return null
      }

      console.log('找到ECharts实例，使用原生导出功能')

      // 使用ECharts原生getDataURL方法
      const imageData = chartInstance.getDataURL({
        type: 'png',
        pixelRatio: options.pixelRatio || 2, // 高清晰度
        backgroundColor: options.backgroundColor || '#ffffff',
        excludeComponents: ['toolbox'] // 排除工具栏等组件
      })

      console.log('ECharts原生导出成功，图片大小:', imageData.length)
      return imageData

    } catch (error) {
      console.warn('ECharts原生导出失败:', error)
      return null
    }
  }

  /**
   * 验证图表元素是否有效
   * @param {HTMLElement} element - 图表元素
   * @returns {boolean} 是否有效
   */
  isValidChartElement(element) {
    if (!element) {
      return false
    }

    // 更宽松的检查条件
    try {
      // 检查是否是DOM元素
      if (typeof element.tagName !== 'string') {
        return false
      }

      // 检查是否包含图表内容
      const hasCanvas = element.querySelector('canvas')
      const hasSvg = element.querySelector('svg')
      const hasChartClass = element.className && (
        element.className.includes('chart') ||
        element.className.includes('px-editor__chart') ||
        element.className.includes('echarts') ||
        element.className.includes('highcharts')
      )

      // 检查是否有图表相关的数据属性
      const hasChartData = element.dataset && (
        element.dataset.chartType ||
        element.dataset.chart ||
        element.getAttribute('data-chart-type')
      )

      return hasCanvas || hasSvg || hasChartClass || hasChartData
    } catch (error) {
      console.error('检查图表元素时出错:', error)
      return false
    }
  }

  /**
   * 获取图表的元数据
   * @param {HTMLElement} element - 图表元素
   * @returns {Object} 图表元数据
   */
  getChartMetadata(element) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight,
      type: element.getAttribute('data-chart-type') || 'unknown',
      id: element.id || 'unnamed',
      className: element.className
    }
  }
}

// 导出单例
export const chartRenderer = new ChartRenderer()

// 导出默认渲染配置
export const DEFAULT_RENDER_CONFIG = {
  backgroundColor: '#ffffff',
  pixelRatio: 2,
  quality: 0.95,
  format: 'png'
}
