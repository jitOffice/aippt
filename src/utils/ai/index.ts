import { getAISettings, getProviderApiKey } from './config'
import { streamOpenAI, type ChatMessage } from './openaiStream'
import { getProvider, type ProviderKey } from './providers'
import { analyzeTaskType, selectModelForTask, getTaskDescription } from './modelRouter'

export type StreamHandler = {
  onDelta?: (chunk: string) => void
  onError?: (e: any) => void
  onDone?: () => void
}

export interface StreamOptions {
  provider?: ProviderKey  // Override provider
  model?: string          // Override model
  taskContext?: {         // Context for automatic model selection
    isChat?: boolean
    slideCount?: number
    hasDocument?: boolean
  }
}

export function streamGenerate(
  userPrompt: string,
  systemPrompt?: string,
  handler?: StreamHandler,
  controller?: AbortController,
  options?: StreamOptions,
): AbortController {
  const settings = getAISettings()
  const messages: ChatMessage[] = []
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt })
  messages.push({ role: 'user', content: userPrompt })

  const ctrl = controller ?? new AbortController()

  ;(async () => {
    try {
      // Determine which model to use
      let finalProvider = settings.provider
      let finalModel = settings.model
      
      // Option 1: Explicit override from options
      if (options?.provider && options?.model) {
        finalProvider = options.provider
        finalModel = options.model
      }
      // Option 2: Automatic task-based selection
      else if (options?.taskContext) {
        const taskType = analyzeTaskType(userPrompt, {
          ...options.taskContext,
          promptLength: userPrompt.length,
        })
        const modelConfig = selectModelForTask(taskType)
        finalProvider = modelConfig.provider
        finalModel = modelConfig.model
        
        console.log(`[AI Router] Task: ${getTaskDescription(taskType)}`)
        console.log(`[AI Router] Selected: ${finalProvider}/${finalModel}`)
      }
      
      // Get provider-specific API key
      const providerApiKey = getProviderApiKey(finalProvider, settings)
      const hasKey = !!providerApiKey
      
      console.log(`[AI Router] Provider: ${finalProvider}, API Key: ${providerApiKey ? providerApiKey.substring(0, 10) + '...' : 'NOT FOUND'}`)
      
      if (hasKey) {
        const provider = getProvider(finalProvider)
        const baseUrl = finalProvider === 'custom' ? (settings.baseUrl || '') : provider.baseUrl
        if (!baseUrl) throw new Error('Base URL is not configured')

        await streamOpenAI({
          url: baseUrl.replace(/\/$/, '') + '/chat/completions',
          apiKey: providerApiKey,
          model: finalModel,
          messages,
          temperature: settings.temperature,
          signal: ctrl.signal,
        }, (d) => handler?.onDelta?.(d))
      } else {
        const { aiApi } = await import('@/api/ai')
        await aiApi.streamTrial({
          model: settings.model,
          messages,
          temperature: settings.temperature,
          headers: { 'x-user-id': localStorage.getItem('uid') || '', 'x-user-role': localStorage.getItem('role') || 'guest' },
          signal: ctrl.signal,
        }, (d: string) => handler?.onDelta?.(d))
      }

      handler?.onDone?.()
    } catch (e: any) {
      // 区分用户中止（AbortError）与其他错误
      if (e?.name === 'AbortError') {
        handler?.onError?.(e)
      } else {
        handler?.onError?.(e)
      }
    }
  })()

  return ctrl
}

