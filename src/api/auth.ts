import { request } from '@/utils/req'

// 用户认证相关接口
export const authApi = {
  // 发送邮箱验证码
  sendVerificationCode: (data: {
    email: string
    username?: string
  }) => {
    return request.post('/api/auth/send-verification', data)
  },

  // 用户注册
  register: (data: {
    email: string
    password: string
    username?: string
    name?: string
    verificationCode?: string
  }) => {
    return request.post('/api/auth/register', data)
  },

  // 用户登录
  login: (data: {
    email: string
    password: string
  }) => {
    return request.post('/api/auth/login', data)
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return request.get('/api/auth/me')
  },

  // 退出登录（客户端清除 token）
  logout: () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('uid')
    localStorage.removeItem('username')
    localStorage.removeItem('userRole')
    return Promise.resolve()
  },

  // GitHub OAuth callback
  githubCallback: (data: {
    code: string
    state: string
  }) => {
    return request.post('/api/auth/github/callback', data)
  }
}
