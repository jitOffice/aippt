import { reactive, Ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { presentationApi } from '@/api/presentation'
import { useI18n } from 'vue-i18n'

interface DocumentOperationsArgs {
  currentDocumentId: Ref<string>
  currentDocumentName: Ref<string>
  documentList: Ref<Array<any>>
  docScope: Ref<string>
  viewTrash: Ref<boolean>
  docDrawerLoading: Ref<boolean>
  createDocForm: Ref<{ name: string; type?: string }>
  createDocVisible: Ref<boolean>
  createDocLoading: Ref<boolean>
  router: any
  loadDocumentList: (options?: any) => Promise<void>
  refreshDocStats: () => Promise<void>
  t?: any
}

export function useDocumentOperations(args: DocumentOperationsArgs) {
  const {
    currentDocumentId,
    currentDocumentName,
    documentList,
    docScope,
    viewTrash,
    docDrawerLoading,
    createDocForm,
    createDocVisible,
    createDocLoading,
    router,
    loadDocumentList,
    refreshDocStats,
    t: tArg
  } = args

  // Use passed t or fallback to useI18n
  const { t: i18nT } = useI18n()
  const localT = tArg || i18nT

  // 抽屉加载状态包装器
  const withDocDrawerLoading = async (fn: () => Promise<void>) => {
    docDrawerLoading.value = true
    try {
      await fn()
    } finally {
      docDrawerLoading.value = false
    }
  }

  // 创建文档确认
  const handleCreateDocumentConfirm = async () => {
    if (!createDocForm.value.name || createDocForm.value.name.trim() === '') {
      Message.warning(localT('doc.nameEmptyWarning'))
      return
    }

    createDocLoading.value = true
    try {
      const type = createDocForm.value.type || 'slide'
      const response: any = await presentationApi.create({
        title: createDocForm.value.name.trim(),
        description: '',
        isPublic: false
      })

      if (response.code === 201) {
        Message.success(localT('doc.createSuccess'))
        createDocVisible.value = false

        // 重新加载文档列表
        await loadDocumentList({ scope: docScope.value })
        // 刷新统计数字
        await refreshDocStats()
        // 通知其他标签页/窗口更新文档列表
        try {
          localStorage.setItem('pxdoc:documents:updated', String(Date.now()))
        } catch (e) {}

        // 新窗口打开（保持当前编辑状态）
        let path = `/${response.data.id}`
        if (type === 'sheet') {
          path = `/sheet/${response.data.id}`
        } else if (type === 'mindmap') {
          path = `/mindmap/${response.data.id}`
        } else if (type === 'slide') {
          path = `/slide/${response.data.id}`
        }
        
        const routeData = router.resolve({ path })
        window.open(routeData.href, '_blank')
        
        // 如果是在当前页面直接跳转（可选，如果需要覆盖当前页）
        // router.push(path)
      } else if (response.code === 403) {
        // 文档数量限制
        Message.error(response.message || localT('doc.docLimitReached'))
      } else {
        Message.error(response.message || localT('common.failed'))
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message
      if (error?.response?.status === 403 || errorMsg?.includes('上限')) {
        Message.error(errorMsg || localT('doc.docLimitReached'))
      } else {
        Message.error(errorMsg || `${localT('common.failed')}: ${error.message || '未知错误'}`)
      }
    } finally {
      createDocLoading.value = false
    }
  }

  // 取消创建文档
  const handleCreateDocumentCancel = () => {
    createDocVisible.value = false
    createDocForm.value.name = ''
  }

  // 打开创建文档对话框
  const handleCreateDocument = (type: string = 'doc') => {
    // 预填充默认名称
    let name = ''
    if (type === 'sheet') {
      name = localT('doc.untitledSheet')
    } else if (type === 'mindmap') {
      name = localT('doc.untitledMindmap')
    } else if (type === 'slide') {
      name = localT('doc.untitledSlide')
    } else {
      name = localT('doc.untitledDoc')
    }

    // Fix: If translation fails, it might return the key or the key suffix (depending on t implementation)
    // We must ensure we don't use 'untitledMindmap' or 'doc.untitledMindmap' as the name
    // Also handle core t fallback which returns key suffix
    const isInvalid = !name || name.startsWith('doc.') || 
                      name === 'untitledMindmap' || name === 'untitledSheet' || name === 'untitledDoc' || name === 'untitledSlide'

    if (isInvalid) {
       if (type === 'sheet') name = '未命名表格'
       else if (type === 'mindmap') name = '未命名思维导图'
       else if (type === 'slide') name = '未命名幻灯片'
       else name = '未命名文档'
    }

    createDocForm.value.name = name
    createDocForm.value.type = type
    createDocVisible.value = true
  }

  // 删除冷却（防误删）
  const DELETE_COOLDOWN_SECONDS = 2
  let lastDeleteTs = 0

  // 软删除文档：移到回收站
  const handleDeleteDocument = async (docId: string) => {
    try {
      const now = Date.now()
      const left = Math.ceil((DELETE_COOLDOWN_SECONDS * 1000 - (now - lastDeleteTs)) / 1000)
      if (now - lastDeleteTs < DELETE_COOLDOWN_SECONDS * 1000) {
        Message.info(localT('doc.cooldownMessage', { seconds: Math.max(left, 1) }))
        return
      }
      const response: any = await presentationApi.delete(docId)
      if (response.code === 200) {
        lastDeleteTs = now
        Message.success(localT('doc.deletedSuccess'))
        // 重新加载文档列表
        await withDocDrawerLoading(async () => {
          await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
        })
        // 刷新统计数字
        await refreshDocStats()
        // 通知其他标签页/窗口更新文档列表
        try {
          localStorage.setItem('pxdoc:documents:updated', String(Date.now()))
        } catch (e) {}

        // 如果删除的是当前文档，跳转到下一个或首页
        if (currentDocumentId.value === docId) {
          const nextId = documentList.value[0]?.id
          if (nextId) {
            router.push('/slide/' + nextId)
          } else {
            router.push('/')
          }
        }
      } else {
        Message.error(response.message || localT('doc.deletedFailed'))
      }
    } catch (error: any) {
      Message.error(error?.response?.data?.message || (localT('doc.deletedFailed') + '：' + (error?.message || '未知错误')))
    }
  }

  // 从回收站恢复文档
  const handleRestoreDocument = async (docId: string) => {
    // Note: presentationApi doesn't have restore endpoint yet
    // This would need to be implemented if trash/restore functionality is needed
    Message.warning(localT('doc.featureNotAvailable') || '回收站功能尚未支持')
    return

    /* Original implementation:
    try {
      const res: any = await documentApi.restoreDocument(docId)
      if (res.code === 200) {
        Message.success(localT('doc.restoredSuccess'))
        await withDocDrawerLoading(async () => {
          await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
        })
        await refreshDocStats()
        try { localStorage.setItem('pxdoc:documents:updated', String(Date.now())) } catch {}
      } else {
        Message.error(res.message || localT('doc.deletedFailed'))
      }
    } catch (e: any) {
      Message.error(e?.response?.data?.message || (localT('doc.deletedFailed') + '：' + (e?.message || '未知错误')))
    }
    */
  }

  // 严格确认模式：输入文档名才允许“永久删除”
  const deleteConfirmInput = reactive<Record<string, string>>({})

  // 永久删除（仅在回收站）
  const handlePermanentDeleteDocument = async (docId: string) => {
    // Note: presentationApi uses regular delete which is already permanent
    // This is the same as handleDeleteDocument
    Message.warning(localT('doc.featureNotAvailable') || '永久删除功能尚未支持')
    return

    /* Original implementation:
    try {
      const now = Date.now()
      const left = Math.ceil((DELETE_COOLDOWN_SECONDS * 1000 - (now - lastDeleteTs)) / 1000)
      if (now - lastDeleteTs < DELETE_COOLDOWN_SECONDS * 1000) {
        Message.info(localT('doc.cooldownMessage', { seconds: Math.max(left, 1) }))
        return
      }
      const res: any = await documentApi.permanentDelete(docId)
      if (res.code === 200) {
        lastDeleteTs = now
        Message.success(localT('doc.permanentlyDeletedSuccess'))
        deleteConfirmInput[docId] = ''
        await withDocDrawerLoading(async () => {
          await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
        })
        await refreshDocStats()
        try { localStorage.setItem('pxdoc:documents:updated', String(Date.now())) } catch {}
      } else {
        Message.error(res.message || localT('doc.deletedFailed'))
      }
    } catch (e: any) {
      Message.error(e?.response?.data?.message || (localT('doc.deletedFailed') + '：' + (e?.message || '未知错误')))
    }
    */
  }

  // 批量删除文档
  const handleBatchDeleteDocuments = async (docIds: string[]) => {
    if (!Array.isArray(docIds) || docIds.length === 0) return

    // Note: presentationApi doesn't have batch delete endpoint yet
    // For now, delete one by one
    try {
      let successCount = 0
      let failedItems: any[] = []

      for (const docId of docIds) {
        try {
          const response: any = await presentationApi.delete(docId)
          if (response.code === 200) {
            successCount++
          } else {
            failedItems.push({ id: docId, reason: response.message || 'Unknown error' })
          }
        } catch (e: any) {
          failedItems.push({ id: docId, reason: e?.message || 'Unknown error' })
        }
      }

      if (successCount > 0) {
        Message.success(localT('doc.batchDeleteSuccess', { count: successCount }))
      }

      if (failedItems.length > 0) {
        failedItems.forEach((item: any) => {
          Message.warning(localT('doc.deleteReason', { id: item.id, reason: item.reason }))
        })
      }

      // 重新加载文档列表
      await withDocDrawerLoading(async () => {
        await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
      })
      // 刷新统计数字
      await refreshDocStats()

      // 通知其他标签页/窗口更新文档列表
      try {
        localStorage.setItem('pxdoc:documents:updated', String(Date.now()))
      } catch (e) {}
    } catch (error: any) {
      Message.error(error?.response?.data?.message || `${localT('common.failed')}: ${error.message || '未知错误'}`)
    }
  }

  // 重命名文档
  const handleRenameDocument = async (docId: string, newName: string, onSuccess?: () => void) => {
    if (!docId) {
      console.error('[handleRenameDocument] Missing docId')
      Message.warning(localT('doc.paramsError') || '参数错误：缺少文档ID')
      return
    }

    // 如果名称未变，直接成功
    if (!newName) {
       Message.warning(localT('doc.nameEmptyWarning'))
       return
    }

    try {
      console.log('[handleRenameDocument] start renaming:', docId, newName)
      const response: any = await presentationApi.update(docId, { title: newName })

      if (response.code === 200) {
        Message.success(localT('common.success'))

        // Update local document list immediately
        const targetDoc = documentList.value.find(d => d.id === docId)
        if (targetDoc) {
          targetDoc.title = newName
        }

        // 更新文档列表
        await withDocDrawerLoading(async () => {
          await loadDocumentList({ skipPageSettings: true, scope: docScope.value })
        })

        // 如果重命名的是当前文档，同步更新当前文档名称
        if (currentDocumentId.value === docId) {
          currentDocumentName.value = newName
        }

        // 通知其他标签页/窗口更新文档列表
        try {
          localStorage.setItem('pxdoc:documents:updated', String(Date.now()))
        } catch (e) {}

        // 调用成功回调，通知子组件关闭编辑状态
        if (typeof onSuccess === 'function') {
          onSuccess()
        }
      } else {
        console.error('[handleRenameDocument] failed:', response)
        Message.error(response.message || localT('doc.saveFailed'))
      }
    } catch (error: any) {
      console.error('[handleRenameDocument] error:', error)
      Message.error(`${localT('doc.saveFailed')}: ${error?.message || '未知错误'}`)
    }
  }

  // 直接创建文档（跳过弹窗）
  const handleDirectCreateDocument = async (type: string = 'doc') => {
    // 统一使用 doc.untitledDoc / doc.untitledSheet
    let defaultName = ''
    if (type === 'sheet') {
      defaultName = localT('doc.untitledSheet')
    } else if (type === 'mindmap') {
      defaultName = localT('doc.untitledMindmap')
    } else {
      defaultName = localT('doc.untitledDoc')
    }
    
    // Fallback if t returns key or suffix
    const isInvalid = !defaultName || defaultName.startsWith('doc.') || 
                      defaultName === 'untitledMindmap' || defaultName === 'untitledSheet' || defaultName === 'untitledDoc'

    const name = !isInvalid
                 ? defaultName 
                 : (type === 'sheet' ? '未命名表格' : (type === 'mindmap' ? '未命名思维导图' : '未命名文档'))
    
    createDocForm.value.name = name
    createDocForm.value.type = type
    
    await handleCreateDocumentConfirm()
  }

  return {
    withDocDrawerLoading,
    handleCreateDocument,
    handleDirectCreateDocument,
    handleCreateDocumentConfirm,
    handleCreateDocumentCancel,
    handleDeleteDocument,
    handleRestoreDocument,
    handlePermanentDeleteDocument,
    handleBatchDeleteDocuments,
    handleRenameDocument,
    deleteConfirmInput
  }
}
