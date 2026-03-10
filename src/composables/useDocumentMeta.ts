import type { Ref } from 'vue'
import { presentationApi } from '@/api/presentation'
import { unwrapResponse, type ApiResponse } from '@/api/response'

export function useDocumentMeta(args: {
  currentDocumentId: Ref<string>
  currentDocumentName: Ref<string>
  documentList: Ref<Array<any>>
  pageSettingsStore?: any
  viewTrash: Ref<boolean>
  docDrawerVisible: Ref<boolean>
  t?: (key: string) => string
}) {
  const {
    currentDocumentId,
    currentDocumentName,
    documentList,
    pageSettingsStore,
    viewTrash,
    docDrawerVisible,
    t
  } = args

  // 轻量节流参数，避免短时间内重复加载列表
  let lastLoadDocumentListTs = 0
  const LOAD_LIST_THROTTLE_MS = 200

  // 文档列表刷新策略：下拉展开/窗口聚焦/跨标签广播时刷新
  const lastDocumentsFetchedAt = { value: 0 }

  const handleDocumentNameFallback = () => {
    const currentDoc = (documentList.value || []).find(
      (doc: any) => doc.id === currentDocumentId.value
    )
    if (currentDoc) {
      // 如果有文档记录但名称为空，显示未命名
      currentDocumentName.value = currentDoc.name || (t ? t('doc.untitled') : '未命名文档')
      console.log('使用文档列表中的名称:', currentDocumentName.value)
    } else {
      // 找不到文档记录时的兜底
      if (currentDocumentId.value && currentDocumentId.value !== 'test') {
        // 如果是新建文档（可能还没同步到列表），也显示未命名
        // 或者保留之前的 ID 截取逻辑作为最后防线，但优先尝试显示未命名
        // 用户反馈：新建文档显示为空 -> 未命名文档
        // 这里我们假设如果找不到，可能是新建的，暂且显示未命名文档，或者保留之前的 ID 逻辑？
        // 之前的逻辑是显示 "文档 ID..."，用户觉得不好。
        // 但如果真的是找不到的文档，显示 "文档 ID..." 可能更好定位问题。
        // 不过用户特别提到"新建文档"，新建文档通常 ID 也是存在的。
        // 让我们结合一下：
        currentDocumentName.value = t ? t('doc.untitled') : '未命名文档'
      } else {
        currentDocumentName.value = '测试文档'
      }
      console.log('使用生成的名称:', currentDocumentName.value)
    }
  }

  const updateCurrentDocumentName = async () => {
    try {
      const res = await presentationApi.getById(currentDocumentId.value)
      const payload = unwrapResponse<{ presentation: { title: string } }>(res)
      if ((payload?.code ?? 0) === 200 && payload?.data?.presentation) {
        // API 返回名称为空时，也显示未命名
        currentDocumentName.value = payload.data.presentation.title || (t ? t('doc.untitled') : '未命名文档')
        console.log('更新当前文档名称（API获取）:', currentDocumentName.value)
      } else {
        handleDocumentNameFallback()
      }
    } catch (error) {
      console.warn('获取文档信息失败，使用降级方案:', error)
      handleDocumentNameFallback()
    }
  }

  const loadCurrentDocumentPageSettings = async () => {
    try {
      const requestDocId = currentDocumentId.value
      console.log('加载文档页面设置, 文档ID:', requestDocId)
      if (pageSettingsStore) {
        await pageSettingsStore.loadDocumentSettings(requestDocId)
      }
      if (requestDocId !== currentDocumentId.value) {
        console.warn('页面设置返回但文档已切换，丢弃过期结果:', requestDocId, '->', currentDocumentId.value)
        return
      }
      console.log('✓ 页面设置加载完成')
    } catch (error) {
      console.error('❌ 加载页面设置失败:', error)
    }
  }

  const loadDocumentList = async (options: any = {}) => {
    const now = Date.now()
    if (now - lastLoadDocumentListTs < LOAD_LIST_THROTTLE_MS) {
      console.log('跳过本次文档列表加载（节流中）')
      return
    }
    lastLoadDocumentListTs = now
    try {
      // 默认 scope 为 'mine'，仅展示用户自己的文档
      const scope = options.scope || 'mine'
      console.log('正在加载文档列表... scope:', scope)
      const res = await presentationApi.getAll()
      const payload = unwrapResponse<{ presentations: any[] }>(res)
      console.log('文档列表响应:', payload)

      if ((payload?.code ?? 0) === 200) {
        // Note: Backend returns { presentations: [...] }
        documentList.value = Array.isArray(payload?.data?.presentations) ? payload.data.presentations : []
        console.log('文档列表加载成功:', documentList.value)

        if (!options.skipPageSettings) {
          console.log('加载当前文档的页面设置')
          loadCurrentDocumentPageSettings()
        } else {
          console.log('跳过页面设置加载(窗口focus触发)')
        }
      } else {
        console.error('加载文档列表失败:', payload?.message || '未知错误')
      }
    } catch (error) {
      console.error('加载文档列表失败:', error)
    }
  }

  const refreshDocumentsIfStale = async (force = false, options: any = {}) => {
    const now = Date.now()
    if (force || now - lastDocumentsFetchedAt.value > 5000) {
      if (!docDrawerVisible.value && !options.allowWhenDrawerClosed) return
      await loadDocumentList(options)
      lastDocumentsFetchedAt.value = now
    }
  }

  const updateCurrentDocumentMetaFromApi = async () => {
    try {
      const res = await presentationApi.getById(currentDocumentId.value)
      const payload = unwrapResponse<{ presentation: { title: string; pageSettings?: any } }>(res)
      if ((payload?.code ?? 0) === 200 && payload?.data?.presentation) {
        currentDocumentName.value = payload.data.presentation.title
      // 应用页面设置（不包含viewMode）
        const pageSettings = payload.data.presentation.pageSettings
        if (pageSettingsStore) {
          if (pageSettings) {
            pageSettingsStore.applySettings({
              orientation: pageSettings.orientation,
              pageSize: pageSettings.pageSize,
              width: pageSettings.width,
              height: pageSettings.height,
              margins: pageSettings.margins
            })
          } else {
            pageSettingsStore.resetToDefault()
          }

          pageSettingsStore.currentDocumentId = currentDocumentId.value
          pageSettingsStore.loadUISettings(currentDocumentId.value)
        }

        console.log('更新文档元信息完成（名称与页面设置）')
      } else {
        handleDocumentNameFallback()
        if (pageSettingsStore) {
          pageSettingsStore.resetToDefault()
          pageSettingsStore.loadUISettings(currentDocumentId.value)
        }
      }
    } catch (error) {
      console.warn('获取文档详情失败（名称+设置），使用降级方案:', error)
      handleDocumentNameFallback()
      if (pageSettingsStore) {
        pageSettingsStore.resetToDefault()
        pageSettingsStore.loadUISettings(currentDocumentId.value)
      }
    }
  }

  return {
    handleDocumentNameFallback,
    updateCurrentDocumentName,
    updateCurrentDocumentMetaFromApi,
    loadDocumentList,
    refreshDocumentsIfStale,
    loadCurrentDocumentPageSettings
  }
}

