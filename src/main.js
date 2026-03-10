import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入Unocss样式
import 'virtual:uno.css'
import '@arco-design/web-vue/dist/arco.css'

// 导入KaTeX样式
import 'katex/dist/katex.min.css'

import App from './App.vue'
import router from './router'
import i18n from '@/locales'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')

const loader = document.getElementById('brand-loader')
const appRoot = document.getElementById('app')

const hideLoader = () => {
  if (!loader) return
  loader.classList.add('hidden')
  loader.addEventListener('transitionend', () => loader.remove(), { once: true })
}

if (appRoot && appRoot.childElementCount > 0) {
  hideLoader()
} else if (appRoot) {
  const mo = new MutationObserver(() => {
    if (appRoot.childElementCount > 0) {
      hideLoader()
      mo.disconnect()
    }
  })
  mo.observe(appRoot, { childList: true })
}
