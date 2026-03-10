<template>
  <div class="deleted-wrap">
    <div class="deleted-card">
      <div class="art">
        <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#74a7ff" />
              <stop offset="1" stop-color="#165dff" />
            </linearGradient>
          </defs>
          <rect x="16" y="20" width="96" height="72" rx="10" fill="var(--deleted-muted-bg)" stroke="var(--deleted-stroke)" />
          <rect x="26" y="30" width="76" height="8" rx="4" fill="var(--deleted-muted-line)" />
          <rect x="26" y="46" width="64" height="8" rx="4" fill="var(--deleted-muted-line)" />
          <rect x="26" y="62" width="56" height="8" rx="4" fill="var(--deleted-muted-line)" />
          <g transform="translate(100,44)">
            <circle cx="28" cy="28" r="28" fill="var(--deleted-muted-bg)" stroke="var(--deleted-stroke)" />
            <path d="M16 20 L40 44 M40 20 L16 44" stroke="url(#g1)" stroke-width="5" stroke-linecap="round" />
          </g>
          <g transform="translate(26,30)" opacity="0.96">
            <rect class="collab-caret" x="8" y="0" width="2.2" height="8" rx="1" fill="var(--deleted-accent-2)" />
            <circle class="typing-dot" cx="14" cy="4" r="1.6" fill="var(--deleted-accent)" />
            <circle class="typing-dot typing-2" cx="17" cy="4" r="1.6" fill="var(--deleted-accent)" />
            <circle class="typing-dot typing-3" cx="20" cy="4" r="1.6" fill="var(--deleted-accent)" />
            <circle class="collab-dot" cx="28" cy="4" r="4" fill="var(--deleted-avatar-dot)" />
            <circle class="collab-ping" cx="28" cy="4" r="6" fill="none" stroke="var(--deleted-avatar-dot)" stroke-width="1.5" />
            <rect class="collab-avatar-chip a1" x="0" y="-22" width="8" height="8" rx="4" fill="var(--deleted-avatar-1)" />
            <rect class="collab-avatar-chip a2" x="9" y="-22" width="8" height="8" rx="4" fill="var(--deleted-avatar-2)" />
            <rect class="collab-avatar-chip a3" x="18" y="-22" width="8" height="8" rx="4" fill="var(--deleted-avatar-3)" />
          </g>
          <g transform="translate(52,6)">
            <rect x="0" y="0" width="56" height="10" rx="5" fill="#165dff" opacity="0.9" />
            <circle cx="-22" cy="5" r="2" fill="var(--deleted-muted-line)" opacity="0.9" />
            <circle cx="-14" cy="5" r="2" fill="var(--deleted-muted-line)" opacity="0.6" />
            <circle cx="-6" cy="5" r="2" fill="var(--deleted-muted-line)" opacity="0.35" />
          </g>
        </svg>
      </div>
      <div class="title">文档已移除</div>
      <div class="brand-sub" :class="{ clickable: !hasDocs }" @click="handleBrandClick">{{ brandSub }}</div>
      <div class="desc">该链接指向的文档已删除或无权限访问</div>
      <div class="actions">
        <a-button type="primary" long @click="goHome">返回首页</a-button>
        <a-button v-if="!isUserLoggedIn" long @click="goLogin">登录账号</a-button>
        <a-button v-else long @click="handleCopyLink">复制链接</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { documentApi } from '@/api/document'
import { unwrapResponse } from '@/api/response'
import { Message } from '@arco-design/web-vue'
const router = useRouter()
const hasDocs = ref(true)
const brandSub = ref('欢迎使用 Jitword · 在线协作文档')

// 检查用户是否已登录
const isUserLoggedIn = computed(() => {
  const token = localStorage.getItem('jwt_token')
  const uid = localStorage.getItem('uid')
  return !!(token && uid)
})
const initBrand = async () => {
  try {
    const res = await documentApi.getDocuments({ filter: 'active' })
    const payload = unwrapResponse(res)
    const list = Array.isArray(payload?.data) ? payload.data : []
    hasDocs.value = list.length > 0
    if (!hasDocs.value) brandSub.value = '试试创建一篇新文档开始协作'
  } catch {
    hasDocs.value = false
    brandSub.value = '试试创建一篇新文档开始协作'
  }
}
onMounted(initBrand)
const goHome = async () => {
  try {
    // 1. 先尝试获取用户自己的文档
    const res = await documentApi.getDocuments({ filter: 'active', scope: 'mine' })
    const payload = unwrapResponse(res)
    const myDocs = Array.isArray(payload?.data) ? payload.data : []

    if (myDocs.length > 0) {
      // 有自己的文档，跳转到第一个
      router.replace(`/${myDocs[0].id}`)
      return
    }

    // 2. 没有自己的文档，尝试获取公共文档
    try {
      const sharedRes = await documentApi.getDocuments({ filter: 'active', scope: 'shared' })
      const sharedPayload = unwrapResponse(sharedRes)
      const sharedDocs = Array.isArray(sharedPayload?.data) ? sharedPayload.data : []

      if (sharedDocs.length > 0) {
        // 有公共文档，跳转到第一个
        router.replace(`/${sharedDocs[0].id}`)
        return
      }
    } catch (err) {
      console.warn('获取公共文档失败:', err)
    }

    // 3. 既没有自己的文档，也没有公共文档，创建新文档
    try {
      const created = unwrapResponse(await documentApi.createDocument('未命名文档'))
      const id = created?.data?.id
      if (id) {
        router.replace(`/${id}`)
        return
      }
    } catch (err) {
      console.error('创建文档失败:', err)
    }

    // 4. 所有尝试都失败，跳转到登录页
    router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
  } catch (err) {
    console.error('获取文档列表失败:', err)
    // 尝试创建新文档
    try {
      const created = unwrapResponse(await documentApi.createDocument('未命名文档'))
      const id = created?.data?.id
      if (id) {
        router.replace(`/${id}`)
        return
      }
    } catch {}
    router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
  }
}
const goLogin = () => {
  router.push({ name: 'Login', query: { force: '1', redirect: '/' } })
}
const handleCopyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    Message.success('链接已复制到剪贴板')
  } catch {
    Message.error('复制链接失败')
  }
}
const handleBrandClick = async () => {
  if (hasDocs.value) return
  try {
    const created = unwrapResponse(await documentApi.createDocument('未命名文档'))
    const id = created?.data?.id
    if (id) router.replace(`/${id}`)
  } catch {}
}
</script>

<style scoped>
.deleted-wrap { --deleted-bg:#f6f7fb; --deleted-card:#ffffff; --deleted-text:#1f1f1f; --deleted-desc:#4b4b4b; --deleted-muted-bg:#f5f7ff; --deleted-muted-line:#e9eeff; --deleted-stroke:#d8e0ff; --deleted-accent:#165dff; --deleted-accent-2:#74a7ff; --deleted-avatar-dot:#3b82f6; --deleted-avatar-1:#e6f0ff; --deleted-avatar-2:#f0f7ff; --deleted-avatar-3:#eaf3ff; --caret-distance:38px; background:var(--deleted-bg); min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; }
.deleted-card { width:min(520px, 92vw); border-radius:16px; background:var(--deleted-card); box-shadow:0 8px 28px rgba(22,93,255,0.08); padding:28px 24px; display:flex; flex-direction:column; align-items:center; gap:16px; }
.art { width:160px; height:120px; }
.title { font-size:20px; font-weight:700; color:var(--deleted-text); }
.brand-sub { font-size:12px; color:var(--deleted-desc); opacity:.9; text-align:center; margin-top:4px; letter-spacing:.2px; }
.brand-sub.clickable { color:var(--deleted-accent); cursor:pointer; }
.brand-sub.clickable:hover { opacity:1; }
.desc { font-size:14px; color:var(--deleted-desc); }
.actions { display:flex; gap:12px; width:100%; justify-content:center; margin-top:6px; }
.actions :deep(.arco-btn) { min-width:140px; height:40px; border-radius:999px; }
@media (prefers-color-scheme: dark) { .deleted-wrap{ --deleted-bg:#0b1020; --deleted-card:#0f172a; --deleted-text:#e5e7eb; --deleted-desc:#9ca3af; --deleted-muted-bg:#111827; --deleted-muted-line:#1f2937; --deleted-stroke:#334155; --deleted-accent:#4f7cff; --deleted-accent-2:#7aa2ff; --deleted-avatar-1:#172033; --deleted-avatar-2:#121a2b; --deleted-avatar-3:#14203a; --deleted-avatar-dot:#83b3ff; --deleted-link:#4a6bb3; } .deleted-card{ box-shadow:0 10px 30px rgba(79,124,255,0.18); } }

.collab-caret { transform-origin: left; animation: caretMove 3.6s cubic-bezier(.37,.0,.25,1) infinite; will-change: transform, opacity; }
.collab-dot { transform-origin: center; animation: pulse 2.8s ease-in-out infinite; will-change: transform, opacity; }
.collab-ping { transform-origin: center; animation: pingWave 3.6s ease-out infinite; opacity: 0.6; }
.typing-dot { animation: typing 1.6s ease-in-out infinite; opacity: 0.85; }
.typing-2 { animation-delay: .2s; }
.typing-3 { animation-delay: .4s; }
.collab-avatar-chip { animation: bounceUp 3.2s ease-in-out infinite; will-change: transform; }
.a1 { animation-delay: 0s; }
.a2 { animation-delay: .18s; }
.a3 { animation-delay: .36s; }

@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
@keyframes floatX { 0%,100% { transform: translateX(0); } 50% { transform: translateX(1.5px); } }
@keyframes pulse { 0%,100% { opacity: 0.95; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.96); } }
@keyframes caretMove { 0% { transform: translateX(0); opacity: .95 } 30% { transform: translateX(var(--caret-distance)); opacity: .95 } 45% { opacity: .35 } 60% { opacity: .95 } 100% { transform: translateX(0); opacity: .95 } }
 
@keyframes typing { 0%, 100% { transform: translateY(0) scale(1); opacity: .85 } 50% { transform: translateY(-1px) scale(.92); opacity: .45 } }
@keyframes pingWave { 0% { transform: scale(.9); opacity: .6 } 50% { transform: scale(1.2); opacity: .2 } 100% { transform: scale(.9); opacity: .6 }}
@keyframes bounceUp { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-2px) } }

@media (prefers-reduced-motion: reduce) {
  .collab-triangle, .collab-rect, .collab-avatar-1, .collab-avatar-2, .collab-dot, .collab-link { animation: none; }
}
@media (max-width: 768px) { .deleted-card { width:94vw; padding:22px 18px; } .title{ font-size:18px;} .desc{ font-size:13px;} }
</style>