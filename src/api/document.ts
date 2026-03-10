import { request } from '@/utils/req'

// 文档权限类型：edit（公开可编辑）、read（公开只读）、private（私有）
export type PublicPermission = 'edit' | 'read' | 'private'

type GetDocumentCacheEntry = {
  promise?: Promise<any>
  value?: any
  expiresAt?: number
}

const getDocumentCache = new Map<string, GetDocumentCacheEntry>()
const DEFAULT_GET_DOCUMENT_CACHE_TTL_MS = 3000

const invalidateGetDocumentCache = (id?: string) => {
  if (!id) {
    getDocumentCache.clear()
    return
  }
  getDocumentCache.delete(String(id))
}

// 用户权限信息（随文档信息返回）
export interface UserPermission {
  canAccess: boolean
  canEdit: boolean
  canComment: boolean
  isOwner?: boolean
  isAdmin?: boolean
}

// 文档信息接口
export interface DocumentInfo {
  id: string
  name: string
  type?: 'doc' | 'sheet' // 文档类型：doc=文档，sheet=表格
  ownerId?: string
  ownerName?: string
  publicPermission?: PublicPermission
  // 协同开关：true=允许多人实时协作；false=单编辑连接（用于超大文档/手动关闭）
  collaborationEnabled?: boolean
  createdAt: string
  updatedAt: string
  isDeleted?: boolean
  deletedAt?: string | null
  pageSettings?: any
  _userPermission?: UserPermission  // 当前用户对该文档的权限
}

// 文档API接口
export const documentApi = {
  // 获取文档列表（新参数 filter=active|deleted|all，默认active）
  getDocuments: (options?: { filter?: 'active' | 'deleted' | 'all', deleted?: '0' | '1' | 'all', scope?: 'mine' | 'shared' | 'all' }) => {
    const params: any = {}
    // 优先使用新参数
    if (options && options.filter) {
      params.filter = options.filter
    } else if (options && options.deleted) {
      // 兼容旧调用：deleted=0|1|all -> 映射到 filter
      params.filter = options.deleted === '1' ? 'deleted' : options.deleted === 'all' ? 'all' : 'active'
    }
    if (options && options.scope) params.scope = options.scope
    return request.get('/documents', { params })
  },
  getStats: (filter: 'active' | 'deleted' | 'all' = 'active') => {
    return request.get('/documents/stats', { params: { filter } })
  },

  // 获取单个文档信息
  getDocument: (id: string, options?: { force?: boolean; ttlMs?: number }) => {
    const cacheKey = String(id)
    const ttlMs = options?.ttlMs ?? DEFAULT_GET_DOCUMENT_CACHE_TTL_MS

    if (!options?.force) {
      const hit = getDocumentCache.get(cacheKey)
      const now = Date.now()

      if (hit?.value && (hit.expiresAt ?? 0) > now) {
        return Promise.resolve(hit.value)
      }
      if (hit?.promise) return hit.promise
    }

    const promise = request
      .get(`/documents/${id}`)
      .then((res: any) => {
        getDocumentCache.set(cacheKey, {
          value: res,
          expiresAt: Date.now() + ttlMs
        })
        return res
      })
      .catch((err: any) => {
        getDocumentCache.delete(cacheKey)
        throw err
      })

    getDocumentCache.set(cacheKey, { promise })
    return promise
  },

  // 创建新文档
  createDocument: (name: string, type: string = 'doc') => {
    return request.post('/documents', { name, type })
  },
  
  // 保存 Excel 数据（快照）
  saveSheet: (id: string, snapshot: any) => {
    return request.put(`/documents/${id}/sheet`, { snapshot }) as Promise<any>
  },

  // 获取 Excel 数据（快照）
  getSheet: (id: string) => {
    return request.get(`/documents/${id}/sheet`) as Promise<any>
  },

  // 保存思维导图数据
  saveMindmap: (id: string, content: any) => {
    return request.put(`/documents/${id}/mindmap`, { content }) as Promise<any>
  },

  // 获取思维导图数据
  getMindmap: (id: string) => {
    return request.get(`/documents/${id}/mindmap`) as Promise<any>
  },

  // 保存幻灯片数据
  saveSlide: (id: string, content: string) => {
    return request.put(`/documents/${id}/slide`, { content }) as Promise<any>
  },

  // 获取幻灯片数据
  getSlide: (id: string) => {
    return request.get(`/documents/${id}/slide`) as Promise<any>
  },

  // 删除文档
  deleteDocument: (id: string) => {
    invalidateGetDocumentCache(id)
    return request.delete(`/documents/${id}`)
  },

  // 恢复文档（从回收站）
  restoreDocument: (id: string) => {
    invalidateGetDocumentCache(id)
    return request.put(`/documents/${id}/restore`)
  },

  // 永久删除（仅在回收站使用）
  permanentDelete: (id: string) => {
    invalidateGetDocumentCache(id)
    return request.delete(`/documents/${id}/permanent`)
  },

  // 重命名文档
  renameDocument: (id: string, name: string) => {
    invalidateGetDocumentCache(id)
    return request.put(`/documents/${id}`, { name })
  },

  // 更新文档页面设置
  updatePageSettings: (id: string, pageSettings: any) => {
    invalidateGetDocumentCache(id)
    return request.put(`/documents/${id}/page-settings`, { pageSettings })
  },

  // 更新文档协同开关
  updateCollaboration: (id: string, enabled: boolean) => {
    invalidateGetDocumentCache(id)
    return request.put(`/documents/${id}/collaboration`, { enabled })
  },

  // 批量删除文档
  batchDeleteDocuments: (ids: string[]) => {
    for (const id of ids) invalidateGetDocumentCache(id)
    return request.post('/documents/batch-delete', { ids })
  }
  ,
  // 更新文档公开权限（edit/read/private）
  updatePermission: (id: string, publicPermission: PublicPermission) => {
    invalidateGetDocumentCache(id)
    return request.put(`/documents/${id}/permission`, { publicPermission })
  },

  invalidateDocumentCache: (id?: string) => {
    invalidateGetDocumentCache(id)
  },
}
