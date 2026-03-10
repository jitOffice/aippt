<template>
  <div class="home-redirect" role="status" aria-live="polite">
    <a-spin :loading="true" tip="正在为您打开文档..." />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { presentationApi } from '@/api/presentation'
import { unwrapResponse } from '@/api/response'

const router = useRouter()

// 判断是否为 Demo（本地 guest）模式：uid 存在但没有 jwt_token
const isDemoMode = () => {
  const uid = localStorage.getItem('uid')
  const token = localStorage.getItem('jwt_token')
  return !!uid && !token
}

// Demo 模式下直接进入临时空白编辑器（使用固定 demo doc id）
const enterDemoEditor = () => {
  router.replace({ name: 'Slide', params: { docId: 'demo' } })
}

let redirectTimeout

onMounted(async () => {
  // Demo 模式：跳过所有 API 调用，直接进编辑器
  if (isDemoMode()) {
    enterDemoEditor()
    return
  }

  try {
    // Set a timeout to redirect to login if all operations take too long
    redirectTimeout = setTimeout(() => {
      console.warn('Home redirect timed out, redirecting to login')
      router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
    }, 5000) // 5 seconds timeout

    // 1. 先尝试获取用户的 PPT 文档列表
    console.log('Attempting to fetch user presentations...')
    const res = await presentationApi.getAll()
    console.log('User presentations response:', res)
    const payload = unwrapResponse(res)
    
    // 后端返回格式：{ code: 200, data: { presentations: [...], pagination: {...} } }
    const presentations = payload?.data?.presentations || []
    console.log('Number of presentations found:', presentations.length)

    if (presentations.length > 0) {
      // Clear timeout since we're redirecting
      clearTimeout(redirectTimeout)
      // 有文档，跳转到第一个 PPT
      const doc = presentations[0]
      console.log('Redirecting to presentation:', doc.id)
      router.replace({ name: 'Slide', params: { docId: doc.id } })
      return
    }

    // 2. 用户没有文档，创建新文档
    try {
      console.log('Attempting to create a new presentation...')
      const created = unwrapResponse(await presentationApi.create({
        title: '未命名演示文稿',
        description: '',
        isPublic: false
      }))
      console.log('Presentation creation response:', created)
      
      // 后端返回格式：{ code: 201, data: { presentation: {...} } }
      const id = created?.data?.presentation?.id
      if (id) {
        // Clear timeout since we're redirecting
        clearTimeout(redirectTimeout)
        console.log('Redirecting to new presentation:', id)
        router.replace({ name: 'Slide', params: { docId: id } })
        return
      } else {
        console.warn('Presentation created but no ID returned:', created)
      }
    } catch (err) {
      console.error('创建文档失败:', err)
      console.error('Error details:', err?.response || err?.message || err)
    }

    // 3. 所有尝试都失败，跳转到登录页
    clearTimeout(redirectTimeout)
    router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
  } catch (err) {
    console.error('获取文档列表失败:', err)
    // Clear timeout before redirecting
    clearTimeout(redirectTimeout)
    
    // 尝试创建新文档
    try {
      console.log('Attempting to create a new presentation in fallback...')
      const created = unwrapResponse(await presentationApi.create({
        title: '未命名演示文稿',
        description: '',
        isPublic: false
      }))
      console.log('Fallback presentation creation response:', created)
      const id = created?.data?.presentation?.id
      if (id) {
        console.log('Redirecting to new presentation in fallback:', id)
        router.replace({ name: 'Slide', params: { docId: id } })
        return
      }
    } catch (fallbackErr) {
      console.error('Fallback presentation creation failed:', fallbackErr)
    }
    router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
  }
})

// Define cleanup function
const cleanupTimeout = () => {
  if (redirectTimeout) {
    clearTimeout(redirectTimeout)
    redirectTimeout = null
  }
}

// Clean up timeout when component is unmounted
onUnmounted(() => {
  cleanupTimeout()
})

// Also add a window-level cleanup
window.addEventListener('beforeunload', () => {
  cleanupTimeout()
})
</script>

<style scoped>
.home-redirect { min-height: 60vh; display:flex; align-items:center; justify-content:center; }
</style>