export type ProviderKey =
  | 'deepseek'
  | 'kimi'
  | 'glm'
  | 'qwen'
  | 'doubao'
  | 'minimax'
  | 'openai'
  | 'claude'
  | 'gemini'
  | 'grok'
  | 'custom'

export interface ProviderConfig {
  key: ProviderKey
  label: string
  baseUrl: string // OpenAI-compatible base
  models: { label: string; value: string }[]
  buildHeaders?: (apiKey: string) => Record<string, string>
}

export const PROVIDERS: Record<ProviderKey, ProviderConfig> = {
  // 国产大模型
  deepseek: {
    key: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      { label: 'DeepSeek Chat', value: 'deepseek-chat' },
      { label: 'DeepSeek Reasoner', value: 'deepseek-reasoner' },
    ],
  },
  kimi: {
    key: 'kimi',
    label: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.cn/v1',
    models: [
      { label: 'Kimi K2 0905 Preview', value: 'kimi-k2-0905-preview' },
      { label: 'Kimi K2 0711', value: 'kimi-k2-0711' },
    ],
  },
  glm: {
    key: 'glm',
    label: '智谱AI (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: [
      { label: 'GLM-4.7', value: 'glm-4.7' },
      { label: 'GLM-4 Plus', value: 'glm-4-plus' },
      { label: 'GLM-4 Air', value: 'glm-4-air' },
      { label: 'GLM-4 Flash', value: 'glm-4-flash' },
    ],
  },
  qwen: {
    key: 'qwen',
    label: '阿里千问 (Qwen)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    models: [
      { label: 'Qwen 3 Max', value: 'qwen3-max' },
      { label: 'Qwen Max', value: 'qwen-max' },
      { label: 'Qwen Plus', value: 'qwen-plus' },
      { label: 'Qwen Turbo', value: 'qwen-turbo' },
    ],
  },
  doubao: {
    key: 'doubao',
    label: '豆包 (Doubao)',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    models: [
      { label: 'Doubao Seed 1.6', value: 'doubao-seed-1.6' },
      { label: 'Doubao Seed 1.6 Thinking', value: 'doubao-seed-1.6-thinking' },
      { label: 'Doubao 1.5 Pro', value: 'doubao-1.5-pro' },
    ],
  },
  minimax: {
    key: 'minimax',
    label: 'MiniMax',
    baseUrl: 'https://api.minimaxi.com/v1',
    models: [
      { label: 'MiniMax M2.1', value: 'minimax-m2.1' },
      { label: 'MiniMax M2.1 Lightning', value: 'minimax-m2.1-lightning' },
      { label: 'MiniMax M2', value: 'minimax-m2' },
    ],
  },

  // 国外大模型
  openai: {
    key: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      { label: 'GPT-5.2', value: 'gpt-5.2' },
      { label: 'GPT-4o', value: 'gpt-4o' },
      { label: 'O1 (推理)', value: 'o1' },
      { label: 'O1 Mini', value: 'o1-mini' },
    ],
  },
  claude: {
    key: 'claude',
    label: 'Claude (Anthropic)',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      { label: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5' },
      { label: 'Claude Opus 4.5', value: 'claude-opus-4-5' },
      { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
    ],
  },
  gemini: {
    key: 'gemini',
    label: 'Gemini (Google)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: [
      { label: 'Gemini 3 Pro', value: 'gemini-3-pro-preview' },
      { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
      { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
      { label: 'Gemini 2.5 Flash-Lite', value: 'gemini-2.5-flash-lite' },
    ],
  },
  grok: {
    key: 'grok',
    label: 'Grok (xAI)',
    baseUrl: 'https://api.x.ai/v1',
    models: [
      { label: 'Grok 4', value: 'grok-4' },
      { label: 'Grok 3', value: 'grok-3' },
      { label: 'Grok 3 Mini', value: 'grok-3-mini' },
    ],
  },

  // 自定义
  custom: {
    key: 'custom',
    label: 'Custom (OpenAI-compatible)',
    baseUrl: '',
    models: [
      { label: 'GPT-5.2 Pro', value: 'gpt-5.2-pro' },
      { label: 'GPT-5.2 Thinking', value: 'gpt-5.2-thinking' },
      { label: 'GPT-5.2 Instant', value: 'gpt-5.2-instant' },
      { label: 'glm-4-air', value: 'glm-4-air' },
      { label: 'claude-3-5-sonnet', value: 'claude-3-5-sonnet-20241022' },
    ],
  },
}

export function getProvider(key: ProviderKey): ProviderConfig {
  return PROVIDERS[key]
}

export function getModels(key: ProviderKey): { label: string; value: string }[] {
  return PROVIDERS[key]?.models || []
}

export function getAllProviders(): ProviderConfig[] {
  return Object.values(PROVIDERS)
}

