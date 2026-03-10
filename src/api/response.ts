// 统一接口响应类型（最小化定义），兼容 AxiosResponse 和已解包对象
export type ApiResponse<T = any> = {
  code?: number
  data?: T
  message?: string
}

// 统一从 AxiosResponse 或普通对象中拿到 payload
export function unwrapResponse<T = any>(res: any): ApiResponse<T> {
  // 情况A：已解包对象 { code, data, message }
  if (res && typeof res === 'object' && ('code' in res || 'message' in res)) {
    return res as ApiResponse<T>
  }
  // 情况B：AxiosResponse，且其 data 里是 { code, data, message }
  if (res && typeof res === 'object' && 'data' in res) {
    const inner = (res as any).data
    if (inner && typeof inner === 'object' && ('code' in inner || 'message' in inner)) {
      return inner as ApiResponse<T>
    }
    // 情况C：AxiosResponse，data 是 T 直接数据
    return { code: 200, data: inner } as ApiResponse<T>
  }
  // 兜底：未知结构，按成功且直接数据处理
  return { code: 200, data: res } as ApiResponse<T>
}