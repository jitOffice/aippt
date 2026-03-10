import axios from "axios"
import { Message } from "@arco-design/web-vue"

interface HTTP_RESPONSE {
    success: 1 | 0
    data: any
    msg: string
}

function resolveBaseApiUrl() {
    try {
        const g: any = (globalThis as any)
        const fromGlobal = g && g.__PX_BASE_API_URL__
        const fromLS = typeof localStorage !== 'undefined' ? localStorage.getItem('px_base_api_url') : null
        const apiUrl = fromGlobal || fromLS || process.env.BASE_API_URL
        
        // 开发环境：如果 apiUrl 包含 localhost，返回空字符串让 Vite 代理处理
        if (apiUrl && apiUrl.includes('localhost')) {
            return ''
        }
        
        return apiUrl
    } catch {
        return process.env.BASE_API_URL
    }
}

const instance = axios.create({
    baseURL: resolveBaseApiUrl(),
    timeout: 60000,
})

instance.interceptors.request.use(
  function (config: any) {
    config.baseURL = resolveBaseApiUrl()
    config.headers = {
      ...(config.headers || {}),
      // 空字符串让后端使用默认的 /public/uploads 目录
      'x-requested-with': '',
      ...(localStorage.getItem('jwt_token') ? { 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}` } : {}),
    }
    return config
  },
    function (error) {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    function (response) {
        return response.data
    },
    function (error) {
        console.error('API请求错误:', error)

        if (error && error.response) {
            const { status, data } = error.response
            const reqUrl = String(error?.config?.url || '')
            const isAuthEndpoint = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register')
            console.error(`HTTP ${status}:`, data)

            switch (status) {
                case 400:
                    if (!isAuthEndpoint) Message.error(data.message || '请求参数错误')
                    break
                case 401:
                    // 401 = 身份验证失败（token 过期、无效、缺失等），需要重新登录
                    if (!isAuthEndpoint) {
                        // Demo 模式（无 token 的本地 guest）不强制跳转登录
                        const isDemoMode = !!localStorage.getItem('uid') && !localStorage.getItem('jwt_token')
                        if (isDemoMode) break

                        // 清除所有用户相关信息
                        try {
                            localStorage.removeItem('jwt_token')
                            localStorage.removeItem('uid')
                            localStorage.removeItem('username')
                            localStorage.removeItem('userRole')
                            localStorage.removeItem('userColor')
                        } catch {}

                        const redirect = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)
                        Message.error('登录已过期，请重新登录')
                        setTimeout(() => {
                            window.location.href = `${import.meta.env.BASE_URL}login?force=1&redirect=` + redirect
                        }, 500)
                    }
                    break
                case 403:
                    break
                case 404:
                    break
                case 429:
                    if (!isAuthEndpoint) Message.error(data?.message || '请求过于频繁')
                    break
                case 500:
                case 503:
                    break
                case 501:
                    window && (location.href = `${import.meta.env.BASE_URL}login`)
                    break
                default:
                    if (!isAuthEndpoint) Message.error(`请求失败 (${status})`)
            }
        } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
            Message.error('网络连接失败，请检查网络设置')
        } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            Message.error('请求超时，请稍后重试')
        } else {
            Message.error('请求失败：' + (error.message || '未知错误'))
        }

        return Promise.reject(error)
    }
)

export const request = instance
export default instance

