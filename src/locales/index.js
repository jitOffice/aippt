import { createI18n } from 'vue-i18n'

import en from './en.json'
import zh from './zh.json'
import zhHant from './zh-Hant.json'
import ja from './ja.json'
import ko from './ko.json'
import id from './id.json'
import th from './th.json'
import vi from './vi.json'


export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh' },
  { label: '繁體中文', value: 'zh-Hant' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Bahasa Indonesia', value: 'id' },
  { label: 'ไทย', value: 'th' },
  { label: 'Tiếng Việt', value: 'vi' }
]

export const LOCALE_LOCAL_NAMES = {
  zh: {
    zh: '中文',
    'zh-Hant': '繁体中文',
    en: '英语',
    ja: '日语',
    ko: '韩语',
    id: '印度尼西亚语',
    th: '泰语',
    vi: '越南语'
  },
  'zh-Hant': {
    zh: '簡體中文',
    'zh-Hant': '繁體中文',
    en: '英語',
    ja: '日語',
    ko: '韓語',
    id: '印尼語',
    th: '泰語',
    vi: '越南語'
  },
  en: {
    zh: 'Chinese',
    'zh-Hant': 'Traditional Chinese',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    id: 'Indonesian',
    th: 'Thai',
    vi: 'Vietnamese'
  },
  ja: {
    zh: '中国語',
    'zh-Hant': '繁体字中国語',
    en: '英語',
    ja: '日本語',
    ko: '韓国語',
    id: 'インドネシア語',
    th: 'タイ語',
    vi: 'ベトナム語'
  },
  ko: {
    zh: '중국어',
    'zh-Hant': '번체 중국어',
    en: '영어',
    ja: '일본어',
    ko: '한국어',
    id: '인도네시아어',
    th: '태국어',
    vi: '베트남어'
  },
  id: {
    zh: 'Bahasa Tiongkok',
    'zh-Hant': 'Bahasa Tiongkok Tradisional',
    en: 'Bahasa Inggris',
    ja: 'Bahasa Jepang',
    ko: 'Bahasa Korea',
    id: 'Bahasa Indonesia',
    th: 'Bahasa Thai',
    vi: 'Bahasa Vietnam'
  },
  th: {
    zh: 'ภาษาจีน',
    'zh-Hant': 'ภาษาจีนตัวเต็ม',
    en: 'ภาษาอังกฤษ',
    ja: 'ภาษาญี่ปุ่น',
    ko: 'ภาษาเกาหลี',
    id: 'ภาษาอินโดนีเซีย',
    th: 'ภาษาไทย',
    vi: 'ภาษาเวียดนาม'
  },
  vi: {
    zh: 'Tiếng Trung',
    'zh-Hant': 'Tiếng Trung Phồn thể',
    en: 'Tiếng Anh',
    ja: 'Tiếng Nhật',
    ko: 'Tiếng Hàn',
    id: 'Tiếng Indonesia',
    th: 'Tiếng Thái',
    vi: 'Tiếng Việt'
  }
}

export function getLocaleLocalName(currentLocale, value) {
  const map = LOCALE_LOCAL_NAMES[currentLocale] || LOCALE_LOCAL_NAMES['zh']
  return map[value] || value
}

function detectDefaultLocale() {
  try {
    const saved = localStorage.getItem('pxdoc:locale')
    if (saved) return saved
  } catch {}
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'zh-CN'
  const lower = String(nav).toLowerCase()
  if (lower.startsWith('zh')) {
    if (lower.includes('tw') || lower.includes('hk') || lower.includes('hant')) return 'zh-Hant'
    return 'zh'
  }
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('ko')) return 'ko'
  if (lower.startsWith('id')) return 'id'
  if (lower.startsWith('th')) return 'th'
  if (lower.startsWith('vi')) return 'vi'
  if (lower.startsWith('en')) return 'en'
  return 'zh'
}

const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: detectDefaultLocale(),
  fallbackLocale: 'en',
  messages: {
    zh,
    'zh-Hant': zhHant,
    en,
    ja,
    ko,
    id,
    th,
    vi
  }
})

function mapToCoreLocale(val) {
  if (val === 'zh-Hans') return 'zh'
  return val
}


export function setLocale(next) {
  const allowed = ['zh','zh-Hant','en','ja','ko','id','th','vi']
  const val = allowed.includes(next) ? next : 'zh'
  try { localStorage.setItem('pxdoc:locale', val) } catch {}
  i18n.global.locale.value = val
}

const LOCALE_CANONICAL_MAP = {
  'zh': 'zh',
  'zh-Hans': 'zh',
  'zh-Hant': 'zh-Hant',
  'en': 'en',
  'en-US': 'en',
  'ja': 'ja',
  'ko': 'ko',
  'id': 'id',
  'th': 'th',
  'vi': 'vi'
}

export async function ensureLocaleLoaded(locale) {
  const key = LOCALE_CANONICAL_MAP[locale] || 'zh'
  if (i18n.global.getLocaleMessage(key) && Object.keys(i18n.global.getLocaleMessage(key)).length > 0) return
  try {
    let mod
    switch (key) {
      case 'zh': mod = await import('./zh.json'); break
      case 'zh-Hant': mod = await import('./zh-Hant.json'); break
      case 'en': mod = await import('./en.json'); break
      case 'ja': mod = await import('./ja.json'); break
      case 'ko': mod = await import('./ko.json'); break
      case 'id': mod = await import('./id.json'); break
      case 'th': mod = await import('./th.json'); break
      case 'vi': mod = await import('./vi.json'); break
      default: mod = await import('./zh.json')
    }
    i18n.global.setLocaleMessage(key, mod.default || mod)
  } catch (e) {
    console.warn('[i18n] Failed to load locale', locale, e)
  }
}

async function applyGeoDefaultLocale() {
  try {
    const saved = localStorage.getItem('pxdoc:locale')
    if (saved) return
  } catch {}
  try {
    const primary = (navigator.language || '').toLowerCase()
    const candidates = Array.isArray(navigator.languages) ? navigator.languages : []
    const all = [primary, ...candidates].filter(Boolean).map(x => String(x).toLowerCase())
    let next = 'en'
    if (all.some(code => code.startsWith('zh'))) {
      next = 'zh'
    }
    if (i18n.global.locale.value !== next) setLocale(next)
  } catch {}
}

applyGeoDefaultLocale()

export default i18n
