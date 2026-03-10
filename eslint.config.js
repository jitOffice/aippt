import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const autoImportGlobals = require('./.eslintrc-auto-import.json')

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  { languageOptions: { globals: autoImportGlobals.globals } },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting
]
