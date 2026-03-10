import { request } from '@/utils/req'

// 版本管理API接口 - 使用新的 presentation 接口
export const versionApi = {
  // 获取文档版本列表
  getVersions: (docId: string, page = 1, limit = 20) => {
    return request.get(`/api/presentations/${docId}/versions`, {
      params: { page, limit }
    })
  },

  // 创建新版本
  createVersion: (docId: string, data: {
    content: any
    title?: string
    description?: string
    isAutoSave?: boolean
    author?: string
  }) => {
    return request.post(`/api/presentations/${docId}/versions`, data)
  },

  // 获取指定版本详情
  getVersion: (docId: string, versionId: string) => {
    return request.get(`/api/presentations/${docId}/versions/${versionId}`)
  },

  // 删除版本
  deleteVersion: (docId: string, versionId: string) => {
    return request.delete(`/api/presentations/${docId}/versions/${versionId}`)
  },

  // 更新版本信息
  updateVersion: (docId: string, versionId: string, data: {
    title?: string
    description?: string
  }) => {
    return request.put(`/api/presentations/${docId}/versions/${versionId}`, data)
  },

  // 版本对比 - 暂未支持
  compareVersions: (docId: string, versionId1: string, versionId2: string) => {
    return request.get(`/api/presentations/${docId}/versions/${versionId1}/compare/${versionId2}`)
  }
}

// 版本数据类型定义
export interface Version {
  id: string
  documentId: string
  content: any
  title: string
  description: string
  isAutoSave: boolean
  createdAt: string
  updatedAt: string
  size: number
  author: string
}

export interface VersionListResponse {
  versions: Version[]
  total: number
  page: number
  limit: number
}