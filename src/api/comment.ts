import { request } from '@/utils/req'

export interface CreateCommentDto {
  id: string
  documentId: string
  content: string
  targetText?: string
}

export interface UpdateCommentDto {
  documentId: string
  content: string
}

export interface Comment {
  id: string
  documentId: string
  content: string
  authorId: string
  authorName: string
  authorColor: string
  targetText: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

// 评论API接口
export const commentApi = {
  // 创建评论
  createComment: (data: CreateCommentDto) => {
    return request.post<Comment>('/comments', data)
  },

  // 获取文档的所有评论
  getComments: (documentId: string) => {
    return request.get<Comment[]>('/comments', { params: { documentId } })
  },

  // 更新评论
  updateComment: (id: string, data: UpdateCommentDto) => {
    return request.put<Comment>(`/comments/${id}`, data)
  },

  // 删除评论
  deleteComment: (id: string, documentId: string) => {
    return request.delete(`/comments/${id}`, { params: { documentId } })
  }
}

