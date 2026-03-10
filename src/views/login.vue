<template>
  <div class="login-container">
    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="float-circle float-circle-1"></div>
      <div class="float-circle float-circle-2"></div>
      <div class="float-circle float-circle-3"></div>
    </div>

    <!-- Main Content -->
    <div class="login-content">
      <div class="login-grid">
        <!-- Left Side: Branding -->
        <div class="branding-section">
          <div class="branding-content">
            <!-- Brand Logo -->
            <div class="brand-header">
              <div class="brand-logo">
                <Icon name="mobile-magic-wand" :size="32" />
              </div>
              <span class="brand-name">{{ tAuth('appTitle') }}</span>
            </div>
            <h2 class="brand-title">
              {{ tAuth('brandSlogan1') }}<br/>{{ tAuth('brandSlogan2') }}
            </h2>
            <p class="brand-description">
              {{ tAuth('brandDescription1') }}<br/>{{ tAuth('brandDescription2') }}
            </p>
          </div>

          <!-- Features List -->
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="star-fall" :size="20" />
              </div>
              <span>{{ tAuth('feature1') }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="gallery" :size="20" />
              </div>
              <span>{{ tAuth('feature2') }}</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <Icon name="rocket" :size="20" />
              </div>
              <span>{{ tAuth('feature3') }}</span>
            </div>
          </div>

          <!-- Decorative Elements -->
          <div class="deco-box deco-box-1"></div>
          <div class="deco-box deco-box-2"></div>
        </div>

        <!-- Right Side: Login/Register Form -->
        <div class="form-section">
          <!-- Mobile Brand -->
          <div class="mobile-brand">
            <div class="mobile-brand-logo">
              <Icon name="magic-wand" :size="24" />
            </div>
            <span class="mobile-brand-name">{{ tAuth('appTitle') }}</span>
          </div>

          <!-- Tab Switcher -->
          <div class="tab-switcher">
            <button 
              class="tab-button" 
              :class="{ active: mode === 'login' }"
              @click="mode = 'login'"
            >
              {{ tAuth('login') }}
            </button>
            <button 
              class="tab-button" 
              :class="{ active: mode === 'register' }"
              @click="mode = 'register'"
            >
              {{ tAuth('register') }}
            </button>
          </div>

          <!-- Login Form -->
          <div v-if="mode === 'login'" class="auth-form">
            <div class="form-header">
              <h3 class="form-title">{{ tAuth('welcomeBack') }}</h3>
              <p class="form-subtitle">{{ tAuth('loginSubtitle') }}</p>
            </div>

            <!-- Social Login Buttons (shown by default) -->
            <div v-if="!showEmailLogin" class="social-buttons-section">
              <div class="social-buttons">
                <button class="social-button" @click="showEmailLogin = true">
                  <Icon name="email" :size="20" />
                  <span>{{ tAuth('email') }}</span>
                </button>
                <button class="social-button" @click="handleGithubLogin">
                  <Icon name="github" :size="20" />
                  <span>GitHub</span>
                </button>
              </div>

              <div class="divider-section">
                <div class="divider-line"></div>
                <span class="divider-text">{{ tAuth('orUseActivationCode') }}</span>
                <div class="divider-line"></div>
              </div>

              <!-- Demo Account Quick Login -->
              <div class="demo-account-section">
                <button class="demo-login-btn" @click="handleDemoLogin" :disabled="demoLoading">
                  <span v-if="!demoLoading" class="demo-btn-inner">
                    <Icon name="rocket" :size="18" />
                    <span>{{ tAuth('demoLogin') }}</span>
                    <span class="demo-badge">{{ tAuth('demoFree') }}</span>
                  </span>
                  <span v-else class="demo-btn-inner">
                    <span class="demo-loading-dot"></span>
                    {{ tAuth('demoLoading') }}
                  </span>
                </button>
                <p class="demo-hint">{{ tAuth('demoHint') }}</p>
              </div>

              <!-- Activation Code Login Form -->
              <a-form :model="form" layout="vertical" @submit="handleSubmit">
                <a-form-item field="name" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('activationCode') }}</span>
                  </template>
                  <a-input
                    v-model="form.name"
                    :placeholder="tAuth('activationCodePlaceholder')"
                    size="large"
                    required
                    maxlength="32"
                  />
                </a-form-item>

                <a-form-item>
                  <a-button 
                    html-type="submit" 
                    type="primary" 
                    long 
                    size="large"
                    class="submit-button"
                  >
                    <Icon name="login-icon" :size="18" />
                    <span>{{ tAuth('loginNow') }}</span>
                  </a-button>
                </a-form-item>
              </a-form>

              <p class="switch-mode-text">
                {{ tAuth('noAccount') }}
                <a class="switch-link" @click="mode = 'register'">{{ tAuth('registerNow') }}</a>
              </p>
            </div>

            <!-- Email Login Form (hidden by default) -->
            <div v-else class="email-form-section">
              <a-form :model="form" layout="vertical" @submit="handleSubmit">
                <a-form-item field="email" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('emailAddress') }}</span>
                  </template>
                  <a-input
                    v-model="form.email"
                    :placeholder="tAuth('emailPlaceholder')"
                    size="large"
                    type="email"
                    required
                  />
                </a-form-item>

                <a-form-item field="password" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('password') }}</span>
                  </template>
                  <a-input-password
                    v-model="form.password"
                    :placeholder="tAuth('passwordPlaceholder')"
                    size="large"
                    required
                    autocomplete="current-password"
                    maxLength="64"
                  />
                </a-form-item>

                <a-form-item>
                  <a-button 
                    html-type="submit" 
                    type="primary" 
                    long 
                    size="large"
                    class="submit-button"
                  >
                    <Icon name="login-icon" :size="18" />
                    <span>{{ tAuth('login') }}</span>
                  </a-button>
                </a-form-item>
              </a-form>

              <button class="back-button" @click="showEmailLogin = false">
                ← {{ tAuth('backToOptions') }}
              </button>
            </div>
          </div>

          <!-- Register Form -->
          <div v-else class="auth-form">
            <div class="form-header">
              <h3 class="form-title">{{ tAuth('startJourney') }}</h3>
              <p class="form-subtitle">{{ tAuth('registerSubtitle') }}</p>
            </div>

            <!-- Social Register Buttons (shown by default) -->
            <div v-if="!showEmailRegister" class="social-buttons-section">
              <div class="social-buttons">
                <button class="social-button" @click="showEmailRegister = true">
                  <Icon name="email" :size="20" />
                  <span>{{ tAuth('email') }}</span>
                </button>
                <button class="social-button" @click="handleGithubLogin">
                  <Icon name="github" :size="20" />
                  <span>GitHub</span>
                </button>
              </div>

              <div class="divider-section">
                <div class="divider-line"></div>
                <span class="divider-text">{{ tAuth('orUseActivationCodeRegister') }}</span>
                <div class="divider-line"></div>
              </div>

              <!-- Activation Code Register Form -->
              <a-form :model="form" layout="vertical" @submit="handleSubmit">
                <a-form-item field="activationCode" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('activationCode') }}</span>
                  </template>
                  <a-input
                    v-model="form.activationCode"
                    :placeholder="tAuth('activationCodePlaceholder')"
                    size="large"
                    required
                    maxlength="32"
                  />
                </a-form-item>

                <a-form-item field="name" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('username') }}</span>
                  </template>
                  <a-input
                    v-model="form.name"
                    :placeholder="tAuth('usernamePlaceholder')"
                    size="large"
                    required
                    maxlength="32"
                  />
                </a-form-item>

                <a-form-item class="form-item checkbox-item">
                  <a-checkbox v-model="agreeTerms">
                    <span class="checkbox-label">
                      {{ tAuth('agreeToTerms') }}
                      <a href="#" class="link-text">{{ tAuth('serviceTerms') }}</a>
                      {{ tAuth('and') }}
                      <a href="#" class="link-text">{{ tAuth('privacyPolicy') }}</a>
                    </span>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-button 
                    html-type="submit" 
                    type="primary" 
                    long 
                    size="large"
                    class="submit-button"
                  >
                    <Icon name="user-add-icon" :size="18" />
                    <span class="margin-left-1 ">{{ tAuth('createAccount') }}</span>
                  </a-button>
                </a-form-item>
              </a-form>
            </div>

            <!-- Email Register Form (hidden by default) -->
            <div v-else class="email-form-section">
              <a-form :model="form" layout="vertical" @submit="handleSubmit">
                <a-form-item field="email" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('emailAddress') }}</span>
                  </template>
                  <a-input
                    v-model="form.email"
                    :placeholder="tAuth('emailPlaceholder')"
                    size="large"
                    type="email"
                    required
                    @blur="handleEmailBlur"
                  />
                </a-form-item>

                <a-form-item field="verificationCode" class="form-item">
                  <template #label>
                    <div class="verification-label">
                      <span class="field-label" style="margin-bottom: 0;margin-right:6px">{{ tAuth('verificationCode') }}</span>
                      <span class="countdown-text" v-if="countdown > 0 && countdown < 600">
                        {{ formatCountdown(countdown) }}
                      </span>
                    </div>
                  </template>
                  <div class="code-input-group">
                    <a-input
                      v-model="form.verificationCode"
                      :placeholder="tAuth('enter6DigitCode')"
                      size="large"
                      required
                      maxlength="6"
                      class="code-input-inline code-input-styled"
                    />
                    <a-button
                      class="send-code-btn"
                      size="large"
                      :loading="sendingCode"
                      :disabled="!isEmailValid || resendCooldown > 0"
                      @click="handleSendVerificationCodeInline"
                    >
                      {{ getCodeButtonText() }}
                    </a-button>
                  </div>
                </a-form-item>

                <a-form-item field="password" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('password') }}</span>
                  </template>
                  <a-input-password
                    v-model="form.password"
                    :placeholder="tAuth('passwordMin8')"
                    size="large"
                    required
                    autocomplete="new-password"
                    maxLength="64"
                  />
                </a-form-item>

                <a-form-item field="confirmPassword" class="form-item">
                  <template #label>
                    <span class="field-label">{{ tAuth('confirmPassword') }}</span>
                  </template>
                  <a-input-password
                    v-model="form.confirmPassword"
                    :placeholder="tAuth('confirmPasswordPlaceholder')"
                    size="large"
                    required
                    maxLength="64"
                  />
                </a-form-item>

                <a-form-item class="form-item checkbox-item">
                  <a-checkbox v-model="agreeTerms">
                    <span class="checkbox-label">
                      {{ tAuth('agreeToTerms') }}
                      <a href="#" class="link-text">{{ tAuth('serviceTerms') }}</a>
                      {{ tAuth('and') }}
                      <a href="#" class="link-text">{{ tAuth('privacyPolicy') }}</a>
                    </span>
                  </a-checkbox>
                </a-form-item>

                <a-form-item>
                  <a-button 
                    html-type="submit" 
                    type="primary" 
                    long 
                    size="large"
                    class="submit-button"
                  >
                    <Icon name="user-add-icon" :size="18" />
                    <span>{{ tAuth('verifyAndRegister') }}</span>
                  </a-button>
                </a-form-item>
              </a-form>

              <button class="back-button" @click="handleBackToRegister">
                ← {{ tAuth('backToOptions') }}
              </button>
            </div>

            <!-- Switch to Login (always visible) -->
            <p class="switch-mode-text">
              {{ tAuth('hasAccount') }}
              <a class="switch-link" @click="mode = 'login'">{{ tAuth('loginNow') }}</a>
            </p>
          </div>

          <!-- Footer -->
          <div class="form-footer">
            <span class="footer-text">{{ tAuth('poweredBy') }}</span>
            <span class="footer-brand">JitWord AI</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { 
  IconUser, 
  IconLock,
  IconStarFill,
  IconImage,
  IconExport
} from '@arco-design/web-vue/es/icon'
import { generateRandomColor } from '@/utils/tool'
import { authApi } from '@/api/auth'
import { presentationApi } from '@/api/presentation'
import { unwrapResponse } from '@/api/response'
import i18n from '@/locales/index.js'
import IIcon from '@/utils/slide/icon.js'

// Use centralized icon system
const Icon = IIcon

const router = useRouter()
const mode = ref('login')
const showEmailLogin = ref(false)
const showEmailRegister = ref(false)
const agreeTerms = ref(false)
const isEmailValid = ref(false)
const demoLoading = ref(false)

// Verification code states
const verificationCodeSent = ref(false)
const sendingCode = ref(false)
const countdown = ref(600) // 10 minutes in seconds
const resendCooldown = ref(0) // 60 seconds cooldown for resend
let countdownTimer = null
let resendTimer = null

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  activationCode: '',
  verificationCode: ''
})

const currentLocale = ref(i18n.global.locale.value)
const tAuth = (key) => { 
  currentLocale.value
  return i18n.global.t('auth.' + key) 
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

const getAttemptInfo = (key) => {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null
    if (parsed && typeof parsed.count === 'number' && typeof parsed.ts === 'number') {
      return parsed
    }
  } catch {}
  return { count: 0, ts: Date.now() }
}

const bumpAttempts = (key) => {
  const now = Date.now()
  const info = getAttemptInfo(key)
  let count = info.count
  let ts = info.ts
  if (now - ts > WINDOW_MS) {
    ts = now
    count = 1
  } else {
    count = count + 1
  }
  try { localStorage.setItem(key, JSON.stringify({ count, ts })) } catch {}
  return count
}

const resetAttempts = (key) => {
  try { localStorage.removeItem(key) } catch {}
}

// GitHub OAuth configuration
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || ''
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}${import.meta.env.BASE_URL}login`

const handleGithubLogin = () => {
  if (!GITHUB_CLIENT_ID) {
    Message.error(tAuth('githubOAuthNotConfigured'))
    return
  }
  
  // Save current redirect URL for after OAuth completes
  const currentRedirect = router.currentRoute.value.query.redirect
  if (currentRedirect) {
    sessionStorage.setItem('oauth_redirect', currentRedirect)
  }
  
  // Build GitHub OAuth URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')
  githubAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID)
  githubAuthUrl.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI)
  githubAuthUrl.searchParams.append('scope', 'user:email')
  githubAuthUrl.searchParams.append('state', Math.random().toString(36).substring(7))
  
  // Redirect to GitHub OAuth
  window.location.href = githubAuthUrl.toString()
}

// Format countdown timer (MM:SS)
const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Start countdown timer
const startCountdown = () => {
  countdown.value = 600 // 10 minutes
  if (countdownTimer) clearInterval(countdownTimer)
  
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      Message.warning(tAuth('codeExpired'))
    }
  }, 1000)
}

// Start resend cooldown
const startResendCooldown = () => {
  resendCooldown.value = 60 // 60 seconds
  if (resendTimer) clearInterval(resendTimer)
  
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(resendTimer)
    }
  }, 1000)
}

// Auto-extract username from email
const handleEmailBlur = () => {
  if (form.email && form.email.includes('@')) {
    const emailPrefix = form.email.split('@')[0]
    // Auto-fill username if not manually set
    if (!form.name || form.name === '') {
      form.name = emailPrefix
    }
    isEmailValid.value = true
  } else {
    isEmailValid.value = false
  }
}

// Get code button text
const getCodeButtonText = () => {
  if (sendingCode.value) return tAuth('sendingCode')
  if (resendCooldown.value > 0) return `${resendCooldown.value}s`
  return verificationCodeSent.value ? tAuth('resendCode') : tAuth('getCode')
}

// Send verification code inline
const handleSendVerificationCodeInline = async () => {
  // Validation
  if (!form.email || !form.email.includes('@')) {
    Message.error(tAuth('invalidEmail') || 'Please enter a valid email address')
    return
  }

  // Auto-extract username
  const emailPrefix = form.email.split('@')[0]
  form.name = emailPrefix

  sendingCode.value = true

  try {
    const res = await authApi.sendVerificationCode({
      email: form.email,
      username: form.name
    })
    const payload = unwrapResponse(res)
    
    if ((payload?.code ?? 0) === 200) {
      Message.success(tAuth('codeSentSuccess'))
      verificationCodeSent.value = true
      startCountdown()
      startResendCooldown()
    } else {
      Message.error(payload?.message || tAuth('codeSendFailed'))
    }
  } catch (error) {
    console.error('Send verification code error:', error)
    Message.error(tAuth('codeSendFailed'))
  } finally {
    sendingCode.value = false
  }
}

// Send verification code
const handleSendVerificationCode = async (data) => {
  if (!data || !data.values) return

  // Validation
  if (!data.values.email || !data.values.name || !data.values.password || !data.values.confirmPassword) {
    Message.error(tAuth('allFieldsRequired') || 'Please fill in all required fields')
    return
  }
  if (!data.values.email.includes('@')) {
    Message.error(tAuth('invalidEmail') || 'Please enter a valid email address')
    return
  }
  if (data.values.password.length < 8) {
    Message.error(tAuth('passwordMin8Chars') || 'Password must be at least 8 characters')
    return
  }
  if (data.values.password !== data.values.confirmPassword) {
    Message.error(tAuth('passwordsDoNotMatch') || 'Passwords do not match')
    return
  }
  if (!agreeTerms.value) {
    Message.error(tAuth('mustAgreeToTerms') || 'Please agree to the terms and conditions')
    return
  }

  sendingCode.value = true

  try {
    const res = await authApi.sendVerificationCode({
      email: data.values.email,
      username: data.values.name
    })
    const payload = unwrapResponse(res)
    
    if ((payload?.code ?? 0) === 200) {
      Message.success(tAuth('codeSentSuccess'))
      verificationCodeSent.value = true
      startCountdown()
      startResendCooldown()
    } else {
      Message.error(payload?.message || tAuth('codeSendFailed'))
    }
  } catch (error) {
    console.error('Send verification code error:', error)
    Message.error(tAuth('codeSendFailed'))
  } finally {
    sendingCode.value = false
  }
}

// Resend verification code
const handleResendCode = async () => {
  if (resendCooldown.value > 0) return

  sendingCode.value = true

  try {
    const res = await authApi.sendVerificationCode({
      email: form.email,
      username: form.name
    })
    const payload = unwrapResponse(res)
    
    if ((payload?.code ?? 0) === 200) {
      Message.success(tAuth('codeResentSuccess'))
      startCountdown()
      startResendCooldown()
    } else {
      Message.error(payload?.message || tAuth('codeSendFailed'))
    }
  } catch (error) {
    console.error('Resend verification code error:', error)
    Message.error(tAuth('codeSendFailed'))
  } finally {
    sendingCode.value = false
  }
}

// Back to register form
const handleBackToRegister = () => {
  verificationCodeSent.value = false
  form.verificationCode = ''
  if (countdownTimer) clearInterval(countdownTimer)
  if (resendTimer) clearInterval(resendTimer)
  showEmailRegister.value = false
}

// Demo account quick login
const DEMO_ACCOUNT = import.meta.env.VITE_DEMO_ACCOUNT || 'demo@aippt.cc'
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD || 'demo123456'

const handleDemoLogin = async () => {
  if (demoLoading.value) return
  demoLoading.value = true
  try {
    const res = await authApi.login({
      email: DEMO_ACCOUNT,
      password: DEMO_PASSWORD
    })
    const payload = unwrapResponse(res)
    if ((payload?.code ?? 0) === 200 && payload?.data?.token) {
      const u = payload.data
      localStorage.setItem('jwt_token', u.token)
      localStorage.setItem('uid', u.user?.id || 'demo')
      localStorage.setItem('username', u.user?.username || u.user?.email || 'Demo User')
      localStorage.setItem('userRole', u.user?.role || '0')
      localStorage.setItem('userColor', generateRandomColor())
      Message.success(tAuth('demoLoginSuccess'))
      const redirect = router.currentRoute.value.query.redirect
      if (redirect) {
        const baseUrl = import.meta.env.BASE_URL || '/'
        const cleanRedirect = typeof redirect === 'string' && redirect.startsWith(baseUrl)
          ? redirect.slice(baseUrl.length - 1)
          : redirect
        router.push(cleanRedirect)
      } else {
        router.push('/')
      }
    } else {
      // Fallback: use local guest mode without backend
      const demoUid = 'demo_' + Math.random().toString(36).slice(2, 8)
      localStorage.setItem('uid', demoUid)
      localStorage.setItem('username', 'Demo User')
      localStorage.setItem('userRole', '0')
      localStorage.setItem('userColor', generateRandomColor())
      Message.success(tAuth('demoLoginSuccess'))
      router.push('/')
    }
  } catch {
    // Network error or no backend: use local guest mode
    const demoUid = 'demo_' + Math.random().toString(36).slice(2, 8)
    localStorage.setItem('uid', demoUid)
    localStorage.setItem('username', 'Demo User')
    localStorage.setItem('userRole', '0')
    localStorage.setItem('userColor', generateRandomColor())
    Message.success(tAuth('demoLoginSuccess'))
    router.push('/')
  } finally {
    demoLoading.value = false
  }
}

const handleSubmit = async (data) => {
  if(data && data.values) {
    const failKey = mode.value === 'login' ? 'login_fail_rate' : 'register_fail_rate'
    try {
      const info = getAttemptInfo(failKey)
      const now = Date.now()
      if (now - info.ts <= WINDOW_MS && info.count >= MAX_ATTEMPTS) {
        Message.error(mode.value === 'login' ? tAuth('tooManyLoginAttempts') : tAuth('tooManyRegisterAttempts'))
        return
      }
    } catch {}

    if (mode.value === 'login') {
      // Validation for email login
      if (showEmailLogin.value) {
        if (!data.values.email || !data.values.password) {
          Message.error(tAuth('emailAndPasswordRequired') || 'Email and password are required')
          return
        }
        if (!data.values.email.includes('@')) {
          Message.error(tAuth('invalidEmail') || 'Please enter a valid email address')
          return
        }
      } else {
        // Validation for activation code login
        if (!data.values.name) {
          Message.error(tAuth('activationCodeRequired') || 'Please enter activation code')
          return
        }
      }

      try {
        const res = await authApi.login({
          email: showEmailLogin.value ? data.values.email : data.values.name,
          password: data.values.password
        })
        const payload = unwrapResponse(res)
        
        // 后端返回格式：{ code: 200, message: '...', data: { user, token } }
        if ((payload?.code ?? 0) === 200 && payload?.data?.token) {
          const u = payload.data
          localStorage.setItem('jwt_token', u.token)
          localStorage.setItem('uid', u.user?.id || '')
          localStorage.setItem('username', u.user?.username || u.user?.email || '')
          localStorage.setItem('userRole', u.user?.role || '0')
          localStorage.setItem('userColor', generateRandomColor())
          resetAttempts(failKey)
          const redirect = router.currentRoute.value.query.redirect
          if (redirect) {
            // Remove base URL prefix if it exists to prevent duplication
            const baseUrl = import.meta.env.BASE_URL || '/'
            const cleanRedirect = typeof redirect === 'string' && redirect.startsWith(baseUrl)
              ? redirect.slice(baseUrl.length - 1) // Keep the leading slash
              : redirect
            router.push(cleanRedirect)
          } else {
            router.push('/')
          }
          return
        }
        const c = bumpAttempts(failKey)
        if ((payload?.code ?? 0) === 429) {
          Message.error(payload?.message || tAuth('tooManyRequests'))
          return
        }
        if (c >= MAX_ATTEMPTS) {
          Message.error(tAuth('tooManyRegisterAttempts'))
          return
        }
        // Use localized message for authentication errors
        const errorMsg = payload?.message
        if (errorMsg && (errorMsg.toLowerCase().includes('credential') || errorMsg.toLowerCase().includes('password') || errorMsg.toLowerCase().includes('username'))) {
          Message.error(tAuth('usernameOrPasswordError'))
        } else {
          Message.error(errorMsg || tAuth('usernameOrPasswordError'))
        }
      } catch (e) {
        const c = bumpAttempts(failKey)
        const status = e?.response?.status
        const p = unwrapResponse(e?.response?.data)
        const msg = p?.message || e?.message
        if (status === 429 || (p?.code ?? 0) === 429) {
          Message.error(msg || tAuth('tooManyRequests'))
          return
        }
        if (status === 401 || (p?.code ?? 0) === 401) {
          // Use localized message for authentication errors
          if (msg && (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('username'))) {
            Message.error(tAuth('usernameOrPasswordError'))
          } else {
            Message.error(msg || tAuth('usernameOrPasswordError'))
          }
          return
        }
        if (c >= MAX_ATTEMPTS) {
          Message.error(tAuth('tooManyRegisterAttempts'))
          return
        }
        Message.error(msg || tAuth('loginFailed'))
      }
    } else {
      // Validation for email register
      if (showEmailRegister.value) {
        if (!data.values.email || !data.values.name || !data.values.password || !data.values.confirmPassword) {
          Message.error(tAuth('allFieldsRequired') || 'Please fill in all required fields')
          return
        }
        if (!data.values.email.includes('@')) {
          Message.error(tAuth('invalidEmail') || 'Please enter a valid email address')
          return
        }
        if (data.values.password.length < 8) {
          Message.error(tAuth('passwordMin8Chars') || 'Password must be at least 8 characters')
          return
        }
        if (data.values.password !== data.values.confirmPassword) {
          Message.error(tAuth('passwordsDoNotMatch') || 'Passwords do not match')
          return
        }
        if (!agreeTerms.value) {
          Message.error(tAuth('mustAgreeToTerms') || 'Please agree to the terms and conditions')
          return
        }
      } else {
        // Validation for activation code register
        if (!data.values.activationCode || !data.values.name) {
          Message.error(tAuth('allFieldsRequired') || 'Please fill in all required fields')
          return
        }
        if (!agreeTerms.value) {
          Message.error(tAuth('mustAgreeToTerms') || 'Please agree to the terms and conditions')
          return
        }
      }

      try {
        const res = await authApi.register({
          email: showEmailRegister.value ? data.values.email : data.values.name,
          password: data.values.password,
          username: data.values.name,
          name: data.values.name,
          verificationCode: data.values.verificationCode // 添加验证码参数
        })
        const payload = unwrapResponse(res)
        
        // 后端返回格式：{ code: 201, message: '...', data: { user, token } }
        if (((payload?.code ?? 0) === 200 || (payload?.code ?? 0) === 201) && payload?.data?.token) {
          const u = payload.data
          localStorage.setItem('jwt_token', u.token)
          localStorage.setItem('uid', u.user?.id || '')
          localStorage.setItem('username', u.user?.username || u.user?.email || '')
          localStorage.setItem('userRole', u.user?.role || '0')
          localStorage.setItem('userColor', generateRandomColor())
          resetAttempts(failKey)
          Message.success(tAuth('registerSuccess') || '注册成功！')
          const redirect = router.currentRoute.value.query.redirect
          if (redirect) {
            // Remove base URL prefix if it exists to prevent duplication
            const baseUrl = import.meta.env.BASE_URL || '/'
            const cleanRedirect = typeof redirect === 'string' && redirect.startsWith(baseUrl)
              ? redirect.slice(baseUrl.length - 1) // Keep the leading slash
              : redirect
            router.push(cleanRedirect)
          } else {
            try {
              const resDocs = await presentationApi.getAll()
              const payloadDocs = unwrapResponse(resDocs)
              const list = payloadDocs?.data?.presentations || []
              if (list.length > 0) {
                router.push({ name: 'Slide', params: { docId: list[0].id } })
              } else {
                try {
                  const created = unwrapResponse(await presentationApi.create({
                    title: '未命名演示文稿',
                    description: '',
                    isPublic: false
                  }))
                  const id = created?.data?.presentation?.id
                  if (id) {
                    router.push({ name: 'Slide', params: { docId: id } })
                  } else {
                    router.push('/')
                  }
                } catch {
                  router.push('/')
                }
              }
            } catch {
              try {
                const created = unwrapResponse(await presentationApi.create({
                  title: '未命名演示文稿',
                  description: '',
                  isPublic: false
                }))
                const id = created?.data?.presentation?.id
                if (id) {
                  router.push({ name: 'Slide', params: { docId: id } })
                } else {
                  router.push('/')
                }
              } catch {
                router.push('/')
              }
            }
          }
          return
        }
        const c = bumpAttempts(failKey)
        if ((payload?.code ?? 0) === 429) {
          Message.error(payload?.message || tAuth('tooManyRequests'))
          return
        }
        if (c >= MAX_ATTEMPTS) {
          Message.error(tAuth('tooManyRegisterAttempts'))
          return
        }
        Message.error(payload?.message || tAuth('registerFailed'))
      } catch (e) {
        const c = bumpAttempts(failKey)
        const status = e?.response?.status
        const p = unwrapResponse(e?.response?.data)
        const msg = p?.message || e?.message
        
        // 409: 用户已存在
        if (status === 409 || (p?.code ?? 0) === 409) {
          Message.error(msg || tAuth('userAlreadyExists') || '用户已存在，请直接登录')
          return
        }
        
        if (status === 429 || (p?.code ?? 0) === 429) {
          Message.error(msg || tAuth('tooManyRequests'))
          return
        }
        if (c >= MAX_ATTEMPTS) {
          Message.error(tAuth('tooManyRegisterAttempts'))
          return
        }
        Message.error(msg || tAuth('registerFailed'))
      }
    }
  }
}

// Handle OAuth callback on component mount
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')
  
  if (code && state) {
    try {
      Message.loading({ content: tAuth('githubAuthenticating'), duration: 0 })
      
      // Call backend to exchange code for token
      const res = await authApi.githubCallback({ code, state })
      const payload = unwrapResponse(res)
      
      Message.clear()
      
      if ((payload?.code ?? 0) === 200 && payload?.data?.token) {
        const u = payload.data
        localStorage.setItem('jwt_token', u.token)
        localStorage.setItem('uid', u.user?.id || '')
        localStorage.setItem('username', u.user?.username || u.user?.email || '')
        localStorage.setItem('userRole', u.user?.role || '0')
        localStorage.setItem('userColor', generateRandomColor())
        
        Message.success(tAuth('githubLoginSuccess'))
        
        // Get saved redirect URL
        const savedRedirect = sessionStorage.getItem('oauth_redirect')
        sessionStorage.removeItem('oauth_redirect')
        
        if (savedRedirect) {
          const baseUrl = import.meta.env.BASE_URL || '/'
          const cleanRedirect = savedRedirect.startsWith(baseUrl)
            ? savedRedirect.slice(baseUrl.length - 1)
            : savedRedirect
          router.push(cleanRedirect)
        } else {
          router.push('/')
        }
      } else {
        Message.error(payload?.message || tAuth('githubAuthFailed'))
        // Clean up URL
        router.replace('/login')
      }
    } catch (error) {
      Message.clear()
      console.error('GitHub OAuth error:', error)
      Message.error(tAuth('githubAuthFailed'))
      router.replace('/login')
    }
  }
})
</script>
<style scoped>
/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Main Container */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: #f8fafc;
  position: relative;
  overflow: hidden;
}

/* Background Decoration */
.bg-decoration {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.float-circle {
  position: absolute;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(60px);
  opacity: 0.2;
  animation: float 6s ease-in-out infinite;
}

.float-circle-1 {
  top: 80px;
  left: -80px;
  width: 384px;
  height: 384px;
  background: #3b82f6;
}

.float-circle-2 {
  bottom: 80px;
  right: -80px;
  width: 384px;
  height: 384px;
  background: #0ea5e9;
  animation-delay: 2s;
}

.float-circle-3 {
  top: 50%;
  left: 50%;
  width: 384px;
  height: 384px;
  background: #06b6d4;
  animation-delay: 4s;
}

/* Content Grid */
.login-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.login-grid {
  display: grid;
  grid-template-columns: 1fr;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

@media (min-width: 768px) {
  .login-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Branding Section */
.branding-section {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0c4a6e 100%);
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .branding-section {
    display: flex;
  }
}

.branding-content {
  position: relative;
  z-index: 10;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.brand-logo {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.brand-title {
  font-size: 36px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 16px;
}

.brand-description {
  font-size: 18px;
  color: #bfdbfe;
  line-height: 1.6;
}

/* Features List */
.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 10;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.feature-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.feature-item span {
  font-weight: 500;
  font-size: 15px;
}

/* Decorative Boxes */
.deco-box {
  position: absolute;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.deco-box-1 {
  top: 80px;
  right: 40px;
  width: 128px;
  height: 128px;
  border-radius: 24px;
  transform: rotate(12deg);
}

.deco-box-2 {
  bottom: 128px;
  right: 80px;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  transform: rotate(-12deg);
}

/* Form Section */
.form-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
}

@media (max-width: 640px) {
  .form-section {
    padding: 32px 24px;
  }
}

/* Mobile Brand */
.mobile-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

@media (min-width: 768px) {
  .mobile-brand {
    display: none;
  }
}

.mobile-brand-logo {
  width: 40px;
  height: 40px;
  background: #2563eb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.mobile-brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
}

/* Tab Switcher */
.tab-switcher {
  display: flex;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.tab-button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Auth Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.social-buttons-section,
.email-form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Social Buttons */
.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.social-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Divider Section */
.divider-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  white-space: nowrap;
}

/* Field Labels */
.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

/* Back Button */
.back-button {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  text-align: center;
}

.back-button:hover {
  color: #334155;
}

/* Checkbox Item */
.checkbox-item {
  margin-bottom: 8px !important;
}

.checkbox-item :deep(.arco-form-item-content) {
  margin-top: 0 !important;
}

.checkbox-label {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.link-text {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.link-text:hover {
  color: #1d4ed8;
}

.form-header {
  margin-bottom: 8px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
}

/* Form Items */
.form-item {
  margin-bottom: 20px !important;
}

.form-item :deep(.arco-form-item-label-col) {
  padding-bottom: 0;
  margin-bottom: 8px;
}

.form-item :deep(.arco-input-wrapper),
.form-item :deep(.arco-input-password) {
  border-radius: 12px !important;
  border: 2px solid #e2e8f0 !important;
  transition: all 0.2s;
  padding: 0;
  background: white;
}

.form-item :deep(.arco-input-wrapper .arco-input),
.form-item :deep(.arco-input-password .arco-input) {
  padding: 12px 16px;
  background: white;
  font-weight: 500;
  font-size: 14px;
  color: #0f172a;
  height: auto;
  line-height: 1.5;
  border: none !important;
  box-shadow: none !important;
  border-radius: 10px;
}

.form-item :deep(.arco-input-password .arco-input-suffix) {
  padding-right: 16px;
  
}

.form-item :deep(.arco-input-wrapper .arco-input-suffix){
  margin-right: 12px;
}

.form-item :deep(.arco-input-wrapper:hover),
.form-item :deep(.arco-input-password:hover) {
  border-color: #cbd5e1 !important;
}

/* Match the HTML prototype focus style */
.form-item :deep(.arco-input-wrapper:focus-within),
.form-item :deep(.arco-input-password:focus-within) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px #dbeafe !important;
  outline: none !important;
 
}

.form-item :deep(.arco-input::placeholder) {
  color: #94a3b8;
  font-weight: 500;
}

/* Submit Button */
.submit-button {
  height: 48px !important;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 15px !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25) !important;
  transition: all 0.2s !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35) !important;
}

.submit-button:active {
  transform: scale(0.98);
}

.margin-left-1{
  margin-left:12px;
}

/* Switch Mode Text */
.switch-mode-text {
  text-align: center;
  font-size: 14px;
  color: #64748b;
  margin-top: 8px;
}

.switch-link {
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
}

.switch-link:hover {
  color: #1d4ed8;
}

/* Form Footer */
.form-footer {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
}

.footer-text {
  color: #64748b;
}

.footer-brand {
  font-weight: 700;
  color: #2563eb;
}

/* Verification Code Section */
.verification-code-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.code-sent-notice {
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  border: 1px solid #bfdbfe;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.notice-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.2);
}

.notice-text {
  text-align: center;
  font-size: 14px;
  color: #1e40af;
  line-height: 1.6;
  margin: 0;
}

.notice-text strong {
  color: #1e3a8a;
  font-weight: 700;
}

.verification-label {
  display: flex;
  justify-content: space-between;

  align-items: center;
  width: 100%;
}

.countdown-text {
  font-size: 12px;
  color: #f59e0b;
  font-weight: 600;
  line-height: 1;
  display: flex;
  align-items: center;
}

.code-input-group {
  display: flex;
  gap: 12px;
  align-items: stretch;
  width: 100%;
}

.code-input-inline {
  flex: 1;
  min-width: 0;
}

.code-input-styled :deep(.arco-input-wrapper) {
  height: 48px;
  border-radius: 12px !important;
  border: 2px solid #e2e8f0 !important;
}

.code-input-styled :deep(.arco-input) {
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 8px;
  font-family: 'Courier New', Consolas, monospace;
  padding: 12px 24px;
  height: 100%;
}

.code-input-styled :deep(.arco-input-wrapper:hover) {
  border-color: #cbd5e1 !important;
}

.code-input-styled :deep(.arco-input-wrapper:focus-within) {
  border-color: #2563eb !important;
  box-shadow: 0 0 0 4px #dbeafe !important;
}

.send-code-btn {
  width: 140px;
  height: 48px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  transition: all 0.2s !important;
  white-space: nowrap;
  flex-shrink: 0;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border: none;
  color: white !important;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.send-code-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  color: white !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.send-code-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
}

.send-code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #e2e8f0 !important;
  color: #94a3b8 !important;
  box-shadow: none !important;
}

.code-input :deep(.arco-input) {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;
}

.resend-section {
  text-align: center;
  padding-top: 8px;
}

.resend-button {
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}

.resend-button:hover:not(:disabled) {
  background: #eff6ff;
  color: #1d4ed8;
}

.resend-button:disabled {
  color: #94a3b8;
  cursor: not-allowed;
}

/* Responsive Adjustments */
@media (max-width: 480px) {
  .brand-title {
    font-size: 28px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .tab-button {
    font-size: 13px;
    padding: 10px 16px;
  }
}

/* Demo Account Section */
.demo-account-section {
  margin-bottom: 20px;
}

.demo-login-btn {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  position: relative;
  overflow: hidden;
}

.demo-login-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}

.demo-login-btn:hover:not(:disabled)::before {
  opacity: 1;
}

.demo-login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.demo-login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.demo-login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.demo-btn-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.demo-badge {
  background: rgba(255,255,255,0.25);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.demo-hint {
  margin: 8px 0 0;
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.4;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.demo-loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  display: inline-block;
  animation: pulse 1s ease-in-out infinite;
  margin-right: 4px;
}</style>
