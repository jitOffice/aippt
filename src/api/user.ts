import { request } from '@/utils/req'

export const userApi = {
  register: (username: string, password: string) => {
    return request.post('/user/register', { username, password })
  },
  login: (username: string, password: string) => {
    return request.post('/user/login', { username, password })
  },
  adminList: () => {
    return request.get('/admin/users')
  }
}

export type UserInfo = { id: string; username: string; role: string; token: string }