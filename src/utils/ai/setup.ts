/**
 * AI Configuration Helper
 * 
 * Quick setup for DeepSeek and MiniMax API keys
 */

import { setAISettings } from './config'

/**
 * Configure DeepSeek API Key
 * 
 * Usage in browser console:
 * ```javascript
 * import { setupDeepSeek } from '@/utils/ai/setup'
 * setupDeepSeek('sk-your-deepseek-api-key')
 * ```
 */
export function setupDeepSeek(apiKey: string) {
  setAISettings({
    provider: 'deepseek',
    model: 'deepseek-chat',
    apiKey,
  })
  console.log('✅ DeepSeek configured successfully!')
  console.log('   Provider: deepseek')
  console.log('   Model: deepseek-chat')
}

/**
 * Configure MiniMax API Key
 * 
 * Usage in browser console:
 * ```javascript
 * import { setupMiniMax } from '@/utils/ai/setup'
 * setupMiniMax('sk-your-minimax-api-key')
 * ```
 */
export function setupMiniMax(apiKey: string) {
  setAISettings({
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
    apiKey,
  })
  console.log('✅ MiniMax configured successfully!')
  console.log('   Provider: minimax')
  console.log('   Model: minimax-m2.1-lightning')
}

/**
 * Quick setup for both models (uses same API key for both)
 * Only use if you have a unified API key or testing
 */
export function setupBothModels(apiKey: string) {
  setAISettings({
    provider: 'deepseek', // Default to DeepSeek
    model: 'deepseek-chat',
    apiKey,
  })
  console.log('✅ AI Models configured!')
  console.log('   Default Provider: deepseek')
  console.log('   Hybrid routing enabled: DeepSeek + MiniMax')
  console.log('')
  console.log('💡 The system will automatically route:')
  console.log('   - Deep content → DeepSeek')
  console.log('   - Chat/Quick edits → MiniMax')
}

/**
 * Check current AI configuration
 */
export function checkAIConfig() {
  const settings = localStorage.getItem('pxdoc_ai_settings')
  if (!settings) {
    console.warn('⚠️  No AI configuration found!')
    console.log('Run setupDeepSeek() or setupMiniMax() to configure.')
    return null
  }
  
  const config = JSON.parse(settings)
  console.log('Current AI Configuration:')
  console.log('  Provider:', config.provider)
  console.log('  Model:', config.model)
  console.log('  API Key:', config.apiKey ? '✅ Configured' : '❌ Missing')
  console.log('  Temperature:', config.temperature || 0.7)
  
  return config
}
