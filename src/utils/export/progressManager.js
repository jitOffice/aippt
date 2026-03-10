/**
 * 导出进度管理器
 * 负责管理导出过程中的进度显示和用户反馈
 */
export class ProgressManager {
  constructor() {
    this.progressElement = null
    this.statusElement = null
    this.isVisible = false
    this.currentStep = 0
    this.totalSteps = 0
    this.currentStepName = ''
  }

  /**
   * 显示进度条
   * @param {number} totalSteps - 总步骤数
   * @param {string} title - 进度条标题
   */
  show(totalSteps = 100, title = '正在导出文档...') {
    this.totalSteps = totalSteps
    this.currentStep = 0
    this.isVisible = true

    // 创建进度条容器
    this.createProgressUI(title)
    
    // 显示进度条
    this.progressElement.style.display = 'flex'
    
    console.log(`进度管理器启动，总步骤: ${totalSteps}`)
  }

  /**
   * 更新进度
   * @param {number} step - 当前步骤
   * @param {string} stepName - 步骤名称
   */
  updateProgress(step, stepName = '') {
    if (!this.isVisible) return

    this.currentStep = step
    this.currentStepName = stepName

    const percentage = Math.min(Math.round((step / this.totalSteps) * 100), 100)
    
    // 更新进度条
    const progressBar = this.progressElement.querySelector('.progress-bar-fill')
    const progressText = this.progressElement.querySelector('.progress-text')
    const statusText = this.progressElement.querySelector('.progress-status')

    if (progressBar) {
      progressBar.style.width = `${percentage}%`
    }
    
    if (progressText) {
      progressText.textContent = `${percentage}%`
    }
    
    if (statusText && stepName) {
      statusText.textContent = stepName
    }

    console.log(`进度更新: ${step}/${this.totalSteps} (${percentage}%) - ${stepName}`)
  }

  /**
   * 隐藏进度条
   */
  hide() {
    if (this.progressElement) {
      this.progressElement.style.display = 'none'
      // 延迟移除DOM元素
      setTimeout(() => {
        if (this.progressElement && this.progressElement.parentNode) {
          this.progressElement.parentNode.removeChild(this.progressElement)
        }
        this.progressElement = null
      }, 500)
    }
    
    this.isVisible = false
    this.currentStep = 0
    this.totalSteps = 0
    
    console.log('进度管理器关闭')
  }

  /**
   * 设置错误状态
   * @param {string} errorMessage - 错误信息
   */
  setError(errorMessage) {
    if (!this.isVisible) return

    const statusText = this.progressElement.querySelector('.progress-status')
    const progressBar = this.progressElement.querySelector('.progress-bar-fill')
    
    if (statusText) {
      statusText.textContent = `导出失败: ${errorMessage}`
      statusText.style.color = '#ff4d4f'
    }
    
    if (progressBar) {
      progressBar.style.backgroundColor = '#ff4d4f'
    }

    // 3秒后自动隐藏
    setTimeout(() => this.hide(), 3000)
  }

  /**
   * 设置成功状态
   */
  setSuccess() {
    if (!this.isVisible) return

    this.updateProgress(this.totalSteps, '导出完成!')
    
    const statusText = this.progressElement.querySelector('.progress-status')
    if (statusText) {
      statusText.style.color = '#52c41a'
    }

    // 2秒后自动隐藏
    setTimeout(() => this.hide(), 2000)
  }

  /**
   * 创建进度条UI
   * @param {string} title - 标题
   */
  createProgressUI(title) {
    // 如果已存在，先移除
    if (this.progressElement) {
      this.hide()
    }

    // 创建进度条HTML
    this.progressElement = document.createElement('div')
    this.progressElement.className = 'export-progress-overlay'
    this.progressElement.innerHTML = `
      <div class="export-progress-modal">
        <div class="progress-header">
          <h3>${title}</h3>
        </div>
        <div class="progress-body">
          <div class="progress-bar">
            <div class="progress-bar-fill"></div>
          </div>
          <div class="progress-info">
            <span class="progress-text">0%</span>
            <span class="progress-status">准备中...</span>
          </div>
        </div>
      </div>
    `

    // 添加样式
    this.addProgressStyles()
    
    // 添加到页面
    document.body.appendChild(this.progressElement)
  }

  /**
   * 添加进度条样式
   */
  addProgressStyles() {
    if (document.getElementById('export-progress-styles')) return

    const style = document.createElement('style')
    style.id = 'export-progress-styles'
    style.textContent = `
      .export-progress-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .export-progress-modal {
        background: white;
        border-radius: 8px;
        padding: 24px;
        min-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .progress-header h3 {
        margin: 0 0 20px 0;
        font-size: 16px;
        font-weight: 500;
        color: #262626;
        text-align: center;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
      }

      .progress-bar-fill {
        height: 100%;
        background: #1890ff;
        border-radius: 4px;
        transition: width 0.3s ease;
        width: 0%;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }

      .progress-text {
        font-weight: 500;
        color: #1890ff;
      }

      .progress-status {
        color: #666;
        max-width: 250px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `
    
    document.head.appendChild(style)
  }
}

// 导出单例
export const progressManager = new ProgressManager()
