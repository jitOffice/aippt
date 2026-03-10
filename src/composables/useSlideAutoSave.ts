import { ref, onUnmounted, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import { presentationApi } from '@/api/presentation'
import { versionApi } from '@/api/version'

export function useSlideAutoSave(args: {
  docId: any
  markdownContent: any
}) {
  const { t } = useI18n()
  const { docId, markdownContent } = args
  
  const autoSaveTimer = ref<number | null>(null)
  const debounceTimer = ref<number | null>(null) // 防抖定时器
  const lastSavedContent = ref<string | null>(null)
  const saveStatus = ref<'saved' | 'saving' | 'error' | 'pending'>('saved')
  const lastMessageTime = ref(0)
  const pendingChanges = ref(false) // 标记是否有未保存的更改

  // 获取当前内容
  const getCurrentContent = () => {
    return markdownContent.value || ''
  }

  // 保存逻辑 (核心)
  // isAutoSave: 是否为自动保存
  // force: 是否强制保存（不检查变更）
  const save = async (isAutoSave = false, force = false) => {
    if (!docId.value) return
    
    // Prevent parallel saves
    if (saveStatus.value === 'saving') return

    const currentContent = getCurrentContent()

    // 检查变更 (如果是自动保存，且内容未变，则跳过)
    if (isAutoSave && !force && lastSavedContent.value === currentContent) {
      return
    }

    try {
      saveStatus.value = 'saving'
      
      // 1. 保存到主文档 (Persistence)
      await presentationApi.update(docId.value, { content: currentContent })

      // 2. 创建版本 (Version History) - Optional until backend supports it
      try {
        await versionApi.createVersion(docId.value, {
          content: currentContent,
          title: isAutoSave 
            ? t('doc.autoSaveTitle', { date: new Date().toLocaleString() }) 
            : t('doc.quickSaveTitle', { date: new Date().toLocaleString() }),
          description: isAutoSave ? t('doc.autoSaveDesc') : t('doc.quickSaveDesc'),
          isAutoSave: isAutoSave,
          author: localStorage.getItem('username') || 'Anonymous'
        })
      } catch (versionError) {
        // Version endpoint not available yet, ignore error
        console.warn('Version creation failed (not implemented yet):', versionError)
      }

      // 更新最后保存状态
      lastSavedContent.value = currentContent
      saveStatus.value = 'saved'

      if (!isAutoSave) {
        // Debounce success message to prevent double triggering
        const now = Date.now()
        if (now - lastMessageTime.value > 2000) {
          Message.success(t('doc.saveSuccess') || '保存成功')
          lastMessageTime.value = now
        }
      }
    } catch (error) {
      console.error('Save failed:', error)
      saveStatus.value = 'error'
      if (!isAutoSave) {
        const now = Date.now()
        if (now - lastMessageTime.value > 2000) {
          Message.error(t('doc.saveFailed') || '保存失败')
          lastMessageTime.value = now
        }
      }
    }
  }

  // 防抖保存：用户停止编辑后自动保存
  // delay: 延迟时间（默认3秒）
  const debouncedSave = (delay = 3000) => {
    // 清除之前的定时器
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
    }

    // 标记有未保存的更改
    pendingChanges.value = true
    saveStatus.value = 'pending'

    // 设置新的防抖定时器
    debounceTimer.value = window.setTimeout(async () => {
      await save(true) // 自动保存
      pendingChanges.value = false
    }, delay)
  }

  // 启动自动保存（基于内容变化监听）
  const startAutoSave = () => {
    stopAutoSave()
    
    // 初始化基准状态
    lastSavedContent.value = getCurrentContent()

    // 监听 markdownContent 变化，触发防抖保存
    const unwatch = watch(
      () => markdownContent.value,
      (newContent, oldContent) => {
        // 内容发生变化时触发防抖保存
        if (newContent !== oldContent && newContent !== lastSavedContent.value) {
          debouncedSave()
        }
      },
      { deep: false } // Markdown 是字符串，不需要深度监听
    )

    // 保存 unwatch 函数供清理
    autoSaveTimer.value = unwatch as any
  }

  // 停止自动保存
  const stopAutoSave = () => {
    // 清理 watch
    if (autoSaveTimer.value && typeof autoSaveTimer.value === 'function') {
      ;(autoSaveTimer.value as any)() // 调用 unwatch
      autoSaveTimer.value = null
    }
    
    // 清理防抖定时器
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
      debounceTimer.value = null
    }
  }

  // 页面卸载前保存（防止数据丢失）
  const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
    if (pendingChanges.value) {
      // 有未保存的更改，提示用户
      e.preventDefault()
      e.returnValue = ''
      
      // 立即保存（同步方式）
      await save(true, true)
    }
  }

  // 手动保存 (对应 Ctrl+S 或 按钮点击)
  const handleManualSave = async () => {
    await save(false, true) // 手动保存强制执行
  }

  // 组件挂载时注册 beforeunload 事件
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  // 组件卸载时清理
  onUnmounted(() => {
    stopAutoSave()
    
    // 卸载前如果有未保存的更改，立即保存
    if (pendingChanges.value) {
      save(true, true)
    }
    
    // 移除事件监听
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  })

  return {
    startAutoSave,
    stopAutoSave,
    handleManualSave,
    debouncedSave, // 暴露防抖保存供外部手动触发
    lastSavedContent, // 暴露出来供调试或初始化设置
    saveStatus,
    pendingChanges // 暴露未保存状态供UI显示
  }
}
