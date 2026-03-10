import { request } from '@/utils/req'

// PPT/Presentation 相关接口（对应 server-slide 后端）
export const presentationApi = {
  // 获取所有演示文稿
  getAll: () => {
    return request.get('/api/presentations')
  },

  // 获取单个演示文稿
  getById: (id: string) => {
    return request.get(`/api/presentations/${id}`)
  },

  // 创建演示文稿
  create: (data: {
    title: string
    description?: string
    content?: any
    thumbnail?: string
    isPublic?: boolean
  }) => {
    return request.post('/api/presentations', data)
  },

  // 更新演示文稿
  update: (id: string, data: {
    title?: string
    description?: string
    content?: any
    thumbnail?: string
    isPublic?: boolean
  }) => {
    return request.put(`/api/presentations/${id}`, data)
  },

  // 删除演示文稿
  delete: (id: string) => {
    return request.delete(`/api/presentations/${id}`)
  },

  // 复制演示文稿
  duplicate: (id: string) => {
    return request.post(`/api/presentations/${id}/duplicate`)
  }
}
