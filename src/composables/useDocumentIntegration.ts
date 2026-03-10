import { ref, computed, type Ref } from 'vue'
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useDocumentOperations } from './useDocumentOperations'
import { useDocumentMeta } from './useDocumentMeta'
import { unwrapResponse } from '../api/response'
import { documentApi } from '../api/document'

export function useDocumentIntegration(
  documentTitle: Ref<string>,
  route: RouteLocationNormalizedLoaded,
  t: (key: string, params?: any) => string
) {
  const router = useRouter()

  // Document drawer state
  const docDrawerVisible = ref(false)
  const docDrawerLoading = ref(false)
  const documentList = ref<any[]>([])
  const docScope = ref('mine')
  const viewTrash = ref(false)
  const docStats = ref({ mine: 0, shared: 0, all: 0 })
  const createDocVisible = ref(false)
  const createDocLoading = ref(false)
  const createDocForm = ref({ name: '', type: 'slide' })

  // Use document meta composable
  const { loadDocumentList } = useDocumentMeta({
    currentDocumentId: computed(() => String(route.params.docId || '')),
    currentDocumentName: documentTitle,
    documentList,
    viewTrash,
    docDrawerVisible,
    t
  })

  const refreshDocStats = async () => {
    try {
      const res = await documentApi.getStats(viewTrash.value ? 'deleted' : 'active')
      const payload = unwrapResponse(res)
      if (payload.code === 200) {
        docStats.value = payload.data
      }
    } catch {
      // ignore
    }
  }

  // Use document operations composable
  const {
    handleRenameDocument,
    handleBatchDeleteDocuments,
    handleDeleteDocument,
    handleRestoreDocument,
    handlePermanentDeleteDocument,
    handleCreateDocument,
    handleCreateDocumentConfirm,
    handleCreateDocumentCancel
  } = useDocumentOperations({
    currentDocumentId: computed(() => String(route.params.docId || '')),
    currentDocumentName: documentTitle,
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
    t
  })

  const handleOpenDocDrawer = async () => {
    docDrawerVisible.value = true
    docDrawerLoading.value = true
    try {
      await loadDocumentList({ scope: docScope.value })
      await refreshDocStats()
    } finally {
      docDrawerLoading.value = false
    }
  }

  const handleSelectDocFromDrawer = (docId: string) => {
    docDrawerVisible.value = false
    const doc = documentList.value.find(d => d.id === docId)
    if (doc) {
      let path = `/${doc.id}`
      if (doc.type === 'sheet') {
        path = `/sheet/${doc.id}`
      } else if (doc.type === 'slide') {
        path = `/slide/${doc.id}`
      } else if (doc.type === 'mindmap') {
        path = `/mindmap/${doc.id}`
      }
      
      if (route.params.docId === docId && route.path.includes(doc.type || 'doc')) {
        window.location.reload()
        return
      }

      if (doc.type === 'slide') {
        router.push(path).then(() => {
          if (route.params.docId === docId) {
            window.location.reload()
          }
        })
      } else {
        window.open(router.resolve(path).href, '_blank')
      }
    }
  }

  const onChangeDocScope = async (v: string) => {
    docScope.value = v
    docDrawerLoading.value = true
    try {
      await loadDocumentList({ scope: v })
      await refreshDocStats()
    } finally {
      docDrawerLoading.value = false
    }
  }

  const toggleTrash = async () => {
    viewTrash.value = !viewTrash.value
    docDrawerLoading.value = true
    try {
      await loadDocumentList({ scope: docScope.value })
      await refreshDocStats()
    } finally {
      docDrawerLoading.value = false
    }
  }

  const handleTitleChange = async (newTitle: string) => {
    try {
      const docId = String(route.params.docId)
      const res = await documentApi.renameDocument(docId, newTitle)
      const payload = unwrapResponse(res)
      if (payload.code === 200) {
        documentTitle.value = newTitle
        if (documentList.value) {
          const targetDoc = documentList.value.find(doc => doc.id === docId)
          if (targetDoc) {
            targetDoc.name = newTitle
          }
        }
        Message.success(t('doc.renameSuccess'))
      } else {
        Message.error(payload.message || t('doc.renameFailed'))
      }
    } catch {
      Message.error(t('doc.renameFailed'))
    }
  }

  return {
    // State
    docDrawerVisible,
    docDrawerLoading,
    documentList,
    docScope,
    viewTrash,
    docStats,
    createDocVisible,
    createDocLoading,
    createDocForm,
    
    // Methods
    handleOpenDocDrawer,
    handleSelectDocFromDrawer,
    onChangeDocScope,
    toggleTrash,
    handleTitleChange,
    loadDocumentList,
    refreshDocStats,
    
    // Document operations
    handleRenameDocument,
    handleBatchDeleteDocuments,
    handleDeleteDocument,
    handleRestoreDocument,
    handlePermanentDeleteDocument,
    handleCreateDocument,
    handleCreateDocumentConfirm,
    handleCreateDocumentCancel
  }
}
