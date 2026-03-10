<template>
  <div class="home-container">
    <!-- Left Sidebar -->
    <aside class="sidebar">
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <Icon name="sidebar-magic-wand" :size="20" />
          </div>
          <span class="logo-text">{{ t('slide.home.appTitle') }}</span>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <a href="#" class="nav-item active">
          <Icon name="layers" :size="20" />
          <span>{{ t('slide.home.aiPpt') }}</span>
        </a>
        <a href="#" class="nav-item text-slate-600" style='margin-left:24px'>
          <span>{{ t('slide.home.themeTemplate') }}</span>
        </a>
        <a href="#" class="nav-item">
          <Icon name="folder" :size="20" />
          <span>{{ t('slide.home.fileLibrary') }}</span>
        </a>
        <a href="https://jitword.com" target="_blank" rel="noopener" class="nav-item">
          <Icon name="document-text" :size="20" />
          <span>{{ t('slide.home.aiOffice') }}</span>
        </a>
        <a href="https://pxcharts.turntip.cn" target="_blank" rel="noopener" class="nav-item">
          <Icon name="table" :size="20" />
          <span>{{ t('slide.home.aiTable') }}</span>
        </a>

        <div class="nav-divider"></div>

        <a href="https://dooring.vip" target="_blank" rel="noopener" class="nav-item">
          <Icon name="ticket" :size="20" />
          <span>Dooring 零代码平台</span>
        </a>
        <a href="#" class="nav-item" @click.prevent="showEnterpriseQrcode = true">
          <Icon name="briefcase" :size="20" />
          <span>{{ t('slide.home.enterpriseSolution') }}</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="sidebar-footer">
        <div class="powered-by">
          {{ t('slide.home.poweredBy') }} <span class="brand">{{ t('slide.home.brandName') }}</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <h1 class="page-title">{{ t('slide.home.workspace') }}</h1>
        </div>
        <div class="header-right">
          <button class="upgrade-button">
            <Icon name="star" :size="16" />
            <span>{{ t('slide.home.upgradeVip') }}</span>
          </button>
          <a
            href="https://github.com/MrXujiang/aippt"
            target="_blank"
            rel="noopener"
            class="github-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span v-if="githubStars" class="github-stars">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="margin-right:2px">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {{ githubStars }}
            </span>
          </a>
          <div class="user-section">
            <a-dropdown trigger="click" @select="handleUserMenuSelect">
              <div class="user-avatar-wrapper">
                <div class="user-avatar">
                  <Icon name="user" :size="20" />
                </div>
                <div class="user-info">
                  <span class="user-name">{{ username || t('slide.home.demoUser') }}</span>
                  <span class="vip-badge">{{ t('slide.home.vipBadge') }}</span>
                </div>
              </div>
              <template #content>
                <a-doption value="logout">
                  <template #icon>
                    <Icon name="logout" :size="16" />
                  </template>
                  {{ t('common.logout') }}
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="content-area">
        <!-- Quick Actions Section -->
        <section class="section">
          <div class="section-header">
            <div class="section-icon">
              <Icon name="layers" :size="24" />
            </div>
            <h2 class="section-title">{{ t('slide.home.aiPpt') }}</h2>
          </div>

          <div class="quick-actions-grid">
            <!-- AI Create PPT -->
            <div class="action-card primary" @click="createNewAiPpt">
              <div class="card-decoration"></div>
              <div class="card-content">
                <div class="card-icon primary-icon">
                  <Icon name="home-magic-wand" :size="28" />
                </div>
                <div class="card-header">
                  <h3 class="card-title">{{ t('slide.home.aiCreatePpt') }}</h3>
                  <span class="ai-badge">AI</span>
                </div>
                <p class="card-description">{{ t('slide.home.aiCreatePptDesc') }}</p>
                <div class="card-action">
                  <span>{{ t('slide.home.createNow') }}</span>
                  <Icon name="arrow-right" :size="16" />
                </div>
              </div>
            </div>

            <!-- Import Document -->
            <div class="action-card secondary">
              <div class="card-decoration secondary-deco"></div>
              <div class="card-content">
                <div class="card-icon secondary-icon">
                  <Icon name="document-add" :size="28" />
                </div>
                <div class="card-header">
                  <h3 class="card-title">{{ t('slide.home.importDocument') }}</h3>
                  <span class="ai-badge secondary-badge">AI</span>
                </div>
                <p class="card-description">{{ t('slide.home.importDocumentDesc') }}</p>
                <div class="card-action secondary-action">
                  <span>{{ t('slide.home.selectFile') }}</span>
                  <Icon name="arrow-down" :size="16" />
                </div>
              </div>
            </div>

            <!-- New Blank Presentation -->
            <div class="action-card tertiary" @click="createNewPpt" style="cursor:pointer">
              <div class="card-icon tertiary-icon">
                <Icon name="document" :size="28" />
              </div>
              <div class="card-header">
                <Icon name="unlock" :size="18" class="unlock-icon" />
                <h3 class="card-title">{{ t('slide.home.uploadWork') }}</h3>
              </div>
              <p class="card-description">{{ t('slide.home.uploadWorkDesc') }}</p>
            </div>
          </div>
        </section>

        <!-- My Works Section -->
        <section class="section">
          <div class="works-header">
            <h2 class="section-title">{{ t('slide.home.myWorks') }}</h2>
            <div class="works-controls">
              <div class="search-box">
                <Icon name="search" :size="16" class="search-icon" />
                <input type="text" :placeholder="t('slide.home.searchMyWorks')" v-model="searchQuery" />
              </div>
              <div class="sort-dropdown">
                <span>{{ t('slide.home.viewTime') }}</span>
                <Icon name="arrow-down-mini" :size="12" />
              </div>
              <div class="view-toggle">
                <button class="view-button active">
                  <Icon name="grid" :size="16" />
                </button>
                <button class="view-button">
                  <Icon name="list" :size="16" />
                </button>
              </div>
            </div>
          </div>

          <!-- Works Grid -->
          <div v-if="loading" class="loading-state">
            <Icon name="loading" :size="32" />
            <p>{{ t('common.loading') }}</p>
          </div>
          <div v-else-if="works.length === 0" class="no-works-state">
            <div class="empty-icon">
              <Icon name="folder-open" :size="48" />
            </div>
            <p class="empty-text">{{ t('slide.home.noWorks') }}</p>
            <button class="create-first-button" @click="createNewPpt">
              <Icon name="add-circle" :size="20" />
              <span>{{ t('slide.home.createFirstWork') }}</span>
            </button>
          </div>
          <div v-else class="works-grid">
            <!-- Work Item -->
            <div v-for="work in works" :key="work.id" class="work-item" @click="openWork(work.id)">
              <div class="work-thumbnail">
                <div class="thumbnail-content">
                  <div class="thumbnail-subtitle">{{ work.subtitle }}</div>
                  <div class="thumbnail-title">{{ work.title }}</div>
                </div>
                <div class="work-overlay"></div>
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ work.name }}</h3>
                <div class="work-meta">
                  <span class="work-time">{{ work.time }}</span>
                  <button class="work-menu-button">
                    <Icon name="menu-dots" :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div class="work-item empty-state" @click="createNewPpt">
              <div class="empty-icon">
                <Icon name="add-circle" :size="48" />
              </div>
              <p class="empty-text">{{ t('slide.home.createNewWork') }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- Enterprise QR Code Modal -->
  <div v-if="showEnterpriseQrcode" class="qrcode-modal-overlay" @click.self="showEnterpriseQrcode = false">
    <div class="qrcode-modal">
      <button class="qrcode-close" @click="showEnterpriseQrcode = false">×</button>
      <h3 class="qrcode-title">企业解决方案</h3>
      <p class="qrcode-desc">扫码添加商务导贵，了解定制化方案</p>
      <img
        src="https://flowmix.turntip.cn/fm/static/my.8ee63da4.png"
        alt="企业微信二维码"
        class="qrcode-img"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IIcon from '@/utils/slide/icon.js'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { presentationApi } from '@/api/presentation'
import { unwrapResponse } from '@/api/response'


const Icon = IIcon
const router = useRouter()
const searchQuery = ref('')
const username = ref('')
const loading = ref(false)
const githubStars = ref('')
const showEnterpriseQrcode = ref(false)

// 获取 GitHub Star 数
const fetchGithubStars = async () => {
  try {
    const res = await fetch('https://api.github.com/repos/MrXujiang/aippt')
    if (res.ok) {
      const data = await res.json()
      const count = data.stargazers_count || 0
      githubStars.value = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : String(count)
    }
  } catch {
    // 网络失败不显示数字
  }
}

// Use Vue I18n's useI18n composable (same as slide-page.vue)
const { t } = useI18n()
const works = ref([])

// Fetch user's presentations
const fetchPresentations = async () => {
  try {
    loading.value = true
    const res = await presentationApi.getAll()
    const payload = unwrapResponse(res)
    
    if (payload?.data?.presentations && Array.isArray(payload.data.presentations)) {
      const presentations = payload.data.presentations
      
      // Transform API data to match works structure
      works.value = presentations.map(p => ({
        id: p.id,
        name: p.title || t('slide.home.untitledWork'),
        title: p.title || t('slide.home.untitledWork'),
        subtitle: p.description || '',
        time: formatTime(p.updatedAt || p.createdAt),
        thumbnail: p.thumbnail
      }))
    }
  } catch (error) {
    console.error('Failed to fetch presentations:', error)
    // Keep demo data on error
  } finally {
    loading.value = false
  }
}

// Format timestamp to relative time
const formatTime = (timestamp) => {
  if (!timestamp) return t('slide.home.justNow')
  
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return t('slide.home.justNow')
  if (minutes < 60) return t('slide.home.minutesAgo', { n: minutes })
  if (hours < 24) return t('slide.home.hoursAgo', { n: hours })
  if (days < 30) return t('slide.home.daysAgo', { n: days })
  
  return new Date(timestamp).toLocaleDateString()
}

onMounted(() => {
  username.value = localStorage.getItem('username') || ''
  fetchPresentations()
  fetchGithubStars()
})

const createNewPpt = () => {
  // Navigate to workspace/home-redirect which will create a new presentation
  router.push('/workspace')
}

const createNewAiPpt = () => {
  // Navigate to AI creation page
  router.push({ name: 'AiCreate' })
}


const openWork = (workId) => {
  router.push({ name: 'Slide', params: { docId: workId } })
}

const handleUserMenuSelect = (value) => {
  if (value === 'logout') {
    try {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('uid')
      localStorage.removeItem('username')
      localStorage.removeItem('userColor')
      localStorage.removeItem('userRole')
      Message.success(t('auth.logoutSuccess') || 'Logged out successfully')
      router.replace({ name: 'Login', query: { force: '1', redirect: '/' } })
    } catch (error) {
      console.error('Logout error:', error)
      Message.error(t('auth.logoutFailed') || 'Logout failed')
    }
  }
}
</script>

<style scoped>
/* Container */
.home-container {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #1e293b;
}

.nav-menu {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.nav-menu::-webkit-scrollbar {
  display: none;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #64748b;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.nav-divider {
  margin: 16px 0;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
}

.powered-by {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

.powered-by .brand {
  font-weight: 600;
  color: #64748b;
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Top Header */
.top-header {
  height: 64px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.upgrade-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.25);
  transition: all 0.2s;
}

.upgrade-button:hover {
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.35);
  transform: translateY(-1px);
}

.icon-button {
  padding: 8px;
  color: #94a3b8;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-button:hover {
  color: #64748b;
  background: #f8fafc;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  border-left: 1px solid #e2e8f0;
}

.user-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.user-avatar-wrapper:hover {
  opacity: 0.8;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dbeafe;
  border: 2px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.vip-badge {
  padding: 2px 8px;
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
}

/* Content Area */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}

.content-area::-webkit-scrollbar {
  display: none;
}

.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.section-icon {
  width: 40px;
  height: 40px;
  background: #dbeafe;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.action-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.action-card.primary {
  background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
}

.action-card.secondary {
  background: linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%);
}

.action-card.tertiary {
  background: white;
  border: 2px solid #e2e8f0;
}

.action-card:hover {
  border-color: #2563eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.card-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  background: linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  border-radius: 50%;
  margin-right: -64px;
  margin-top: -64px;
}

.card-decoration.secondary-deco {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
}

.card-content {
  position: relative;
  z-index: 1;
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.2s;
  color: white;
}

.action-card:hover .card-icon {
  transform: scale(1.1);
}

.primary-icon {
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
}

.secondary-icon {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
}

.tertiary-icon {
  background: #f1f5f9;
  color: #64748b;
}

.action-card:hover .tertiary-icon {
  background: #eff6ff;
  color: #2563eb;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.ai-badge {
  padding: 2px 8px;
  background: #2563eb;
  color: white;
  font-size: 12px;
  font-weight: 700;
  border-radius: 4px;
}

.secondary-badge {
  background: #0ea5e9;
}

.unlock-icon {
  color: #f97316;
}

.card-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 16px;
}

.card-action {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #2563eb;
  font-weight: 600;
  font-size: 14px;
}

.secondary-action {
  color: #0ea5e9;
}

/* Works Section */
.works-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.works-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 80%;
  padding: 7px 12px 7px 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  color: #64748b;
}

.search-box input::placeholder {
  color: #94a3b8;
}

.search-box input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
}

.sort-dropdown:hover {
  border-color: #cbd5e1;
}

.view-toggle {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.view-button {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.view-button.active {
  background: white;
  color: #334155;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Works Grid */
.works-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.work-item {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.work-item:hover {
  border-color: #2563eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.work-thumbnail {
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
  min-height: 160px;
}

.thumbnail-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
}

.thumbnail-subtitle {
  font-size: 11px;
  font-weight: 600;
  opacity: 0.6;
  margin-bottom: 4px;
}

.thumbnail-title {
  font-size: 20px;
  font-weight: 700;
}

.work-overlay {
  position: absolute;
  inset: 0;
  background: black;
  opacity: 0;
  transition: opacity 0.2s;
}

.work-item:hover .work-overlay {
  opacity: 0.1;
}

.work-info {
  padding: 12px 16px;
}

.work-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.work-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}

.work-menu-button {
  padding: 4px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s;
}

.work-item:hover .work-menu-button {
  opacity: 1;
}

.work-menu-button:hover {
  color: #64748b;
  background: #f8fafc;
}

/* Empty State */
.work-item.empty-state {
  background: #f8fafc;
  border: 2px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  gap: 16px;
}

.work-item.empty-state:hover {
  border-color: #2563eb;
  background: rgba(239, 246, 255, 0.3);
}

.empty-icon {
  width: 56px;
  height: 56px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s;
}

.work-item.empty-state:hover .empty-icon {
  color: #2563eb;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.empty-text {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  transition: color 0.2s;
}

.work-item.empty-state:hover .empty-text {
  color: #2563eb;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-state p {
  font-size: 14px;
  color: #64748b;
}

/* No Works State */
.no-works-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 24px;
}

.no-works-state .empty-icon {
  width: 80px;
  height: 80px;
  background: #f8fafc;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.no-works-state .empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
}

.create-first-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.25);
  transition: all 0.2s;
}

.create-first-button:hover {
  box-shadow: 0 6px 16px rgba(147, 51, 234, 0.35);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 1536px) {
  .works-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .works-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  
  .works-grid {
    grid-template-columns: 1fr;
  }

}

/* GitHub Button */
.github-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  cursor: pointer;
  white-space: nowrap;
}

.github-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.github-stars {
  display: flex;
  align-items: center;
  color: #f59e0b;
  font-size: 12px;
  font-weight: 700;
}

/* Enterprise QR Code Modal */
.qrcode-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.qrcode-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 300px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
}

.qrcode-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #94a3b8;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.qrcode-close:hover {
  color: #334155;
}

.qrcode-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.qrcode-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.qrcode-img {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
}

</style>
