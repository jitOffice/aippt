import { request } from '@/utils/req'

/**
 * Template API
 * 模板相关 API
 */
export const templateApi = {
  /**
   * 获取模板列表
   * @param options 查询选项
   */
  getTemplates: (options?: {
    category?: string
    source?: string
    page?: number
    pageSize?: number
  }) => {
    const params: any = {}
    if (options?.category) params.category = options.category
    if (options?.source) params.source = options.source
    if (options?.page) params.page = options.page
    if (options?.pageSize) params.pageSize = options.pageSize
    
    return request.get('/api/templates', { params })
  },

  /**
   * 获取单个模板详情
   * @param id 模板 ID
   */
  getTemplate: (id: string) => {
    return request.get(`/api/templates/${id}`)
  },
}
