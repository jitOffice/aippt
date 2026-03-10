<template>
  <div class="mobile-header" :style="{ 'background-color': headerBackgroundColor }" @mouseenter="$emit('mouseenter')">
    <!-- 顶部行：标题和用户信息 -->
    <div class="mobile-header-top">
      <div class="mobile-title-section" >
        <a
          v-if="logoSrc"
          :href="logoHref"
          target="_blank"
          rel="noopener"
          aria-label="Home"
          class="brand-link"
        >
          <img :src="logoSrc" class="app-logo" alt="JitWord" decoding="async" />
        </a>
        <span class="mobile-title">
          {{ isMobile || isTablet ? appTitleShort : appTitle }}
        </span>
        <span v-if="betaLabel" class="beta-label">{{ betaLabel }}</span>
        <span v-if="logoSrc" class="brand-sep"></span>
        
        <div class="mobile-current-doc-name-wrapper" v-if="!isTitleEditing">
          <span 
            class="mobile-current-doc-name" 
            :class="{ 'editable': editableTitle }"
            @click="startEditingTitle"
          >
            {{ displayDocumentTitle }}
          </span>
        </div>
        <input
          v-else
          ref="titleInputRef"
          v-model="tempTitle"
          class="title-input"
          @blur="saveTitle"
          @keydown.enter="saveTitle"
        />
        
        <!-- 内置文档管理按钮（可配置） -->
        <a-tooltip :content="t.documentList" v-if="enableDocumentList">
          <span 
            class="icon-btn ml-2 " 
            @click="$emit('document-list-click')"
          >
            <span style="display: flex;" v-html="iconDocuments"></span>
          </span>
        </a-tooltip>
        <a-dropdown v-if="enableCreateDocument" trigger="click" v-model:popup-visible="createDropdownVisible" :popup-container="'body'">
          <a-tooltip :content="createDocumentTooltip || t.newDocument">
            <span class="icon-btn ml-2">
              <span style="display: flex;" v-html="iconPlus"></span>
            </span>
          </a-tooltip>
          <template #content>
            <div class="create-doc-popup">
              <div class="create-doc-header">
                <span class="create-doc-brand">{{ appTitleShort || 'JitWord' }}</span>
              </div>
              <div class="create-doc-section-title">
                {{createSectionTitle}}
              </div>
              <div class="create-doc-grid">
                <div class="create-doc-item" @click="handleCreateClick('doc')">
                  <div class="create-doc-icon" v-html="iconDocColor"></div>
                  <div class="create-doc-label">{{ t.newDoc || '文档' }}</div>
                </div>
                <div class="create-doc-item" @click="handleCreateClick('sheet')">
                  <div class="create-doc-icon" v-html="iconSheetColor"></div>
                  <div class="create-doc-label">{{ t.newSheet || '表格' }}</div>
                </div>
                <div class="create-doc-item" @click="handleCreateClick('mindmap')">
                  <div class="create-doc-icon" v-html="iconMindmapColor"></div>
                  <div class="create-doc-label">{{ t.newMindmap || '思维导图' }}</div>
                </div>
                <div class="create-doc-item" @click="handleCreateClick('slide')">
                  <div class="create-doc-icon" v-html="iconSlideColor"></div>
                  <div class="create-doc-label">{{ t.newSlide || '幻灯片' }}</div>
                </div>
              </div>
            </div>
          </template>
        </a-dropdown>
        
        <!-- 自定义左侧操作插槽 -->
        <slot name="leftActions" :isMobile="isMobile" :isTablet="isTablet"></slot>
      </div>

      <!-- 右侧用户信息和操作按钮 -->
      <div class="mobile-header-actions">
        <!-- 自定义右侧操作插槽 -->
        <slot name="rightActions" :isMobile="isMobile" :isTablet="isTablet"></slot>

        <!-- 桌面端用户信息 -->
        <div v-if="!isMobile && !isTablet && showOnlineUsers" class="flex items-center">
          <div class="m-r-6">
            <a-avatar-group :size="24" :max-count="8">
              <a-avatar
                v-for="(user, index) in onlineUsers"
                :key="user.userId || user.id || index"
                :style="{ backgroundColor: `#${user.color}` }"
              >
                {{ user.username || user.name }}
              </a-avatar>
            </a-avatar-group>
          </div>
          <div class="m-r-6">{{ t.online }}：{{ onlineUsers.length }} {{ t.people }}</div>
        </div>

        <!-- 移动端用户信息简化为下拉菜单 -->
        <a-dropdown v-if="(isMobile || isTablet) && showOnlineUsers" trigger="click">
          <a-button type="text" size="small" class="mobile-user-dropdown">
            <span v-html="iconUser" class="mr-1"></span>
            {{ onlineUsers.length }}{{ t.peopleOnline }}
          </a-button>
          <template #content>
            <div style="padding: 8px;">
              <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">{{ t.online }}：</div>
              <a-avatar-group :size="24" :max-count="6">
                <a-avatar
                  v-for="(user, index) in onlineUsers"
                  :key="user.userId || user.id || index"
                  :style="{ backgroundColor: `#${user.color}` }"
                >
                  {{ user.username || user.name }}
                </a-avatar>
              </a-avatar-group>
            </div>
          </template>
        </a-dropdown>

        <!-- <div class="flex" v-if="!isMobile && !isTablet">
          <a-dropdown class="locale-dropdown" :popupClassName="'locale-menu-popup'" @select="handleLocaleChange" @popup-visible-change="onLocalePopupChange">
            <a-button size="small" type="text" class="locale-icon-btn">
              <a-tooltip :content="tApp('switchLanguage')" :disabled="localeMenuOpen">
                <span v-html="iconGlobe"></span>
              </a-tooltip>
            </a-button>
            <template #content>
                <div class="locale-menu-title">{{ tApp('interfaceLanguage') }}</div>
                <a-divider style="margin:4px 0" />
                <a-doption v-for="opt in orderedLocaleOptions" :key="opt.value" :value="opt.value" :style="opt.value === currentLocale ? 'color: var(--color-primary-6); font-weight:600' : ''">
                  {{ opt.value === currentLocale ? '✓ ' + opt.label : opt.label }}
                </a-doption>
            </template>
          </a-dropdown>
        </div> -->

        <!-- <div v-if="isMobile || isTablet" class="flex items-center">
          <a-dropdown class="locale-dropdown" :popupClassName="'locale-menu-popup'" @select="handleLocaleChange" @popup-visible-change="onLocalePopupChange">
            <a-button type="text" size="small" class="mobile-more-btn">
              <span v-html="iconGlobe"></span>
            </a-button>
            <template #content>
              <div class="locale-menu-title">{{ tApp('interfaceLanguage') }}</div>
              <a-divider style="margin:4px 0" />
              <a-doption v-for="opt in orderedLocaleOptions" :key="opt.value" :value="opt.value" :style="opt.value === currentLocale ? 'color: var(--color-primary-6); font-weight:600' : ''">
                {{ opt.value === currentLocale ? '✓ ' + opt.label : opt.label }}
              </a-doption>
            </template>
          </a-dropdown>
        </div> -->

        <!-- 操作按钮 -->
        <div class="mobile-action-buttons">
          <!-- 桌面端分享按钮 -->
          <a-button
            v-if="!isMobile && !isTablet && enableShare"
            type="primary"
            size="small"
            class="mobile-share-btn ml-2"
            @click="$emit('share-click')"
          >
            {{ tApp('share') }}
          </a-button>
        </div>
     
         <div class="user-profile-section">
           <a-dropdown v-if="enableAuth" class="account-dropdown" trigger="click" @select="handleAccountSelect">
            <div class="user-avatar-wrapper">
              <div class="user-avatar">
                <span v-html="iconUser"></span>
              </div>
              <div class="user-info">
                <span class="user-name">{{ displayUserName }}</span>
                <span class="vip-badge">{{ t('slide.home.vipBadge') }}</span>
              </div>
            </div>
            <template #content>
              <a-doption v-if="!isLoggedIn" value="login">{{ tAuth('login') }}</a-doption>
              <!-- <a-doption v-else value="profile">个人中心</a-doption> -->
              <a-doption v-if="isLoggedIn" value="logout">{{ tCommon('logout') }}</a-doption>
            </template>
          </a-dropdown>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useEditorHeader } from './useEditorHeader'
import { useI18n } from 'vue-i18n'
import i18n, { LOCALE_OPTIONS, setLocale } from '@/locales/index.js'

const props = defineProps({
  appTitle: {
    type: String,
    default: 'jitSlide AI'
  },
  appTitleShort: {
    type: String,
    default: 'JitSlide'
  },
  createSectionTitle:{
    type: String,
    default: 'AI 驱动无限可能'
  },
  betaLabel: {
    type: String,
    default: import.meta.env.VITE_APP_BETA_LABEL || '共建版'
  },
  logoSrc: {
    type: String,
    default: ''
  },
  headerBackgroundColor: {
    type: String,
    default: 'white'
  },
  logoHref: {
    type: String,
    default: 'https://jitword.com/'
  },
  onlineUsers: {
    type: Array,
    default: () => []
  },
  orgUsers: {
    type: Array,
    default: () => []
  },
  showOnlineUsers: {
    type: Boolean,
    default: true
  },
  enableShare: {
    type: Boolean,
    default: true
  },
  enableDocumentList: {
    type: Boolean,
    default: false
  },
  documentTitle: {
    type: String,
    default: ''
  },
  editableTitle: {
    type: Boolean,
    default: false
  },
  enableCreateDocument: {
    type: Boolean,
    default: false
  },
  createDocumentTooltip: {
    type: String,
    default: ''
  },
  enableAuth: {
    type: Boolean,
    default: true
  },
  userName: {
    type: String,
    default: ''
  },
  locale: {
    type: String,
    default: 'zh',  // 'zh' or 'en'
    validator: (value) => ['zh','zh-Hant','en','ja','ko','id','th','vi'].includes(value)
  }
})

// Use centralized i18n
const { t: tCore } = useI18n()
const t = tCore
const currentLocale = ref(i18n.global.locale.value)
const tApp = computed(() => {
  currentLocale.value
  return (key) => tCore(`app.${key}`)
})
const tAuth = computed(() => {
  currentLocale.value
  return (key) => i18n.global.t('auth.' + key)
})
const tCommon = computed(() => {
  currentLocale.value
  return (key) => i18n.global.t('common.' + key)
})
const orderedLocaleOptions = computed(() => LOCALE_OPTIONS.slice().sort((a, b) => a.label.localeCompare(b.label)))
const localeMenuOpen = ref(false)
const onLocalePopupChange = v => { localeMenuOpen.value = v }
function handleLocaleChange(val) {
  currentLocale.value = val
  setLocale(val)
  emit('locale-change', val)
}

const isLoggedInState = ref(!!localStorage.getItem('jwt_token'))
const isLoggedIn = computed(() => isLoggedInState.value)
const displayUserName = computed(() => props.userName || localStorage.getItem('username') || (isLoggedIn.value ? tAuth.value('login') : tAuth.value('register')))
const displayDocumentTitle = computed(() => {
  currentLocale.value
  const title = (props.documentTitle || '').trim()
  return title || tCore('doc.untitled') || '未命名文档'
})
const refreshAuth = () => { isLoggedInState.value = !!localStorage.getItem('jwt_token') }
const isMobile = ref(false)
const isTablet = ref(false)
const updateDeviceFlags = () => {
  if (typeof window === 'undefined') return
  const w = window.innerWidth
  isMobile.value = w <= 768
  isTablet.value = !isMobile.value && w <= 1024
}
onMounted(() => {
  refreshAuth()
  window.addEventListener('focus', refreshAuth)
  updateDeviceFlags()
  window.addEventListener('resize', updateDeviceFlags)
})
onBeforeUnmount(() => {
  window.removeEventListener('focus', refreshAuth)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateDeviceFlags)
  }
})
const router = useRouter()
function handleAccountSelect(val) {
  if (val === 'login') {
    emit('login-click')
    try { router.push({ name: 'Login', query: { force: '1', redirect: location.pathname } }) } catch { /* ignore */ }
  } else if (val === 'logout') {
    emit('logout-click')
    try {
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('uid')
      localStorage.removeItem('username')
      localStorage.removeItem('userColor')
      localStorage.removeItem('userRole')
    } catch { /* ignore */ }
    try { Message.success(tAuth.value('logoutSuccess')) } catch { /* ignore */ }
    try { router.replace({ name: 'Login', query: { force: '1', redirect: '/' } }) } catch { /* ignore */ }
    refreshAuth()
  } else if (val === 'profile') {
    emit('profile-click')
  }
}

const emit = defineEmits([
  'share-click',
  'locale-change',
  'document-list-click',
  'create-document-click',
  'login-click',
  'logout-click',
  'profile-click',
  'title-change',
  'mouseenter'
])

const createDropdownVisible = ref(false)
function handleCreateClick(type) {
  emit('create-document-click', type)
  createDropdownVisible.value = false
}

// Title Editing
const isTitleEditing = ref(false)
const tempTitle = ref('')
const titleInputRef = ref(null)

function startEditingTitle() {
  if (!props.editableTitle) return
  tempTitle.value = props.documentTitle || ''
  isTitleEditing.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
  })
}

function saveTitle() {
  if (!isTitleEditing.value) return
  isTitleEditing.value = false
  if (tempTitle.value && tempTitle.value !== props.documentTitle) {
    emit('title-change', tempTitle.value)
  }
}

// 使用组合式函数获取图标
const { iconUser, iconGlobe, iconDocuments, iconPlus, iconDocColor, iconSheetColor, iconMindmapColor, iconSlideColor } = useEditorHeader()

// Removed global state logic for performance optimization in Excel mode
</script>

<style scoped>
/* 头部容器 */
.mobile-header {
  width: 100%;
  border-bottom: 1px solid var(--color-border-1, #e5e7eb);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}
.user-profile-section {
  display: flex;
  align-items: center;
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

/* 顶部行 */
.mobile-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 16px;
  min-height: 48px;
}

/* 左侧标题区 */
.mobile-title-section {
  display: flex;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;
}

.mobile-title {
  font-weight: bold;
  font-size: 16px;
}

.beta-label {
  display: inline-block;
  background: linear-gradient(90deg, #FF7D00 0%, #FF9F00 100%);
  color: #fff;
  font-size: 9px;
  padding: 3px 5px;
  border-radius: 6px;
  margin-left: 2px;
  line-height: 1;
  font-weight: 600;
  vertical-align: top;
  transform: translateY(-6px);
  position: relative;
  z-index: 1;
}

.brand-link { display:flex; align-items:center; border-radius:6px; text-decoration:none; color: var(--color-text-1, #1a1a1a); }
.brand-link:hover .app-logo { filter: brightness(1.08) saturate(1.1); }
.brand-link:active .app-logo { transform: scale(0.98); }
.brand-link:hover,
.brand-link:active,
.brand-link:focus-visible,
.brand-link:visited { text-decoration:none; color: var(--color-text-1, #1a1a1a); }
.app-logo { width:28px; height:28px; margin-right:8px; border-radius:4px; vertical-align:middle; cursor:pointer; }
.brand-sep { display:inline-block; width:1px; height:16px; background: rgba(0,0,0,0.08); margin: 0 12px; vertical-align: middle; }

.mobile-current-doc-name-wrapper {
  display: flex;
  align-items: center;
}

.mobile-current-doc-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 144px;
  color: var(--color-text-2, #6b7280);
  font-size: 14px;
}
.mobile-current-doc-name.editable {
  cursor: pointer;
}
.mobile-current-doc-name.editable:hover {
  color: var(--color-text-1, #1a1a1a);
  background: rgba(0,0,0,0.04);
  border-radius: 4px;
  padding: 0 4px;
  margin: 0 -4px;
}

.title-input {
  max-width: 144px;
  font-size: 14px;
  padding: 2px 4px;
  border: 1px solid var(--color-primary-light-2);
  border-radius: 4px;
  outline: none;
  color: var(--color-text-1, #1a1a1a);
}
.title-input:focus {
  border-color: var(--color-primary-6);
}

/* 右侧操作区 */
.mobile-header-actions {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 0;
}

/* 用户头像区域 */
.m-r-6 {
  margin-right: 24px;
}

/* 按钮间距 */
.mr-1 {
  margin-right: 4px;
}

.ml-2 {
  margin-left: 8px;
}

.ml-4 {
  margin-left: 16px;
}

.mr-2 {
  margin-right: 8px;
}

/* Flex 布局工具类 */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .mobile-header {
    padding: 0;
  }
  
  .mobile-header-top {
    padding: 6px 10px;
  }
  
  .mobile-title-section {
    flex: 1;
    min-width: 0;
  }
  
  .mobile-title {
    font-size: 15px;
    margin-right: 8px;
  }
  
  .mobile-current-doc-name {
    max-width: 88px;
  }
  
  .mobile-header-actions {
    gap: 2px;
  }
  
  .mobile-user-dropdown {
    padding: 4px 6px;
    font-size: 11px;
  }
  
  .mobile-action-buttons {
    gap: 2px;
  }
  
  .mobile-share-btn,
  .mobile-more-btn {
    padding: 4px 6px;
    min-width: 28px;
  }
  .brand-sep { display: none !important; }
  .app-logo { width:24px; height:24px; margin-right:6px; }
}

@media (max-width: 360px) {
  .mobile-current-doc-name { display: none; }
  .app-logo { margin-right: 6px; }
}

/* 平板端适配 (769px - 1024px) */
@media (min-width: 769px) and (max-width: 1024px) {
  .mobile-title {
    font-size: 16px;
  }
  
  .mobile-doc-selector {
    max-width: 200px;
  }
}

/* 按钮组 */
.mobile-action-buttons {
  display: flex;
  align-items: center;
}

.mobile-share-btn {
  margin-left: 12px;
}

:global(.locale-menu-popup) { border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.16); border: 1px solid rgba(0,0,0,0.06); overflow: hidden; background: #fff; }
:global(.locale-menu-title) { padding: 8px 12px; font-weight: 600; }

.mobile-version-btn {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
}

/* 文档选择器相关 */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: var(--color-text-2, #6b7280);
  transition: color 0.3s;
  vertical-align: middle;
}

.icon-btn:hover {
  color: #165dff;
}

.mobile-doc-list-btn,
.mobile-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.3s;
}

.mobile-doc-list-btn:hover,
.mobile-create-btn:hover {
  color: #165dff;
}

.mobile-doc-selector {
  max-width: 150px;
}

/* 新建文档弹窗样式 */
.create-doc-popup {
  padding: 16px;
  width: 320px;
  background: #fff;
  border-radius: 8px;
}

.create-doc-header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-1, #e5e7eb);
}

.create-doc-brand {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1, #1a1a1a);
}

.create-doc-section-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 12px;
  color: var(--color-text-3, #86909c);
  margin-bottom: 12px;
}

.create-doc-grid {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.create-doc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  flex: 1;
  min-width: 0;
}

.create-doc-item:hover {
  transform: translateY(-2px);
}

.create-doc-item:active {
  transform: translateY(0);
}

.create-doc-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-doc-label {
  font-size: 12px;
  color: var(--color-text-2, #4e5969);
  text-align: center;
  white-space: nowrap;
}
</style>