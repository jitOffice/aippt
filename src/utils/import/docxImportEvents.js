/**
 * DOCX导入事件触发补丁
 *
 * 用途: 在mammothImporter.js中集成,触发DOCX导入事件
 *
 * 集成方法:
 * 1. 在mammothImporter.js顶部引入此文件
 * 2. 在convertToHTML方法开始时调用 triggerImportStarted
 * 3. 在convertToTipTapJSON方法完成时调用 triggerImportCompleted
 *
 * @version 1.0
 * @date 2026-01-02
 */

/**
 * 触发DOCX导入开始事件
 * @param {File} file DOCX文件对象
 */
export function triggerImportStarted(file) {
  if (!file) return

  const detail = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    timestamp: Date.now()
  }

  window.dispatchEvent(new CustomEvent('docx-import-started', { detail }))
  console.log('[DOCX Import] 导入开始:', detail)
}

/**
 * 触发DOCX导入完成事件
 * @param {File} file DOCX文件对象
 * @param {boolean} success 是否成功
 * @param {Object} result 导入结果
 */
export function triggerImportCompleted(file, success = true, result = {}) {
  if (!file) return

  const detail = {
    fileName: file.name,
    fileSize: file.size,
    success,
    nodeCount: result.nodeCount || 0,
    timestamp: Date.now(),
    ...result
  }

  window.dispatchEvent(new CustomEvent('docx-import-completed', { detail }))
  console.log('[DOCX Import] 导入完成:', detail)
}

/**
 * 触发DOCX导入错误事件
 * @param {File} file DOCX文件对象
 * @param {Error} error 错误对象
 */
export function triggerImportError(file, error) {
  if (!file) return

  const detail = {
    fileName: file.name,
    fileSize: file.size,
    error: error.message || String(error),
    timestamp: Date.now()
  }

  window.dispatchEvent(new CustomEvent('docx-import-error', { detail }))
  console.error('[DOCX Import] 导入失败:', detail)
}
