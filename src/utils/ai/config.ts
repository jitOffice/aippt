import { getModels, type ProviderKey } from './providers'

export interface AISettings {
  provider: ProviderKey
  model: string
  apiKey?: string
  baseUrl?: string // for custom OpenAI-compatible endpoints
  temperature?: number
  // Provider-specific API keys
  apiKeys?: {
    deepseek?: string
    minimax?: string
    kimi?: string
    glm?: string
    qwen?: string
    doubao?: string
    openai?: string
    claude?: string
    gemini?: string
    grok?: string
  }
}

const STORAGE_KEY = 'pxdoc_ai_settings'

const DEFAULTS: AISettings = {
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: '',
  temperature: 0.7,
  apiKeys: {},
}

/**
 * Get API key for a specific provider
 * Priority: 1. Provider-specific key in settings 2. Environment variable 3. Generic apiKey (backward compatibility)
 */
export function getProviderApiKey(provider: ProviderKey, settings: AISettings): string {
  console.log(`[getProviderApiKey] Resolving key for provider: ${provider}`)
  
  // 1. Check provider-specific API key in settings
  if (settings.apiKeys?.[provider]) {
    console.log(`[getProviderApiKey] Found in settings.apiKeys[${provider}]`)
    return settings.apiKeys[provider];
  }
  
  // 2. Check environment variables
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envKey = getEnvKeyForProvider(provider);
    console.log(`[getProviderApiKey] Checking env var: ${envKey}`)
    if (envKey && import.meta.env[envKey]) {
      console.log(`[getProviderApiKey] Found in environment: ${import.meta.env[envKey].substring(0, 10)}...`)
      return import.meta.env[envKey];
    } else {
      console.log(`[getProviderApiKey] Not found in environment`)
    }
  }
  
  // 3. Fallback to generic apiKey (backward compatibility)
  console.log(`[getProviderApiKey] Falling back to generic apiKey: ${settings.apiKey ? 'exists' : 'empty'}`)
  return settings.apiKey || '';
}

/**
 * Get environment variable name for a provider
 */
function getEnvKeyForProvider(provider: ProviderKey): string | null {
  const envMap: Record<ProviderKey, string> = {
    deepseek: 'VITE_DEEPSEEK_API_KEY',
    minimax: 'VITE_MINIMAX_API_KEY',
    kimi: 'VITE_KIMI_API_KEY',
    glm: 'VITE_GLM_API_KEY',
    qwen: 'VITE_QWEN_API_KEY',
    doubao: 'VITE_DOUBAO_API_KEY',
    openai: 'VITE_OPENAI_API_KEY',
    claude: 'VITE_CLAUDE_API_KEY',
    gemini: 'VITE_GEMINI_API_KEY',
    grok: 'VITE_GROK_API_KEY',
    custom: '', // Custom provider doesn't have env key
  };
  return envMap[provider] || null;
}

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    let settings: AISettings;
    
    if (!raw) {
      settings = { ...DEFAULTS };
    } else {
      const parsed = JSON.parse(raw);
      settings = { ...DEFAULTS, ...parsed };
    }
    
    // Initialize apiKeys object if not present
    if (!settings.apiKeys) {
      settings.apiKeys = {};
    }
    
    // Backward compatibility: migrate generic apiKey to provider-specific if needed
    if (settings.apiKey && !settings.apiKeys[settings.provider]) {
      settings.apiKeys[settings.provider] = settings.apiKey;
    }
    
    return settings;
  } catch {
    // Return defaults in error case
    return { ...DEFAULTS, apiKeys: {} };
  }
}

export function setAISettings(next: Partial<AISettings>) {
  const merged = { ...getAISettings(), ...next }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

export function getAvailableModels(provider: ProviderKey): Array<{label: string; value: string}> {
  return getModels(provider)
}

