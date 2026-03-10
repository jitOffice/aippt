/**
 * AI Model Router - Hybrid Model Selection Strategy
 * 
 * Automatically selects the optimal AI model based on task type:
 * - DeepSeek V3/R1: Deep reasoning, long-form content, document parsing
 * - MiniMax M2.1: Real-time interactions, quick edits, UI adjustments
 */

import type { ProviderKey } from './providers'

// Task categories for AI model routing
export enum TaskType {
  // DeepSeek Tasks - Deep reasoning and complex content
  DOCUMENT_PARSE = 'document-parse',           // Parse PDF/Word to slides
  DEEP_CONTENT_GENERATION = 'deep-content',    // Generate detailed content
  LONG_FORM_WRITING = 'long-form',             // Long presentations (>5 slides)
  INDUSTRY_REPORT = 'industry-report',         // Professional reports
  DATA_ANALYSIS = 'data-analysis',             // Complex data interpretation
  
  // MiniMax Tasks - Fast interactions and real-time edits
  QUICK_EDIT = 'quick-edit',                   // Single slide modifications
  LAYOUT_ADJUSTMENT = 'layout-adjust',         // UI/layout changes
  TEXT_POLISH = 'text-polish',                 // Text refinement
  REAL_TIME_CHAT = 'real-time-chat',          // ChatPanel interactions
  VOICE_SYNTHESIS = 'voice-synthesis',         // Voice/audio generation
  STYLE_MODIFICATION = 'style-modification',   // Theme/color changes
}

// Model selection mapping
export const TASK_MODEL_MAP: Record<TaskType, { provider: ProviderKey; model: string }> = {
  // DeepSeek tasks
  [TaskType.DOCUMENT_PARSE]: {
    provider: 'deepseek',
    model: 'deepseek-chat',
  },
  [TaskType.DEEP_CONTENT_GENERATION]: {
    provider: 'deepseek',
    model: 'deepseek-chat',
  },
  [TaskType.LONG_FORM_WRITING]: {
    provider: 'deepseek',
    model: 'deepseek-chat',
  },
  [TaskType.INDUSTRY_REPORT]: {
    provider: 'deepseek',
    model: 'deepseek-reasoner', // Use reasoner for complex reports
  },
  [TaskType.DATA_ANALYSIS]: {
    provider: 'deepseek',
    model: 'deepseek-reasoner',
  },
  
  // MiniMax tasks
  [TaskType.QUICK_EDIT]: {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning', // Lightning for fastest response
  },
  [TaskType.LAYOUT_ADJUSTMENT]: {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
  },
  [TaskType.TEXT_POLISH]: {
    provider: 'minimax',
    model: 'minimax-m2.1',
  },
  [TaskType.REAL_TIME_CHAT]: {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
  },
  [TaskType.VOICE_SYNTHESIS]: {
    provider: 'minimax',
    model: 'minimax-m2.1',
  },
  [TaskType.STYLE_MODIFICATION]: {
    provider: 'minimax',
    model: 'minimax-m2.1-lightning',
  },
}

/**
 * Analyze user prompt to determine task type
 */
export function analyzeTaskType(prompt: string, context?: {
  isChat?: boolean
  slideCount?: number
  hasDocument?: boolean
  promptLength?: number
}): TaskType {
  const lowerPrompt = prompt.toLowerCase()
  
  // Chat context - always use MiniMax
  if (context?.isChat) {
    return TaskType.REAL_TIME_CHAT
  }
  
  // Document parsing indicators
  if (context?.hasDocument || 
      lowerPrompt.includes('parse') || 
      lowerPrompt.includes('convert document') ||
      lowerPrompt.includes('pdf') ||
      lowerPrompt.includes('word')) {
    return TaskType.DOCUMENT_PARSE
  }
  
  // Industry report indicators
  if (lowerPrompt.includes('report') ||
      lowerPrompt.includes('analysis') ||
      lowerPrompt.includes('market') ||
      lowerPrompt.includes('research')) {
    return TaskType.INDUSTRY_REPORT
  }
  
  // Long-form content (complex presentations)
  if (context?.slideCount && context.slideCount > 8) {
    return TaskType.LONG_FORM_WRITING
  }
  
  if (lowerPrompt.includes('presentation') ||
      lowerPrompt.includes('deck') ||
      lowerPrompt.includes('slides') ||
      (context?.promptLength && context.promptLength > 200)) {
    return TaskType.DEEP_CONTENT_GENERATION
  }
  
  // Layout/UI modifications - use MiniMax
  if (lowerPrompt.includes('layout') ||
      lowerPrompt.includes('column') ||
      lowerPrompt.includes('align') ||
      lowerPrompt.includes('position') ||
      lowerPrompt.includes('move')) {
    return TaskType.LAYOUT_ADJUSTMENT
  }
  
  // Theme/style changes - use MiniMax
  if (lowerPrompt.includes('theme') ||
      lowerPrompt.includes('color') ||
      lowerPrompt.includes('style') ||
      lowerPrompt.includes('background')) {
    return TaskType.STYLE_MODIFICATION
  }
  
  // Text polishing - use MiniMax
  if (lowerPrompt.includes('improve') ||
      lowerPrompt.includes('polish') ||
      lowerPrompt.includes('refine') ||
      lowerPrompt.includes('rewrite') ||
      lowerPrompt.includes('shorter') ||
      lowerPrompt.includes('longer')) {
    return TaskType.TEXT_POLISH
  }
  
  // Default: for short, simple edits use MiniMax; otherwise DeepSeek
  if (prompt.length < 100) {
    return TaskType.QUICK_EDIT
  }
  
  return TaskType.DEEP_CONTENT_GENERATION
}

/**
 * Select optimal model configuration for a task
 */
export function selectModelForTask(taskType: TaskType): {
  provider: ProviderKey
  model: string
} {
  return TASK_MODEL_MAP[taskType]
}

/**
 * Get human-readable task type description
 */
export function getTaskDescription(taskType: TaskType): string {
  const descriptions: Record<TaskType, string> = {
    [TaskType.DOCUMENT_PARSE]: 'Document parsing (DeepSeek)',
    [TaskType.DEEP_CONTENT_GENERATION]: 'Deep content generation (DeepSeek)',
    [TaskType.LONG_FORM_WRITING]: 'Long-form writing (DeepSeek)',
    [TaskType.INDUSTRY_REPORT]: 'Industry report (DeepSeek Reasoner)',
    [TaskType.DATA_ANALYSIS]: 'Data analysis (DeepSeek Reasoner)',
    [TaskType.QUICK_EDIT]: 'Quick edit (MiniMax Lightning)',
    [TaskType.LAYOUT_ADJUSTMENT]: 'Layout adjustment (MiniMax Lightning)',
    [TaskType.TEXT_POLISH]: 'Text polishing (MiniMax)',
    [TaskType.REAL_TIME_CHAT]: 'Real-time chat (MiniMax Lightning)',
    [TaskType.VOICE_SYNTHESIS]: 'Voice synthesis (MiniMax)',
    [TaskType.STYLE_MODIFICATION]: 'Style modification (MiniMax Lightning)',
  }
  
  return descriptions[taskType] || 'Unknown task'
}
