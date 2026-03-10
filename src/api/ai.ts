import { request } from '@/utils/req'
import { streamOpenAI, type ChatMessage } from '@/utils/ai/openaiStream'

export const aiApi = {
  // 获取试用次数统计
  getTrialStats: (uid?: string, role?: string) => {
    const headers: any = {}
    if (uid) headers['x-user-id'] = uid
    if (role) headers['x-user-role'] = role
    return request.get('/ai/trial/stats', { headers })
  },

  // 试用流式生成（SSE透传），封装统一基址与头部
  streamTrial: async (
    args: {
      model: string
      messages: ChatMessage[]
      temperature?: number
      headers?: Record<string, string>
      signal?: AbortSignal
    },
    onDelta: (chunk: string) => void
  ) => {
    const base = request.defaults.baseURL || ''
    const url = (base || '').replace(/\/$/, '') + '/ai/trial/stream'
    await streamOpenAI({
      url,
      apiKey: '',
      model: args.model,
      messages: args.messages,
      temperature: args.temperature,
      headers: args.headers,
      signal: args.signal,
    }, onDelta)
  },

  generateAliyunImage: (prompt: string) => {
    return request.post('/ai/image/aliyun', { prompt })
  },
}
