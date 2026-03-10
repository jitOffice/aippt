export function installPinyinSupport() {
  try {
    // 如果已经定义了，直接返回
    if (typeof window.getPinyin === 'function' && typeof window.getInitials === 'function') return

    // 尝试使用已存在的 TinyPinyin（例如通过 npm 安装并挂载到 window 的）
    const api = window.TinyPinyin

    window.getPinyin = (s) => {
      if (!s) return ''
      if (api && typeof api.convertToPinyin === 'function') return String(api.convertToPinyin(s) || '')
      if (api && typeof api.parse === 'function') return String(api.parse(s) || '')
      // 降级策略：不支持拼音时返回原字符串
      return String(s)
    }

    window.getInitials = (s) => {
      const p = window.getPinyin ? window.getPinyin(s) : String(s)
      return p.split(/\s+/).map(x => x[0] || '').join('')
    }
  } catch {}
}